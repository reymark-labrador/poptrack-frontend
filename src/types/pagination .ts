export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}
