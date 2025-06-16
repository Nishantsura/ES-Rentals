'use client'

import { Card, CardContent } from '@/components/ui/card'

interface CarLocationProps {
  location: {
    name: string
  }
  selectedDate: string
}

export function CarLocation({ location, selectedDate }: CarLocationProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-3">Location</h2>
      <Card>
        <CardContent className="p-4">
          <p className="font-medium">{location.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Available for pickup
          </p>
          {selectedDate && (
            <p className="text-sm text-primary mt-2">
              Scheduled for {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
