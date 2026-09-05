'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export function DashboardSection() {
  return (
    <section data-copilot-section="dashboard" className="relative pt-2 pb-2 sm:pt-3 md:pt-4 px-2 sm:px-6 md:px-8 overflow-hidden md:overflow-visible">
        <div className="max-w-6xl mx-auto relative mt-0 sm:mt-2 md:mt-4 overflow-hidden md:overflow-visible">
        {/* Curved Arrow - hidden on mobile to prevent overflow */}
        <motion.div
          className="absolute hidden md:block md:left-[-70px] md:top-[-60px] md:w-[80px] md:h-[80px] z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Image
            src="/curved-arrow.svg"
            alt="Curved Arrow"
            width={80}
            height={80}
            className="transform -rotate-12 w-[80px] h-[80px]"
          />
        </motion.div>

        {/* Google Calendar Icon - hidden on mobile */}
        <div className="absolute hidden md:block md:right-[20px] md:top-[-80px] md:w-[80px] md:h-[80px] z-20 rotate-[-15deg]">
          <Image
            src="/google-calendar.png"
            alt="Google Calendar"
            width={80}
            height={80}
            className="floating-icon-1 w-[80px] h-[80px]"
            priority
          />
        </div>
        {/* Teams Icon - hidden on mobile */}
        <div className="absolute hidden md:block md:right-[-100px] md:top-[-50px] md:w-[80px] md:h-[80px] z-20 rotate-[10deg]">
          <Image
            src="/Teams 1.png"
            alt="Teams"
            width={80}
            height={80}
            className="floating-icon-2 w-[80px] h-[80px]"
            priority
          />
        </div>
        {/* Mail Icon (Gmail) - hidden on mobile */}
        <div className="absolute hidden md:block md:right-[-100px] md:top-[90px] md:w-[80px] md:h-[80px] z-20 rotate-[-10deg]">
          <Image
            src="/ma 1.png"
            alt="Mail"
            width={80}
            height={80}
            className="floating-icon-3 w-[80px] h-[80px]"
            priority
          />
        </div>
        
        {/* Dashboard Image */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
        <Image
          src="/dashboard.jpeg"
          alt="Orixs Dashboard"
          width={1200}
          height={800}
          className="rounded-lg md:rounded-2xl shadow-md md:shadow-2xl w-full max-w-6xl mx-auto mb-3 md:mb-0"
          priority
        />
        </motion.div>
      </div>
    </section>
  );
}
