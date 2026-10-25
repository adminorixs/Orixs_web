import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  // Feature dictionaries are merged per locale in messages/<locale>/index.ts. Any missing key falls back to English.
  const [localized, fallback] = await Promise.all([
    import(`../messages/${locale}/index`),
    import('../messages/en/index'),
  ]);

  return {
    locale,
    messages: locale === 'en' ? localized.default : deepMerge(fallback.default, localized.default),
    timeZone: 'UTC',
  };
});

type Dict = { [key: string]: string | string[] | Dict };

const isDict = (value: unknown): value is Dict => typeof value === 'object' && value !== null && !Array.isArray(value);

function deepMerge(base: Dict, override: Dict): Dict {
  const out: Dict = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] =
      isDict(value) && isDict(current)
        ? deepMerge(current, value)
        : value;
  }
  return out;
}
