import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export interface InquiryFilters {
  status: "all" | "new" | "contacted" | "converted"
  searchTerm?: string
  dateFrom?: string
  dateTo?: string
}

interface InquiryUIState {
  filters: InquiryFilters
  setStatus: (status: InquiryFilters["status"]) => void
  setSearchTerm: (searchTerm?: string) => void
  setDateRange: (from?: string, to?: string) => void
  resetFilters: () => void
}

interface PaginationState {
  page: number
  limit: number
  setPage: (page: number) => void
}

const defaultFilters: InquiryFilters = {
  status: "all",
  searchTerm: "",
  dateFrom: "",
  dateTo: "",
}

export const useInquiryUIStore = create<InquiryUIState & PaginationState>()(
  devtools(
    persist(
      immer((set) => ({
        filters: defaultFilters,
        page: 1,
        limit: 10,
        setPage: (page) =>
          set((state) => {
            state.page = page
          }),

        setStatus: (status) =>
          set((state) => {
            state.filters.status = status
          }),

        setSearchTerm: (searchTerm) =>
          set((state) => {
            state.filters.searchTerm = searchTerm
          }),

        setDateRange: (from, to) =>
          set((state) => {
            state.filters.dateFrom = from
            state.filters.dateTo = to
          }),

        resetFilters: () =>
          set(() => ({
            filters: defaultFilters,
          })),
      })),
      {
        name: "inquiry-ui-filters",
      }
    )
  )
)
