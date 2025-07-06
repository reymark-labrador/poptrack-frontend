import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox"

import type { IProperty } from "@/types/property"
import { getPropertyById, updateProperty } from "../apis/propertyApi"

const EditPropertyPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [property, setProperty] = useState<IProperty | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    type: "sale" as "rent" | "sale",
    city: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    images: [] as string[],
    amenities: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const amenityOptions = [
    "Parking",
    "Garden",
    "Balcony",
    "Air Conditioning",
    "Heating",
    "Furnished",
    "Pet Friendly",
    "Gym",
    "Pool",
    "Security",
  ]

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return

      try {
        const propertyData = await getPropertyById(id)
        setProperty(propertyData)
        setFormData({
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price.toString(),
          type: propertyData.type,
          city: propertyData.location.city,
          address: propertyData.location.address || "",
          bedrooms: propertyData.bedrooms?.toString() || "",
          bathrooms: propertyData.bathrooms?.toString() || "",
          area: propertyData.area?.toString() || "",
          images: propertyData.images,
          amenities: propertyData.amenities,
        })
      } catch (error) {
        console.error("Error loading property:", error)
        setErrors({ load: "Failed to load property. Please try again." })
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadProperty()
  }, [id])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, amenity]
        : prev.amenities.filter((a) => a !== amenity),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required"
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }
    if (!formData.bedrooms || parseInt(formData.bedrooms) < 0) {
      newErrors.bedrooms = "Valid number of bedrooms is required"
    }
    if (!formData.bathrooms || parseInt(formData.bathrooms) < 0) {
      newErrors.bathrooms = "Valid number of bathrooms is required"
    }
    if (!formData.area || parseFloat(formData.area) <= 0) {
      newErrors.area = "Valid area is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !id) {
      return
    }

    setIsLoading(true)
    try {
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        type: formData.type,
        location: {
          city: formData.city.trim(),
          address: formData.address.trim() || undefined,
        },
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        images: formData.images,
        amenities: formData.amenities,
      }

      await updateProperty(id, propertyData)

      // Invalidate and refetch dashboard properties queries to update the list
      await queryClient.invalidateQueries({
        queryKey: ["dashboard-properties"],
      })

      navigate("/dashboard/properties")
    } catch (error) {
      console.error("Error updating property:", error)
      setErrors({ submit: "Failed to update property. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading property...</p>
        </div>
      </div>
    )
  }

  if (errors.load) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-8 text-red-600">
          <p>{errors.load}</p>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/properties")}
            className="mt-4"
          >
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-8 text-red-600">
          <p>Property not found.</p>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/properties")}
            className="mt-4"
          >
            Back to Properties
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/properties")}
        >
          Back to Properties
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter property title"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: value as "rent" | "sale",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <Input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter address (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <Input
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleInputChange}
                placeholder="Number of bedrooms"
                className={errors.bedrooms ? "border-red-500" : ""}
              />
              {errors.bedrooms && (
                <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <Input
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="Number of bathrooms"
                className={errors.bathrooms ? "border-red-500" : ""}
              />
              {errors.bathrooms && (
                <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (sq ft) *
              </label>
              <Input
                name="area"
                type="number"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Property area in sq ft"
                className={errors.area ? "border-red-500" : ""}
              />
              {errors.area && (
                <p className="text-red-500 text-sm mt-1">{errors.area}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter property description"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {amenityOptions.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) =>
                      handleAmenityChange(amenity, e.target.checked)
                    }
                  />
                  <label
                    htmlFor={amenity}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/properties")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Property"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPropertyPage
