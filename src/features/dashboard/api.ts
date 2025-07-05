import axios from "@/services/axios"
import type { PropertyFilters } from "@/stores/usePropertyUIStore"
import type { ILead, LeadListResponse } from "@/types/lead"
import type { IProperty, PropertyListResponse } from "@/types/property"

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
  if (filters.showArchived) params.archived = "true"

  const res = await axios.get<PropertyListResponse>("/properties", {
    params,
  })
  return res.data
}

export const createProperty = async (
  propertyData: Omit<IProperty, "_id">
): Promise<IProperty> => {
  const res = await axios.post<IProperty>("/properties", propertyData)
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

export const getInquiries = async (
  page: number,
  limit: number
): Promise<LeadListResponse> => {
  const params: Record<string, string | number | string[]> = {
    page,
    limit,
  }

  const res = await axios.get<LeadListResponse>("/leads", {
    params,
  })

  return res.data
}

export const scheduleInquery = async (
  leadId: string,
  scheduledAt: Date
): Promise<ILead> => {
  const res = await axios.post<ILead>(`/leads/${leadId}/convert-and-schedule`, {
    scheduledAt,
  })

  return res.data
}
