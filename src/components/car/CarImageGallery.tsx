'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { cn } from '@/lib/utils'

interface CarImageGalleryProps {
  images: string[]
  carName: string
  currentImageIndex: number
  setCurrentImageIndex: (index: number) => void
  isLightboxOpen: boolean
  setIsLightboxOpen: (open: boolean) => void
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
}

export function CarImageGallery({
  images,
  carName,
  currentImageIndex,
  setCurrentImageIndex,
  isLightboxOpen,
  setIsLightboxOpen,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}: CarImageGalleryProps) {
  return (
    <div className="lg:flex-1 md:mr-2 mx-4 md:mx-0 mt-4 md:mt-0">
      <div 
        className="relative h-72 md:h-[70vh] group rounded-xl overflow-hidden shadow-xl border border-zinc-700/40"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 z-10"></div>
        <Image
          src={images[currentImageIndex]}
          alt={`${carName} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-600/50 hover:bg-teal-500/80 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-zinc-600/50 hover:bg-teal-500/80 z-20"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                index === currentImageIndex ? "bg-teal-400 scale-110" : "bg-white/60 hover:bg-white/80"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>
      </div>

      <Dialog.Root open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-zinc-900/95 backdrop-blur-sm z-50" />
          <Dialog.Content 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Dialog.Title asChild>
              <VisuallyHidden>
                {carName} - Image {currentImageIndex + 1} of {images.length}
              </VisuallyHidden>
            </Dialog.Title>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none"></div>
              <Image
                src={images[currentImageIndex]}
                alt={`${carName} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700/50 text-white text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
              <button
                className="absolute top-4 right-4 text-white p-2.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 hover:bg-teal-500/80 transition-colors"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-800/80 text-white p-3 rounded-full hover:bg-teal-500/80 transition-colors border border-zinc-700/50"
                    onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-800/80 text-white p-3 rounded-full hover:bg-teal-500/80 transition-colors border border-zinc-700/50"
                    onClick={() => setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2.5 h-2.5 rounded-full transition-all",
                      index === currentImageIndex ? "bg-teal-400 scale-110" : "bg-white/60 hover:bg-white/80"
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
