import type { PaginationMeta } from "./pagination "

export interface IProperty {
  _id: string
  title: string
  description: string
  price: number
  type: "rent" | "sale"
  location: {
    city: string
    address?: string
  }
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  amenities: string[]
  isArchived?: boolean
}

export interface PropertyListResponse {
  success: boolean
  message?: string
  data: IProperty[]
  pagination: PaginationMeta
}
