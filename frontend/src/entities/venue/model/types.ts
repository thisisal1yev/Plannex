import type { BookingStatus, RatingStats } from '@shared/types'

export interface Venue {
  id: string
  ownerId: string
  name: string
  description?: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  capacity: number
  pricePerDay: number
  isIndoor: boolean
  hasWifi: boolean
  hasParking: boolean
  hasSound: boolean
  hasStage: boolean
  imageUrls: string[]
  ratingStats?: RatingStats
  createdAt: string
}

export interface VenueBooking {
  id: string
  venueId: string
  venue?: Venue
  eventId: string
  userId: string
  startDate: string
  endDate: string
  status: BookingStatus
  totalCost: number
  createdAt: string
}
