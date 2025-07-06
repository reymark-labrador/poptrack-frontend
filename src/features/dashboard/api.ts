import axios from "@/services/axios"
import type { ILead, LeadListResponse } from "@/types/lead"
import type { IProperty } from "@/types/property"

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
  date: string,
  time: string
): Promise<ILead> => {
  const res = await axios.post<ILead>(`/leads/${leadId}/convert-and-schedule`, {
    date,
    time,
  })

  return res.data
}
