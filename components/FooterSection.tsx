import Image from 'next/image';
import Link from 'next/link';

export function FooterSection() {
  return (
    <footer className="bg-[#171321] px-5 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 sm:flex-row sm:items-start">
          <div className="max-w-xs">
            <Link href="/" aria-label="Orixs home">
              <Image src="/worksuite-logo.jpeg" alt="Orixs" width={120} height={40} className="h-auto w-[108px]" />
            </Link>
            <p className="mt-5 text-sm leading-6 text-slate-300">A connected workspace for clearer business decisions and more purposeful action.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-4 sm:gap-x-8">
            <Link href="/#how-it-works" className="text-slate-300 transition-colors hover:text-white">How Orixs works</Link>
            <Link href="/#platform" className="text-slate-300 transition-colors hover:text-white">Platform</Link>
            <Link href="/#use-cases" className="text-slate-300 transition-colors hover:text-white">Use cases</Link>
            <Link href="/get-started/business" className="text-slate-300 transition-colors hover:text-white">Request a demo</Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <span>© 2026 Orixs. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/terms-and-conditions" className="transition-colors hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
