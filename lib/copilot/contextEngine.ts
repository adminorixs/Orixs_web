'use client';

import { useParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { copilotEventBus } from './eventBus';
import type { CopilotContext, DeviceType, PageType } from './types';

function createConversationId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `copilot-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getPageType(pathname: string): PageType {
  if (pathname === '/') return 'homepage';
  if (pathname === '/use-cases') return 'use-cases';
  if (pathname === '/pricing') return 'pricing';
  if (pathname.startsWith('/get-started')) return 'get-started';
  if (pathname.startsWith('/blogs/')) return 'blog';
  if (pathname === '/blogs') return 'blog';
  if (pathname.startsWith('/case-studies/')) return 'case-study';
  if (pathname === '/case-studies') return 'case-study';
  if (pathname === '/about') return 'about';
  if (pathname === '/privacy' || pathname === '/terms-and-conditions') return 'legal';
  if (pathname.startsWith('/payment') || pathname.startsWith('/pricing/')) return 'payment';
  return 'unknown';
}

function getPageTitle(pageType: PageType, pathname: string) {
  const titles: Record<PageType, string> = {
    homepage: 'Homepage',
    'use-cases': 'Use Cases',
    'get-started': 'Get Started',
    pricing: 'Pricing',
    blog: pathname === '/blogs' ? 'Blogs' : 'Blog Detail',
    'case-study': pathname === '/case-studies' ? 'Case Studies' : 'Case Study Detail',
    about: 'About Orixs',
    legal: pathname === '/privacy' ? 'Privacy Policy' : 'Terms and Conditions',
    payment: 'Payment',
    unknown: 'Orixs',
  };
  return titles[pageType];
}

function getDevice(width: number): DeviceType {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function useContextEngine(): CopilotContext {
  const pathname = usePathname() || '/';
  const params = useParams();
  const conversationId = useRef(createConversationId());
  const [visibleSection, setVisibleSection] = useState('hero');
  const [activeTab, setActiveTab] = useState<string | undefined>();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState<string | undefined>();
  const [formStep, setFormStep] = useState<number | undefined>();
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [scrollDepth, setScrollDepth] = useState(0);
  const [pagesVisited, setPagesVisited] = useState<string[]>([]);

  const pageType = useMemo(() => getPageType(pathname), [pathname]);

  useEffect(() => {
    setPagesVisited((prev) => {
      const next = [...prev, pathname].slice(-8);
      return next;
    });
  }, [pathname]);

  useEffect(() => {
    function updateViewport() {
      setDevice(getDevice(window.innerWidth));
    }

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    function updateScrollDepth() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setScrollDepth(height > 0 ? Math.min(100, Math.round((scrollTop / height) * 100)) : 0);
    }

    updateScrollDepth();
    window.addEventListener('scroll', updateScrollDepth, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDepth);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-copilot-section]'));
    if (!elements.length) {
      setVisibleSection(pageType === 'homepage' ? 'hero' : pageType);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const section = visible?.target.getAttribute('data-copilot-section');
        if (section) setVisibleSection(section);
      },
      { rootMargin: '-20% 0px -45% 0px', threshold: [0.15, 0.35, 0.6] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname, pageType]);

  useEffect(() => {
    const offSwitchTab = copilotEventBus.on('switchTab', ({ tabGroup, tabValue }) => {
      setActiveTab(`${tabGroup}:${tabValue}`);
    });
    const offFilterChange = copilotEventBus.on('filterChange', ({ currency, billingPeriod }) => {
      setActiveFilters([currency && `currency:${currency}`, billingPeriod && `billing:${billingPeriod}`].filter(Boolean) as string[]);
    });
    const offModalOpen = copilotEventBus.on('modalOpen', ({ modalId }) => setOpenModal(modalId));
    const offModalClose = copilotEventBus.on('modalClose', () => setOpenModal(undefined));
    const offFormStep = copilotEventBus.on('formStepChange', ({ formStep }) => setFormStep(formStep));

    return () => {
      offSwitchTab();
      offFilterChange();
      offModalOpen();
      offModalClose();
      offFormStep();
    };
  }, []);

  return {
    route: pathname,
    routeParams: Object.fromEntries(
      Object.entries(params || {}).map(([key, value]) => [key, Array.isArray(value) ? value.join('/') : String(value)])
    ),
    pageType,
    pageTitle: getPageTitle(pageType, pathname),
    visibleSection,
    activeTab,
    activeFilters,
    openModal,
    formStep,
    device,
    scrollDepth,
    pagesVisited,
    conversationId: conversationId.current,
  };
}
