import type { Iclient } from "./client"
import type { PaginationMeta } from "./pagination "
import type { IProperty } from "./property"

export type ViewingStatus = "scheduled" | "completed" | "no-show" | "cancelled"

export interface IViewing {
  _id: string
  client: Iclient
  property: IProperty
  status: ViewingStatus
  scheduledAt: string
  notes?: string
  createdAt: string
  updatedAt?: string
}

export interface ViewingResponse {
  success: boolean
  message?: string
  data: IViewing
  pagination: PaginationMeta
}

export interface ViewingListResponse {
  success: boolean
  message?: string
  data: IViewing[]
  pagination: PaginationMeta
}
