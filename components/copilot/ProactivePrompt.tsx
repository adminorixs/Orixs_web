'use client';

import { X } from 'lucide-react';
import { useCopilot } from './CopilotProvider';

export function ProactivePrompt() {
  const { proactivePrompt, dismissProactivePrompt, open } = useCopilot();
  if (!proactivePrompt) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 w-[260px] rounded-2xl border border-purple-100 bg-white p-3 text-sm text-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:bottom-24 sm:right-6">
      <button
        type="button"
        className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        onClick={dismissProactivePrompt}
        aria-label="Dismiss Copilot prompt"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <button type="button" className="block pr-5 text-left" onClick={open}>
        {proactivePrompt}
      </button>
    </div>
  );
}
