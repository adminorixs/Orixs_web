'use client';

import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { localeNames, locales, isAppLocale } from '@/i18n/routing';

/**
 * Accessible language selector: a native <select> (keyboard, screen-reader and mobile friendly) that keeps the visitor
 * on the same page, query string and hash when switching language.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const t = useTranslations('Common.language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onChange = (next: string) => {
    if (!isAppLocale(next) || next === locale) {
      return;
    }

    // Read the query and hash at click time: avoids useSearchParams, which would force client-side rendering of every page.
    const { search, hash } = window.location;
    router.replace(`${pathname}${search}${hash}`, { locale: next });
  };

  return (
    <label className={`relative inline-flex items-center gap-2 text-sm text-slate-600 ${className}`}>
      <Globe aria-hidden="true" size={16} className="shrink-0" />
      <span className="sr-only">{t('switchTo')}</span>
      <select
        value={locale}
        onChange={(event) => onChange(event.target.value)}
        aria-label={t('switchTo')}
        className="h-9 cursor-pointer rounded-md border border-slate-200 bg-white ps-2 pe-7 text-sm font-medium text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]"
      >
        {locales.map((code) => (
          <option key={code} value={code} lang={code}>
            {localeNames[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
