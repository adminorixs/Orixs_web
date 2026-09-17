'use client';

import { useCopilot } from './CopilotProvider';
import { ProactivePrompt } from './ProactivePrompt';

export default function CopilotButton() {
  const { toggleOpen, context, isOpen } = useCopilot();

  if (isOpen && context.device === 'desktop') return <ProactivePrompt />;

  return (
    <>
      <ProactivePrompt />
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-4 right-4 z-40 flex h-20 w-20 items-center justify-center bg-transparent p-0 transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-300 sm:bottom-6 sm:right-6"
        aria-label={isOpen ? 'Close Orixs AI' : 'Ask Orixs AI'}
        aria-expanded={isOpen}
      >
        <img
          src="/img/chatbot-icon.png?v=20260917b"
          srcSet="/img/chatbot-icon@2x.png?v=20260917b 2x"
          alt=""
          aria-hidden="true"
          className="h-20 w-20 object-contain"
        />
      </button>
    </>
  );
}
