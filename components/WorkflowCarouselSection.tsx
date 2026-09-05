"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export function WorkflowCarouselSection() {
  const cards = [
    { src: "/Human Resources.svg", alt: "Human Resources" },
    { src: "/work.svg", alt: "Work" },
    { src: "/Finance.svg", alt: "Finance" },
    { src: "/Travel.svg", alt: "Travel" },
    { src: "/Social.svg", alt: "Social" },
    { src: "/Commerce.svg", alt: "Commerce" },
    { src: "/Support.svg", alt: "Support" },
    { src: "/Settings.svg", alt: "Settings" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to start the carousel
  const startCarousel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 3000);
  };

  useEffect(() => {
    // Start carousel on component mount
    startCarousel();
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cards.length]);

  return (
    <section data-copilot-section="workflow-modules" className="w-full py-4 sm:py-6 md:py-8 lg:py-10 bg-white flex flex-col items-center px-4 sm:px-6 md:px-8 overflow-hidden">
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-center mb-3 sm:mb-4 md:mb-6 px-2">
        How Orixs Transform's your workflow
      </h2>
      <div className="w-full max-w-[1400px] mx-auto overflow-hidden">
        <div className="w-full overflow-hidden relative h-48 sm:h-64 md:h-80 lg:h-96">
          <div
            className="flex absolute w-full h-full transition-all duration-500"
            style={{
              transform: `translateX(-${currentIndex * (100 / cards.length)}%)`,
              width: `${cards.length * 100}%`
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="relative flex justify-center items-center px-2 sm:px-4 md:px-8"
                style={{ width: `${100 / cards.length}%` }}
              >
                <Image 
                  src={card.src} 
                  alt={card.alt} 
                  width={1400} 
                  height={500}
                  className="object-contain max-h-full w-full"
                  priority={index === 0 || index === 1}
                  onError={() => console.error(`Failed to load image: ${card.src}`)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                currentIndex === index ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => {
                setCurrentIndex(index);
                startCarousel(); // Restart carousel timer when user interacts
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 
