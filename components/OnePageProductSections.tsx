'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  CircleCheck,
  ClipboardCheck,
  FileCheck2,
  HardHat,
  Mail,
  MapPin,
  MessagesSquare,
  Network,
  Settings2,
  ShieldCheck,
  UsersRound,
  WalletCards,
  Workflow,
} from 'lucide-react';

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
    description: 'Keep important conversations connected to the people, tasks and follow-up work they create.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'A live view for better decisions',
    description: 'Bring operational signals together so leaders can see priorities, progress and areas that need attention.',
  },
];

const industryUseCases = [
  {
    id: 'business',
    name: 'Business Operations',
    tagline: 'Your AI command center',
    icon: BriefcaseBusiness,
    title: 'Intelligence that keeps the whole business moving',
    description: 'Connect project activity, customer relationships and financial priorities in one workspace so teams can act with the same context.',
    features: [
      { icon: ChartNoAxesCombined, title: 'Live dashboards', description: 'Keep performance, team activity and priorities visible in one place.' },
      { icon: UsersRound, title: 'Connected customer work', description: 'Bring follow-ups and customer context closer to the work they create.' },
      { icon: Settings2, title: 'Resource visibility', description: 'Give owners a clearer view of people, budgets and shared work.' },
      { icon: Workflow, title: 'Workflow automation', description: 'Move routine handoffs and approvals forward with less manual coordination.' },
      { icon: FileCheck2, title: 'Ready-to-share reporting', description: 'Turn operational information into clear reports for the people who need them.' },
      { icon: CircleCheck, title: 'Priority tracking', description: 'See what is on track, what is blocked and what needs attention next.' },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    tagline: 'Claims, underwriting, compliance',
    icon: ShieldCheck,
    title: 'A clearer operating view across the insurance lifecycle',
    description: 'Bring claims, underwriting, policy work and customer communication into a shared operational picture for faster, more consistent action.',
    features: [
      { icon: ShieldCheck, title: 'Risk context', description: 'Give teams the information they need to review and assess each case.' },
      { icon: ClipboardCheck, title: 'Claims coordination', description: 'Track review steps, documents and handoffs across the claims process.' },
      { icon: FileCheck2, title: 'Policy oversight', description: 'Keep policy updates, renewals and key records easier to follow.' },
      { icon: UsersRound, title: 'Customer service', description: 'Connect customer requests to the people and work needed to resolve them.' },
      { icon: Workflow, title: 'Compliance workflows', description: 'Support consistent checks, approvals and auditable operational steps.' },
      { icon: ChartNoAxesCombined, title: 'Operational reporting', description: 'Give leaders a clearer view of workload, progress and service activity.' },
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    tagline: 'Projects, crews, budgets',
    icon: HardHat,
    title: 'Full visibility across every build',
    description: 'Connect timelines, crews, budgets and site activity so project teams can make informed decisions from pre-construction to handover.',
    features: [
      { icon: HardHat, title: 'Project planning', description: 'Keep the work, milestones and planning context visible to the whole team.' },
      { icon: MapPin, title: 'Crew coordination', description: 'Support clearer task ownership, check-ins and activity across project locations.' },
      { icon: WalletCards, title: 'Budget control', description: 'Bring cost activity and budget priorities into the project conversation.' },
      { icon: ClipboardCheck, title: 'Safety workflows', description: 'Coordinate safety actions, checklists and issue follow-up across sites.' },
      { icon: CalendarDays, title: 'Delivery milestones', description: 'Keep subcontractor activity, schedules and milestones aligned with the plan.' },
      { icon: ChartNoAxesCombined, title: 'Project reporting', description: 'Give stakeholders a current view of progress, workload and delivery risk.' },
    ],
  },
];

export function OnePageProductSections() {
  const [activeIndustryId, setActiveIndustryId] = useState('business');
  const activeIndustry = industryUseCases.find((industry) => industry.id === activeIndustryId) ?? industryUseCases[0];

  return (
    <main>
      <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200 bg-white py-16 sm:py-20" aria-labelledby="how-it-works-title">
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

          <div className="mt-8 grid gap-5 md:grid-cols-3">
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

      <section id="platform" className="scroll-mt-20 bg-[#221d35] py-16 text-white sm:py-20" aria-labelledby="platform-title">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#beb5ec]">The Orixs platform</p>
            <h2 id="platform-title" className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
              The operating layer for everyday business.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Bring people, work, customer information and financial activity into a connected workspace that gives every team the context to act with confidence.
            </p>
            <div className="mt-8 grid gap-6">
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
          <div className="mx-auto w-full max-w-[560px] overflow-hidden rounded-lg border border-white/15 bg-white shadow-2xl shadow-black/20 lg:justify-self-end">
            <Image src="/orixs-all-in-one-platform.png" alt="Orixs all-in-one platform for connected business operations" width={1774} height={887} className="h-auto w-full" />
          </div>
        </div>
      </section>

      <section id="use-cases" className="scroll-mt-20 bg-[#fbfafc] py-16 sm:py-20" aria-labelledby="use-cases-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">Use cases</p>
              <h2 id="use-cases-title" className="mt-4 text-3xl font-semibold leading-tight text-[#1e1a2e] sm:text-4xl">
                A connected workspace for your industry.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Choose the way your organization works today, then explore the Orixs capabilities and account experience built around it.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3" role="group" aria-label="Industry use cases">
            {industryUseCases.map(({ id, name, tagline, icon: Icon }) => {
              const isActive = id === activeIndustry.id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveIndustryId(id)}
                  aria-pressed={isActive}
                  className={`min-h-[152px] border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a] ${
                    isActive
                      ? 'border-[#2f275a] bg-[#2f275a] text-white shadow-lg shadow-[#2f275a]/15'
                      : 'border-slate-200 bg-white text-slate-900 hover:border-[#a59bd3] hover:bg-[#f7f5ff]'
                  }`}
                >
                  <Icon aria-hidden="true" size={25} className={isActive ? 'text-[#ddd7ff]' : 'text-[#7564b6]'} />
                  <span className="mt-6 block text-xl font-semibold">{name}</span>
                  <span className={`mt-2 block text-sm ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>{tagline}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border border-slate-200 bg-white p-6 sm:p-7 lg:p-8">
            <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">{activeIndustry.name}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-[#1e1a2e] sm:text-3xl">{activeIndustry.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{activeIndustry.description}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href={`/get-started/${activeIndustry.id}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#2f275a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#211b43]">
                  Sign up for {activeIndustry.name}
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
                <Link href={`/get-started/${activeIndustry.id}?mode=login`} className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50">
                  Log in to your account
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {activeIndustry.features.map(({ icon: Icon, title, description }) => (
                <article key={title} className="border-l-2 border-[#d9d4f1] pl-4">
                  <Icon aria-hidden="true" size={20} className="text-[#7564b6]" />
                  <h4 className="mt-4 font-semibold text-slate-900">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 border-t border-slate-200 bg-white py-16 sm:py-20" aria-labelledby="contact-title">
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
