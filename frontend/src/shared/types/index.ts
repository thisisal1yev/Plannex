// ─── Enums ───────────────────────────────────────────────────────────────────

export type Role = 'ORGANIZER' | 'PARTICIPANT' | 'ADMIN' | 'VENDOR' | 'VOLUNTEER'
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type ServiceCategory = 'CATERING' | 'DECORATION' | 'SOUND' | 'PHOTO' | 'SECURITY'
export type PaymentProvider = 'CLICK' | 'PAYME'
export type VolunteerStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

export interface AuthUser {
  id: string
  email: string
  role: Role
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
