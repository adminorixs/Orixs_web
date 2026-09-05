import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import axiosInstance from '@/lib/config/axiosInstance';
import { actionFunctionDeclarations, validateCopilotAction } from '@/lib/copilot/actionRegistry';
import { buildSystemPrompt } from '@/lib/copilot/promptBuilder';
import type { CopilotChatRequest, ConversationTurn, CopilotStreamEvent } from '@/lib/copilot/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MODEL_NAME = 'gemini-2.5-flash';
const MESSAGE_LIMIT = 2000;
const HISTORY_TURN_LIMIT = 10;
const HISTORY_CHAR_LIMIT = 16000;
const REQUESTS_PER_MINUTE = 30;
const REQUESTS_PER_HOUR = 200;

type RateBucket = {
  minuteStart: number;
  minuteCount: number;
  hourStart: number;
  hourCount: number;
};

const rateBuckets = new Map<string, RateBucket>();
let cachedPlans: { value: unknown; expiresAt: number } | null = null;

function getIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

async function hashIp(ip: string) {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip) ?? {
    minuteStart: now,
    minuteCount: 0,
    hourStart: now,
    hourCount: 0,
  };

  if (now - bucket.minuteStart > 60_000) {
    bucket.minuteStart = now;
    bucket.minuteCount = 0;
  }
  if (now - bucket.hourStart > 3_600_000) {
    bucket.hourStart = now;
    bucket.hourCount = 0;
  }

  bucket.minuteCount += 1;
  bucket.hourCount += 1;
  rateBuckets.set(ip, bucket);

  return bucket.minuteCount <= REQUESTS_PER_MINUTE && bucket.hourCount <= REQUESTS_PER_HOUR;
}

function sanitizeMessage(value: unknown) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MESSAGE_LIMIT);
}

function sanitizeHistory(history: unknown): ConversationTurn[] {
  if (!Array.isArray(history)) return [];
  let charCount = 0;
  const turns = history
    .slice(-HISTORY_TURN_LIMIT)
    .map((turn) => {
      if (!turn || typeof turn !== 'object') return null;
      const value = turn as Record<string, unknown>;
      const role = value.role === 'model' ? 'model' : value.role === 'user' ? 'user' : null;
      const content = sanitizeMessage(value.content);
      if (!role || !content) return null;
      return { role, content };
    })
    .filter(Boolean) as ConversationTurn[];

  return turns.reverse().filter((turn) => {
    charCount += turn.content.length;
    return charCount <= HISTORY_CHAR_LIMIT;
  }).reverse();
}

function sendEvent(controller: ReadableStreamDefaultController<Uint8Array>, event: CopilotStreamEvent) {
  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(event)}\n\n`));
}

async function getLivePlans() {
  const now = Date.now();
  if (cachedPlans && cachedPlans.expiresAt > now) return cachedPlans.value;

  const response = await axiosInstance.get('/masterplans/grouped-by-platform', { timeout: 10_000 });
  cachedPlans = { value: response.data, expiresAt: now + 15 * 60_000 };
  return response.data;
}

function buildContents(history: ConversationTurn[], message: string) {
  return [
    ...history.map((turn) => ({
      role: turn.role,
      parts: [{ text: turn.content }],
    })),
    {
      role: 'user',
      parts: [{ text: `User message:\n${message}` }],
    },
  ];
}

export async function POST(request: Request) {
  const start = Date.now();
  const ip = getIp(request);
  const ipHash = await hashIp(ip);
  const actionsReturned: string[] = [];
  let sessionId = 'unknown';
  let messageLength = 0;

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ message: 'Too many Copilot requests. Please try again in a moment.' }, { status: 429 });
  }

  try {
    const body = await request.json() as Partial<CopilotChatRequest>;
    const message = sanitizeMessage(body.message);
    const history = sanitizeHistory(body.conversationHistory);
    const context = body.context;
    sessionId = sanitizeMessage(body.sessionId).slice(0, 100) || 'anonymous';
    messageLength = message.length;

    if (!message) {
      return NextResponse.json({ message: 'Message is required.' }, { status: 400 });
    }
    if (!context || typeof context !== 'object') {
      return NextResponse.json({ message: 'Context is required.' }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ message: 'Copilot is not configured.' }, { status: 503 });
    }

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let streamError: string | null = null;
        try {
          const livePlanData = await getLivePlans().catch(() => null);
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
          const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            systemInstruction: buildSystemPrompt({ context, conversationHistory: history, livePlanData }),
            generationConfig: {
              temperature: 0.3,
              topP: 0.8,
              maxOutputTokens: 1024,
            },
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
            tools: [{ functionDeclarations: actionFunctionDeclarations }],
          });

          const result = await model.generateContentStream({
            contents: buildContents(history, message),
          });

          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) sendEvent(controller, { type: 'text', content: text });

            const functionCalls = chunk.functionCalls?.() ?? [];
            for (const call of functionCalls) {
              const action = validateCopilotAction(call.name, call.args);
              if (action) {
                actionsReturned.push(action.name);
                sendEvent(controller, { type: 'action', action });
              }
            }
          }
          sendEvent(controller, { type: 'done' });
        } catch (error) {
          streamError = error instanceof Error ? error.message : 'Unknown Gemini stream error';
          sendEvent(controller, { type: 'error', message: 'Copilot is temporarily unavailable. Please try again later.' });
          sendEvent(controller, { type: 'done' });
        } finally {
          console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            sessionId,
            ip: ipHash,
            route: '/api/copilot/chat',
            context: {
              page: context.route,
              device: context.device,
              visibleSection: context.visibleSection,
            },
            messageLength,
            latencyMs: Date.now() - start,
            actionsReturned,
            geminiModel: MODEL_NAME,
            error: streamError,
          }));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      sessionId,
      ip: ipHash,
      route: '/api/copilot/chat',
      messageLength,
      latencyMs: Date.now() - start,
      actionsReturned,
      geminiModel: MODEL_NAME,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
    return NextResponse.json({ message: 'Copilot is temporarily unavailable.' }, { status: 500 });
  }
}
