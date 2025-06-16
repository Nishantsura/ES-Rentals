'use client';

import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaWhatsapp } from "react-icons/fa";
import { Brand } from '@/types/brand';
import { Car } from '@/types/car';
import { brandService } from '@/services/brandService';
import { carService } from '@/services/carService';
import { SearchResultsSkeleton } from '@/components/ui/card-skeleton';
import { PageHeader } from '@/components/PageHeader';
import { ChevronLeft } from 'lucide-react';
import { TiltedCarCard } from '@/components/car/TiltedCarCard';

function SearchResultsLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BrandPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrandAndCars = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const brandData = await brandService.getBrandBySlug(slug);
        setBrand(brandData);

        if (brandData) {
          const carsData = await carService.getCarsByBrand(brandData.name);
          setCars(carsData);
        }
      } catch (error) {
        console.error('Error loading brand and cars:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBrandAndCars();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Brand" />
        <div className="container mx-auto px-4 py-8">
          <SearchResultsSkeleton />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Brand Not Found" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Brand not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={brand.name} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <TiltedCarCard
              key={car.id}
              car={car}
              onClick={() => localStorage.setItem('previousPage', 'brand')}
            />
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No cars found for this brand</p>
          </div>
        )}
      </div>
    </div>
  );
}
