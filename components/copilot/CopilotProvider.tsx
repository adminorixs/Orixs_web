'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createActionExecutor } from '@/lib/copilot/actionExecutor';
import { useContextEngine } from '@/lib/copilot/contextEngine';
import { parseCopilotStream } from '@/lib/copilot/streamParser';
import type { ActionResult, CopilotContext, CopilotMessage, ConversationTurn } from '@/lib/copilot/types';

type CopilotContextValue = {
  isOpen: boolean;
  isSending: boolean;
  messages: CopilotMessage[];
  context: CopilotContext;
  suggestions: string[];
  proactivePrompt: string | null;
  proactiveEnabled: boolean;
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
  sendMessage: (message: string) => Promise<void>;
  dismissProactivePrompt: () => void;
  setProactiveEnabled: (enabled: boolean) => void;
};

const CopilotReactContext = createContext<CopilotContextValue | null>(null);

function createMessage(role: 'user' | 'assistant', content: string, status: CopilotMessage['status'] = 'complete'): CopilotMessage {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return { id, role, content, status, actions: [] };
}

function toHistory(messages: CopilotMessage[]): ConversationTurn[] {
  return messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .slice(-10)
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      content: message.content,
    }));
}

function getStoredBoolean(key: string, fallback: boolean) {
  if (typeof window === 'undefined') return fallback;
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;
  return value === 'true';
}

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const context = useContextEngine();
  const executeAction = useMemo(() => createActionExecutor(router), [router]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [proactivePrompt, setProactivePrompt] = useState<string | null>(null);
  const [proactiveEnabled, setProactiveEnabledState] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('orixs-copilot-docked', isOpen);
    return () => document.body.classList.remove('orixs-copilot-docked');
  }, [isOpen]);

  useEffect(() => {
    setProactiveEnabledState(getStoredBoolean('orixs-copilot-proactive', true));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/copilot/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageType: context.pageType, route: context.route }),
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []))
      .catch(() => setSuggestions([]));
    return () => controller.abort();
  }, [context.pageType, context.route]);

  const dismissProactivePrompt = useCallback(() => setProactivePrompt(null), []);

  useEffect(() => {
    if (!proactiveEnabled || isOpen || proactivePrompt) return;

    const triggerKey =
      context.pageType === 'homepage'
        ? 'homepage-tour'
        : context.pageType === 'pricing'
          ? 'pricing-help'
          : context.pageType === 'get-started'
            ? 'signup-help'
            : (context.pageType === 'blog' || context.pageType === 'case-study') && context.scrollDepth >= 60
              ? 'resource-industry'
              : null;

    if (!triggerKey || sessionStorage.getItem(`orixs-copilot-trigger:${triggerKey}`)) return;

    const delay =
      triggerKey === 'homepage-tour'
        ? 8000
        : triggerKey === 'pricing-help'
          ? 15000
          : triggerKey === 'signup-help'
            ? 20000
            : 1000;

    const copy: Record<string, string> = {
      'homepage-tour': 'Not sure where to start? I can show you around.',
      'pricing-help': 'Need help comparing plans?',
      'signup-help': 'I can explain what happens after you sign up.',
      'resource-industry': 'Want to see how this applies to your industry?',
    };

    const timeout = window.setTimeout(() => {
      sessionStorage.setItem(`orixs-copilot-trigger:${triggerKey}`, 'true');
      setProactivePrompt(copy[triggerKey]);
      window.setTimeout(() => setProactivePrompt(null), 6000);
    }, delay);

    const dismiss = () => setProactivePrompt(null);
    window.addEventListener('pointerdown', dismiss, { once: true });
    window.addEventListener('keydown', dismiss, { once: true });

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown', dismiss);
    };
  }, [context.pageType, context.scrollDepth, isOpen, proactiveEnabled, proactivePrompt]);

  const setProactiveEnabled = useCallback((enabled: boolean) => {
    setProactiveEnabledState(enabled);
    window.localStorage.setItem('orixs-copilot-proactive', String(enabled));
    if (!enabled) setProactivePrompt(null);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
    setProactivePrompt(null);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
    setProactivePrompt(null);
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    const userMessage = createMessage('user', trimmed);
    const assistantMessage = createMessage('assistant', '', 'streaming');
    const history = toHistory(messages);

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setIsSending(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          context,
          conversationHistory: history,
          sessionId: context.conversationId,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Copilot request failed.');
      }

      for await (const event of parseCopilotStream(response.body)) {
        if (event.type === 'text') {
          setMessages((current) => current.map((item) => (
            item.id === assistantMessage.id ? { ...item, content: `${item.content}${event.content}` } : item
          )));
        }

        if (event.type === 'action') {
          const result: ActionResult = await executeAction(event.action);
          setMessages((current) => current.map((item) => (
            item.id === assistantMessage.id ? { ...item, actions: [...(item.actions || []), result] } : item
          )));
        }

        if (event.type === 'suggestion') {
          setSuggestions(event.suggestions);
        }

        if (event.type === 'error') {
          setMessages((current) => current.map((item) => (
            item.id === assistantMessage.id ? { ...item, content: item.content || event.message, status: 'error' } : item
          )));
        }
      }

      setMessages((current) => current.map((item) => (
        item.id === assistantMessage.id ? { ...item, status: item.status === 'error' ? 'error' : 'complete' } : item
      )));
    } catch {
      setMessages((current) => current.map((item) => (
        item.id === assistantMessage.id
          ? { ...item, content: "I'm temporarily unavailable. You can still browse Use Cases, Pricing, Blogs, and Case Studies from the site navigation.", status: 'error' }
          : item
      )));
    } finally {
      setIsSending(false);
    }
  }, [context, executeAction, isSending, messages]);

  const value: CopilotContextValue = {
    isOpen,
    isSending,
    messages,
    context,
    suggestions,
    proactivePrompt,
    proactiveEnabled,
    open,
    close,
    toggleOpen,
    sendMessage,
    dismissProactivePrompt,
    setProactiveEnabled,
  };

  return (
    <CopilotReactContext.Provider value={value}>
      <div className="orixs-site-shell">
        {children}
      </div>
    </CopilotReactContext.Provider>
  );
}

export function useCopilot() {
  const value = useContext(CopilotReactContext);
  if (!value) throw new Error('useCopilot must be used inside CopilotProvider');
  return value;
}
