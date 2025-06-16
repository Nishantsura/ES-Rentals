'use client';

import { motion } from "framer-motion";
import { TestimonialsColumn } from "./testimonials-columns-1";

// Using the existing testimonials from the current component
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

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6);

export function StaggerTestimonials() {
  return (
    <section className="relative py-16 md:py-24 bg-background dark:bg-transparent">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(36,36,36,0.06)_0%,rgba(36,36,36,0)_50%)] dark:bg-[radial-gradient(circle_at_15%_50%,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(36,36,36,0.08)_0%,rgba(36,36,36,0)_50%)] dark:bg-[radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_45%)]" />

      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="border border-border py-1 px-4 rounded-lg text-foreground/70 text-sm">Testimonials</div>
          </div>

          <h2 className="font-heading text-heading-2 text-zinc-800 dark:text-white text-center">
            Hear From Our <span className="text-teal-500">Happy Customers</span>
          </h2>
          <p className="text-center mt-4 text-foreground/70 max-w-md mx-auto">
            Read what our premium customers say about their luxury car rental experiences
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-14 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
