import { SchemaType, type FunctionDeclaration } from '@google/generative-ai';
import type { CopilotAction, CopilotActionName } from './types';

export const allowedRoutes = [
  '/',
  '/use-cases',
  '/pricing',
  '/get-started/business',
  '/get-started/insurance',
  '/get-started/construction',
  '/blogs',
  '/case-studies',
  '/about',
  '/privacy',
  '/terms-and-conditions',
] as const;

export const allowedSections = [
  'hero',
  'dashboard',
  'features',
  'workflow-modules',
  'resources',
  'use-cases',
  'pricing-plans',
  'get-started',
  'about-hero',
  'about-locations',
  'about-leadership',
  'footer',
] as const;

export const allowedElementIds = [
  'feature-chat-with-orixs',
  'feature-smarter-mail-with-ai',
  'feature-strategic-decisions-backed-by-data',
  'feature-seamless-migrations',
  'pricing-currency',
  'pricing-billing',
  'pricing-platform-tabs',
  'signup-form',
  'login-form',
] as const;

export const allowedUseCaseTabs = ['business', 'insurance', 'construction'] as const;
export const allowedPricingTabs = ['RINI', 'Insurance', 'Construction', 'Scene One', 'Intern Africa'] as const;
export const allowedBillingPeriods = ['monthly', 'yearly'] as const;
export const allowedCurrencies = ['USD', 'INR', 'GBP', 'ZAR'] as const;
export const allowedIndustries = ['business', 'insurance', 'construction'] as const;
export const allowedModalIds = ['demo-request', 'newsletter', 'pricing-form'] as const;

const rawActionFunctionDeclarations = [
  {
    name: 'navigate_to_page',
    description: 'Navigate the user to a public page on the Orixs marketing website.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        route: { type: SchemaType.STRING, enum: [...allowedRoutes] },
        reason: { type: SchemaType.STRING },
      },
      required: ['route', 'reason'],
    },
  },
  {
    name: 'scroll_to_section',
    description: 'Smooth-scroll to a semantic page section marked for Copilot.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        sectionId: { type: SchemaType.STRING, enum: [...allowedSections] },
        reason: { type: SchemaType.STRING },
      },
      required: ['sectionId', 'reason'],
    },
  },
  {
    name: 'highlight_element',
    description: 'Pulse-highlight a semantic UI element briefly.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        elementId: { type: SchemaType.STRING, enum: [...allowedElementIds] },
        duration: { type: SchemaType.NUMBER },
        reason: { type: SchemaType.STRING },
      },
      required: ['elementId', 'reason'],
    },
  },
  {
    name: 'switch_tab',
    description: 'Switch an existing tab on use-cases, pricing platform, pricing billing, or get-started pages.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        tabGroup: {
          type: SchemaType.STRING,
          enum: ['use-cases', 'pricing-platform', 'pricing-billing', 'get-started-auth'],
        },
        tabValue: { type: SchemaType.STRING },
        reason: { type: SchemaType.STRING },
      },
      required: ['tabGroup', 'tabValue', 'reason'],
    },
  },
  {
    name: 'open_modal',
    description: 'Open a reversible public UI modal, such as newsletter or demo request.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        modalId: { type: SchemaType.STRING, enum: [...allowedModalIds] },
        reason: { type: SchemaType.STRING },
      },
      required: ['modalId', 'reason'],
    },
  },
  {
    name: 'close_modal',
    description: 'Close a reversible public UI modal.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        modalId: { type: SchemaType.STRING, enum: [...allowedModalIds] },
        reason: { type: SchemaType.STRING },
      },
      required: ['modalId', 'reason'],
    },
  },
  {
    name: 'apply_pricing_filter',
    description: 'Apply pricing currency or billing filters on the pricing page.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        currency: { type: SchemaType.STRING, enum: [...allowedCurrencies] },
        billingPeriod: { type: SchemaType.STRING, enum: [...allowedBillingPeriods] },
        reason: { type: SchemaType.STRING },
      },
      required: ['reason'],
    },
  },
  {
    name: 'show_plan_details',
    description: 'Highlight or open details for a visible pricing plan card.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        planId: { type: SchemaType.STRING },
        planName: { type: SchemaType.STRING },
        reason: { type: SchemaType.STRING },
      },
      required: ['reason'],
    },
  },
  {
    name: 'start_signup',
    description: 'Navigate the visitor to a get-started page for a supported industry. This never submits forms.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        industry: { type: SchemaType.STRING, enum: [...allowedIndustries] },
        reason: { type: SchemaType.STRING },
      },
      required: ['industry', 'reason'],
    },
  },
  {
    name: 'show_blog',
    description: 'Navigate to a public Orixs blog post by slug.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        slug: { type: SchemaType.STRING },
        reason: { type: SchemaType.STRING },
      },
      required: ['slug', 'reason'],
    },
  },
  {
    name: 'show_case_study',
    description: 'Navigate to a public Orixs case study by slug.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        slug: { type: SchemaType.STRING },
        reason: { type: SchemaType.STRING },
      },
      required: ['slug', 'reason'],
    },
  },
];

