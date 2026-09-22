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
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm sm:grid-cols-4 sm:gap-x-8">
            <Link href="/#how-it-works" className="text-slate-300 transition-colors hover:text-white">How Orixs works</Link>
            <Link href="/#platform" className="text-slate-300 transition-colors hover:text-white">Platform</Link>
            <Link href="/#use-cases" className="text-slate-300 transition-colors hover:text-white">Use cases</Link>
            <Link href="/get-started/business" className="text-slate-300 transition-colors hover:text-white">Sign up or log in</Link>
          </nav>
        </div>

        <div className="mt-12 border-y border-white/10 py-7">
          <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
            <a href="https://alcorsystems.com" target="_blank" rel="noopener noreferrer" className="shrink-0 transition-opacity hover:opacity-85">
              <Image src="/alcor-systems-logo.jpeg" alt="Alcor Systems" width={72} height={72} className="h-14 w-14 rounded-md object-contain" />
            </a>
            <div>
              <p className="text-sm font-semibold text-white">AI Copilot for Business Excellence</p>
              <p className="mt-1 text-sm text-slate-300">
                Built with{' '}
                <a href="https://alcorsystems.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-white transition-colors hover:text-[#d8d1ff]">
                  ALCOR GROUP
                </a>
              </p>
              <p className="mt-2 text-xs font-medium tracking-[0.12em] text-slate-500">USA&nbsp;&nbsp;|&nbsp;&nbsp;KSA&nbsp;&nbsp;|&nbsp;&nbsp;SINGAPORE</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-slate-400 sm:flex-row sm:items-center">
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
