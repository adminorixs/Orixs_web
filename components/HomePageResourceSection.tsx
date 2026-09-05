'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { NewsletterModal } from './NewsletterModal';
import { blogs } from './blogData';
import { caseStudies } from './caseStudiesData';

// Add a style block to hide scrollbars
const scrollbarHideStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

// Select the two most relevant/featured blogs and case studies
const featuredBlogs = [
  blogs.find(b => b.slug === 'juggling-6-tools'),
  blogs.find(b => b.slug === 'RINI-launch-africa'),
].filter(Boolean);

const featuredCaseStudies = [
  caseStudies.find(cs => cs.slug === 'construction-firm-blindspots'),
  caseStudies.find(cs => cs.slug === 'saas-founder-bottleneck'),
].filter(Boolean);

// Interleave in the requested order
const resources = [
  featuredBlogs[0] && {
    type: 'Blog',
    title: featuredBlogs[0].title,
    description: featuredBlogs[0].summary,
    image: featuredBlogs[0].image,
    link: `/blogs/${featuredBlogs[0].slug}`,
  },
  featuredCaseStudies[0] && {
    type: 'Case Study',
    title: featuredCaseStudies[0].title,
    description: featuredCaseStudies[0].summary,
    image: featuredCaseStudies[0].image,
    link: `/case-studies/${featuredCaseStudies[0].slug}`,
  },
  featuredBlogs[1] && {
    type: 'Blog',
    title: featuredBlogs[1].title,
    description: featuredBlogs[1].summary,
    image: featuredBlogs[1].image,
    link: `/blogs/${featuredBlogs[1].slug}`,
  },
  featuredCaseStudies[1] && {
    type: 'Case Study',
    title: featuredCaseStudies[1].title,
    description: featuredCaseStudies[1].summary,
    image: featuredCaseStudies[1].image,
    link: `/case-studies/${featuredCaseStudies[1].slug}`,
  }
].filter(Boolean);

export function HomePageResourceSection() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <section data-copilot-section="resources" className="w-full py-4 md:py-8 bg-white">
      {/* Add style tag to inject CSS */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyles }} />
      
      <div className="flex flex-col gap-0 items-stretch justify-between px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-0">
            Resources and Insights to <span className="text-purple-500">Inspire</span>
          </h2>
          <div className="flex gap-3">
            <Link href="/blogs">
              <span className="bg-purple-500 text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium cursor-pointer hover:bg-purple-600 transition whitespace-nowrap">Blogs</span>
            </Link>
            <Link href="/case-studies">
              <span className="border border-purple-500 text-purple-500 bg-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium cursor-pointer hover:bg-purple-50 transition whitespace-nowrap">Case Studies</span>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto whitespace-nowrap mt-6 md:mt-8 hide-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex gap-4 sm:gap-6 md:gap-8">
            {resources.map((res, idx) => (
              <div key={idx} className="w-[280px] sm:w-80 flex-shrink-0 bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <Link href={res!.link}>
                  <div className="w-full h-36 sm:h-44 mb-2 rounded-[12px] sm:rounded-[16px] overflow-hidden relative">
                    <Image 
                      src={res!.image} 
                      alt={res!.title} 
                      fill 
                      className="object-cover transition-transform hover:scale-105 duration-300" 
                    />
                  </div>
                </Link>
                <div className="text-gray-500 text-xs sm:text-sm mb-1 mt-2">{res!.type}</div>
                <Link href={res!.link}>
                  <div className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 truncate hover:text-purple-500">{res!.title}</div>
                </Link>
                <div className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 truncate">{res!.description}</div>
                <Link href={res!.link} className="text-purple-500 text-sm sm:text-base font-medium hover:underline flex items-center gap-1">
                  Read More <span>&rarr;</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewsletterModal show={showModal} setShow={setShowModal} />
    </section>
  );
} 
