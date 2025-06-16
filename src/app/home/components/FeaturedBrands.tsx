"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/types/brand';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FeaturedBrandsProps {
  brands: Brand[];
}

export function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Multiply brands to ensure we have enough content for seamless scrolling
  const displayBrands = [...brands, ...brands, ...brands, ...brands];
  return (
    <section className="mt-4 sm:mt-10 px-4 sm:px-4">
      <div className="flex items-center justify-between mb-2 -mx-4">
        <h2 className="font-heading text-heading-3">Featured Brands</h2>
        <Link href="/brands" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-white hover:bg-teal-500 hover:text-white h-10 px-4 py-2">
          View all
        </Link>
      </div>
      <div className="-mx-8 sm:-mx-8 relative group scroll-container">
        {/* Gradient fade overlay on the sides for visual continuity */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10"></div>
        
        {/* Visual indicator that content can be paused */}
        <div className="absolute top-3 right-24 text-xs text-gray-400 opacity-0 group-hover:opacity-80 transition-opacity duration-300 z-20">
          <span className="inline-flex items-center">
            <span className="mr-1">{isPaused ? 'Paused' : 'Hover to pause'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isPaused ? 
                <path d="M6 4v16M18 4v16"></path> :
                <path d="M5 3l14 9-14 9V3z"></path>
              }
            </svg>
          </span>
        </div>
        
        {/* Scrolling content with brands */}
        <div 
          ref={scrollContainerRef}
          className={cn(
            'scroll-track py-8 px-8 auto-scroll',
            isPaused && 'scroll-pause' // Pause animation when needed
          )}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 1000)}
          data-component-name="FeaturedBrands"
        >
          {/* Duplicated list of brands for smooth infinite scrolling */}
          {displayBrands.map((brand, index) => (
            <Link
              key={`${brand.id}-${index}`}
              href={`/brand/${encodeURIComponent(brand.slug)}`}
              className="min-w-[150px] px-6 py-4 h-[120px] shrink-0 bg-white dark:bg-gray-800 rounded-2xl flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out shadow-sm border border-gray-100 dark:border-gray-700 group/brand"
            >
              <div className="w-14 h-14 relative group-hover/brand:scale-110 transition-transform duration-300 ease-out">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 30vw"
                  priority={index < 5}
                />
              </div>
              <span className="text-sm font-medium text-center whitespace-nowrap mt-2 text-gray-700 dark:text-gray-300 group-hover/brand:text-black dark:group-hover/brand:text-white transition-colors duration-300">{brand.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Mouse hover indicator */}
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-primary rounded-full h-1.5 mb-2 transition-all duration-500 ${isPaused ? 'opacity-100 w-24' : 'opacity-0 w-12'}`}></div>
        
        {/* Add accessible scroll information */}
        <span className="sr-only">This content scrolls automatically. Hover over it to pause scrolling.</span>
      </div>
    </section>
  );
}
