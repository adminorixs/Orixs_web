'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Pause, Play } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { copilotEventBus } from '@/lib/copilot/eventBus';
import { featureMenus, featureStats } from './featuresData';

const TOUR_STEP_MS = 4500;
const tileColors = ['bg-[#7564b6]', 'bg-emerald-500', 'bg-amber-500'];
const HASH_PATTERN = /^#features-([A-Za-z]+)(?:-([A-Za-z]+))?$/;

// An interactive tour of the real Orixs menus. Clicking a menu opens its modules, clicking a feature shows what is inside.
// Text lives in messages/<locale>/features.json; structure and icons in ./featuresData.ts.
export function FeaturesTour() {
  const t = useTranslations('Features');
  const sectionRef = useRef<HTMLElement>(null);
  const [menuIndex, setMenuIndex] = useState(0);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const menu = featureMenus[menuIndex];
  const feature = menu.modules[moduleIndex];
  const ModuleIcon = feature.icon;
  const items = t.raw(`modules.${feature.id}.items`) as string[];

  const updateHash = useCallback((menuId: string, moduleId: string) => {
    try {
      window.history.replaceState(null, '', `#features-${menuId}-${moduleId}`);
    } catch {
      // The hash is only a convenience link; the tour works without it.
    }
  }, []);

  const chooseMenu = useCallback(
    (index: number, byUser = true) => {
      setMenuIndex(index);
      setModuleIndex(0);
      if (byUser) {
        setPlaying(false);
        updateHash(featureMenus[index].id, featureMenus[index].modules[0].id);
        copilotEventBus.emit('switchTab', { tabGroup: 'use-cases', tabValue: featureMenus[index].id });
      }
    },
    [updateHash],
  );

  const chooseModule = useCallback(
    (index: number) => {
      setModuleIndex(index);
      setPlaying(false);
      updateHash(menu.id, menu.modules[index].id);
    },
    [menu, updateHash],
  );

  // Deep links such as /#features-finance or /#features-finance-billing open that menu and feature.
  useEffect(() => {
    const match = HASH_PATTERN.exec(window.location.hash);
    if (!match) return;
    const targetMenu = featureMenus.findIndex((entry) => entry.id === match[1]);
    if (targetMenu < 0) return;
    const targetModule = Math.max(0, featureMenus[targetMenu].modules.findIndex((entry) => entry.id === match[2]));
    setMenuIndex(targetMenu);
    setModuleIndex(targetModule);
    sectionRef.current?.scrollIntoView({ block: 'start' });
  }, []);

  // The Copilot can switch the tour to a menu.
  useEffect(() => {
    return copilotEventBus.on('switchTab', ({ tabGroup, tabValue }) => {
      if (tabGroup !== 'use-cases') return;
      const index = featureMenus.findIndex((entry) => entry.id === tabValue);
      if (index >= 0) {
        setMenuIndex(index);
        setModuleIndex(0);
        setPlaying(false);
      }
    });
  }, []);

  // Guided tour: step through every feature of every menu until the visitor takes over or pauses.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (moduleIndex < menu.modules.length - 1) {
        setModuleIndex(moduleIndex + 1);
      } else {
        setMenuIndex((menuIndex + 1) % featureMenus.length);
        setModuleIndex(0);
      }
    }, TOUR_STEP_MS);
    return () => window.clearTimeout(timer);
  }, [playing, menuIndex, moduleIndex, menu.modules.length]);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtl = getComputedStyle(document.documentElement).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    let next = -1;
    if (event.key === forward) next = (index + 1) % featureMenus.length;
    else if (event.key === backward) next = (index - 1 + featureMenus.length) % featureMenus.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = featureMenus.length - 1;
    if (next < 0) return;
    event.preventDefault();
    chooseMenu(next);
    document.getElementById(`features-tab-${featureMenus[next].id}`)?.focus();
  };

  const stats = [
    { value: featureStats.menus, label: t('statMenus') },
    { value: featureStats.modules, label: t('statModules') },
    { value: featureStats.stores, label: t('statStores') },
    { value: featureStats.gateways, label: t('statGateways') },
    { value: featureStats.languages, label: t('statLanguages') },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      data-copilot-section="use-cases"
      className="scroll-mt-20 bg-[#fbfafc] py-16 sm:py-20"
      aria-labelledby="features-title"
    >
      {/* Old /#use-cases links keep landing here. */}
      <span id="use-cases" aria-hidden="true" className="block scroll-mt-20" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">{t('eyebrow')}</p>
            <h2 id="features-title" className="mt-4 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
              {t('title')}
            </h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">{t('description')}</p>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-slate-200 bg-white px-4 py-4">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block text-3xl font-semibold text-[#2f275a]">{stat.value}</span>
                <span className="mt-1 block text-sm text-slate-500">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <span className="ms-3 text-xs font-medium text-slate-500">{t('previewLabel')}</span>
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              className="ms-auto inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#2f275a] hover:bg-slate-50"
              aria-pressed={playing}
            >
              {playing ? <Pause aria-hidden="true" size={14} /> : <Play aria-hidden="true" size={14} />}
              {playing ? t('pause') : t('play')}
            </button>
          </div>

          <div role="tablist" aria-label={t('menuNavLabel')} className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-[#f7f5fc] px-2 py-2">
            {featureMenus.map((entry, index) => {
              const Icon = entry.icon;
              const active = index === menuIndex;
              return (
                <button
                  key={entry.id}
                  id={`features-tab-${entry.id}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls="features-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => chooseMenu(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active ? 'bg-white text-[#2f275a] shadow-sm ring-1 ring-[#d8d1ff]' : 'text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <Icon aria-hidden="true" size={16} className={active ? 'text-[#7564b6]' : 'text-slate-400'} />
                  {t(`menus.${entry.id}.name`)}
                  <span className={`rounded-full px-1.5 text-[11px] ${active ? 'bg-[#efeaff] text-[#5b4a9e]' : 'bg-slate-200/70 text-slate-500'}`}>
                    {entry.modules.length}
                  </span>
                </button>
              );
            })}
          </div>

          <div id="features-panel" role="tabpanel" aria-labelledby={`features-tab-${menu.id}`} className="grid lg:grid-cols-[18rem_1fr]">
            <nav aria-label={t('modulesLabel')} className="border-b border-slate-200 bg-white p-3 lg:border-b-0 lg:border-e">
              <p className="px-2 pb-1 text-sm font-semibold text-[#1e1a2e]">{t(`menus.${menu.id}.name`)}</p>
              <p className="px-2 pb-3 text-xs text-slate-500">{t('moduleCount', { count: menu.modules.length })}</p>
              <ul className="grid gap-1">
                {menu.modules.map((entry, index) => {
                  const Icon = entry.icon;
                  const active = index === moduleIndex;
                  return (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => chooseModule(index)}
                        aria-current={active ? 'true' : undefined}
                        className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-start text-sm transition-colors ${
                          active ? 'bg-[#efeaff] font-semibold text-[#2f275a]' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${active ? 'bg-white text-[#7564b6]' : 'bg-slate-100 text-slate-500'}`}>
                          <Icon aria-hidden="true" size={16} />
                        </span>
                        <span className="flex-1">{t(`modules.${entry.id}.name`)}</span>
                        <ChevronRight aria-hidden="true" size={15} className="shrink-0 text-slate-400 rtl:rotate-180" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="min-h-[26rem] p-5 sm:p-7" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${menu.id}-${feature.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7564b6]">
                    {t('openIn')} {t(`menus.${menu.id}.name`)}
                  </p>
                  <div className="mt-3 flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#efeaff] text-[#5b4a9e]">
                      <ModuleIcon aria-hidden="true" size={24} />
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold leading-tight text-[#1e1a2e]">{t(`modules.${feature.id}.name`)}</h3>
                      <p className="mt-2 max-w-xl leading-7 text-slate-600">{t(`modules.${feature.id}.description`)}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{t('insideLabel')}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {items.map((item) => (
                      <li key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div aria-hidden="true" className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="h-2.5 w-28 rounded bg-slate-300" />
                      <div className="h-6 w-20 rounded bg-[#2f275a]" />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {tileColors.map((color, index) => (
                        <div key={color} className="rounded-md border border-slate-200 bg-white p-2.5">
                          <div className={`h-1 w-8 rounded ${color}`} />
                          <div className="mt-2 h-3 rounded bg-slate-200" style={{ width: `${70 - index * 14}%` }} />
                          <div className="mt-1.5 h-2 w-1/2 rounded bg-slate-100" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 grid gap-2">
                      {items.slice(0, 4).map((item, index) => (
                        <div key={item} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                          <ModuleIcon size={13} className="shrink-0 text-[#7564b6]" />
                          <span className="text-xs font-medium text-slate-700">{item}</span>
                          <span className="ms-auto h-1.5 rounded bg-slate-200" style={{ width: `${64 - index * 10}px` }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                    <Link
                      href="/get-started/business"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2f275a] px-5 text-sm font-semibold text-white transition hover:bg-[#241d47]"
                    >
                      {t('cta')}
                      <ArrowRight aria-hidden="true" size={16} className="rtl:rotate-180" />
                    </Link>
                    <span className="text-xs text-slate-500">{t('ctaNote')}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
