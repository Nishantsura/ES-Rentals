'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CarHireContextType {
  pickupLocation: string
  setPickupLocation: (location: string) => void
  returnDifferentLocation: boolean
  setReturnDifferentLocation: (different: boolean) => void
  pickupDate: string
  setPickupDate: (date: string) => void
  dropoffDate: string
  setDropoffDate: (date: string) => void
  driverAgeValid: boolean
  setDriverAgeValid: (valid: boolean) => void
}

const CarHireContext = createContext<CarHireContextType | undefined>(undefined)

export function CarHireProvider({ children }: { children: ReactNode }) {
  const [pickupLocation, setPickupLocation] = useState('Dubai')
  const [returnDifferentLocation, setReturnDifferentLocation] = useState(false)
  
  // Set default pickup date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]
  
  // Set default dropoff date to 3 days after pickup
  const dropoffDefault = new Date(tomorrow)
  dropoffDefault.setDate(dropoffDefault.getDate() + 2)
  const dropoffDefaultStr = dropoffDefault.toISOString().split('T')[0]
  
  const [pickupDate, setPickupDate] = useState(tomorrowStr)
  const [dropoffDate, setDropoffDate] = useState(dropoffDefaultStr)
  const [driverAgeValid, setDriverAgeValid] = useState(true)

  return (
    <CarHireContext.Provider
      value={{
        pickupLocation,
        setPickupLocation,
        returnDifferentLocation,
        setReturnDifferentLocation,
        pickupDate,
        setPickupDate,
        dropoffDate,
        setDropoffDate,
        driverAgeValid,
        setDriverAgeValid
      }}
    >
      {children}
    </CarHireContext.Provider>
  )
}

export function useCarHire() {
  const context = useContext(CarHireContext)
  if (context === undefined) {
    throw new Error('useCarHire must be used within a CarHireProvider')
  }
  return context
}
