'use client'

import { Gauge, Power, Fuel, CarFront } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CarDetailsGridProps {
  engineCapacity: string
  power: string
  fuelType: string
  type: string
}

export function CarDetailsGrid({
  engineCapacity,
  power,
  fuelType,
  type
}: CarDetailsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      <Card className="shadow-lg border-zinc-700/50 bg-zinc-800/80 hover:border-teal-500/40 transition-colors">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-2.5 rounded-full bg-teal-500/20">
            <Gauge className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Engine</p>
            <p className="font-semibold text-white">{engineCapacity ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-zinc-700/50 bg-zinc-800/80 hover:border-teal-500/40 transition-colors">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-2.5 rounded-full bg-teal-500/20">
            <Power className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Power</p>
            <p className="font-semibold text-white">{power ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-zinc-700/50 bg-zinc-800/80 hover:border-teal-500/40 transition-colors">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-2.5 rounded-full bg-teal-500/20">
            <Fuel className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Fuel Type</p>
            <p className="font-semibold text-white">{fuelType ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-lg border-zinc-700/50 bg-zinc-800/80 hover:border-teal-500/40 transition-colors">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="p-2.5 rounded-full bg-teal-500/20">
            <CarFront className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm text-zinc-400 font-medium">Type</p>
            <p className="font-semibold text-white">{type ?? 'N/A'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
