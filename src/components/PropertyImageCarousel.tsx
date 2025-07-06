import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface PropertyImageCarouselProps {
  images: string[]
  title: string
  className?: string
}

const PropertyImageCarousel = ({
  images,
  title,
  className = "",
}: PropertyImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use placeholder images for now, but structure for real images
  const displayImages =
    images && images.length > 0
      ? images
      : ["https://placehold.co/600x400?text=No+Photo&font=roboto"]

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    )
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className={`relative group max-h-80 ${className}`}>
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-t-none h-full">
        <img
          src={displayImages[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                prevImage()
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                nextImage()
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Image Counter */}
      {displayImages.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {displayImages.length}
        </div>
      )}

      {/* Dots Indicator */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {displayImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToImage(index)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PropertyImageCarousel
