import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'es', 'ar'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';

// Locales that render right-to-left (document dir="rtl").
export const rtlLocales: readonly AppLocale[] = ['ar'];

// Native names, never translated, so a visitor can always find their own language.
export const localeNames: Record<AppLocale, string> = {
  en: 'English',
  es: 'Español',
  ar: 'العربية',
};

export function isAppLocale(value: string | undefined | null): value is AppLocale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function directionFor(locale: string): 'rtl' | 'ltr' {
  return (rtlLocales as readonly string[]).includes(locale) ? 'rtl' : 'ltr';
}

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Stable, shareable, indexable URLs: /en/..., /es/..., /ar/...
  localePrefix: 'always',
});
