import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Legal');
  const sections = t.raw('privacy.sections') as LegalSection[];

  return (
    <main className="min-h-screen bg-[#f6f8fa] pt-20 pb-0 flex flex-col">
      <Navbar />
      <LegalDocument
        backLabel={t('backToHome')}
        contentsLabel={t('contentsLabel')}
        updated={t('privacy.lastUpdated')}
        title={t('privacy.title')}
        lead={t('privacy.lead')}
        notice={t('translationNotice')}
        sections={sections}
        contact={{ title: t('privacy.contact.title'), intro: t('privacy.contact.intro'), email: 'adminorixs@gmail.com' }}
      />
      <FooterSection />
    </main>
  );
}
