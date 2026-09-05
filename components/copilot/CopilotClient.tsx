'use client';

import dynamic from 'next/dynamic';
import { CopilotErrorBoundary } from './CopilotErrorBoundary';

const CopilotButton = dynamic(() => import('./CopilotButton'), { ssr: false });
const CopilotPanel = dynamic(() => import('./CopilotPanel'), { ssr: false });

export function CopilotClient() {
  return (
    <CopilotErrorBoundary>
      <CopilotButton />
      <CopilotPanel />
    </CopilotErrorBoundary>
  );
}
