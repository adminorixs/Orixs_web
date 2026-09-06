'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { copilotEventBus } from '@/lib/copilot/eventBus';
import { FaBriefcase, FaShieldAlt, FaHardHat } from 'react-icons/fa';
import {
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineLightningBolt,
  HiOutlineDocumentReport,
  HiOutlineShieldCheck,
  HiOutlineClipboardCheck,
  HiOutlineRefresh,
  HiOutlineGlobe,
  HiOutlineBadgeCheck,
  HiOutlineCube,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
} from 'react-icons/hi';

const useCases = [
  {
    id: 'business',
    name: 'Business Operations',
    tagline: 'Your AI command center',
    icon: <FaBriefcase />,
    title: 'Intelligence that runs your business',
    description:
      'Centralize your entire operation, including project tracking, sales pipelines, and financial forecasting, in one AI-driven platform. Make faster, data-backed decisions with real-time visibility across every team.',
    features: [
      { icon: <HiOutlineChartBar />, title: 'Live dashboards', desc: 'Real-time KPIs, team metrics, and performance tracking in one view' },
      { icon: <HiOutlineUserGroup />, title: 'AI-powered CRM', desc: 'Smart lead scoring, deal tracking, and automated follow-ups' },
      { icon: <HiOutlineCog />, title: 'Resource optimization', desc: 'Allocate people, budgets, and assets across projects intelligently' },
      { icon: <HiOutlineLightningBolt />, title: 'Predictive analytics', desc: 'Spot trends, forecast revenue, and anticipate bottlenecks' },
      { icon: <HiOutlineDocumentReport />, title: 'Auto-generated reports', desc: 'From raw data to polished reports in seconds, not hours' },
      { icon: <HiOutlineRefresh />, title: 'Workflow automation', desc: 'Eliminate repetitive tasks with smart triggers and rules' },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    tagline: 'Claims, underwriting, compliance',
    icon: <FaShieldAlt />,
    title: 'Faster claims. Smarter underwriting.',
    description:
      'Process claims up to 70% faster with AI-powered verification and fraud detection. Automate the entire insurance lifecycle, from quotes to renewals, while staying fully compliant and audit-ready.',
    features: [
      { icon: <HiOutlineShieldCheck />, title: 'AI risk profiling', desc: 'Instant, data-driven underwriting with automated risk scoring' },
      { icon: <HiOutlineLightningBolt />, title: 'Smart claims processing', desc: 'Automated review, verification, and fraud detection pipeline' },
      { icon: <HiOutlineClipboardCheck />, title: 'Policy management', desc: 'Real-time tracking of policies, renewals, and amendments' },
      { icon: <HiOutlineGlobe />, title: 'Customer self-service', desc: 'Branded portal for policyholders to manage claims and policies' },
      { icon: <HiOutlineBadgeCheck />, title: 'Compliance engine', desc: 'Automated regulatory checks and full audit trail' },
      { icon: <HiOutlineDocumentReport />, title: 'Reporting suite', desc: 'Custom reports for regulators, management, and stakeholders' },
    ],
  },
  {
    id: 'construction',
    name: 'Construction',
    tagline: 'Projects, crews, budgets',
    icon: <FaHardHat />,
    title: 'Full visibility across every build',
    description:
      'Unify budgets, crews, safety, and timelines from pre-construction to final handover. Orixs gives project managers complete control to cut delays, reduce cost overruns, and keep every phase on track.',
    features: [
      { icon: <HiOutlineCube />, title: 'BIM integration', desc: '3D design visualization, clash detection, and planning tools' },
      { icon: <HiOutlineLocationMarker />, title: 'Crew tracking', desc: 'Real-time GPS location, task assignments, and check-ins' },
      { icon: <HiOutlineCurrencyDollar />, title: 'Budget control', desc: 'Live cost tracking, forecasting, and variance alerts' },
      { icon: <HiOutlineExclamationCircle />, title: 'Safety compliance', desc: 'Incident reporting, safety checklists, and compliance monitoring' },
      { icon: <HiOutlineCalendar />, title: 'Subcontractor management', desc: 'Scheduling, progress tracking, and payment milestones' },
      { icon: <HiOutlineChartBar />, title: 'Project analytics', desc: 'Dashboards for timeline, budget, and resource utilization' },
    ],
  },
];

export function UseCasesSection() {
  const [active, setActive] = useState(0);
  const current = useCases[active];

  useEffect(() => {
    return copilotEventBus.on('switchTab', ({ tabGroup, tabValue }) => {
      if (tabGroup !== 'use-cases') return;
      const index = useCases.findIndex((useCase) => useCase.id === tabValue);
      if (index >= 0) setActive(index);
    });
  }, []);

  return (
    <section data-copilot-section="use-cases" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-50/50">
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Tailored for your industry
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
            Choose your sector and see how Orixs works for you.
          </p>
        </div>

        {/* Use Case Cards — selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-14 md:mb-16">
          {useCases.map((uc, idx) => (
            <button
              key={uc.id}
              onClick={() => {
                setActive(idx);
                copilotEventBus.emit('switchTab', { tabGroup: 'use-cases', tabValue: uc.id });
              }}
              className={`group relative text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                active === idx
                  ? 'bg-white border-purple-200 shadow-lg shadow-purple-100/50 ring-1 ring-purple-100'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl mb-3 sm:mb-4 transition-colors ${
                  active === idx
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                }`}>
                  {uc.icon}
                </div>
                {/* Sign Up link */}
                <Link
                  href={`/get-started/${uc.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                    active === idx
                      ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                  aria-label={`Sign up for ${uc.name}`}
                >
                  Sign Up
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <h3 className={`text-base sm:text-lg font-semibold mb-1 transition-colors ${
                active === idx ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {uc.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                {uc.tagline}
              </p>
              {active === idx && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-6 right-6 h-0.5 bg-purple-600 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Detail Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title + Description */}
            <div className="mb-8 sm:mb-10 md:mb-12 max-w-3xl">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {current.title}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 sm:mb-10">
              {current.features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-lg sm:text-xl mb-3 group-hover:bg-purple-100 transition-colors">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-2">
              <Link
                href={`/get-started/${current.id}`}
                className="bg-purple-600 text-white font-semibold px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base hover:bg-purple-700 transition shadow-lg shadow-purple-200"
              >
                Get started with {current.name}
              </Link>
              <span className="text-xs sm:text-sm text-gray-400">
                Free setup · No credit card · Live in under a week
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
