import type { BookingStatus, RatingStats } from '@shared/types'

export interface SquareCategory {
  id: string
  name: string
}

export interface Venue {
  id: string
  ownerId: string
  categoryId: string
  category?: SquareCategory
  owner?: { id: string; firstName: string; lastName: string }
  name: string
  description?: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  capacity: number
  pricePerDay: number
  characteristics?: { id: string; name: string }[]
  imageUrls: string[]
  ratingStats?: RatingStats
  createdAt: string
}

export interface VenueBooking {
  id: string
  squareId: string
  venue?: Venue
  eventServiceId?: string
  userId: string
  startDate: string
  endDate: string
  status: BookingStatus
  totalCost: number
  createdAt: string
}
