'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCarHire } from '@/contexts/CarHireContext';

export default function HeroSection() {
  const router = useRouter();
  const { 
    pickupLocation, setPickupLocation,
    pickupDate, setPickupDate,
    dropoffDate, setDropoffDate 
  } = useCarHire();
  
  // Local state
  const [location, setLocation] = useState(pickupLocation || 'Dubai');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('daily');
  const [carType, setCarType] = useState('');
  
  // Initialize startDate from context or set to tomorrow if not available
  useEffect(() => {
    if (!startDate) {
      if (pickupDate) {
        setStartDate(pickupDate);
      } else {
        // Default to tomorrow if no date is set
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setStartDate(tomorrow.toISOString().split('T')[0]);
      }
    }
  }, [pickupDate, startDate]);

  const handleSearch = () => {
    // Calculate dropoff date based on selected duration
    const pickupDateObj = new Date(startDate);
    let dropoffDateObj = new Date(startDate);
    
    switch(duration) {
      case 'daily':
        dropoffDateObj.setDate(pickupDateObj.getDate() + 1); // +1 day
        break;
      case '3days':
        dropoffDateObj.setDate(pickupDateObj.getDate() + 3); // +3 days
        break;
      case 'weekly':
        dropoffDateObj.setDate(pickupDateObj.getDate() + 7); // +7 days
        break;
      default:
        dropoffDateObj.setDate(pickupDateObj.getDate() + 1); // Default to +1 day
    }
    
    // Update the car hire context
    setPickupLocation(location || 'Dubai');
    setPickupDate(startDate);
    setDropoffDate(dropoffDateObj.toISOString().split('T')[0]);
    
    // Log the data being saved to context
    console.log('Saving to context:', { 
      location: location || 'Dubai',
      pickupDate: startDate,
      dropoffDate: dropoffDateObj.toISOString().split('T')[0],
      carType
    });
    
    // Navigate to cars page
    router.push('/cars');
  };

  return (
    <section className="relative w-[100vw] h-auto min-h-[100vh] flex items-center justify-center py-16 md:py-24 overflow-hidden mx-0 px-0 max-w-none left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] -translate-x-0">
      {/* Background video with overlay */}
      <div className="absolute inset-0 z-0 w-[100vw] h-screen left-0 right-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 w-[100vw] h-full object-cover object-center dark:brightness-[0.85] dark:contrast-[1.1] transition-all duration-700 ease-in-out">
          <source src="/Videos/4632167-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          {/* Fallback for older browsers */}
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30 dark:bg-black/40"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-5xl px-4 md:px-8 flex flex-col items-center">
        {/* Text Section - Now at the top */}
        <div className="mb-8 md:mb-12 text-center animate-fade-up w-full" style={{ animationDelay: '100ms', animationDuration: '500ms' }}>
          <h1 className="text-4xl md:text-6xl font-bold font-playfair text-white drop-shadow-lg tracking-wide dark:heading-glow">
            Parked in Dubai. Just for You
          </h1>
          <p className="text-lg font-semibold font-clash mt-3 text-white/90 drop-shadow-md">
            Dubai's Gateway to Supercar Thrills
          </p>
        </div>
        
        {/* Search Box - Now below the text */}
        <div 
          className="bg-black/30 backdrop-blur-sm shadow-lg rounded-xl p-4 md:p-6 animate-fade-up border border-white/10 dark:border-white/5 w-full max-w-[800px] overflow-hidden"
          style={{ animationDelay: '300ms', animationDuration: '500ms' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {/* Pickup car at */}
            <div className="sm:col-span-2">
              <label htmlFor="location" className="block text-sm font-semibold tracking-wide text-white">
                Pickup car at
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, airport, address or hotel"
                className="mt-2 py-3 px-4 w-full rounded-md bg-black/30 border border-white/20 text-white placeholder-white/80 shadow-sm tracking-wide font-medium text-base focus:border-indigo-500 dark:focus:border-primary focus:ring-indigo-500 dark:focus:ring-primary focus:ring-opacity-50 transition-all backdrop-blur-sm"
              />
            </div>
            
            {/* From */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold tracking-wide text-white">
                From
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Select pickup date"
                className="mt-2 py-3 px-4 w-full rounded-md bg-black/30 border border-white/20 text-white placeholder-white/80 shadow-sm tracking-wide font-medium text-base focus:border-indigo-500 dark:focus:border-primary focus:ring-indigo-500 dark:focus:ring-primary focus:ring-opacity-50 transition-all backdrop-blur-sm [&::-webkit-calendar-picker-indicator]:invert"
              />
              
              {/* Duration tags */}
              <div className="mt-3 flex flex-wrap gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setDuration('daily')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    duration === 'daily' 
                      ? 'bg-indigo-600 dark:bg-primary text-white dark:accent-glow' 
                      : 'bg-black/20 text-white/80 hover:bg-black/30 border border-white/10'
                  }`}
                >
                  Daily
                </button>
                <button 
                  type="button" 
                  onClick={() => setDuration('3days')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    duration === '3days' 
                      ? 'bg-indigo-600 dark:bg-primary text-white dark:accent-glow' 
                      : 'bg-black/20 text-white/80 hover:bg-black/30 border border-white/10'
                  }`}
                >
                  +3 Days
                </button>
                <button 
                  type="button" 
                  onClick={() => setDuration('weekly')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    duration === 'weekly' 
                      ? 'bg-indigo-600 dark:bg-primary text-white dark:accent-glow' 
                      : 'bg-black/20 text-white/80 hover:bg-black/30 border border-white/10'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>
            
            {/* Car Type */}
            <div>
              <label htmlFor="carType" className="block text-sm font-semibold tracking-wide text-white">
                Car type
              </label>
              <div className="relative mt-2">
                <select
                  id="carType"
                  value={carType}
                  onChange={(e) => setCarType(e.target.value)}
                  className="py-3 px-4 w-full rounded-md bg-black/30 border border-white/20 text-white shadow-sm tracking-wide font-medium text-base focus:border-indigo-500 dark:focus:border-primary focus:ring-indigo-500 dark:focus:ring-primary focus:ring-opacity-50 transition-all backdrop-blur-sm appearance-none pr-10"
                >

                <option value="">Select car type</option>
                <option value="coupe">Coupe</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="convertible">Convertible</option>
                <option value="sports">Sports</option>
                <option value="luxury">Luxury</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-white/70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* WhatsApp Button - Centered below all inputs */}
          <div className="flex justify-center mt-8">
            <button 
              onClick={() => window.open('https://wa.me/971501234567?text=I\'m interested in renting a car from AutoLuxe', '_blank')}
              className="bg-indigo-600 dark:bg-primary hover:bg-indigo-700 dark:hover:bg-primary/90 transition-colors px-7 py-3 rounded-full flex items-center justify-center shadow-md w-auto mx-auto min-w-[160px]"
              aria-label="Contact Us"
            >
              <Search className="h-5 w-5 text-black mr-2" />
              <span className="text-black font-medium">Search Cars</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
