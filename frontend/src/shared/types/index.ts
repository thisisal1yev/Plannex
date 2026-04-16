// ─── Enums ───────────────────────────────────────────────────────────────────

export type Role = 'ORGANIZER' | 'PARTICIPANT' | 'ADMIN' | 'VENDOR' | 'VOLUNTEER'
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type PaymentProvider = 'CLICK' | 'PAYME'
export type VolunteerStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface RatingStats {
  id: string
  squareId?: string   // was venueId
  serviceId?: string
  avg: number
  count: number
  one: number
  two: number
  three: number
  four: number
  five: number
}

export interface AuthUser {
  id: string
  email: string
  roles: Role[]
  activeRole: Role
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}
