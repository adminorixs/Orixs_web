'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  CircleCheck,
  ClipboardCheck,
  FileCheck2,
  HardHat,
  Mail,
  MapPin,
  MessagesSquare,
  Network,
  Settings2,
  ShieldCheck,
  UsersRound,
  WalletCards,
  Workflow,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';

const stepDefs = [
  { id: 'ask', icon: MessagesSquare, number: '01' },
  { id: 'see', icon: Network, number: '02' },
  { id: 'act', icon: CircleCheck, number: '03' },
];

const capabilityDefs = [
  { id: 'copilot', icon: MessagesSquare },
  { id: 'communication', icon: Mail },
  { id: 'view', icon: ChartNoAxesCombined },
];

// Text lives in messages/<locale>/home.json; only ids and icons stay in code.
const industryDefs = [
  {
    id: 'business',
    icon: BriefcaseBusiness,
    features: [
      { id: 'dashboards', icon: ChartNoAxesCombined },
      { id: 'customers', icon: UsersRound },
      { id: 'resources', icon: Settings2 },
      { id: 'automation', icon: Workflow },
      { id: 'reporting', icon: FileCheck2 },
      { id: 'priorities', icon: CircleCheck },
    ],
  },
  {
    id: 'insurance',
    icon: ShieldCheck,
    features: [
      { id: 'risk', icon: ShieldCheck },
      { id: 'claims', icon: ClipboardCheck },
      { id: 'policy', icon: FileCheck2 },
      { id: 'service', icon: UsersRound },
      { id: 'compliance', icon: Workflow },
      { id: 'reporting', icon: ChartNoAxesCombined },
    ],
  },
  {
    id: 'construction',
    icon: HardHat,
    features: [
      { id: 'planning', icon: HardHat },
      { id: 'crews', icon: MapPin },
      { id: 'budget', icon: WalletCards },
      { id: 'safety', icon: ClipboardCheck },
      { id: 'delivery', icon: CalendarDays },
      { id: 'reporting', icon: ChartNoAxesCombined },
    ],
  },
];

export function OnePageProductSections() {
  const t = useTranslations('Home');
  const [activeIndustryId, setActiveIndustryId] = useState('business');
  const activeIndustry = industryDefs.find((industry) => industry.id === activeIndustryId) ?? industryDefs[0];
  const activeName = t(`useCases.industries.${activeIndustry.id}.name`);

  return (
    <main>
      <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200 bg-white py-16 sm:py-20" aria-labelledby="how-it-works-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">{t('howItWorks.eyebrow')}</p>
              <h2 id="how-it-works-title" className="mt-4 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
                {t('howItWorks.title')}
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{t('howItWorks.description')}</p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {stepDefs.map(({ id, icon: Icon, number }) => (
              <article key={id} className="border-t-2 border-[#d9d4f1] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#7564b6]">{number}</span>
                  <Icon aria-hidden="true" size={22} className="text-[#2f275a]" />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-slate-900">{t(`howItWorks.steps.${id}.title`)}</h3>
                <p className="mt-3 leading-7 text-slate-600">{t(`howItWorks.steps.${id}.description`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-20 bg-[#221d35] py-16 text-white sm:py-20" aria-labelledby="platform-title">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#beb5ec]">{t('platform.eyebrow')}</p>
            <h2 id="platform-title" className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              {t('platform.title')}
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{t('platform.description')}</p>
            <div className="mt-8 grid gap-6">
              {capabilityDefs.map(({ id, icon: Icon }) => (
                <div key={id} className="grid grid-cols-[32px_1fr] gap-4">
                  <Icon aria-hidden="true" size={22} className="mt-1 text-[#d8d1ff]" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t(`platform.capabilities.${id}.title`)}</h3>
                    <p className="mt-1 leading-7 text-slate-300">{t(`platform.capabilities.${id}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-lg border border-white/15 bg-white shadow-2xl shadow-black/20 lg:justify-self-end">
            <Image src="/orixs-all-in-one-platform.png" alt={t('platform.imageAlt')} width={1774} height={887} className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section id="use-cases" className="scroll-mt-20 bg-[#fbfafc] py-16 sm:py-20" aria-labelledby="use-cases-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">{t('useCases.eyebrow')}</p>
              <h2 id="use-cases-title" className="mt-4 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
                {t('useCases.title')}
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">{t('useCases.description')}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3" role="group" aria-label={t('useCases.groupLabel')}>
            {industryDefs.map(({ id, icon: Icon }) => {
              const isActive = id === activeIndustry.id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveIndustryId(id)}
                  aria-pressed={isActive}
                  className={`min-h-[152px] border p-5 text-start transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a] ${
                    isActive
                      ? 'border-[#2f275a] bg-[#2f275a] text-white shadow-lg shadow-[#2f275a]/15'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-[#a59bd3] hover:bg-[#f7f5ff]'
                  }`}
                >
                  <Icon aria-hidden="true" size={25} className={isActive ? 'text-[#ddd7ff]' : 'text-[#7564b6]'} />
                  <span className="mt-6 block text-xl font-semibold">{t(`useCases.industries.${id}.name`)}</span>
                  <span className={`mt-2 block text-sm ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>{t(`useCases.industries.${id}.tagline`)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border border-slate-200 bg-white p-6 sm:p-7 lg:p-8">
            <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">{activeName}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#1e1a2e] sm:text-3xl">{t(`useCases.industries.${activeIndustry.id}.title`)}</h3>
                <p className="mt-4 leading-7 text-slate-600">{t(`useCases.industries.${activeIndustry.id}.description`)}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href={`/get-started/${activeIndustry.id}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2f275a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#211b43]">
                  {t('useCases.getStarted', { name: activeName })}
                  <ArrowRight aria-hidden="true" size={16} className="rtl:rotate-180" />
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeIndustry.features.map(({ id, icon: Icon }) => (
                <article key={id} className="border-s-2 border-[#d9d4f1] ps-4">
                  <Icon aria-hidden="true" size={20} className="text-[#7564b6]" />
                  <h4 className="mt-4 font-semibold text-slate-900">{t(`useCases.industries.${activeIndustry.id}.features.${id}.title`)}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{t(`useCases.industries.${activeIndustry.id}.features.${id}.description`)}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 border-t border-slate-200 bg-white py-16 sm:py-20" aria-labelledby="contact-title">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <ShieldCheck aria-hidden="true" size={28} className="mx-auto text-[#7564b6]" />
          <h2 id="contact-title" className="mt-5 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
            {t('contact.title')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t('contact.description')}</p>
          <Link href="/get-started/business" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#2f275a] px-5 text-base font-semibold text-white transition-colors hover:bg-[#211b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]">
            {t('contact.requestDemo')}
            <ArrowRight aria-hidden="true" size={17} className="rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </main>
  );
}
