import React from 'react';
import { StaggerTestimonials } from '@/components/ui/testimonials';

export function FeaturedContent() {
  return (
    <div className="relative w-full overflow-visible my-16" data-component-name="FeaturedContent">
      <div className="relative z-10 mb-14" data-component-name="FeaturedContent">
        <h2 className="font-heading text-heading-2 text-center text-white mb-2 px-4" data-component-name="FeaturedContent">
          Hear From Our <span className="text-primary dark:text-primary">Happy Customers</span>
        </h2>
        <p className="text-center text-white/70 max-w-md mx-auto">
          Read what our premium customers say about their luxury car rental experiences
        </p>
      </div>
      <StaggerTestimonials />
    </div>
  );
}
