import type { PropertyFilters } from "@/features/properties/store"

export function filtersToUrlParams(filters: PropertyFilters, page: number) {
  const params: Record<string, string> = {}
  if (filters.type) params.type = filters.type
  if (filters.city) params.city = filters.city
  if (filters.location) params.location = filters.location
  if (filters.minPrice !== null) params.minPrice = String(filters.minPrice)
  if (filters.maxPrice !== null) params.maxPrice = String(filters.maxPrice)
  if (filters.bedrooms !== null) params.bedrooms = String(filters.bedrooms)
  if (filters.bathrooms !== null) params.bathrooms = String(filters.bathrooms)
  if (filters.minArea !== null) params.minArea = String(filters.minArea)
  if (filters.maxArea !== null) params.maxArea = String(filters.maxArea)
  if (filters.amenities.length > 0)
    params.amenities = filters.amenities.join(",")
  if (page && page > 1) params.page = String(page)
  return params
}

export function urlParamsToFilters(params: URLSearchParams) {
  const filters: PropertyFilters = {
    type: params.get("type") as "rent" | "sale" | null,
    city: params.get("city") || "",
    location: params.get("location") || "",
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : null,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : null,
    bedrooms: params.get("bedrooms") ? Number(params.get("bedrooms")) : null,
    bathrooms: params.get("bathrooms") ? Number(params.get("bathrooms")) : null,
    minArea: params.get("minArea") ? Number(params.get("minArea")) : null,
    maxArea: params.get("maxArea") ? Number(params.get("maxArea")) : null,
    amenities: params.get("amenities")
      ? params.get("amenities")!.split(",")
      : [],
  }
  const page = params.get("page") ? Number(params.get("page")) : 1
  return { filters, page }
}
