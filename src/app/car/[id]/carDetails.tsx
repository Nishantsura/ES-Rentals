'use client'

import { useEffect, useState } from "react"
import { Car } from "@/types/car"
// Remove direct Firestore imports
import { query, where, limit, getDocs, collection } from 'firebase/firestore'
import { db } from "@/lib/firebase"
import { CarDetailsSkeleton } from '@/components/ui/card-skeleton'
import { CarHeader } from "@/components/car/CarHeader"
import { CarImageGallery } from "@/components/car/CarImageGallery"
import { CarSpecifications } from "@/components/car/CarSpecifications"
import { CarRating } from "@/components/car/CarRating"
import { CarDetailsGrid } from "@/components/car/CarDetailsGrid"
import { CarDescription } from "@/components/car/CarDescription"
import { CarLocation } from "@/components/car/CarLocation"
import { CarPricing } from "@/components/car/CarPricing"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CarBrandLogo } from "@/components/car/CarBrandLogo"
import { carService } from "@/services/carService"
import { TiltedCarCard } from '@/components/car/TiltedCarCard'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/app/home/components/Header"
import { useCarHire } from "@/contexts/CarHireContext"
import { FaWhatsapp } from "react-icons/fa"

// Similar Cars Component
function SimilarCars({ currentCar }: { currentCar: Car }) {
  const [similarCars, setSimilarCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarCars = async () => {
      try {
        // Get cars with same type or brand, excluding current car
        const allCars = await carService.getAllCars()
        const filtered = allCars
          .filter(car => 
            car.id !== currentCar.id && 
            (car.type === currentCar.type || car.brand === currentCar.brand)
          )
          .slice(0, 2) // Get only 2 random cars
        setSimilarCars(filtered)
      } catch (error) {
        console.error('Error fetching similar cars:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarCars()
  }, [currentCar])

  if (loading) return <div className="max-w-7xl mx-auto h-32 animate-pulse bg-zinc-800/50 rounded-xl" />

  if (similarCars.length === 0) return null;
  
  return (
    <div className="mt-14 mb-12 max-w-7xl mx-auto px-4">
      <div className="flex items-center mb-6">
        <div className="w-1.5 h-8 bg-teal-400 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-white">Similar Vehicles</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {similarCars.map((car) => (
          <TiltedCarCard
            key={car.id}
            car={car}
            onClick={() => localStorage.setItem('previousPage', 'home')}
          />
        ))}
      </div>
    </div>
  )
}

export default function CarDetails({ id }: { id: string }) {
  // State variables
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [previousPage, setPreviousPage] = useState<string>('home')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  // Get dates from context
  const { pickupDate, setPickupDate, dropoffDate, setDropoffDate } = useCarHire()

  // Minimum swipe distance in pixels
  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev === car!.images.length - 1 ? 0 : prev + 1))
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev === 0 ? car!.images.length - 1 : prev - 1))
    }
    
    // Reset touch values
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Fetch car details on component mount
  useEffect(() => {
    const loadCar = async () => {
      try {
        // Use the Admin SDK API endpoint instead of direct Firestore access
        const response = await fetch(`/api/cars/${id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch car: ${response.statusText}`)
        }
        
        const carData = await response.json()
        setCar(carData as Car)
      } catch (error) {
        console.error('Error loading car details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCar()
    
    // Retrieve and clear previous page from localStorage
    const storedPreviousPage = localStorage.getItem('previousPage')
    if (storedPreviousPage) {
      setPreviousPage(storedPreviousPage)
      localStorage.removeItem('previousPage')
    }
  }, [id])

  // Loading state
  if (loading) {
    return <CarDetailsSkeleton />;
  }

  // Car not found state
  if (!car) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-semibold mb-2">Vehicle not found</h1>
        <p className="text-muted-foreground mb-4">This vehicle may no longer be available.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 dark:bg-black text-white mb-12" data-component-name="CarDetails">
      {car ? (
        <div className="pb-2 sticky top-0 z-20">
          <CarHeader
            previousPage={previousPage}
            selectedDate={pickupDate}
            endDate={dropoffDate}
            title={car.name}
            brand={car.brand}
            setSelectedDate={setPickupDate}
            setEndDate={setDropoffDate}
          />
        </div>
      ) : null}

      <div className="lg:flex lg:gap-8 lg:p-4 max-w-7xl mx-auto">
        <CarImageGallery
          images={car.images}
          carName={car.name}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          isLightboxOpen={isLightboxOpen}
          setIsLightboxOpen={setIsLightboxOpen}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        />

        <div className="lg:flex-1">
          <main className="p-4 lg:p-0">
            <div className="flex flex-col mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                  <CarBrandLogo brand={car.brand} />
                </div>
                <h1 className="text-3xl font-bold text-white font-heading tracking-tight">{car.name}</h1>
              </div>
              <CarRating rating={car.rating} />
            </div>

            <CarSpecifications
              year={car.year}
              transmission={car.transmission}
              seats={car.seats}
            />

            <CarDetailsGrid
              engineCapacity={car.engineCapacity}
              power={car.power}
              fuelType={car.fuelType}
              type={car.type}
            />

            <CarDescription
              description={car.description}
              tags={car.tags}
            />

            {/* <CarLocation
              location={car.location}
              selectedDate={pickupDate}
            /> */}
          </main>
        </div>
      </div>

      <SimilarCars currentCar={car} />

      <CarPricing
        car={car}
        selectedDate={pickupDate}
        endDate={dropoffDate}
      />
    </div>
  )
}
