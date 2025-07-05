import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { getFilteredProperties, getPropertyById } from "./api"
import { usePropertyUIStore } from "./store"

export const useFilteredProperties = () => {
  const filters = usePropertyUIStore((state) => state.filters)
  const page = usePropertyUIStore((state) => state.page)
  const limit = usePropertyUIStore((state) => state.limit)

  const debouncedFilters = useMemo(() => {
    return {
      ...filters,
      location: filters.location?.trim(),
    }
  }, [filters])

  return useQuery({
    queryKey: ["properties", debouncedFilters, page, limit],
    queryFn: () => getFilteredProperties(debouncedFilters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  })
}

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}
