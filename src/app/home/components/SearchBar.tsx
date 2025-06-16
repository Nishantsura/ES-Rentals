'use client'

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Car } from "@/types/car";
import { searchAPI } from "@/services/api";
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const formatPrice = (dailyPrice: number | undefined | null) => {
  if (!dailyPrice && dailyPrice !== 0) return 'Price on request';
  return dailyPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'AED'
  }) + '/day';
};

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLFormElement>(null);
  const searchCache = useRef<Record<string, Car[]>>({});
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchCars = async () => {
      const trimmedQuery = debouncedQuery.trim();
      
      if (!trimmedQuery) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Check cache first
      if (searchCache.current[trimmedQuery]) {
        setResults(searchCache.current[trimmedQuery]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Get initial results from Algolia
        const searchResults = await searchAPI.search(trimmedQuery);
        
        // Fetch additional data from Firestore for each result
        const enhancedResults = await Promise.all(
          searchResults.map(async (car) => {
            try {
              // Use objectID from Algolia result, fallback to id
              const carId = car.objectID || car.id;
              const carDoc = await getDoc(doc(db, 'cars', carId));
              if (carDoc.exists()) {
                // Merge Firestore data with Algolia data, prioritizing Firestore
                return {
                  ...car,
                  ...carDoc.data(),
                  id: carId, // Ensure we keep the ID
                  objectID: car.objectID, // Keep Algolia objectID
                  dailyPrice: carDoc.data().dailyPrice ?? car.dailyPrice, // Fallback to Algolia price
                  images: carDoc.data().images ?? car.images // Fallback to Algolia images
                } as Car;
              }
              return car;
            } catch (error) {
              console.error(`Error fetching Firestore data for car ${car.objectID || car.id}:`, error);
              return car;
            }
          })
        );

        // Cache the enhanced results
        searchCache.current[trimmedQuery] = enhancedResults;
        setResults(enhancedResults);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchCars();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-6 sm:pt-8 max-w-7xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative" ref={dropdownRef}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search luxury vehicles"
          className="pl-10 pr-4 h-10 md:h-12 bg-secondary/50 hover:bg-secondary/70 transition-colors rounded-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowDropdown(true)}
        />
        
        {showDropdown && (query.trim() !== '') && (
          <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[70vh] overflow-y-auto z-50">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
              <>
                {results.length > 0 ? (
                  <>
                    {results.slice(0, 5).map((car) => (
                      <Link
                        key={car.objectID || car.id}
                        href={`/car/${car.objectID || car.id}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {car.images?.[0] && (
                          <div className="relative w-16 h-16">
                            <Image
                              src={car.images[0]}
                              alt={car.name}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{car.name || 'Unnamed Vehicle'}</h3>
                          <p className="text-sm text-gray-500">
                            {car.year || 'Year N/A'} • {formatPrice(car.dailyPrice)}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/search/results?q=${encodeURIComponent(query)}`}
                      className="block p-4 text-center text-purple-600 hover:text-purple-700 hover:bg-gray-50 border-t font-medium"
                    >
                      See all {results.length} results
                    </Link>
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No results found
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
