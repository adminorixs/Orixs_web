'use client';
import { useState, useEffect } from 'react';

const faqs = [
  {
    q: 'Can Orixs align with my long-term business strategy?',
    a: 'Yes, Orixs is designed to adapt and scale with your business needs, supporting long-term strategies and growth.',
  },
  {
    q: 'How does Orixs ensure seamless adoption across different teams?',
    a: 'Orixs offers intuitive interfaces and integrations, making it easy for teams to adopt and collaborate efficiently.',
  },
  {
    q: 'How does Orixs drive business efficiency and scalability?',
    a: 'By automating workflows and providing actionable insights, Orixs boosts efficiency and supports scalable operations.',
  },
  {
    q: 'What ROI can I expect from integrating Orixs into my organization?',
    a: 'Organizations typically see significant cost savings, improved productivity, and faster decision-making with Orixs.',
  },
];

export function IndustriesFAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  // Safely handle hydration
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-4 sm:mx-6 md:mx-auto mt-8 sm:mt-10 md:mt-16 lg:mt-20 xl:mt-24 mb-10 sm:mb-12 md:mb-16 lg:mb-20 py-2 sm:py-3 md:py-4">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h3>
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b pb-1.5 sm:pb-2 md:pb-3">
            <button
              className="w-full flex justify-between items-start text-left text-sm sm:text-base md:text-lg lg:text-xl font-semibold py-1.5 sm:py-2 md:py-2.5"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span className="pr-2">{faq.q}</span>
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-purple-600 flex-shrink-0 leading-none">
                {open === idx ? '−' : '+'}
              </span>
            </button>
            {open === idx && (
              <div className="mt-1 sm:mt-1.5 md:mt-2 text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg pl-0 md:pl-2 pb-1.5 sm:pb-2">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 