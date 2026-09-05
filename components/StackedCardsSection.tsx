'use client';

import Image from 'next/image';
import { Card } from './ui/card';

const cards = [
  {
    number: '01',
    title: 'Chat with Orixs',
    points: [
      'Need answers on the fly?',
      'From "Who\'s on leave?" to "What\'s the latest sales number?", just ask Orixs.',
      'Real-time company intel at your fingertips, powered by AI.',
    ],
    image: '/rini_flow.jpeg',
  },
  {
    number: '02',
    title: 'Smarter Mail with AI',
    points: [
      'Emails that write themselves.',
      "Auto-draft replies, summarize threads, and flag important updates, all powered by Orixs's AI engine.",
      'Say less. Get more done.',
    ],
    image: '/rini_flow.jpeg',
  },
  {
    number: '03',
    title: 'Strategic Decisions, Backed by Data',
    points: [
      'From performance reviews to P&L forecasts, Orixs gives leaders live dashboards, predictive analytics, and real-time insights.',
      'Make faster, smarter, data-backed calls.',
      'Orixs ensures policy compliance and budget control, automatically.',
    ],
    image: '/rini_flow.jpeg',
  },
  {
    number: '04',
    title: 'Seamless Migrations',
    points: [
      'Switching systems? Leave the heavy lifting to Orixs.',
      'Migrate teams, data, and workflows without disruption.',
      'Fast onboarding. Zero downtime.',
    ],
    image: '/rini_flow.jpeg',
  },
];

export function StackedCardsSection() {
  return (
    <section data-copilot-section="features" className="relative w-full bg-white">
      {cards.map((card, idx) => (
        <Card
          key={card.number}
          data-copilot-id={`feature-${card.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
          className={`w-full flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-32 py-6 sm:py-8 md:py-12 lg:py-16 bg-white border-none rounded-none ${
            idx > 0 ? 'border-t border-gray-100' : ''
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-4 md:gap-8 lg:gap-12">
            {/* Left: Number and Text */}
            <div className="flex-1 flex flex-col gap-y-2 md:gap-y-3 w-full md:min-w-[280px] max-w-xl">
              <div className="text-2xl md:text-4xl font-light text-gray-400">{card.number}</div>
              <div className="text-lg md:text-2xl lg:text-3xl font-semibold">{card.title}</div>
              <ul className="space-y-1.5 md:space-y-2 mt-1">
                {card.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm md:text-base lg:text-lg">
                    <span className="text-violet-500 mt-0.5">&#10003;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right: Image */}
            <div className="flex-1 flex justify-center items-center w-full md:min-w-[400px]">
              <Image
                src={card.image}
                alt={card.title}
                width={1200}
                height={1000}
                className="object-contain max-w-[1000px] w-full max-h-[200px] md:max-h-[500px]"
              />
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
