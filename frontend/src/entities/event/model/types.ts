import type { EventStatus, RatingStats } from '@shared/types'
import type { User } from '../../user/model/types'
import type { Venue } from '../../venue/model/types'

export interface TicketTier {
  id: string
  eventId: string
  name: string
  price: number
  quantity: number
  sold?: number
  createdAt: string
}

export interface Event {
  [x: string]: any
  id: string
  organizerId: string
  organizer?: User
  title: string
  description?: string
  bannerUrl?: string[]
  startDate: string
  endDate: string
  eventType: string
  capacity: number
  status: EventStatus
  venueId?: string
  venue?: Venue
  ticketTiers?: TicketTier[]
  ratingStats?: RatingStats
  createdAt: string
  updatedAt: string
}
