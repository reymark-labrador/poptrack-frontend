import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"
import type { ViewingStatus } from "@/types/viewing"

export interface ViewingFilters {
  status: ViewingStatus | "all"
  date?: string
  searchTerm?: string
}

interface ViewingUIState {
  filters: ViewingFilters
  setStatus: (status: ViewingStatus | "all") => void
  setDate: (date?: string) => void
  setSearchTerm: (searchTerm?: string) => void
  resetFilters: () => void
}

interface PaginationState {
  page: number
  limit: number
  setPage: (page: number) => void
}

const defaultFilters: ViewingFilters = {
  status: "all",
  date: undefined,
  searchTerm: "",
}

export const useViewingUIStore = create<ViewingUIState & PaginationState>()(
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

        setDate: (date) =>
          set((state) => {
            state.filters.date = date
          }),

        setSearchTerm: (searchTerm) =>
          set((state) => {
            state.filters.searchTerm = searchTerm
          }),

        resetFilters: () =>
          set(() => ({
            filters: defaultFilters,
          })),
      })),
      {
        name: "viewing-ui-filters",
      }
    )
  )
)
