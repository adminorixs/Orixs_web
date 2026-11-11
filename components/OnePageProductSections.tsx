'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
  ArrowRight,
  ChartNoAxesCombined,
  CircleCheck,
  Mail,
  MessagesSquare,
  Network,
  ShieldCheck,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { FeaturesTour } from '@/components/features/FeaturesTour';

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

export function OnePageProductSections() {
  const t = useTranslations('Home');

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

      <FeaturesTour />

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
