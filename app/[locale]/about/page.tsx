'use client';

import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { useTranslations } from 'next-intl';

const leaders = [
  { src: '/rakesh.png', name: 'Rakesh Kasa', role: 'director' },
  { src: '/mahesh.png', name: 'Mahesh Kumar Baheti', role: 'director' },
  { src: '/RINI-006.svg', name: 'M Abdul Raoof', role: 'director' },
  { src: '/RINI-145.svg', name: 'Dr. Lizo Mkhutshulwa', role: 'director' },
  { src: '/RINI-020.svg', name: 'Mahesh T. Kotecha', role: 'mentor' },
] as const;

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <main className="min-h-screen bg-white pt-20 pb-0">
      <Navbar />
      {/* Hero Section */}
      <section data-copilot-section="about-hero" className="max-w-7xl mx-auto py-10 md:py-20 px-4 flex flex-col md:flex-row items-center gap-8 md:gap-12 xl:max-w-[1400px] 2xl:max-w-[1800px]">
        {/* Start: About us image */}
        <div className="flex-1 flex justify-center md:justify-start items-center">
          <img
            src="/about us.svg"
            alt={t('heroImageAlt')}
            className="max-w-full h-auto object-contain md:ms-8"
            style={{ maxWidth: '100%', width: 'auto' }}
          />
        </div>
        {/* End: Text */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center">
          <img
            src="/meet-Orixs.svg"
            alt={t('meetImageAlt')}
            className="mb-8 md:mb-20 mx-auto md:me-auto md:ms-0"
            style={{ maxWidth: '80%', width: 'auto' }}
          />
          <div className="text-gray-600 text-base md:text-lg xl:text-xl 2xl:text-2xl mb-6">
            {(['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const).map((key, index) => (
              <p key={key} className={index === 0 ? '' : 'mt-6'}>{t(`story.${key}`)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section data-copilot-section="about-locations" className="max-w-6xl mx-auto py-8 sm:py-10 md:py-16 lg:py-20 px-4 sm:px-6 xl:max-w-7xl 2xl:max-w-[1400px]">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 sm:mb-8 md:mb-10 lg:mb-14 text-center">{t('locations.titlePrefix')} <span className="text-purple-500">{t('locations.titleHighlight')}</span></h3>
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-24 2xl:gap-32">
          <div className="flex-1 flex flex-col gap-4 sm:gap-5 md:gap-8 lg:gap-10 xl:gap-12 text-lg sm:text-xl md:text-2xl xl:text-3xl font-medium w-full">
            <div className="bg-white/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 shadow-lg">
              <span className="text-purple-500">{t('locations.india')}</span><br />
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-gray-700">{t('locations.indiaAddress')}</span>
            </div>
            <div className="bg-white/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 shadow-lg">
              <span className="text-purple-500">{t('locations.southAfrica')}</span><br />
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-normal text-gray-700">{t('locations.southAfricaAddress')}</span>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center relative min-h-[200px] sm:min-h-[250px] md:min-h-[350px] lg:min-h-[450px] w-full mt-4 sm:mt-6 md:mt-0">
            <img src="/gif/map.gif" alt={t('locations.mapAlt')} className="w-full max-w-[500px] sm:max-w-[600px] h-auto" />
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section data-copilot-section="about-leadership" className="max-w-6xl mx-auto py-8 sm:py-10 md:py-16 lg:py-20 px-4 sm:px-6 xl:max-w-7xl 2xl:max-w-[1400px]">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-center">{t('leadership.titlePrefix')} <span className="text-purple-500">{t('leadership.titleHighlight')}</span></h3>
        <div className="text-center text-gray-500 mb-6 sm:mb-8 md:mb-10 lg:mb-12 text-base sm:text-lg md:text-xl lg:text-2xl">{t('leadership.subtitle')}</div>

        {/* Single responsive leadership grid: all 5 leaders at every viewport */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20 justify-items-center">
          {leaders.map((leader) => (
            <div key={leader.name} className="flex flex-col items-center">
              <div className="w-28 h-28 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-full overflow-hidden mb-3 md:mb-4 border-4 border-purple-100">
                <img src={leader.src} alt={leader.name} className="w-full h-full object-cover" />
              </div>
              <div dir="auto" className="font-semibold text-base md:text-lg text-center">{leader.name}</div>
              <div className="text-purple-500 text-sm sm:text-base md:text-base lg:text-lg xl:text-xl">{t(`leadership.roles.${leader.role}`)}</div>
            </div>
          ))}
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
