'use client';

import { FormEvent, KeyboardEvent, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopilot } from './CopilotProvider';

export function CopilotInput() {
  const { sendMessage, suggestions, isSending } = useCopilot();
  const [value, setValue] = useState('');

  async function submit(message = value) {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;
    setValue('');
    await sendMessage(trimmed);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submit();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  }

  return (
    <div className="border-t border-gray-100 bg-white p-3">
      {suggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2 md:flex-nowrap md:overflow-x-auto">
          {suggestions.slice(0, 4).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => void submit(suggestion)}
              className="min-h-9 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-left text-xs font-medium text-purple-700 transition hover:border-purple-200 hover:bg-purple-100 md:whitespace-nowrap"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          maxLength={2000}
          placeholder="Ask about Orixs..."
          className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100"
          disabled={isSending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!value.trim() || isSending}
          className="h-11 w-11 flex-shrink-0 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
