import { useQuery } from "@tanstack/react-query"
import { useViewingUIStore } from "@/stores/useViewingUIStore"
import { useMemo } from "react"
import { getViewings } from "@/features/dashboard/apis/viewApi"

export const useViewings = () => {
  const filters = useViewingUIStore((state) => state.filters)
  const page = useViewingUIStore((state) => state.page)
  const limit = useViewingUIStore((state) => state.limit)

  const debouncedFilters = useMemo(() => {
    return {
      ...filters,
    }
  }, [filters])

  return useQuery({
    queryKey: ["viewings", debouncedFilters, page, limit],
    queryFn: () => getViewings(debouncedFilters, page, limit),
    staleTime: 5 * 60 * 1000,
  })
}
