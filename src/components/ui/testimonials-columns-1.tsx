"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Array<{
    testimonial: string;
    by: string;
    rentedDate?: string;
    author?: string;
    location?: string;
  }>;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map((testimonial, i) => (
                <div className="p-6 md:p-8 rounded-xl border border-border bg-card shadow-lg shadow-primary/5 dark:shadow-primary/10 max-w-xs w-full" key={i}>
                  <p className="text-sm text-foreground/90 leading-relaxed">"{testimonial.testimonial}"</p>
                  <div className="flex flex-col mt-4">
                    <div className="font-medium text-sm tracking-tight leading-5 text-teal-500 dark:text-teal-400">{testimonial.author || testimonial.by}</div>
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
};
