'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import PartnerModal from './modal/PartnerModal';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLDivElement>(null);

  // Check if active page is blogs or case-studies
  const isActive = (path: string) => pathname === path;
  const isResourcesActive = pathname?.startsWith('/blogs') || pathname?.startsWith('/case-studies');

  // Handle clicks outside the resources menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [resourcesRef]);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsResourcesOpen(true);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      setIsResourcesOpen(false);
    }, 200); // 200ms delay before closing
    setTimeoutId(id);
  };

  const toggleResourcesMenu = () => {
    setIsResourcesOpen(!isResourcesOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleMobileResources = () => {
    setMobileResourcesOpen(!mobileResourcesOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-0 lg:px-0 ${
      isActive('/') ? '' : 'border-b border-gray-100 shadow-sm'
    }`}>
      {/* Right: Buttons (both at far right, outside max-w-7xl) */}
      <div className="hidden lg:flex items-center absolute right-4 top-1/2 -translate-y-1/2 z-20">
        <Button
          className="border border-purple-600 text-black bg-white hover:bg-purple-100 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-full px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base"
          onClick={() => router.push('/get-started/business')}
        >
          Explore Now
        </Button>
        <Button
          className="ml-2 border border-purple-600 text-purple-700 bg-white hover:bg-purple-50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-full px-3 sm:px-4 md:px-5 lg:px-6 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base"
          onClick={() => setShowPartnerModal(true)}
        >
          Partner with us
        </Button>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-20 relative">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/worksuite-logo.jpeg"
                alt="Orixs Logo"
                width={120}
                height={40}
                priority
                className="py-1 sm:py-1.5 md:py-2 w-[80px] sm:w-[100px] md:w-[120px]"
              />
            </Link>
          </div>
          
          {/* Absolutely Centered Desktop Menu */}
          <div className="hidden md:flex items-center bg-white rounded-full px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <Link 
              href="/" 
              className={`px-2 sm:px-2.5 md:px-3 lg:px-4 font-medium text-xs sm:text-sm md:text-base relative ${
                isActive('/') 
                  ? 'text-purple-600 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-3/5 after:bg-purple-600 after:scale-x-100' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/use-cases"
              className={`px-2 sm:px-2.5 md:px-3 lg:px-4 font-medium text-xs sm:text-sm md:text-base relative ${
                isActive('/use-cases') 
                  ? 'text-purple-600 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-3/5 after:bg-purple-600 after:scale-x-100' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Use Cases
            </Link>
            <div 
              ref={resourcesRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Resources text with click handler for tablet */}
              <span 
                onClick={toggleResourcesMenu}
                className={`px-2 sm:px-2.5 md:px-3 lg:px-4 transition-colors font-medium text-xs sm:text-sm md:text-base relative cursor-pointer flex items-center gap-1 ${
                  isResourcesActive 
                    ? 'text-purple-600 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-3/5 after:bg-purple-600 after:scale-x-100' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Resources
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              
              {/* Dropdown with higher z-index and better positioning */}
              <div 
                className={`absolute left-0 mt-2 w-28 sm:w-32 md:w-36 lg:w-40 bg-white border border-gray-200 rounded-lg shadow-lg transition-all duration-200 z-50 ${
                  isResourcesOpen 
                    ? 'opacity-100 visible' 
                    : 'opacity-0 invisible'
                }`}
              >
                <Link 
                  href="/blogs" 
                  className={`block px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base ${
                    pathname?.startsWith('/blogs') 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  Blogs
                </Link>
                <Link 
                  href="/case-studies" 
                  className={`block px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base ${
                    pathname?.startsWith('/case-studies') 
                      ? 'text-purple-600 bg-purple-50' 
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  Case Studies
                </Link>
              </div>
            </div>
            {/* Pricing link - temporarily hidden per investor request
            <Link
              href="/pricing"
              className={`px-2 sm:px-2.5 md:px-3 lg:px-4 font-medium text-xs sm:text-sm md:text-base relative ${
                isActive('/pricing')
                  ? 'text-purple-600 after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:h-[1px] after:w-3/5 after:bg-purple-600 after:scale-x-100'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Pricing
            </Link>
            */}
          </div>

          <div className="flex items-center">
            {/* Mobile/Tablet menu button */}
            <button
              type="button"
              className="md:hidden text-gray-700 p-1.5 sm:p-2 ml-1 sm:ml-2"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div
        className={`fixed inset-0 top-[48px] sm:top-[56px] md:top-[64px] z-40 bg-white transition-[transform,visibility] duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0 visible' : 'translate-x-full invisible'
        }`}
      >
        <div className="h-screen bg-white p-4 space-y-3 sm:space-y-4 overflow-y-auto">
          <Link
            href="/"
            className={`block py-2 px-4 text-sm sm:text-base rounded-lg ${
              isActive('/') ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/use-cases"
            className={`block py-2 px-4 text-sm sm:text-base rounded-lg ${
              isActive('/use-cases') ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Use Cases
          </Link>

          {/* Resources dropdown in mobile menu */}
          <div>
            <button
              className={`flex items-center justify-between w-full py-2 px-4 text-sm sm:text-base rounded-lg ${
                isResourcesActive ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={toggleMobileResources}
            >
              <span>Resources</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`pl-4 space-y-1 mt-1 ${mobileResourcesOpen ? 'block' : 'hidden'}`}>
              <Link
                href="/blogs"
                className={`block py-2 px-4 text-sm sm:text-base rounded-lg ${
                  pathname?.startsWith('/blogs') ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </Link>
              <Link
                href="/case-studies"
                className={`block py-2 px-4 text-sm sm:text-base rounded-lg ${
                  pathname?.startsWith('/case-studies') ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Case Studies
              </Link>
            </div>
          </div>

          {/* Pricing link - temporarily hidden per investor request
          <Link
            href="/pricing"
            className={`block py-2 px-4 text-sm sm:text-base rounded-lg ${
              isActive('/pricing') ? 'text-purple-600 bg-purple-50 font-medium' : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          */}

          <div className="mt-4">
            <Button
              className="w-full border border-purple-600 bg-purple-600 text-white hover:bg-purple-700 rounded-lg px-4 py-2.5 text-sm sm:text-base"
              onClick={() => {
                router.push('/get-started/business');
                setMobileMenuOpen(false);
              }}
            >
              Explore Now
            </Button>
            <Button
              className="w-full mt-2 border border-purple-600 text-purple-700 bg-white hover:bg-purple-50 rounded-lg px-4 py-2.5 text-sm sm:text-base"
              onClick={() => {
                setShowPartnerModal(true);
                setMobileMenuOpen(false);
              }}
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </div>

      <PartnerModal open={showPartnerModal} onClose={() => setShowPartnerModal(false)} />
    </nav>
  );
}
