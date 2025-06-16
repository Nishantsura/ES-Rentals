'use client';

import React from "react";
import { motion } from "framer-motion";

// Testimonial data
const testimonials = [
  {
    testimonial: "The Escalade was perfect for cruising around Dubai in comfort and style. The ride was ultra-smooth and the interior tech was seriously impressive.",
    by: "Cadillac Escalade Sport",
    rentedDate: "May 2025",
    author: "Ayesha M.",
    location: "Abu Dhabi"
  },
  {
    testimonial: "Booking was seamless and the delivery was on time. Loved the auto-pilot on Sheikh Zayed Road and the futuristic feel of the cabin.",
    by: "Tesla Model Y",
    rentedDate: "April 2025",
    author: "Marcus L.",
    location: "Berlin"
  },
  {
    testimonial: "Absolute thrill. I rented it for a weekend trip to Jebel Jais and it handled like a dream. Everyone turned their heads!",
    by: "Lamborghini Huracán Evo",
    rentedDate: "May 2025",
    author: "Farhan Q.",
    location: "Dubai Marina"
  },
  {
    testimonial: "Picked this for a desert shoot, and it didn't disappoint. Great balance of luxury and utility. The panoramic roof was a win.",
    by: "Range Rover Velar",
    rentedDate: "March 2025",
    author: "Aditi N.",
    location: "Photographer, India"
  },
  {
    testimonial: "The Kia EV6 GT offers impressive performance with its sporty handling and quick acceleration. The high-tech interior with dual panoramic displays provides both style and functionality.",
    by: "Kia EV6 GT",
    rentedDate: "April 2025",
    author: "Khaled R.",
    location: "Downtown Dubai"
  },
  {
    testimonial: "I booked the Ghost for a wedding and it was the highlight of the event. The chauffeur was professional and the car was pristine.",
    by: "Rolls Royce Ghost",
    rentedDate: "February 2025",
    author: "Noor H.",
    location: "Dubai Hills"
  },
  {
    testimonial: "Mind-blowing acceleration and incredible control. This was my dream drive and ES made it happen with no hassle.",
    by: "McLaren GT",
    rentedDate: "May 2025",
    author: "Brandon T.",
    location: "Los Angeles"
  },
  {
    testimonial: "AutoLuxe's delivery service has transformed our destination wedding business. Luxury cars delivered right to the venue add that special touch our clients adore.",
    by: "Zoe, Luxury Travel Agent at EliteJourneys",
    rentedDate: "June 2025"
  }
];

// Single testimonial column component
function TestimonialsColumn({ 
  testimonials, 
  className = "",
  duration = 15
}: { 
  testimonials: Array<{
    testimonial: string;
    by: string;
    rentedDate?: string;
    author?: string;
    location?: string;
  }>;
  className?: string;
  duration?: number;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {testimonials.map((testimonial, i) => (
                <div 
                  className="p-6 md:p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm shadow-xl shadow-black/30 max-w-xs w-full" 
                  key={i}
                >
                  <p className="text-sm text-foreground/90 leading-relaxed">"{testimonial.testimonial}"</p>
                  <div className="flex flex-col mt-4">
                    <div className="font-medium text-sm tracking-tight leading-5 text-teal-500 dark:text-teal-400">
                      {testimonial.author || testimonial.by}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {testimonial.location && <span className="block">{testimonial.location}</span>}
                      {testimonial.rentedDate && <span>{testimonial.rentedDate}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
}

// Main testimonials component
export function StaggerTestimonials() {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6);

  return (
    <section className="relative py-8 md:py-12 bg-transparent">

      <div className="container z-10 mx-auto bg-transparent">
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[640px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={15} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={15} />
        </div>
      </div>
    </section>
  );
}
