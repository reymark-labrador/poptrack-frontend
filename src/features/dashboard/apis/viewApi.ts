import axios from "@/services/axios"
import type { ViewingFilters } from "@/stores/useViewingUIStore"
import type { ViewingListResponse, ViewingStatus } from "@/types/viewing"

export const getViewings = async (
  filters: ViewingFilters,
  page: number,
  limit: number
): Promise<ViewingListResponse> => {
  const params: Record<string, string | number | string[]> = {
    page,
    limit,
  }

  if (filters.status && filters.status !== "all") {
    params.status = filters.status
  }
  if (filters.date) {
    params.date = filters.date
  }
  if (filters.searchTerm) {
    params.search = filters.searchTerm
  }

  const res = await axios.get<ViewingListResponse>("/viewings", {
    params,
  })
  return res.data
}

export const updateViewingStatus = async (
  viewingId: string,
  status: ViewingStatus,
  note?: string
): Promise<{ success: boolean; message?: string }> => {
  const payload: { status: ViewingStatus; notes?: string } = {
    status,
  }

  if (note !== undefined) {
    payload.notes = note
  }

  const res = await axios.patch(`/viewings/${viewingId}`, payload)

  return res.data
}
