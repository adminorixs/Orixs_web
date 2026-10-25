'use client';

import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('Common.nav');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { label: t('howItWorks'), href: '/#how-it-works' },
    { label: t('platform'), href: '/#platform' },
    { label: t('useCases'), href: '/#use-cases' },
    { label: t('contact'), href: '/#contact' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav aria-label={t('primary')} className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" aria-label={t('home')} className="flex shrink-0 items-center" onClick={closeMenu}>
          <Image src="/worksuite-logo.jpeg" alt="Orixs" width={120} height={40} priority className="h-auto w-[104px]" />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageSwitcher />
          <Link href="/get-started/business" className="inline-flex h-10 items-center justify-center rounded-md bg-[#2f275a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#211b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]">
            {t('requestDemo')}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a] lg:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeMenu} className="rounded-md px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-950">
                {item.label}
              </Link>
            ))}
            <div className="px-3 py-3">
              <LanguageSwitcher />
            </div>
            <Link href="/get-started/business" onClick={closeMenu} className="mt-3 inline-flex h-11 items-center justify-center rounded-md bg-[#2f275a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#211b43]">
              {t('requestDemo')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
