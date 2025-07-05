import type {
  Lead,
  LeadListResponse,
  LeadResponse,
  CreateLeadPayload,
  UpdateLeadPayload,
} from "@/types/lead"

// Mock data
const mockLeads: Lead[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    message: "I'm interested in viewing this property. Is it still available?",
    property: "prop1",
    propertyTitle: "Modern Downtown Apartment",
    status: "new",
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    message: "Could you provide more details about the parking situation?",
    property: "prop2",
    propertyTitle: "Family Home with Garden",
    status: "contacted",
    submittedAt: "2024-01-14T14:20:00Z",
  },
  {
    _id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 456-7890",
    message: "What are the monthly utilities typically?",
    property: "prop1",
    propertyTitle: "Modern Downtown Apartment",
    status: "converted",
    convertedToClient: "client1",
    submittedAt: "2024-01-13T09:15:00Z",
  },
  {
    _id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    message: "Interested in scheduling a viewing",
    property: "prop3",
    propertyTitle: "Luxury Penthouse",
    status: "new",
    submittedAt: "2024-01-12T16:45:00Z",
  },
  {
    _id: "5",
    name: "David Brown",
    email: "david.brown@example.com",
    phone: "+1 (555) 789-0123",
    property: "prop2",
    propertyTitle: "Family Home with Garden",
    status: "archived",
    submittedAt: "2024-01-11T11:20:00Z",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API functions
export const mockGetLeads = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  property?: string
): Promise<LeadListResponse> => {
  await delay(500) // Simulate network delay

  let filteredLeads = [...mockLeads]

  // Apply filters
  if (status) {
    filteredLeads = filteredLeads.filter((lead) => lead.status === status)
  }
  if (property) {
    filteredLeads = filteredLeads.filter((lead) => lead.property === property)
  }

  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex)

  const totalItems = filteredLeads.length
  const totalPages = Math.ceil(totalItems / limit)

  return {
    data: paginatedLeads,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
    },
  }
}

export const mockGetLeadById = async (id: string): Promise<Lead> => {
  await delay(300)

  const lead = mockLeads.find((l) => l._id === id)
  if (!lead) {
    throw new Error("Lead not found")
  }

  return lead
}

export const mockUpdateLead = async (
  id: string,
  updateData: UpdateLeadPayload
): Promise<Lead> => {
  await delay(400)

  const leadIndex = mockLeads.findIndex((l) => l._id === id)
  if (leadIndex === -1) {
    throw new Error("Lead not found")
  }

  mockLeads[leadIndex] = { ...mockLeads[leadIndex], ...updateData }
  return mockLeads[leadIndex]
}

export const mockDeleteLead = async (id: string): Promise<void> => {
  await delay(300)

  const leadIndex = mockLeads.findIndex((l) => l._id === id)
  if (leadIndex === -1) {
    throw new Error("Lead not found")
  }

  mockLeads.splice(leadIndex, 1)
}

export const mockCreateLead = async (
  leadData: CreateLeadPayload
): Promise<LeadResponse> => {
  await delay(400)

  const newLead: Lead = {
    _id: (mockLeads.length + 1).toString(),
    ...leadData,
    status: "new",
    submittedAt: new Date().toISOString(),
  }

  mockLeads.push(newLead)

  return {
    success: true,
    message: "Lead created successfully",
    data: newLead,
  }
}
