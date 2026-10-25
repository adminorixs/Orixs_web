import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function FooterSection() {
  const t = useTranslations('Common.footer');
  const tNav = useTranslations('Common.nav');

  const footerGroups = [
    {
      title: t('product'),
      links: [
        { label: t('howItWorks'), href: '/#how-it-works' },
        { label: t('platform'), href: '/#platform' },
        { label: t('useCases'), href: '/#use-cases' },
      ],
    },
    {
      title: t('getStarted'),
      links: [
        { label: t('requestDemo'), href: '/#contact' },
        { label: t('login'), href: '/get-started/business' },
      ],
    },
    {
      title: t('company'),
      links: [
        { label: t('contact'), href: '/#contact' },
        { label: t('privacy'), href: '/privacy' },
        { label: t('terms'), href: '/terms-and-conditions' },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white px-5 py-10 text-slate-700 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 border-b border-slate-200 pb-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,2fr)] lg:gap-16">
          <div className="max-w-sm">
            <Link href="/" aria-label={tNav('home')} className="inline-flex transition-opacity hover:opacity-75">
              <Image src="/worksuite-logo.jpeg" alt="Orixs" width={108} height={36} className="h-auto w-[112px]" />
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-500">{t('tagline')}</p>
          </div>

          <nav aria-label={t('navigation')} className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-10">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-800">{group.title}</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-slate-500 transition-colors hover:text-[#2f2760]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex justify-center border-b border-slate-200 py-8 sm:py-9">
          <div className="flex flex-col items-center text-center">
            <a href="https://alcorsystems.com" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75">
              <Image src="/alcor-systems-logo.jpeg" alt="Alcor Systems" width={64} height={64} className="h-14 w-14 object-contain" />
            </a>
            <p className="mt-3 text-sm font-medium text-slate-600">
              {t('builtWith')}{' '}
              <a href="https://alcorsystems.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-800 transition-colors hover:text-[#2f2760]">
                ALCOR GROUP
              </a>
            </p>
            <p dir="ltr" className="mt-2 text-xs font-medium tracking-[0.12em] text-slate-400">{t('regions')}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>{t('rights')}</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-[#2f2760]">{t('privacy')}</Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-[#2f2760]">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
