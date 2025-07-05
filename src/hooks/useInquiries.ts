import { useQuery } from "@tanstack/react-query"
import { getInquiries } from "../features/dashboard/api"

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

// Note: Individual inquiry fetching can be added when needed
// export const useInquiryById = (id: string) => {
//   return useQuery({
//     queryKey: ["inquiry", id],
//     queryFn: () => getInquiryById(id),
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   })
// }
