export type Optinal<T> = T | undefined | null

export interface BaseRecord {
  id: number
  createdAt: string
  updatedAt?: string
}

export interface BaseResponse<T> {
  message: string
  code: number
  status: string
  result: T
}

export interface ListResponse<T> {
  count: number
  records: T[]
}

export interface PaginationRequest {
  limit: number
  offset?: number
}
