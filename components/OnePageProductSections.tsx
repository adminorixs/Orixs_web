import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChartNoAxesCombined, CircleCheck, Mail, MessagesSquare, Network, ShieldCheck, Workflow } from 'lucide-react';

const steps = [
  {
    icon: MessagesSquare,
    number: '01',
    title: 'Ask in plain language',
    description: 'Start with the question in front of you, from a project update or customer follow-up to an operational priority.',
  },
  {
    icon: Network,
    number: '02',
    title: 'See the connected picture',
    description: 'Orixs brings the relevant work, information and people into a single view with the context to understand it.',
  },
  {
    icon: CircleCheck,
    number: '03',
    title: 'Turn clarity into action',
    description: 'Move from insight to the next task, handoff, decision or workflow without losing the thread of the work.',
  },
];

const capabilities = [
  {
    icon: MessagesSquare,
    title: 'A copilot in the flow of work',
    description: 'Give teams a direct way to ask, summarize and find the next best action without chasing information across tools.',
  },
  {
    icon: Mail,
    title: 'Communication that leads somewhere',
    description: 'Keep important conversations connected to the people, projects and follow-up work they create.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'A live view for better decisions',
    description: 'Bring operational signals together so leaders can see priorities, progress and areas that need attention.',
  },
];

const useCases = [
  {
    title: 'Business operations',
    description: 'Give the people running the business a clear view of work, ownership and what needs attention next.',
    accent: 'border-t-[#2f275a]',
  },
  {
    title: 'Client and project delivery',
    description: 'Keep customer commitments, conversations and internal handoffs visible from planning through delivery.',
    accent: 'border-t-[#0f766e]',
  },
  {
    title: 'Finance and leadership',
    description: 'Connect performance signals to the decisions that shape priorities, budgets and business momentum.',
    accent: 'border-t-[#b45309]',
  },
  {
    title: 'People and internal teams',
    description: 'Make everyday coordination easier across people operations, approvals, communication and shared work.',
    accent: 'border-t-[#be123c]',
  },
];

export function OnePageProductSections() {
  return (
    <main>
      <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200 bg-white py-20 sm:py-24" aria-labelledby="how-it-works-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">How Orixs works</p>
              <h2 id="how-it-works-title" className="mt-4 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
                A simple path from question to action.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Orixs is designed around the way work actually happens: a question arrives, context is needed, and someone has to make the next move.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, number, title, description }) => (
              <article key={number} className="border-t-2 border-[#d9d4f1] pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#7564b6]">{number}</span>
                  <Icon aria-hidden="true" size={22} className="text-[#2f275a]" />
                </div>
                <h3 className="mt-8 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-20 bg-[#221d35] py-20 text-white sm:py-24" aria-labelledby="platform-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#beb5ec]">The Orixs platform</p>
            <h2 id="platform-title" className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              The operating layer for everyday business.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Bring people, work, customer information and financial activity into a connected workspace that gives every team the context to act with confidence.
            </p>
            <div className="mt-10 grid gap-7">
              {capabilities.map(({ icon: Icon, title, description }) => (
                <div key={title} className="grid grid-cols-[32px_1fr] gap-4">
                  <Icon aria-hidden="true" size={22} className="mt-1 text-[#d8d1ff]" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="mt-1 leading-7 text-slate-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/15 bg-white p-2 shadow-2xl shadow-black/20 sm:p-3">
            <Image src="/dashboard.jpeg" alt="Orixs dashboard with work, mailbox, team and performance information" width={1600} height={900} className="h-auto w-full rounded-md" />
          </div>
        </div>
      </section>

      <section id="use-cases" className="scroll-mt-20 bg-[#fbfafc] py-20 sm:py-24" aria-labelledby="use-cases-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">Use cases</p>
            <h2 id="use-cases-title" className="mt-4 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
              One workspace, shaped around the work that matters.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Orixs adapts to the practical moments where teams need a shared understanding and a faster path forward.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map(({ title, description, accent }) => (
              <article key={title} className={`min-h-[236px] border border-slate-200 border-t-4 bg-white p-6 shadow-sm ${accent}`}>
                <Workflow aria-hidden="true" size={21} className="text-slate-500" />
                <h3 className="mt-9 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 border-t border-slate-200 bg-white py-20 sm:py-24" aria-labelledby="contact-title">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <ShieldCheck aria-hidden="true" size={28} className="mx-auto text-[#7564b6]" />
          <h2 id="contact-title" className="mt-5 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
            See what a connected business workspace can unlock.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Explore how Orixs can bring your teams, work and decisions into a clearer operating rhythm.
          </p>
          <Link href="/get-started/business" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#2f275a] px-5 text-base font-semibold text-white transition-colors hover:bg-[#211b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]">
            Request a demo
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
