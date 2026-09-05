import type { CopilotStreamEvent } from './types';

export async function* parseCopilotStream(stream: ReadableStream<Uint8Array>): AsyncGenerator<CopilotStreamEvent> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() || '';

    for (const frame of frames) {
      const dataLine = frame.split('\n').find((line) => line.startsWith('data: '));
      if (!dataLine) continue;

      try {
        yield JSON.parse(dataLine.slice(6)) as CopilotStreamEvent;
      } catch {
        yield { type: 'error', message: 'Could not parse a Copilot stream event.' };
      }
    }
  }

  if (buffer.trim().startsWith('data: ')) {
    try {
      yield JSON.parse(buffer.trim().slice(6)) as CopilotStreamEvent;
    } catch {
      yield { type: 'error', message: 'Could not parse the final Copilot stream event.' };
    }
  }
}
