import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Checkbox } from "@/components/ui/Checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/Select"
import { usePropertyUIStore } from "@/features/properties/store"
import { useSearchParams } from "react-router-dom"
import { filtersToUrlParams, urlParamsToFilters } from "@/utils/filterUrlSync"

const AMENITIES_OPTIONS = [
  { value: "parking", label: "Parking" },
  { value: "gym", label: "Gym" },
  { value: "pool", label: "Pool" },
  { value: "garden", label: "Garden" },
  { value: "balcony", label: "Balcony" },
  { value: "elevator", label: "Elevator" },
  { value: "air-conditioning", label: "Air Conditioning" },
  { value: "heating", label: "Heating" },
  { value: "wifi", label: "WiFi" },
  { value: "furnished", label: "Furnished" },
]

const BEDROOM_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5+", label: "5+" },
]

const BATHROOM_OPTIONS = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4+", label: "4+" },
]

const PROPERTY_TYPE_OPTIONS = [
  { value: "sale", label: "Sale" },
  { value: "rent", label: "Rent" },
]

export const PropertyFilters = () => {
  const {
    filters,
    setType,
    setLocation,
    setPriceRange,
    setBedrooms,
    setBathrooms,
    setAreaRange,
    setAmenities,
    resetFilters,
    setPage,
  } = usePropertyUIStore()

  const [searchParams, setSearchParams] = useSearchParams()
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const { filters: urlFilters, page } = urlParamsToFilters(searchParams)
    setType(urlFilters.type)
    setLocation(urlFilters.location)
    setBedrooms(urlFilters.bedrooms)
    setBathrooms(urlFilters.bathrooms)
    setPriceRange(urlFilters.minPrice, urlFilters.maxPrice)
    setAreaRange(urlFilters.minArea, urlFilters.maxArea)
    setAmenities(urlFilters.amenities)
    setPage(page)
  }, [])

  const updateAllUrlParams = (nextFilters = filters, nextPage?: number) => {
    const params = filtersToUrlParams(nextFilters, nextPage ?? 1)
    setSearchParams(params, { replace: true })
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = filters.amenities
    let newAmenities: string[]
    if (checked) {
      newAmenities = [...currentAmenities, amenity]
    } else {
      newAmenities = currentAmenities.filter((a) => a !== amenity)
    }
    setAmenities(newAmenities)
    setPage(1)
    updateAllUrlParams({ ...filters, amenities: newAmenities }, 1)
  }

  const handlePriceChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10)
    let newFilters = { ...filters }
    if (field === "min") {
      setPriceRange(numValue, filters.maxPrice)
      newFilters = { ...filters, minPrice: numValue }
    } else {
      setPriceRange(filters.minPrice, numValue)
      newFilters = { ...filters, maxPrice: numValue }
    }
    setPage(1)
    updateAllUrlParams(newFilters, 1)
  }

  const handleAreaChange = (field: "min" | "max", value: string) => {
    const numValue = value === "" ? null : parseInt(value, 10)
    let newFilters = { ...filters }
    if (field === "min") {
      setAreaRange(numValue, filters.maxArea)
      newFilters = { ...filters, minArea: numValue }
    } else {
      setAreaRange(filters.minArea, numValue)
      newFilters = { ...filters, maxArea: numValue }
    }
    setPage(1)
    updateAllUrlParams(newFilters, 1)
  }

  const handleBedroomsChange = (value: string) => {
    const numValue = value === "any" ? null : parseInt(value, 10)
    setBedrooms(numValue)
    setPage(1)
    updateAllUrlParams({ ...filters, bedrooms: numValue }, 1)
  }

  const handleBathroomsChange = (value: string) => {
    const numValue = value === "any" ? null : parseInt(value, 10)
    setBathrooms(numValue)
    setPage(1)
    updateAllUrlParams({ ...filters, bathrooms: numValue }, 1)
  }

  const handleTypeChange = (value: string) => {
    const typeValue = value === "all" ? null : (value as "sale" | "rent")
    setType(typeValue)
    setPage(1)
    updateAllUrlParams({ ...filters, type: typeValue }, 1)
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    setPage(1)
    updateAllUrlParams({ ...filters, location: value }, 1)
  }

  const handleReset = () => {
    resetFilters()
    setPage(1)
    updateAllUrlParams(
      {
        type: null,
        city: "",
        location: "",
        minPrice: null,
        maxPrice: null,
        bedrooms: null,
        bathrooms: null,
        minArea: null,
        maxArea: null,
        amenities: [],
      },
      1
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide" : "Show"} Advanced
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Location */}
          <div>
            <Input
              placeholder="Search by location..."
              value={filters.location}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Property Type */}
          <div>
            <Select
              value={filters.type || PROPERTY_TYPE_OPTIONS[0].value}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  {PROPERTY_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Bedrooms */}
          <div>
            <Select
              value={filters.bedrooms?.toString()}
              onValueChange={handleBedroomsChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bedrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bedrooms</SelectLabel>
                  {BEDROOM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Bathrooms */}
          <div>
            <Select
              value={filters.bathrooms?.toString()}
              onValueChange={handleBathroomsChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Bathrooms" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bathrooms</SelectLabel>
                  {BATHROOM_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice || ""}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Area Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  type="number"
                  placeholder="Min Area (sq ft)"
                  value={filters.minArea || ""}
                  onChange={(e) => handleAreaChange("min", e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max Area (sq ft)"
                  value={filters.maxArea || ""}
                  onChange={(e) => handleAreaChange("max", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Amenities
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <Checkbox
                    key={amenity.value}
                    id={amenity.value}
                    checked={filters.amenities.includes(amenity.value)}
                    onChange={(e) =>
                      handleAmenityChange(amenity.value, e.target.checked)
                    }
                    label={amenity.label}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
