'use client';

import React from 'react';

export class CopilotErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Copilot UI error:', error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
