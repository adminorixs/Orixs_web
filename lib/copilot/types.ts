export type PageType =
  | 'homepage'
  | 'use-cases'
  | 'get-started'
  | 'pricing'
  | 'blog'
  | 'case-study'
  | 'about'
  | 'legal'
  | 'payment'
  | 'unknown';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface CopilotContext {
  route: string;
  routeParams: Record<string, string>;
  pageType: PageType;
  pageTitle: string;
  visibleSection: string;
  activeTab?: string;
  activeFilters?: string[];
  openModal?: string;
  formStep?: number;
  device: DeviceType;
  scrollDepth: number;
  pagesVisited: string[];
  conversationId: string;
}

export type CopilotRole = 'user' | 'assistant' | 'system';

export interface CopilotMessage {
  id: string;
  role: CopilotRole;
  content: string;
  status?: 'streaming' | 'complete' | 'error';
  actions?: ActionResult[];
}

export interface ConversationTurn {
  role: 'user' | 'model';
  content: string;
}

export type CopilotActionName =
  | 'navigate_to_page'
  | 'scroll_to_section'
  | 'highlight_element'
  | 'switch_tab'
  | 'open_modal'
  | 'close_modal'
  | 'apply_pricing_filter'
  | 'show_plan_details'
  | 'start_signup'
  | 'show_blog'
  | 'show_case_study';

export interface CopilotAction {
  name: CopilotActionName;
  params: Record<string, unknown>;
  reason?: string;
}

export interface ActionResult {
  action: CopilotActionName;
  success: boolean;
  message: string;
}

export type CopilotStreamEvent =
  | { type: 'text'; content: string }
  | { type: 'action'; action: CopilotAction }
  | { type: 'suggestion'; suggestions: string[] }
  | { type: 'error'; message: string }
  | { type: 'done' };

export interface CopilotChatRequest {
  message: string;
  context: CopilotContext;
  conversationHistory?: ConversationTurn[];
  sessionId: string;
}

export interface PromptBuildInput {
  context: CopilotContext;
  conversationHistory: ConversationTurn[];
  livePlanData?: unknown;
}
