import { Card, CardContent } from "./card"
import { Skeleton } from "./skeleton"

export function CardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="h-48 rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    </div>
  )
}

export function CarDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20 bg-background border-b">
        <div className="flex items-center justify-between h-12 px-4 pt-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="px-4 py-2">
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <Skeleton className="h-72 w-full" />
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )
}

export function SearchResultsSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function BrandDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-16 h-16 rounded-lg" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
