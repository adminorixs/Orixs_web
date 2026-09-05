'use client';
import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { caseStudies } from '../../components/caseStudiesData';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function CaseStudiesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-44 pb-16 sm:pb-20 md:pb-24 lg:pb-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,80,220,0.12),transparent)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-purple-600 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-5 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
              Case Studies
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 sm:mb-6 leading-[1.1] tracking-tight"
          >
            Real results.{' '}
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
              Real businesses.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10"
          >
            See how companies across industries are using Orixs to eliminate
            bottlenecks, automate operations, and drive measurable growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <button
              onClick={() => router.push('/get-started/business')}
              className="bg-purple-600 text-white font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base hover:bg-purple-700 transition shadow-lg shadow-purple-200"
            >
              Request a demo
            </button>
            <button
              onClick={() => {
                document.getElementById('case-studies-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-gray-700 font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base hover:bg-gray-50 transition border border-gray-200 shadow-sm"
            >
              View case studies ↓
            </button>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative z-10 max-w-3xl mx-auto mt-14 sm:mt-16 md:mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { value: '100%', label: 'On-time payouts achieved' },
              { value: '78%', label: 'Error reduction' },
              { value: '80%', label: 'Fewer manual check-ins' },
              { value: '3', label: 'Industries transformed' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Case Studies Grid ─── */}
      <section id="case-studies-grid" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured stories
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
              Every business has a unique challenge. Here is how Orixs solved theirs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {caseStudies.map((cs, idx) => (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link
                  href={`/case-studies/${cs.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 h-full"
                >
                  {/* Image */}
                  <div className="relative h-48 sm:h-52 overflow-hidden">
                    <Image
                      src={cs.image}
                      alt={cs.title}
                      width={400}
                      height={220}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-white/90 backdrop-blur-sm text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {cs.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>📍 {cs.location}</span>
                      <span>·</span>
                      <span>{cs.date}</span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 leading-snug group-hover:text-purple-600 transition-colors"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {cs.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-5"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {cs.summary}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
                      {cs.stats.slice(0, 3).map((stat: { value: string; label: string }, i: number) => (
                        <div key={i} className="text-center bg-gray-50 rounded-lg p-2.5">
                          <div className="text-sm sm:text-base font-bold text-purple-600">{stat.value}</div>
                          <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5"
                            style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          >
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Read more */}
                    <div className="flex items-center text-purple-600 text-sm font-semibold">
                      Read full story
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Want results like these?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-7 sm:mb-8 max-w-lg mx-auto">
              See how Orixs can transform your operations with a personalized walkthrough.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/get-started/business')}
                className="bg-white text-gray-900 font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base hover:bg-gray-100 transition"
              >
                Get started free
              </button>
              <button
                onClick={() => router.push('/get-started/business')}
                className="text-gray-300 font-medium px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base hover:text-white transition border border-gray-700 hover:border-gray-500"
              >
                Talk to sales
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
