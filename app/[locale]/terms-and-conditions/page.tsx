import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { Link } from '@/i18n/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const SECTION_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12'] as const;

export default async function TermsAndConditionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Legal');
  const notice = t('translationNotice');
  const useLines = t.raw('terms.sections.s3.lines') as string[];

  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-20 pb-0 flex flex-col">
      <Navbar />
      <section className="max-w-3xl mx-auto px-4 py-16 flex-1">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
            <FaArrowLeft className="rtl:rotate-180" /> {t('backToHome')}
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-8">{t('terms.title')}</h1>
        {notice ? <p className="mb-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p> : null}
        <div className="text-gray-800 text-lg space-y-6">
          {SECTION_IDS.map((id) => (
            <div key={id}>
              <span className="font-bold">{t(`terms.sections.${id}.title`)}</span>
              <br />
              {id === 's3'
                ? useLines.map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < useLines.length - 1 ? <br /> : null}
                    </span>
                  ))
                : t(`terms.sections.${id}.body`)}
            </div>
          ))}
          <div>
            <span className="font-bold">{t('terms.sections.s13.title')}</span>
            <br />
            {t('terms.sections.s13.bodyBefore')}{' '}
            <a href="mailto:contact@askOrixs.ai" dir="ltr" className="text-purple-600 underline">contact@askOrixs.ai</a>
          </div>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
