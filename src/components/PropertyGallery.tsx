import { useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

const IMAGE_PLACEHOLDER =
  "https://placehold.co/600x400?text=No+Photo&font=roboto"

export const PropertyGallery = ({ images, title }: PropertyGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use placeholder if no images, otherwise use provided images
  const displayImages = images.length > 0 ? images : [IMAGE_PLACEHOLDER]

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    )
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      {/* Main Gallery */}
      <div className="relative group">
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            // src={displayImages[currentImageIndex]}
            src={IMAGE_PLACEHOLDER}
            alt={`${title} - Image ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={openModal}
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {displayImages.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex
                    ? "border-primary"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  //   src={image}
                  src={IMAGE_PLACEHOLDER}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Image */}
            <div className="relative">
              <img
                // src={displayImages[currentImageIndex]}
                src={IMAGE_PLACEHOLDER}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {/* Modal Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Modal Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {currentImageIndex + 1} / {displayImages.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
