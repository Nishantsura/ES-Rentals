'use client'

import Link from 'next/link';
import { useState } from 'react';
import { Car } from '@/types/car';
import { TiltedCard } from "@/components/ui/tilted-card";

interface TiltedCarCardProps {
  car: Car;
  onClick?: () => void;
  className?: string;
  linkHref?: string;
}

export function TiltedCarCard({ car, onClick, className = '', linkHref }: TiltedCarCardProps) {
  const href = linkHref || `/car/${car.id}`;
  const [isHovered, setIsHovered] = useState(false);

  const overlayContent = (
    <div className="absolute inset-0 flex flex-col justify-end p-4 
                  bg-gradient-to-t from-black/80 to-transparent 
                  rounded-b-[15px] overflow-hidden">
      <h3 className="subtitle-1 text-white mb-1 truncate">{car.name}</h3>
      <div className="flex flex-wrap items-center gap-1 body-2 text-white/80 mb-1">
        <span className="text-xs">{car.year}</span>
        <span className="text-xs">•</span>
        <span className="text-xs">{car.transmission}</span>
        <span className="text-xs">•</span>
        <span className="text-xs">{car.fuelType}</span>
        <span className="hidden sm:inline-block text-xs">•</span>
        <span className="hidden sm:inline-block text-xs">250kms/day</span>
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className="body-2">
          <span className="subtitle-1 text-white">AED {car.dailyPrice?.toLocaleString()}</span>
          <span className="text-white/70"> / day</span>
        </div>
      </div>
    </div>
  );

  const cardComponent = (
    <div 
      className="h-[260px] sm:h-[280px] md:h-[300px] w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TiltedCard
        imageSrc={car.images[0]}
        altText={car.name}
        captionText={`${car.brand} ${car.name}`}
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={8}
        scaleOnHover={1.03}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={overlayContent}
        className={`${className}`}
        tooltipClassName="bg-zinc-800/90 text-white border border-zinc-700/50"
      />
    </div>
  );

  return onClick ? (
    <Link href={href} onClick={onClick} className="block h-full rounded-[15px] overflow-hidden">
      {cardComponent}
    </Link>
  ) : (
    <Link href={href} className="block h-full rounded-[15px] overflow-hidden">
      {cardComponent}
    </Link>
  );
}
