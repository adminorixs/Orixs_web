'use client';

import { Bot, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCopilot } from './CopilotProvider';
import { ProactivePrompt } from './ProactivePrompt';

export default function CopilotButton() {
  const { toggleOpen, context, isOpen } = useCopilot();
  const collapsed = context.device !== 'desktop' || context.scrollDepth > 12;

  if (isOpen && context.device === 'desktop') return <ProactivePrompt />;

  return (
    <>
      <ProactivePrompt />
      <button
        type="button"
        onClick={toggleOpen}
        className={cn(
          'fixed bottom-4 right-4 z-40 flex h-12 items-center justify-center gap-2 bg-purple-600 text-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 sm:bottom-6 sm:right-6',
          collapsed ? 'w-12 rounded-full' : 'rounded-full px-5'
        )}
        aria-label={isOpen ? 'Close Orixs AI' : 'Ask Orixs AI'}
        aria-expanded={isOpen}
      >
        {collapsed ? <Bot className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        {!collapsed && <span className="text-sm font-semibold">Ask Orixs</span>}
      </button>
    </>
  );
}
