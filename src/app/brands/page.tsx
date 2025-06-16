'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Car, SprayCan, HelpCircle, MessageSquare, Search } from 'lucide-react';
import { Brand } from '@/types/brand';
import { brandService } from '@/services/brandService';
import { BrandDetailsSkeleton } from '@/components/ui/card-skeleton';
import { FeaturesBenefits } from '@/components/ui/FeaturesBenefits';
import { FeaturedContent } from '@/components/ui/FeaturedContent';
// Global Header is used from RootLayout

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await brandService.getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);


  // Using global Header and Navbar from RootLayout

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header now rendered globally in RootLayout */}
        
        <div className="container mx-auto pt-12 pb-8 px-4">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">All Brands</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, index) => (
              <BrandDetailsSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header now rendered globally in RootLayout */}
      
      <div className="container mx-auto pt-12 pb-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">All Brands</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {brands.map((brand: Brand) => (
            <Link
              key={brand.id}
              href={`/brand/${encodeURIComponent(brand.slug)}`}
              className="p-6 bg-white/80 dark:bg-card/50 rounded-2xl flex flex-col items-center justify-center hover:bg-white dark:hover:bg-card transition-all duration-300 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-border/30 backdrop-blur-sm group"
            >
              <div className="w-16 h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-center text-gray-900 dark:text-white">{brand.name}</span>
            </Link>
          ))}
        </div>
        
      </div>
      
      {/* Features and Benefits section - moved outside container for full-width display */}
      <div className="w-full">
        <FeaturesBenefits />
      </div>
      
      {/* Dark background wrapper for testimonials - full width */}
      <div className="w-full bg-zinc-900 py-10">
        <FeaturedContent />
      </div>
    </div>
  );
}
