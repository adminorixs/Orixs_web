'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, PanelRightClose, X } from 'lucide-react';
import { Drawer as DrawerPrimitive } from 'vaul';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { CopilotInput } from './CopilotInput';
import { CopilotMessage } from './CopilotMessage';
import { useCopilot } from './CopilotProvider';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
}

function PanelBody() {
  const { messages, proactiveEnabled, setProactiveEnabled } = useCopilot();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div ref={listRef} className="flex-1 overflow-y-auto bg-gray-50/60 p-4">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-purple-100 bg-white p-4 text-sm leading-relaxed text-gray-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <p className="font-semibold text-gray-900">Hi, I am Orixs AI.</p>
            <p className="mt-2">Ask me about platforms, plans, modules, use cases, or where to go next.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <CopilotMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2 text-xs text-gray-500">
        <span>Proactive suggestions</span>
        <Switch checked={proactiveEnabled} onCheckedChange={setProactiveEnabled} aria-label="Toggle proactive Copilot suggestions" />
      </div>
      <CopilotInput />
    </>
  );
}

function PanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Orixs AI</h2>
          <p className="text-xs text-gray-400">Product and website guide</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        aria-label="Close Orixs AI"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CopilotPanel() {
  const { isOpen, close } = useCopilot();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close, isOpen]);

  if (isMobile) {
    return (
      <DrawerPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) close(); }}>
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay className="fixed inset-0 z-30 bg-black/20" />
          <DrawerPrimitive.Content className="fixed inset-x-0 bottom-0 z-40 flex h-[88vh] flex-col rounded-t-2xl border border-gray-100 bg-white p-0 outline-none">
            <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-gray-200" />
            <PanelHeader onClose={close} />
            <PanelBody />
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className={cn('fixed right-0 top-0 z-40 flex h-screen w-[var(--copilot-sidebar-width)] flex-col overflow-hidden border-l border-gray-100 bg-white shadow-[-6px_0_24px_rgba(15,23,42,0.08)]')}
          initial={{ x: '100%', opacity: 0.98 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0.98 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        >
          <PanelHeader onClose={close} />
          <PanelBody />
          <PanelRightClose className="pointer-events-none absolute right-4 top-5 h-4 w-4 opacity-0" />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
