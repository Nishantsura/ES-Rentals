'use client'; // Add this line for Swiper client-side rendering

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    quote: "Autoluxe made finding my dream car so easy! The process was seamless and the customer service was top-notch.",
    author: "Jane Doe",
    location: "San Francisco, CA",
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg", // Example image
  },
  {
    id: 2,
    quote: "I was hesitant about buying a car online, but Autoluxe exceeded my expectations. Highly recommended!",
    author: "John Smith",
    location: "New York, NY",
    imageUrl: "https://randomuser.me/api/portraits/men/1.jpg", // Example image
  },
  {
    id: 3,
    quote: "Fantastic selection and great prices. The virtual tour feature was incredibly helpful.",
    author: "Alex Johnson",
    location: "Chicago, IL",
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg", // Example image
  },
  {
    id: 4,
    quote: "The best car buying experience I've ever had. Everything was handled professionally and efficiently.",
    author: "Sarah Lee",
    location: "Los Angeles, CA",
    imageUrl: "https://randomuser.me/api/portraits/women/2.jpg", // Example image
  },
  {
    id: 5,
    quote: "Great communication and transparency throughout the purchase. Found the exact model I wanted.",
    author: "Michael Brown",
    location: "Houston, TX",
    imageUrl: "https://randomuser.me/api/portraits/men/3.jpg", // Example image
  },
    {
    id: 6,
    quote: "Autoluxe offers a truly modern way to buy cars. User-friendly website and supportive staff.",
    author: "Emily Davis",
    location: "Miami, FL",
    imageUrl: "https://randomuser.me/api/portraits/women/3.jpg", // Example image
  },
];

const TestimonialCard: React.FC<{ quote: string; author: string; location: string; imageUrl?: string }> = ({
  quote,
  author,
  location,
  imageUrl,
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center h-full">
      {imageUrl ? (
        <img src={imageUrl} alt={author} className="w-20 h-20 rounded-full mb-5 object-cover" />
      ) : (
        <div className="w-20 h-20 rounded-full mb-5 bg-gray-200 flex items-center justify-center text-gray-500">
          {/* Placeholder icon or initials can go here */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
      <p className="text-gray-600 mb-6 text-md leading-relaxed font-sans">"{quote}"</p>
      <div className="mt-auto">
        <p className="font-heading text-gray-900 text-lg font-semibold">
          {author}
        </p>
        <p className="text-sm text-gray-500 mt-1 font-sans">{location}</p>
      </div>
    </div>
  );
};

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-16 bg-transparent">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-heading-2 text-center text-gray-800 mb-12">
          Hear From Our Happy Customers
        </h2>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30} // Spacing between slides
          slidesPerView={1} // Default slides per view
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }} // Add pagination dots
          navigation // Add navigation arrows
          breakpoints={{
            // when window width is >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 30
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 40
            }
          }}
          className="pb-12" // Add padding-bottom for pagination
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id} style={{ height: 'auto' }}> {/* Ensure slide height adjusts */} 
              <TestimonialCard
                quote={testimonial.quote}
                author={testimonial.author}
                location={testimonial.location}
                imageUrl={testimonial.imageUrl}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialSection;
