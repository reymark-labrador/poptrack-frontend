import type { IProperty } from "./property"

export interface CreateLeadPayload {
  name: string
  email: string
  phone?: string
  message?: string
  property: string
}

export interface ILead {
  _id: string
  name: string
  email: string
  phone?: string
  message?: string
  property: IProperty
  status: "new" | "contacted" | "converted" | "archived"
  convertedToClient?: string
  submittedAt: string
}

export interface LeadListResponse {
  data: ILead[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface LeadResponse {
  success: boolean
  message?: string
  data: Lead
}

export interface UpdateLeadPayload {
  status?: "new" | "contacted" | "converted" | "archived"
  convertedToClient?: string
}
