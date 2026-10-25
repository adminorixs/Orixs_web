import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { QueryProvider } from '@/lib/api/QueryProvider';
import { CopilotProvider } from '@/components/copilot/CopilotProvider';
import { CopilotClient } from '@/components/copilot/CopilotClient';
import { directionFor, isAppLocale, locales } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] });
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-arabic' });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const resolved = isAppLocale(locale) ? locale : 'en';
  const t = await getTranslations({ locale: resolved, namespace: 'Meta' });

  return {
    title: t('title'),
    description: t('description'),
    // hreflang alternates so each language version points at its siblings.
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={directionFor(locale)} className="scroll-smooth">
      <body className={`${inter.className} ${notoArabic.variable} ${locale === 'ar' ? 'font-arabic' : ''} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <CopilotProvider>
              {children}
              <CopilotClient />
            </CopilotProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
