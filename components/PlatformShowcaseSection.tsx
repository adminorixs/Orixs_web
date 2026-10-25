import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function PlatformShowcaseSection() {
  const t = useTranslations('Home.hero');

  return (
    <section className="bg-[#fbfafc] pt-24 sm:pt-28" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 sm:px-6 sm:pb-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8 lg:pb-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">{t('eyebrow')}</p>
          <h1 id="hero-title" className="mt-5 text-4xl font-semibold leading-[1.08] text-[#1e1a2e] sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">{t('description')}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/get-started/business" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#2f275a] px-5 text-base font-semibold text-white transition-colors hover:bg-[#211b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]">
              {t('requestDemo')}
              <ArrowRight aria-hidden="true" size={17} className="rtl:rotate-180" />
            </Link>
            <Link href="/#how-it-works" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]">
              {t('seeHow')}
            </Link>
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-500">{t('note')}</p>
        </div>

        <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:justify-self-end">
          <div className="absolute -inset-x-4 top-[11%] bottom-[9%] -z-10 rounded-[2rem] bg-[#ece9fb] sm:-inset-x-8" />
          <Image
            src="/orixs-hero-square.webp"
            alt={t('imageAlt')}
            width={1280}
            height={1280}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
