'use client';

import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CopilotMessage as CopilotMessageType } from '@/lib/copilot/types';

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={index}>{bold[1]}</strong>;

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2].startsWith('/') ? link[2] : '#';
      return (
        <a key={index} href={href} className="font-medium text-purple-600 hover:underline">
          {link[1]}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

function MarkdownLight({ content }: { content: string }) {
  const lines = content.split('\n').filter((line) => line.trim().length > 0);
  const bullets = lines.filter((line) => line.trim().startsWith('- '));

  if (bullets.length === lines.length && lines.length > 0) {
    return (
      <ul className="list-disc space-y-1 pl-4">
        {lines.map((line, index) => (
          <li key={index}>{renderInline(line.trim().slice(2))}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-2">
      {lines.map((line, index) => (
        <p key={index}>{renderInline(line)}</p>
      ))}
    </div>
  );
}

export function CopilotMessage({ message }: { message: CopilotMessageType }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
          isUser
            ? 'bg-purple-600 text-white'
            : 'border border-gray-100 bg-white text-gray-700'
        )}
      >
        {message.content ? (
          <MarkdownLight content={message.content} />
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}

        {message.actions && message.actions.length > 0 && (
          <div className="mt-3 space-y-1 border-t border-gray-100 pt-2">
            {message.actions.map((action, index) => (
              <div
                key={`${action.action}-${index}`}
                className={cn('flex items-center gap-1.5 text-xs', action.success ? 'text-emerald-600' : 'text-red-500')}
              >
                {action.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                <span>{action.message}</span>
              </div>
            ))}
          </div>
        )}

        {message.status === 'streaming' && message.content && (
          <span className="mt-2 inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
        )}
      </div>
    </div>
  );
}
