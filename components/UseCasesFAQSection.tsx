'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: 'How quickly can my team get started?',
    a: 'Most teams are fully onboarded within a week. Orixs includes guided setup, data migration tools, and dedicated support to ensure a smooth transition with zero downtime.',
  },
  {
    q: 'Does Orixs integrate with existing tools?',
    a: 'Yes. Orixs connects with popular CRMs, ERPs, accounting software, and communication platforms through native integrations and a full REST API.',
  },
  {
    q: 'How is data security handled?',
    a: 'Orixs uses enterprise-grade encryption, role-based access controls, and automated compliance monitoring. Your data stays protected and audit-ready at all times.',
  },
  {
    q: 'Can Orixs scale as we grow?',
    a: 'Absolutely. Orixs is built to grow with you, from small teams to enterprise operations. Add users, workflows, and modules as your needs evolve, with no disruption.',
  },
  {
    q: 'Is there a free trial?',
    a: 'We offer a guided demo and a personalized pilot program so you can see Orixs working with your real data before committing. No credit card required.',
  },
];

export function UseCasesFAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Everything you need to know about getting started.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-200 ${
                open === idx
                  ? 'bg-white border-purple-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <button
                className="w-full flex justify-between items-center text-left px-5 sm:px-6 py-4 sm:py-5"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="text-sm sm:text-base font-semibold text-gray-900 pr-4">
                  {faq.q}
                </span>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                  open === idx ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      open === idx ? 'rotate-180 text-purple-600' : 'text-gray-400'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <AnimatePresence>
                {open === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-4 sm:pb-5">
                      <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
