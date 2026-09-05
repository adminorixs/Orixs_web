'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { NewsletterModal } from './NewsletterModal';
import Image from 'next/image';

export function FooterSection() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <footer data-copilot-section="footer" className="w-full bg-black text-white pt-5 sm:pt-6 md:pt-8 pb-3 sm:pb-4 md:pb-5 px-3 sm:px-4 md:px-6 rounded-t-xl sm:rounded-t-2xl md:rounded-t-3xl mt-2 sm:mt-3 md:mt-4 text-[0.8rem] sm:text-[0.85rem] md:text-base font-light">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-stretch gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Logo & Social */}
          <div className="w-full sm:w-1/4 md:w-1/4 flex flex-col justify-between mb-4 sm:mb-0">
            <div>
              <div className="mb-2 sm:mb-3 flex items-center">
                <Image src="/worksuite-logo.jpeg" alt="Orixs logo" width={120} height={40} className="object-contain w-[80px] sm:w-[100px] md:w-[120px]" priority />
              </div>
              <div className="mb-3 sm:mb-4 text-gray-300 text-[0.7rem] sm:text-xs md:text-sm font-light leading-relaxed">Your AI Copilot for business automation.<br/>Streamline operations and boost productivity.</div>
            </div>
            <div className="flex gap-2 sm:gap-3 md:gap-4 items-center">
              <a href="#" aria-label="Instagram" className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 bg-white/10 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-lg text-white"><FaInstagram /></a>
              <a href="#" aria-label="Facebook" className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 bg-white/10 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-lg text-white"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter" className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 bg-white/10 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-lg text-white"><FaTwitter /></a>
              <a href="#" aria-label="LinkedIn" className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 bg-white/10 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-lg text-white"><FaLinkedinIn /></a>
            </div>
          </div>
          
          {/* Middle Section - Links */}
          <div className="flex w-full sm:w-auto justify-between sm:justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            {/* Product Links */}
            <div>
              <div className="font-semibold mb-1.5 sm:mb-2 text-[0.7rem] sm:text-xs md:text-sm text-white">Product</div>
              <div className="flex flex-col gap-1 sm:gap-1.5 text-[0.7rem] sm:text-xs md:text-sm font-light">
                <Link href="/use-cases" className="text-gray-300 hover:text-purple-400">Use Cases</Link>
                {/* About Us link - temporarily hidden per investor request */}
                {/* <Link href="/about" className="text-gray-300 hover:text-purple-400">About Us</Link> */}
              </div>
            </div>
            
            {/* Resources Links */}
            <div>
              <div className="font-semibold mb-1.5 sm:mb-2 text-[0.7rem] sm:text-xs md:text-sm text-white">Resources</div>
              <div className="flex flex-col gap-1 sm:gap-1.5 text-[0.7rem] sm:text-xs md:text-sm font-light">
                <Link href="/blogs" className="text-gray-300 hover:text-purple-400">Blogs</Link>
                <Link href="/case-studies" className="text-gray-300 hover:text-purple-400">Case Studies</Link>
              </div>
            </div>
          </div>
          
          {/* Right Column - Newsletter */}
          <div className="w-full sm:w-1/3 md:w-1/3 flex flex-col items-start sm:items-end mt-4 sm:mt-0">
            <div className="w-full sm:max-w-[160px] md:max-w-[180px] lg:max-w-[220px]">
              <div className="font-semibold mb-1.5 sm:mb-2 text-[0.7rem] sm:text-xs md:text-sm text-white text-left sm:text-right">Subscribe to our Newsletter</div>
              <button 
                className="w-full border border-gray-400 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 bg-black text-white mb-1.5 sm:mb-2 text-[0.7rem] sm:text-xs" 
                onClick={() => setShowPopup(true)}
              >
                Enter your details here
              </button>
              <button 
                className="w-full bg-purple-600 text-white rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 md:py-2 font-semibold hover:bg-purple-700 transition text-[0.7rem] sm:text-xs" 
                onClick={() => setShowPopup(true)}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Alcor Systems collaboration */}
        <div className="mt-6 sm:mt-8 md:mt-10 border-t border-white/10 pt-6 sm:pt-8 md:pt-10">
          <div className="flex flex-col items-center text-center">
            <a href="https://alcorsystems.com" target="_blank" rel="noopener noreferrer" className="group">
              <Image
                src="/alcor-systems-logo.jpeg"
                alt="Alcor Systems"
                width={60}
                height={60}
                className="mx-auto w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain mb-2 sm:mb-3"
              />
            </a>
            <p className="text-gray-300 text-[0.7rem] sm:text-xs md:text-sm font-light">
              AI Copilot for Business Excellence by{' '}
              <a href="https://alcorsystems.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-purple-400 transition-colors">
                ALCOR GROUP
              </a>
            </p>
            <p className="text-gray-500 text-[0.6rem] sm:text-[0.65rem] md:text-xs font-light mt-1 sm:mt-1.5 tracking-wider">
              USA&nbsp;&nbsp;|&nbsp;&nbsp;KSA&nbsp;&nbsp;|&nbsp;&nbsp;SINGAPORE
            </p>
          </div>
        </div>

        {/* Copyright section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-5 md:mt-6 border-t border-white/10 pt-2 sm:pt-3 md:pt-4 text-[9px] sm:text-[10px] md:text-xs font-light">
          <div className="text-gray-400 text-[8px] sm:text-[9px] md:text-[11px]">
            © 2025 Orixs. All rights reserved.
          </div>
          <div className="text-gray-400 flex gap-2 sm:gap-3 md:gap-4 items-center mt-1.5 sm:mt-0">
            <Link href="/privacy" className="hover:text-purple-400">Privacy</Link>
            <Link href="/terms-and-conditions" className="hover:text-purple-400">Terms</Link>
          </div>
        </div>
      </div>
      <NewsletterModal show={showPopup} setShow={setShowPopup} />
    </footer>
  );
} 
