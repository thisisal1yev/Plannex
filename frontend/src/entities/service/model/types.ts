import type { BookingStatus, RatingStats } from '@shared/types'

export interface ServiceCategory {
  id: string
  name: string
}

export interface Service {
  id: string
  vendorId: string
  vendor?: { id: string; firstName: string; lastName: string }
  categoryId: string
  category?: ServiceCategory
  name: string
  description?: string
  priceFrom: number
  ratingStats?: RatingStats
  imageUrls: string[]
  city: string
  createdAt: string
}

export interface EventService {
  id: string
  eventId: string
  serviceId: string
  service?: Service
  agreedPrice: number
  status?: BookingStatus
  createdAt: string
}
