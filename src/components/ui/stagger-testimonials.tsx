"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

// Customized testimonials for AutoLuxe car rental
const testimonials = [
  {
    tempId: 0,
    testimonial: "The Escalade was perfect for cruising around Dubai in comfort and style. The ride was ultra-smooth and the interior tech was seriously impressive.",
    by: "Cadillac Escalade Sport",
    rentedDate: "May 2025",
    author: "Ayesha M.",
    location: "Abu Dhabi"
  },
  {
    tempId: 1,
    testimonial: "Booking was seamless and the delivery was on time. Loved the auto-pilot on Sheikh Zayed Road and the futuristic feel of the cabin.",
    by: "Tesla Model Y",
    rentedDate: "April 2025",
    author: "Marcus L.",
    location: "Berlin"
  },
  {
    tempId: 2,
    testimonial: "Absolute thrill. I rented it for a weekend trip to Jebel Jais and it handled like a dream. Everyone turned their heads!",
    by: "Lamborghini Huracán Evo",
    rentedDate: "May 2025",
    author: "Farhan Q.",
    location: "Dubai Marina"
  },
  {
    tempId: 3,
    testimonial: "Picked this for a desert shoot, and it didn't disappoint. Great balance of luxury and utility. The panoramic roof was a win.",
    by: "Range Rover Velar",
    rentedDate: "March 2025",
    author: "Aditi N.",
    location: "Photographer, India"
  },
  {
    tempId: 4,
    testimonial: "The Kia EV6 GT offers impressive performance with its sporty handling and quick acceleration. The high-tech interior with dual panoramic displays provides both style and functionality.",
    by: "Kia EV6 GT",
    rentedDate: "April 2025",
    author: "Khaled R.",
    location: "Downtown Dubai"
  },
  {
    tempId: 5,
    testimonial: "I booked the Ghost for a wedding and it was the highlight of the event. The chauffeur was professional and the car was pristine.",
    by: "Rolls Royce Ghost",
    rentedDate: "February 2025",
    author: "Noor H.",
    location: "Dubai Hills"
  },
  {
    tempId: 6,
    testimonial: "Mind-blowing acceleration and incredible control. This was my dream drive and ES made it happen with no hassle.",
    by: "McLaren GT",
    rentedDate: "May 2025",
    author: "Brandon T.",
    location: "Los Angeles"
  },
  {
    tempId: 19,
    testimonial: "AutoLuxe's delivery service has transformed our destination wedding business. Luxury cars delivered right to the venue add that special touch our clients adore.",
    by: "Zoe, Luxury Travel Agent at EliteJourneys",
    rentedDate: "June 2025"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: {
    tempId: number;
    testimonial: string;
    by: string;
    rentedDate: string;
    author?: string;
    location?: string;
  };
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;
  // Make center card bigger by adding a size multiplier
  const sizeMultiplier = isCenter ? 1.15 : 1;
  
  // Adjust horizontal spread for better layout - increase spacing between cards
  const horizontalSpread = isCenter ? 0 : (cardSize / 1) * position;
  
  return (
    <div
      onClick={() => isCenter ? undefined : handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer p-6 transition-all duration-500 ease-in-out overflow-hidden",
        isCenter ? "z-10" : "z-0",
        isCenter ? "bg-background" : "bg-background/80 backdrop-blur-sm",
        "text-foreground"
      )}
      style={{
        width: cardSize * sizeMultiplier,
        height: cardSize * sizeMultiplier,
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${horizontalSpread}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 10px 30px -5px rgba(0, 0, 0, 0.3), 0px 8px 10px -8px rgba(0, 0, 0, 0.5)" : "0px 5px 15px -3px rgba(0, 0, 0, 0.1)",
        minHeight: isCenter ? undefined : "300px",
        maxHeight: isCenter ? undefined : "320px"
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-border"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <div className="flex mb-3 items-center">
        <span className={cn(
          "font-medium text-sm truncate", 
          !isCenter && "opacity-60"
        )}>Rented <span className="text-teal-500 font-bold">{testimonial.by}</span> • {testimonial.rentedDate}</span>
      </div>
      <h3 className={cn(
        "font-heading mb-2 max-w-full",
        isCenter ? "text-base sm:text-lg" : "text-sm",
        isCenter ? "text-foreground" : "text-foreground/60",
        !isCenter && "line-clamp-3"
      )}>
        "{testimonial.testimonial}"
      </h3>
      {testimonial.author && (
        <span className={cn(
          "font-medium text-sm block truncate", 
          isCenter ? "text-teal-500" : "text-teal-500/60"
        )}>– {testimonial.author}{testimonial.location ? `, ${testimonial.location}` : ''}</span>
      )}
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(385);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches: isLarge } = window.matchMedia("(min-width: 1024px)");
      const { matches: isMedium } = window.matchMedia("(min-width: 640px)");
      setCardSize(isLarge ? 385 : isMedium ? 365 : 290);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-[100vw] overflow-hidden bg-gradient-to-b from-background via-background/95 to-background left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] -translate-x-0"
      style={{ height: 650 }}>
      {/* Subtle background patterns for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(36,36,36,0.06)_0%,rgba(36,36,36,0)_50%)] dark:bg-[radial-gradient(circle_at_15%_50%,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(36,36,36,0.08)_0%,rgba(36,36,36,0)_50%)] dark:bg-[radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_45%)]" />
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 z-20">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-16 w-16 items-center justify-center text-2xl transition-all duration-300",
            "bg-background/30 backdrop-blur-sm border-2 border-white/10 hover:bg-primary hover:text-primary-foreground",
            "hover:shadow-lg hover:scale-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-16 w-16 items-center justify-center text-2xl transition-all duration-300",
            "bg-background/30 backdrop-blur-sm border-2 border-white/10 hover:bg-primary hover:text-primary-foreground",
            "hover:shadow-lg hover:scale-105",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
