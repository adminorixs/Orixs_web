'use client';
import { UseCasesSection } from '../../components/UseCasesSection';
import { UseCasesFAQSection } from '../../components/UseCasesFAQSection';
import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function UseCasesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-44 pb-16 sm:pb-20 md:pb-24 lg:pb-28 px-4 sm:px-6 overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,80,220,0.12),transparent)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-purple-600 font-semibold text-xs sm:text-sm tracking-widest uppercase mb-4 sm:mb-5 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100">
              Use Cases
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 sm:mb-6 leading-[1.1] tracking-tight"
          >
            One platform.{' '}
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
              Every industry.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10"
          >
            Orixs brings AI-powered automation, real-time analytics, and intelligent workflows
            tailored for your sector. Ready from day one.
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
                document.getElementById('use-cases-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-gray-700 font-semibold px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base hover:bg-gray-50 transition border border-gray-200 shadow-sm"
            >
              Explore use cases ↓
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
              { value: '70%', label: 'Faster processing' },
              { value: '10x', label: 'Efficiency gains' },
              { value: '99.9%', label: 'Platform uptime' },
              { value: '< 1 week', label: 'Onboarding time' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── Use Cases Section ─── */}
      <div id="use-cases-section">
        <UseCasesSection />
      </div>

      {/* ─── FAQ Section ─── */}
      <UseCasesFAQSection />

      {/* ─── CTA Banner ─── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Ready to transform your operations?
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-7 sm:mb-8 max-w-lg mx-auto">
              Get a personalized walkthrough for your industry. No commitment required.
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
