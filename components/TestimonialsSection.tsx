'use client';
import { useRef } from 'react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'James Carter',
    role: 'Businessman',
    image: '/James Carter.jpg',
    text: `Managing multiple SaaS subscriptions was a nightmare. Orixs's AI-driven optimization helped us cut unnecessary costs and streamline workflows. Within three months, we reduced our SaaS expenses by 35%! An absolute game-changer for finance teams.`,
  },
  {
    name: 'Priya Sharma',
    role: 'HR Management',
    image: '/Priya.jpg',
    text: `As a growing startup, we struggled with tracking software expenses. Orixs not only provided real-time insights but also automated our SaaS management, saving us valuable time and money. Our efficiency has skyrocketed!`,
  },
  {
    name: 'David Chen',
    role: 'Businessman',
    image: '/David.jpg',
    text: `Orixs transformed the way we manage our SaaS tools. Its AI identified redundant software, consolidated usage, and helped us optimize our spending, leading to a 40% reduction in costs. Highly recommended!`,
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full py-10 md:py-16 bg-white px-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-8 md:mb-12">
        Trusted by <span className="text-purple-500">Innovators</span>, Loved by <span className="text-purple-500">Teams</span>.
      </h2>
      <div className="relative max-w-6xl mx-auto">
        {/* Left navigation button */}
        <button
          onClick={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
            }
          }}
          className="absolute left-[-16px] sm:left-[-24px] md:left-[-32px] top-1/2 -translate-y-1/2 bg-white border border-purple-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md hover:bg-purple-50 transition z-10"
        >
          <span className="text-lg sm:text-xl md:text-2xl text-purple-500">←</span>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="min-w-[280px] sm:min-w-[380px] md:min-w-[420px] bg-white border border-purple-100 rounded-2xl p-6 md:p-8 shadow-md flex flex-col gap-5 relative"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover h-16 w-16"
                />
                <div>
                  <div className="font-semibold text-gray-950">{testimonial.name}</div>
                  <div className="text-sm text-purple-500">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-700 leading-7">{testimonial.text}</p>
            </div>
          ))}
        </div>
        {/* Right navigation button */}
        <button
          onClick={handleScroll}
          className="absolute right-[-16px] sm:right-[-24px] md:right-[-32px] top-1/2 -translate-y-1/2 bg-white border border-purple-200 rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center shadow-md hover:bg-purple-50 transition z-10"
        >
          <span className="text-lg sm:text-xl md:text-2xl text-purple-500">→</span>
        </button>
      </div>
    </section>
  );
}
