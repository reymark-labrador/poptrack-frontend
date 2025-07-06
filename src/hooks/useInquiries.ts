import {
  getInquiries,
  scheduleInquery,
} from "@/features/dashboard/apis/inquery"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface UseInquiriesOptions {
  page?: number
  limit?: number
}

export const useInquiries = (options: UseInquiriesOptions = {}) => {
  const { page = 1, limit = 10 } = options

  return useQuery({
    queryKey: ["inquiries", page, limit],
    queryFn: () => getInquiries(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useScheduleInquiry = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      leadId,
      date,
      time,
    }: {
      leadId: string
      date: string
      time: string
    }) => scheduleInquery(leadId, date, time),
    onSuccess: () => {
      // Invalidate and refetch inquiries to update the table
      queryClient.invalidateQueries({ queryKey: ["inquiries"] })
    },
  })
}

// Note: Individual inquiry fetching can be added when needed
// export const useInquiryById = (id: string) => {
//   return useQuery({
//     queryKey: ["inquiry", id],
//     queryFn: () => getInquiryById(id),
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   })
// }
