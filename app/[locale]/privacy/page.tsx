import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { Link } from '@/i18n/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { getTranslations, setRequestLocale } from 'next-intl/server';

const SECTION_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15'] as const;

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Legal');
  const notice = t('translationNotice');

  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-20 pb-0 flex flex-col">
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 py-16 flex-1">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
            <FaArrowLeft className="rtl:rotate-180" /> {t('backToHome')}
          </Link>
        </div>
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 mb-3">{t('privacy.lastUpdated')}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4">{t('privacy.title')}</h1>
          <p className="text-lg text-gray-700 leading-8">{t('privacy.lead')}</p>
          {notice ? <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p> : null}
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 text-gray-800 text-base md:text-lg leading-8 space-y-8">
          {SECTION_IDS.map((id) => (
            <section key={id}>
              <h2 className="text-xl font-bold text-slate-950 mb-2">{t(`privacy.sections.${id}.title`)}</h2>
              {id === 's8' ? (
                <p>
                  {t('privacy.sections.s8.bodyBefore')}{' '}
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    className="text-purple-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('privacy.sections.s8.linkText')}
                  </a>
                  {t('privacy.sections.s8.bodyAfter')}
                </p>
              ) : (
                <p>{t(`privacy.sections.${id}.body`)}</p>
              )}
            </section>
          ))}
          <section>
            <h2 className="text-xl font-bold text-slate-950 mb-2">{t('privacy.sections.s16.title')}</h2>
            <p>
              {t('privacy.sections.s16.bodyBefore')}{' '}
              <a href="mailto:contact@askOrixs.ai" dir="ltr" className="text-purple-600 underline">
                contact@askOrixs.ai
              </a>
              {t('privacy.sections.s16.bodyAfter')}
            </p>
          </section>
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
