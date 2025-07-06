import { useState, useRef } from "react"
import { Button } from "@/components/ui/Button"
import { X, Upload, Image as ImageIcon } from "lucide-react"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

const ImageUpload = ({
  images,
  onImagesChange,
  maxImages = 10,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    )
    const remainingSlots = maxImages - images.length
    const filesToProcess = validFiles.slice(0, remainingSlots)

    if (filesToProcess.length === 0) return

    console.log(`Processing ${filesToProcess.length} images...`)
    setIsProcessing(true)

    // Generate random image URLs instead of reading files
    const newImages: string[] = []

    filesToProcess.forEach((file) => {
      // Generate a random image URL
      const randomId = Math.random().toString(36).substring(2, 15)
      const imageUrl = `https://picsum.photos/800/600?random=${randomId}&filename=${file.name}`
      newImages.push(imageUrl)
    })

    // Simulate processing delay
    setTimeout(() => {
      console.log(
        `Generated ${newImages.length} random image URLs, updating state...`
      )
      onImagesChange([...images, ...newImages])
      setIsProcessing(false)
    }, 500)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                {isProcessing
                  ? "Processing images..."
                  : "Drag and drop images here, or "}
                {!isProcessing && (
                  <button
                    type="button"
                    onClick={openFileDialog}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    browse
                  </button>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF, WebP
              </p>
              <p className="text-xs text-gray-500">
                {images.length} of {maxImages} images selected
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Note: Random placeholder images will be generated for demo
                purposes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selected Images ({images.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add More Button */}
      {images.length > 0 && images.length < maxImages && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={openFileDialog}
            className="flex items-center space-x-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Add More Images</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
