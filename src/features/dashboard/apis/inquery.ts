import axios from "@/services/axios"
import type { ILead, LeadListResponse } from "@/types/lead"

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
