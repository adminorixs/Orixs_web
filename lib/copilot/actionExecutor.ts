'use client';

import { copilotEventBus } from './eventBus';
import type { ActionResult, CopilotAction } from './types';

type RouterLike = {
  push: (href: string) => void;
};

function getString(params: Record<string, unknown>, key: string): string | undefined {
  const value = params[key];
  return typeof value === 'string' ? value : undefined;
}

function makeResult(action: CopilotAction, success: boolean, message: string): ActionResult {
  return { action: action.name, success, message };
}

export function createActionExecutor(router: RouterLike) {
  return async function executeAction(action: CopilotAction): Promise<ActionResult> {
    const params = action.params || {};

    switch (action.name) {
      case 'navigate_to_page': {
        const route = getString(params, 'route');
        if (!route) return makeResult(action, false, 'Navigation target was missing.');
        router.push(route);
        return makeResult(action, true, `Navigated to ${route}.`);
      }
      case 'scroll_to_section': {
        const sectionId = getString(params, 'sectionId');
        const element = sectionId ? document.querySelector<HTMLElement>(`[data-copilot-section="${sectionId}"]`) : null;
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return makeResult(action, Boolean(element), element ? `Scrolled to ${sectionId}.` : 'That section is not visible on this page.');
      }
      case 'highlight_element': {
        const elementId = getString(params, 'elementId');
        const duration = typeof params.duration === 'number' ? params.duration : 2200;
        const element = elementId ? document.querySelector<HTMLElement>(`[data-copilot-id="${elementId}"]`) : null;
        if (element) {
          element.classList.add('copilot-highlight');
          window.setTimeout(() => element.classList.remove('copilot-highlight'), duration);
        }
        return makeResult(action, Boolean(element), element ? 'Highlighted it for you.' : 'I could not find that element on this page.');
      }
      case 'switch_tab': {
        const tabGroup = getString(params, 'tabGroup');
        const tabValue = getString(params, 'tabValue');
        if (!tabGroup || !tabValue) return makeResult(action, false, 'Tab target was missing.');
        copilotEventBus.emit('switchTab', { tabGroup: tabGroup as any, tabValue });
        return makeResult(action, true, `Switched to ${tabValue}.`);
      }
      case 'open_modal': {
        const modalId = getString(params, 'modalId');
        if (!modalId) return makeResult(action, false, 'Modal target was missing.');
        copilotEventBus.emit('modalOpen', { modalId });
        return makeResult(action, true, 'Opened the requested panel.');
      }
      case 'close_modal': {
        const modalId = getString(params, 'modalId');
        if (!modalId) return makeResult(action, false, 'Modal target was missing.');
        copilotEventBus.emit('modalClose', { modalId });
        return makeResult(action, true, 'Closed it.');
      }
      case 'apply_pricing_filter': {
        const currency = getString(params, 'currency');
        const billingPeriod = getString(params, 'billingPeriod');
        copilotEventBus.emit('filterChange', { filterGroup: 'pricing', currency, billingPeriod });
        return makeResult(action, true, 'Updated pricing filters.');
      }
      case 'show_plan_details': {
        const planId = getString(params, 'planId');
        const planName = getString(params, 'planName');
        const selector = planId
          ? `[data-copilot-plan-id="${planId}"]`
          : planName
            ? `[data-copilot-plan-name="${planName.toLowerCase()}"]`
            : '';
        const element = selector ? document.querySelector<HTMLElement>(selector) : null;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('copilot-highlight');
          window.setTimeout(() => element.classList.remove('copilot-highlight'), 2800);
        }
        return makeResult(action, Boolean(element), element ? 'Brought that plan into view.' : 'I could not find that plan on this page.');
      }
      case 'start_signup': {
        const industry = getString(params, 'industry');
        if (!industry) return makeResult(action, false, 'Industry was missing.');
        router.push(`/get-started/${industry}`);
        return makeResult(action, true, `Opened signup for ${industry}.`);
      }
      case 'show_blog': {
        const slug = getString(params, 'slug');
        if (!slug) return makeResult(action, false, 'Blog slug was missing.');
        router.push(`/blogs/${slug}`);
        return makeResult(action, true, 'Opened the blog post.');
      }
      case 'show_case_study': {
        const slug = getString(params, 'slug');
        if (!slug) return makeResult(action, false, 'Case study slug was missing.');
        router.push(`/case-studies/${slug}`);
        return makeResult(action, true, 'Opened the case study.');
      }
      default:
        return makeResult(action, false, 'That action is not supported.');
    }
  };
}
