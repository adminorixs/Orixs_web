import { FaArrowLeft } from 'react-icons/fa';
import { Link } from '@/i18n/navigation';

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  link?: { text: string; href: string };
};

type LegalDocumentProps = {
  backLabel: string;
  contentsLabel: string;
  updated: string;
  title: string;
  lead: string;
  notice?: string;
  sections: LegalSection[];
  contact: { title: string; intro: string; email: string };
};

// Shared layout for the Privacy Policy and the Terms. Text lives in messages/<locale>/legal.json.
export function LegalDocument({ backLabel, contentsLabel, updated, title, lead, notice, sections, contact }: LegalDocumentProps) {
  const all = [...sections, { title: contact.title }];

  return (
    <section className="max-w-4xl mx-auto px-4 py-16 flex-1 w-full">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
          <FaArrowLeft className="rtl:rotate-180" /> {backLabel}
        </Link>
      </div>

      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600 mb-3">{updated}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-950 mb-4">{title}</h1>
        <p className="text-lg text-gray-700 leading-8">{lead}</p>
        {notice ? <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{notice}</p> : null}
      </header>

      <nav aria-label={contentsLabel} className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{contentsLabel}</h2>
        <ol className="grid gap-x-8 gap-y-1.5 text-sm text-slate-700 md:grid-cols-2">
          {all.map((section, index) => (
            <li key={index}>
              <a href={`#section-${index + 1}`} className="hover:text-purple-600 hover:underline">
                {index + 1}. {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 text-gray-800 text-base leading-8 space-y-9">
        {sections.map((section, index) => (
          <section key={index} id={`section-${index + 1}`} className="scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-950 mb-3">
              {index + 1}. {section.title}
            </h2>
            {section.paragraphs?.map((paragraph, i) => (
              <p key={i} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
            {section.items?.length ? (
              <ul className="mt-2 list-disc space-y-1.5 ps-6 marker:text-purple-400">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.link ? (
              <p className="mt-3">
                <a href={section.link.href} className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">
                  {section.link.text}
                </a>
              </p>
            ) : null}
          </section>
        ))}

        <section id={`section-${sections.length + 1}`} className="scroll-mt-28">
          <h2 className="text-xl font-bold text-slate-950 mb-3">
            {sections.length + 1}. {contact.title}
          </h2>
          <p>
            {contact.intro}{' '}
            <a href={`mailto:${contact.email}`} dir="ltr" className="text-purple-600 underline">
              {contact.email}
            </a>
          </p>
        </section>
      </div>
    </section>
  );
}
