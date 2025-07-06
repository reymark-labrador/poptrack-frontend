import axios from "@/services/axios"
import type { PropertyListResponse, IProperty } from "@/types/property"
import type { PropertyFilters } from "../../stores/usePropertyUIStore"
import type { CreateLeadPayload, LeadResponse } from "@/types/lead"

export const getFilteredProperties = async (
  filters: PropertyFilters,
  page: number,
  limit: number
): Promise<PropertyListResponse> => {
  const params: Record<string, string | number | string[]> = {
    page,
    limit,
  }

  if (filters.type) params.type = filters.type
  if (filters.location) {
    params.location = filters.location
  } else if (filters.city) {
    params.city = filters.city
  }
  if (filters.minPrice) params.minPrice = filters.minPrice
  if (filters.maxPrice) params.maxPrice = filters.maxPrice
  if (filters.bedrooms) params.bedrooms = filters.bedrooms
  if (filters.bathrooms) params.bathrooms = filters.bathrooms
  if (filters.minArea) params.minArea = filters.minArea
  if (filters.maxArea) params.maxArea = filters.maxArea
  if (filters.amenities.length > 0)
    params.amenities = filters.amenities.join(",")

  const res = await axios.get<PropertyListResponse>("/frontend/properties", {
    params,
  })
  return res.data
}

export const getPropertyById = async (id: string): Promise<IProperty> => {
  const res = await axios.get<IProperty>(`/frontend/properties/${id}`)
  return res.data
}

export const createLead = async (
  payload: CreateLeadPayload
): Promise<LeadResponse> => {
  const res = await axios.post<LeadResponse>("/leads", payload)
  return res.data
}
