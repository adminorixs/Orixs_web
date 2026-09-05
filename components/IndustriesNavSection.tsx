'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaBriefcase, FaShieldAlt, FaHardHat } from 'react-icons/fa';
// Icons for hidden industries (kept for future restoration)
// import { FaGraduationCap, FaFilm } from 'react-icons/fa';

const industries = [
  {
    name: 'Business',
    icon: <FaBriefcase className="text-xl sm:text-2xl md:text-3xl text-purple-500" />,
    title: 'Intelligence That Runs Your Business',
    description: `Orixs Business Ops is an AI-driven business operations platform that centralizes and streamlines enterprise workflows. Eliminate fragmented systems with a unified command center tailored to your business processes.\n\nFrom project tracking to sales optimization, Orixs turns real-time data into strategic insights, empowering leadership to make faster, smarter decisions. Designed to boost efficiency, adaptability, and growth, Orixs goes beyond automation to deliver true operational intelligence.`,
    features: [
      'Custom dashboards with real-time visibility',
      'AI CRM with smart lead scoring',
      'Project and resource optimization tools',
      'Predictive financial trends and analytics',
      'Auto-generated reports and documents',
    ],
  },
  {
    name: 'Insurance',
    icon: <FaShieldAlt className="text-2xl md:text-3xl text-purple-500" />,
    title: 'Smarter Insurance, Seamless Experience',
    description: `Orixs Insurance is a smart, AI-powered platform that automates underwriting, speeds up claims, and enhances customer experience while staying fully compliant. Designed for modern insurers, Orixs reduces processing time by up to 70% with real-time verification and fraud detection.\n\nFrom quotes to claims, Orixs streamlines every step with automated workflows, live policy management, and a user-friendly customer portal. It helps insurers scale efficiently, reduce errors, and stay audit-ready.`,
    features: [
      'Instant underwriting with AI risk profiling',
      'Fast claims with fraud detection',
      'Live policy and renewal tracking',
      'Self-service portal for customers',
      'Compliance tools for audit readiness',
    ],
  },
  /* Internship tab - temporarily hidden per investor request
  {
    name: 'Internship',
    icon: <FaGraduationCap className="text-2xl md:text-3xl text-purple-500" />,
    title: 'Smarter Intern Hiring Starts Here',
    description: `Orixs Intern is a modern platform transforming how companies discover, assess, and onboard interns and early talent. With AI-powered screening, skills matching, and automated onboarding, every hire aligns with your team's culture and needs.\n\nBeyond resumes, Orixs enables scenario-based evaluations, effortless interview scheduling, and post-hire insights. Whether scaling campus drives or ongoing programs, Orixs helps you find future leaders faster.`,
    features: [
      'AI resume parsing and skill shortlisting',
      'Smart interview scheduling with calendar sync',
      'Scenario-based talent evaluation tests',
      'Custom onboarding flows for interns',
      'Funnel analytics for conversion insights',
    ],
  },
  */
  {
    name: 'Construction',
    icon: <FaHardHat className="text-2xl md:text-3xl text-purple-500" />,
    title: 'Full Control Over Every Build',
    description: `Orixs Construction is a powerful project management platform built for the construction industry, offering end-to-end visibility across planning, execution, and delivery. From infrastructure to high-rises, it unifies budgets, crews, safety, and timelines to cut delays and reduce cost overruns.\n\nWith real-time tracking, BIM integration, and streamlined subcontractor coordination, Orixs empowers teams to build faster, safer, and smarter. Every phase, from pre-construction to handover, is fully optimized.`,
    features: [
      'BIM integration with design visualization',
      'Real-time crew and equipment tracking',
      'Budget control with cost forecasting',
      'Safety tracking and compliance monitoring',
      'Subcontractor scheduling and progress tracking',
    ],
  },
  /* Entertainment tab - temporarily hidden per investor request
  {
    name: 'Entertainment',
    icon: <FaFilm className="text-2xl md:text-3xl text-purple-500" />,
    title: 'Where Every Great Production Begins',
    description: `Scene 1 is a purpose-built talent platform for the film, TV, and entertainment industry that unites actors, directors, DOPs, stylists, and technicians in one intelligent, searchable space. From casting to crew building, it simplifies hiring and showcases creative portfolios like never before.\n\nWhether you're a production house sourcing talent or a freelancer ready for your next role, Scene 1 streamlines discovery, auditions, scheduling, and communication, all from a collaborative, real-time dashboard.`,
    features: [
      'Discover cast, crew, and creatives',
      'Showcase portfolios, reels, and resumes',
      'Post roles and manage applications',
      'Smart filters by skill and availability',
      'Real-time calendar and schedule tracking',
    ],
  },
  */
];

const industryToSlug: Record<string, string> = {
  Business: 'business',
  Insurance: 'insurance',
  Construction: 'construction',
};

export function IndustriesNavSection() {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const industry = industries[active];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full flex flex-col items-center mt-6 sm:mt-8 md:mt-12 lg:mt-16 px-4 sm:px-6">
      {/* Single responsive industry selector */}
      <div className="flex bg-white rounded-xl border px-2 py-2 gap-2 shadow max-w-4xl w-full justify-center">
        {industries.map((ind, idx) => (
          <button
            key={ind.name}
            onClick={() => setActive(idx)}
            className={`flex items-center gap-1 md:gap-2 px-3 sm:px-4 lg:px-6 py-2 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-medium transition justify-center ${
              active === idx
                ? 'bg-purple-100 text-purple-700 shadow border border-purple-300'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center flex-shrink-0">
              {ind.icon}
            </div>
            <span>{ind.name}</span>
          </button>
        ))}
      </div>

      {/* Content section with responsive layout */}
      <div className="w-full max-w-6xl mt-6 sm:mt-8 md:mt-10 lg:mt-16 xl:mt-24 flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-8 px-2 sm:px-3 md:px-4">
        {/* Left column - industry description */}
        <div className="flex-1 bg-white rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg min-w-0">
          <div className="flex flex-col items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-purple-600">
            <div className="text-2xl sm:text-3xl md:text-4xl">{industry.icon}</div>
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-purple-500">{industry.title}</span>
          </div>
          <div className="text-gray-700 text-xs sm:text-sm md:text-base lg:text-base whitespace-pre-line">
            {industry.description}
          </div>
        </div>
        
        {/* Right column - features */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
          <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg flex-1">
            <div className="font-semibold text-lg sm:text-xl md:text-2xl text-gray-800 mb-2 sm:mb-3 md:mb-4">Key Features</div>
            <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
              {industry.features.map((feature, i) => (
                <li key={i} className="flex items-start md:items-center gap-1.5 sm:gap-2 md:gap-3 bg-purple-50 rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm md:text-base font-medium text-gray-700 shadow-sm">
                  <span className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex items-center justify-center text-purple-500 text-base sm:text-lg md:text-xl mt-0.5 sm:mt-1 md:mt-0">⦿</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            className="self-center lg:self-end px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 border border-purple-600 text-purple-600 rounded-lg sm:rounded-xl hover:bg-purple-50 transition text-sm sm:text-base md:text-lg font-semibold shadow"
            onClick={() => router.push(`/get-started/${industryToSlug[industry.name] || 'business'}`)}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
} 