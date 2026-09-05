'use client';
import { Navbar } from '@/components/Navbar';
import { FooterSection } from '@/components/FooterSection';
import { blogs } from '../../components/blogData';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogsPage() {
  const router = useRouter();
  const [activeTag, setActiveTag] = useState('All');

  const featured = blogs[0];
  const allTags = ['All', ...Array.from(new Set(blogs.map((b) => b.tag)))];
  const filteredBlogs = activeTag === 'All'
    ? blogs.slice(1)
    : blogs.slice(1).filter((b) => b.tag === activeTag);

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
              Blog
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-5 sm:mb-6 leading-[1.1] tracking-tight"
          >
            Insights for{' '}
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-500 bg-clip-text text-transparent">
              modern teams.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-500 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Practical guides, founder stories, and deep dives into AI-powered
            operations, business automation, and scaling with clarity.
          </motion.p>
        </div>
      </section>

      {/* ─── Featured Article ─── */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <Link
            href={`/blogs/${featured.slug}`}
            className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row">
              {/* Image */}
              <div className="relative lg:w-[55%] h-56 sm:h-64 lg:h-80 overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  width={700}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-[45%] p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block bg-purple-50 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full border border-purple-100">
                    {featured.tag}
                  </span>
                  <span className="text-xs text-gray-400">
                    {featured.published}
                  </span>
                  <span className="text-xs text-gray-400">· 10 min read</span>
                </div>

                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-snug group-hover:text-purple-600 transition-colors">
                  {featured.title}
                </h2>

                <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6 leading-relaxed"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {featured.summary}
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm font-bold">
                    {featured.author?.charAt(0) || 'O'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{featured.author}</div>
                    <div className="text-xs text-gray-400">Author</div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* ─── Category Filters + Blog Grid ─── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              All articles
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
              Explore ideas and strategies to run your business smarter.
            </p>

            {/* Filter pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    activeTag === tag
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Blog cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {filteredBlogs.map((blog, idx) => (
              <motion.div
                key={blog.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 h-full"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={400}
                      height={220}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block bg-white/90 backdrop-blur-sm text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                        {blog.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{blog.published}</span>
                      <span>·</span>
                      <span>10 min read</span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 leading-snug group-hover:text-purple-600 transition-colors"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {blog.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4 leading-relaxed"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {blog.summary}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                          {blog.author?.charAt(0) || 'O'}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">{blog.author}</span>
                      </div>
                      <div className="flex items-center text-purple-600 text-xs font-semibold">
                        Read
                        <svg className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No articles found in this category.
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900 px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Ready to see Orixs in action?
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
