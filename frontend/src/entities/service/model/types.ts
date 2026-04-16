import type { BookingStatus, RatingStats } from '@shared/types'

export interface ServiceCategory {
  id: string
  name: string
}

export interface Service {
  id: string
  vendorId: string
  categoryId: string          // UUID (was: category: ServiceCategory enum)
  category?: ServiceCategory  // included only if backend adds include: { category: true }
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
  status: BookingStatus
  agreedPrice: number
  createdAt: string
}
