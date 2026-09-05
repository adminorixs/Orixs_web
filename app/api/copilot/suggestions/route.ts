import { NextResponse } from 'next/server';
import type { PageType } from '@/lib/copilot/types';

const suggestionsByPage: Record<PageType, string[]> = {
  homepage: [
    'What is Orixs in plain English?',
    'Which platform fits my business?',
    'Show me the main modules.',
    'How do I get started?',
  ],
  'use-cases': [
    'Compare Business, Insurance, and Construction.',
    'What can Orixs do for insurance teams?',
    'How does Orixs help construction projects?',
    'Take me to signup.',
  ],
  'get-started': [
    'What happens after I sign up?',
    'Do I need a credit card?',
    'Which details do I need to provide?',
    'Can I switch industries?',
  ],
  pricing: [
    'Compare the available plans.',
    'Is there a free trial?',
    'Show me insurance pricing.',
    'What do AI credits mean?',
  ],
  blog: [
    'Summarize this topic for me.',
    'How does this apply to my company?',
    'Show related Orixs resources.',
  ],
  'case-study': [
    'Summarize the results.',
    'Which Orixs modules helped here?',
    'Show me a similar use case.',
  ],
  about: [
    'Who is behind Orixs?',
    'Where is Orixs located?',
    'What problem was Orixs built to solve?',
  ],
  legal: [
    'Summarize this policy.',
    'What should customers know?',
    'Where can I find product information?',
  ],
  payment: [
    'What should I do if payment is pending?',
    'Take me back to pricing.',
    'How do I contact support?',
  ],
  unknown: [
    'What is Orixs?',
    'Show me use cases.',
    'Show me pricing.',
  ],
};

function inferPageType(route: string): PageType {
  if (route === '/') return 'homepage';
  if (route === '/use-cases') return 'use-cases';
  if (route === '/pricing') return 'pricing';
  if (route.startsWith('/get-started')) return 'get-started';
  if (route.startsWith('/blogs')) return 'blog';
  if (route.startsWith('/case-studies')) return 'case-study';
  if (route === '/about') return 'about';
  if (route === '/privacy' || route === '/terms-and-conditions') return 'legal';
  if (route.startsWith('/payment') || route.startsWith('/pricing/')) return 'payment';
  return 'unknown';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const route = typeof body?.route === 'string' ? body.route : '/';
    const pageType = typeof body?.pageType === 'string' ? body.pageType as PageType : inferPageType(route);
    return NextResponse.json({ suggestions: suggestionsByPage[pageType] ?? suggestionsByPage.unknown });
  } catch {
    return NextResponse.json({ suggestions: suggestionsByPage.unknown });
  }
}
