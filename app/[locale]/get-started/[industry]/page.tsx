import { notFound, redirect } from 'next/navigation';

/**
 * "Get started" gateway.
 *
 * The marketing site no longer has its own sign-up form. There is a single registration path: the product's login page
 * carries a "New registration" button that opens the full onboarding (company, location, currency, tax). Every existing
 * "Get started" / "Log in" link on the site points here, so they keep working and always land on the right product.
 */
const productApps: Record<string, string> = {
  business: 'https://dev.orixs.io',
  insurance: 'https://insurance.orixs.io',
  construction: 'https://construction.orixs.io',
};

export default async function GetStartedPage({ params }: { params: Promise<{ locale: string; industry: string }> }) {
  const { locale, industry } = await params;
  const base = productApps[industry];

  if (!base) {
    notFound();
  }

  // The product apps accept ?lang=<en|es|ar> on their guest pages, so the visitor keeps the language they chose here.
  redirect(`${base}/login?lang=${encodeURIComponent(locale)}`);
}
