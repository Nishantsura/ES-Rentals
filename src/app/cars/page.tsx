'use client'

import { useEffect, useState } from 'react'
import { Car } from '@/types/car'
import { carService } from '@/services/carService'
// Header is now imported globally in RootLayout
import { FilterModal, FilterValues } from '../home/components/FilterModal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { SearchBar } from '../home/components/SearchBar'
import { useCarHire } from '@/contexts/CarHireContext'
import { Calendar } from 'lucide-react'
import { FaWhatsapp } from "react-icons/fa";
import { TiltedCarCard } from '@/components/car/TiltedCarCard'
import { FeaturesBenefits } from '@/components/ui/FeaturesBenefits'
import { FeaturedContent } from '@/components/ui/FeaturedContent'

// Direct Firebase imports for testing
import { db } from '@/lib/firebase'
import { collection, getDocs, query, limit } from 'firebase/firestore'

const ITEMS_PER_PAGE = 12

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    types: [],
    tags: [],
    transmission: '',
    maxPrice: 10000,
  })
  
  // Debug states
  const [isDirectFbTest, setIsDirectFbTest] = useState(false)
  const [fbTestResult, setFbTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  } | null>(null)
  const [shouldResetFilters, setShouldResetFilters] = useState(false)
  
  // Get car hire details from context
  const { pickupDate, dropoffDate, pickupLocation } = useCarHire()
  
  // Debug log car hire details
  useEffect(() => {
    console.log('Car hire details:', { pickupDate, dropoffDate, pickupLocation })
  }, [pickupDate, dropoffDate, pickupLocation])

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Ensure we handle the date string correctly by explicitly parsing YYYY-MM-DD format
      const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
      // Month is 0-indexed in JavaScript Date
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };

  // Test API connection
  const testFirebaseConnection = async () => {
    setIsDirectFbTest(true)
    setFbTestResult(null)
    
    try {
      // Use API endpoint with limit parameter
      console.log('Testing API connection to fetch cars')
      const response = await fetch('/api/cars?limit=5')
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const carsData = await response.json()
      
      console.log(`API returned ${carsData.length} cars`, carsData)
      setFbTestResult({
        success: true,
        message: `Successfully retrieved ${carsData.length} cars from API`,
        data: carsData
      })
      
      // If main load failed but API test works, use this data
      if (cars.length === 0 && carsData.length > 0) {
        setCars(carsData as Car[])
        setFilteredCars(carsData as Car[])
      }
    } catch (error) {
      console.error('Error in API connection test:', error)
      setFbTestResult({
        success: false, 
        message: 'Error connecting to API',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  useEffect(() => {
    const loadCars = async () => {
      try {
        console.log('Fetching cars from API endpoint')
        // Fetch cars from our API endpoint
        const response = await fetch('/api/cars')
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        const allCars = await response.json()
        console.log(`Loaded ${allCars.length} cars from API endpoint`)
        
        // Update state
        setCars(allCars)
        setFilteredCars(allCars)
      } catch (error) {
        console.error('Error loading cars from API:', error)
        // If there's an error, we can try the testFirebaseConnection as a fallback
        testFirebaseConnection()
      } finally {
        setLoading(false)
      }
    }

    loadCars()
  }, [])

  const handleFiltersChange = (filters: FilterValues) => {
    setShouldResetFilters(false)
    setSelectedFilters(filters)
    setCurrentPage(1) // Reset to first page when filters change

    const filtered = cars.filter(car => {
      const matchesPrice = car.dailyPrice >= 1000 && car.dailyPrice <= filters.maxPrice
      const matchesTransmission = !filters.transmission || 
                               car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      const matchesType = filters.types.length === 0 || 
                       filters.types.includes(car.type.toLowerCase())
      const matchesTags = filters.tags.length === 0 ||
                       car.tags.some(tag => filters.tags.includes(tag.toLowerCase()))

      return matchesPrice && matchesTransmission && matchesType && matchesTags
    })

    setFilteredCars(filtered)
  }

  const clearFilters = () => {
    setShouldResetFilters(true)
    setSelectedFilters({
      types: [],
      tags: [],
      transmission: '',
      maxPrice: 10000,
    })
    setFilteredCars(cars)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCars = filteredCars.slice(startIndex, endIndex)

  const hasActiveFilters = selectedFilters.types.length > 0 || 
    selectedFilters.tags.length > 0 || 
    selectedFilters.transmission !== '' || 
    selectedFilters.maxPrice < 10000

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen justify-center align-center max-w-7xl mx-auto">
        {/* Header now rendered globally in RootLayout */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen  max-w-7xl mx-auto w-full">
      {/* Header now rendered globally in RootLayout */}
      <div className="container mx-auto px-4 py-8">
        {/* Debugging button - only shown when cars can't be loaded */}
        {(cars.length === 0 && !loading) && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h3 className="text-lg font-medium text-amber-800 mb-2">Troubleshooting</h3>
            <p className="text-amber-700 mb-3">
              No cars were loaded from the API. This could be due to Firebase connection issues, empty collection, or API errors.
            </p>
            <Button 
              onClick={testFirebaseConnection}
              variant="outline"
              className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 mr-3"
            >
              Test Direct Firebase Connection
            </Button>
            <Link href="/debug">
              <Button variant="outline" className="bg-slate-100 border-slate-300">
                Go to Debug Page
              </Button>
            </Link>
            
            {fbTestResult && (
              <div className={`mt-4 p-3 rounded-md ${fbTestResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <p className="font-medium">{fbTestResult.message}</p>
                {fbTestResult.error && <p className="text-sm mt-1">{fbTestResult.error}</p>}
                {fbTestResult.success && fbTestResult.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm">Show sample data</summary>
                    <pre className="mt-2 text-xs overflow-auto p-2 bg-white/50 rounded">
                      {JSON.stringify(fbTestResult.data[0], null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        )}
        <SearchBar />
        
        {/* Date selection component hidden per user request */}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-4 font-semibold">All Cars</h1>
          <div className="flex items-center gap-4">
            <FilterModal 
              onFiltersChange={handleFiltersChange} 
              shouldReset={shouldResetFilters} 
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {selectedFilters.types.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
            {selectedFilters.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            ))}
            {selectedFilters.transmission && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {selectedFilters.transmission.charAt(0).toUpperCase() + selectedFilters.transmission.slice(1)}
              </span>
            )}
            {selectedFilters.maxPrice < 10000 && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Up to ${selectedFilters.maxPrice.toLocaleString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-primary"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedCars.length > 0 ? (
            paginatedCars.map((car) => (
              <TiltedCarCard
                key={car.id}
                car={car}
              />
            ))
          ) : (
            !loading && (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-medium mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? 'Try clearing or adjusting your filters' 
                    : 'There might be a problem connecting to the database'}
                </p>
              </div>
            )
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
        
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
  )
}
