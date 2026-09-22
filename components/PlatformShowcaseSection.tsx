import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function PlatformShowcaseSection() {
  return (
    <section className="bg-[#fbfafc] pt-28 sm:pt-32" aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 sm:px-6 sm:pb-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8 lg:pb-24">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#7564b6]">Orixs AI workspace</p>
          <h1 id="hero-title" className="mt-5 text-4xl font-semibold leading-[1.08] text-[#1e1a2e] sm:text-5xl lg:text-6xl">
            Bring every business decision into focus.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Orixs brings your work, conversations, customers and operational data together so every team can understand what matters and move the business forward.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/get-started/business" className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#2f275a] px-5 text-base font-semibold text-white transition-colors hover:bg-[#211b43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]">
              Request a demo
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
            <Link href="/#how-it-works" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-base font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f275a]">
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-sm leading-6 text-slate-500">One connected workspace for the questions, work and decisions that keep your business moving.</p>
        </div>

        <div className="relative mx-auto w-full max-w-[640px] lg:mx-0 lg:justify-self-end">
          <div className="absolute -inset-x-4 top-[11%] bottom-[9%] -z-10 rounded-[2rem] bg-[#ece9fb] sm:-inset-x-8" />
          <Image
            src="/orixs-hero-square.webp"
            alt="Orixs workspace showing business tasks, project activity, finance and the Orixs Copilot"
            width={1280}
            height={1280}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
