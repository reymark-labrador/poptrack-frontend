export interface CreateLeadPayload {
  name: string
  email: string
  phone: string
  message: string
  property: string
}

export interface LeadResponse {
  success: boolean
  message?: string
  data: {
    _id: string
    name: string
    email: string
    phone: string
    message: string
    propertyId: string
    createdAt: string
  }
}
