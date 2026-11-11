import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function TermsAndConditionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Legal');
  const sections = t.raw('terms.sections') as LegalSection[];

  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-20 pb-0 flex flex-col">
      <Navbar />
      <LegalDocument
        backLabel={t('backToHome')}
        contentsLabel={t('contentsLabel')}
        updated={t('terms.lastUpdated')}
        title={t('terms.title')}
        lead={t('terms.lead')}
        notice={t('translationNotice')}
        sections={sections}
        contact={{ title: t('terms.contact.title'), intro: t('terms.contact.intro'), email: 'adminorixs@gmail.com' }}
      />
      <FooterSection />
    </main>
  );
}
