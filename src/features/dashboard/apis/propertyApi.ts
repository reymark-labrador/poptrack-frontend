import axios from "@/services/axios"
import type { PropertyFilters } from "@/stores/usePropertyUIStore"
import type { IProperty, PropertyListResponse } from "@/types/property"

export const createProperty = async (
  propertyData: Omit<IProperty, "_id">
): Promise<IProperty> => {
  const res = await axios.post<IProperty>("/properties", propertyData)
  return res.data
}

export const getDashboardProperties = async (
  filters: PropertyFilters,
  page: number,
  limit: number
): Promise<PropertyListResponse> => {
  const params: Record<string, string | number | string[]> = {
    page,
    limit,
  }

  if (filters.type) params.type = filters.type
  if (filters.searchTerm) {
    params.searchTerm = filters.searchTerm
  }
  if (filters.minPrice) params.minPrice = filters.minPrice
  if (filters.maxPrice) params.maxPrice = filters.maxPrice
  if (filters.bedrooms) params.bedrooms = filters.bedrooms
  if (filters.bathrooms) params.bathrooms = filters.bathrooms
  if (filters.minArea) params.minArea = filters.minArea
  if (filters.maxArea) params.maxArea = filters.maxArea
  if (filters.amenities.length > 0)
    params.amenities = filters.amenities.join(",")
  if (filters.showArchived) params.archived = "true"

  const res = await axios.get<PropertyListResponse>("/properties", {
    params,
  })
  return res.data
}

export const getPropertyById = async (id: string): Promise<IProperty> => {
  const res = await axios.get<IProperty>(`/properties/${id}`)
  return res.data
}

export const updateProperty = async (
  id: string,
  propertyData: Omit<IProperty, "_id">
): Promise<IProperty> => {
  const res = await axios.put<IProperty>(`/properties/${id}`, propertyData)
  return res.data
}

export const deleteProperty = async (id: string): Promise<void> => {
  await axios.delete(`/properties/${id}`)
}

export const archiveProperty = async (id: string): Promise<IProperty> => {
  const res = await axios.patch<IProperty>(`/properties/${id}/archive`)
  return res.data
}

export const unarchiveProperty = async (id: string): Promise<IProperty> => {
  const res = await axios.patch<IProperty>(`/properties/${id}/unarchive`)
  return res.data
}
