import { useQuery } from "@tanstack/react-query"
import { getDashboardProperties } from "../features/dashboard/api"
import { usePropertyUIStore } from "@/stores/usePropertyUIStore"
import { useMemo } from "react"

export const useDashboardProperties = () => {
  const filters = usePropertyUIStore((state) => state.filters)
  const page = usePropertyUIStore((state) => state.page)
  const limit = usePropertyUIStore((state) => state.limit)

  const debouncedFilters = useMemo(() => {
    return {
      ...filters,
      location: filters.searchTerm?.trim(),
    }
  }, [filters])

  return useQuery({
    queryKey: ["dashboard-properties", debouncedFilters, page, limit],
    queryFn: () => getDashboardProperties(debouncedFilters, page, limit),
    staleTime: 5 * 60 * 1000,
  })
}