export const actionFunctionDeclarations = rawActionFunctionDeclarations as unknown as FunctionDeclaration[];

const actionNames = actionFunctionDeclarations.map((action) => action.name);

function isAllowed<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value);
}

function cleanString(value: unknown, max = 120): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.replace(/[<>]/g, '').trim().slice(0, max);
}

export function validateCopilotAction(name: string, rawParams: unknown): CopilotAction | null {
  if (!actionNames.includes(name)) return null;
  const actionName = name as CopilotActionName;

  const params = rawParams && typeof rawParams === 'object' ? rawParams as Record<string, unknown> : {};
  const reason = cleanString(params.reason, 180);

  switch (actionName) {
    case 'navigate_to_page': {
      if (!isAllowed(params.route, allowedRoutes) || !reason) return null;
      return { name: actionName, params: { route: params.route }, reason };
    }
    case 'scroll_to_section': {
      if (!isAllowed(params.sectionId, allowedSections) || !reason) return null;
      return { name: actionName, params: { sectionId: params.sectionId }, reason };
    }
    case 'highlight_element': {
      if (!isAllowed(params.elementId, allowedElementIds) || !reason) return null;
      const duration = typeof params.duration === 'number'
        ? Math.min(Math.max(params.duration, 800), 6000)
        : 2200;
      return { name: actionName, params: { elementId: params.elementId, duration }, reason };
    }
    case 'switch_tab': {
      const tabGroup = cleanString(params.tabGroup);
      const tabValue = cleanString(params.tabValue);
      if (!tabGroup || !tabValue || !reason) return null;
      if (tabGroup === 'use-cases' && !isAllowed(tabValue, allowedUseCaseTabs)) return null;
      if (tabGroup === 'pricing-platform' && !isAllowed(tabValue, allowedPricingTabs)) return null;
      if (tabGroup === 'pricing-billing' && !isAllowed(tabValue, allowedBillingPeriods)) return null;
      if (tabGroup === 'get-started-auth' && !['signup', 'login'].includes(tabValue)) return null;
      if (!['use-cases', 'pricing-platform', 'pricing-billing', 'get-started-auth'].includes(tabGroup)) return null;
      return { name: actionName, params: { tabGroup, tabValue }, reason };
    }
    case 'open_modal':
    case 'close_modal': {
      if (!isAllowed(params.modalId, allowedModalIds) || !reason) return null;
      return { name: actionName, params: { modalId: params.modalId }, reason };
    }
    case 'apply_pricing_filter': {
      if (!reason) return null;
      const filtered: Record<string, unknown> = {};
      if (params.currency !== undefined) {
        if (!isAllowed(params.currency, allowedCurrencies)) return null;
        filtered.currency = params.currency;
      }
      if (params.billingPeriod !== undefined) {
        if (!isAllowed(params.billingPeriod, allowedBillingPeriods)) return null;
        filtered.billingPeriod = params.billingPeriod;
      }
      return { name: actionName, params: filtered, reason };
    }
    case 'show_plan_details': {
      const planId = cleanString(params.planId, 60);
      const planName = cleanString(params.planName, 80);
      if (!reason || (!planId && !planName)) return null;
      return { name: actionName, params: { planId, planName }, reason };
    }
    case 'start_signup': {
      if (!isAllowed(params.industry, allowedIndustries) || !reason) return null;
      return { name: actionName, params: { industry: params.industry }, reason };
    }
    case 'show_blog':
    case 'show_case_study': {
      const slug = cleanString(params.slug, 120);
      if (!slug || !/^[a-zA-Z0-9-]+$/.test(slug) || !reason) return null;
      return { name: actionName, params: { slug }, reason };
    }
    default:
      return null;
  }
}
