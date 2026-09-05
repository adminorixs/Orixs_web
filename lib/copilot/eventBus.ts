type CopilotEvents = {
  switchTab: {
    tabGroup: 'use-cases' | 'pricing-platform' | 'pricing-billing' | 'get-started-auth';
    tabValue: string;
  };
  filterChange: {
    filterGroup: 'pricing';
    currency?: string;
    billingPeriod?: string;
  };
  modalOpen: { modalId: string };
  modalClose: { modalId: string };
  formStepChange: { formStep: number };
};

type Listener<T> = (payload: T) => void;

class CopilotEventBus {
  private listeners = new Map<keyof CopilotEvents, Set<Listener<any>>>();

  on<K extends keyof CopilotEvents>(event: K, listener: Listener<CopilotEvents[K]>) {
    const listeners = this.listeners.get(event) ?? new Set();
    listeners.add(listener);
    this.listeners.set(event, listeners);
    return () => this.off(event, listener);
  }

  off<K extends keyof CopilotEvents>(event: K, listener: Listener<CopilotEvents[K]>) {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof CopilotEvents>(event: K, payload: CopilotEvents[K]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload));
  }
}

export const copilotEventBus = new CopilotEventBus();
export type { CopilotEvents };
