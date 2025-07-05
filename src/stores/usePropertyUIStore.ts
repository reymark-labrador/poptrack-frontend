import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

export type PropertyType = "rent" | "sale" | null

export interface PropertyFilters {
  type: PropertyType
  city: string
  location?: string
  searchTerm?: string
  minPrice: number | null
  maxPrice: number | null
  bedrooms: number | null
  bathrooms: number | null
  minArea: number | null
  maxArea: number | null
  amenities: string[]
  showArchived?: boolean
}

interface PropertyUIState {
  filters: PropertyFilters

  setType: (type: PropertyType) => void
  setCity: (city: string) => void
  setLocation: (location?: string) => void
  setSearchTerm: (searchTerm?: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setBedrooms: (value: number | null) => void
  setBathrooms: (value: number | null) => void
  setAreaRange: (min: number | null, max: number | null) => void
  setAmenities: (items: string[]) => void
  setShowArchived: (show: boolean) => void
  resetFilters: () => void
}

interface PaginationState {
  page: number
  limit: number
  setPage: (page: number) => void
}

const defaultFilters: PropertyFilters = {
  type: null,
  city: "",
  location: "",
  searchTerm: "",
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
  bathrooms: null,
  minArea: null,
  maxArea: null,
  amenities: [],
  showArchived: false,
}

export const usePropertyUIStore = create<PropertyUIState & PaginationState>()(
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

        setType: (type) =>
          set((state) => {
            state.filters.type = type
          }),

        setCity: (city) =>
          set((state) => {
            state.filters.city = city
          }),

        setLocation: (location) =>
          set((state) => {
            state.filters.location = location
          }),

        setSearchTerm: (searchTerm) =>
          set((state) => {
            state.filters.searchTerm = searchTerm
          }),

        setPriceRange: (min, max) =>
          set((state) => {
            state.filters.minPrice = min
            state.filters.maxPrice = max
          }),

        setBedrooms: (value) =>
          set((state) => {
            state.filters.bedrooms = value
          }),

        setBathrooms: (value) =>
          set((state) => {
            state.filters.bathrooms = value
          }),

        setAreaRange: (min, max) =>
          set((state) => {
            state.filters.minArea = min
            state.filters.maxArea = max
          }),

        setAmenities: (items) =>
          set((state) => {
            state.filters.amenities = items
          }),

        setShowArchived: (show) =>
          set((state) => {
            state.filters.showArchived = show
          }),

        resetFilters: () =>
          set(() => ({
            filters: defaultFilters,
          })),
      })),
      {
        name: "property-ui-filters",
      }
    )
  )
)
