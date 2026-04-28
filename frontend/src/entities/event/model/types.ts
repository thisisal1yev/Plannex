import type { EventStatus, RatingStats } from '@shared/types'
import type { User } from '../../user/model/types'
import type { Venue } from '../../venue/model/types'
import type { EventService } from '../../service/model/types'

export interface TicketTier {
  id: string
  eventId: string
  name: string
  price: number
  quantity: number
  _count?: { tickets: number }
  createdAt: string
}

export interface Event {
  [x: string]: any
  id: string
  organizerId: string
  organizer?: User
  title: string
  description?: string
  bannerUrls?: string[]
  startDate: string
  endDate: string
  eventType: string
  capacity: number
  status: EventStatus
  squareId?: string   // was venueId
  venue?: Venue
  ticketTiers?: TicketTier[]
  eventServices?: EventService[]
  ratingStats?: RatingStats
  createdAt: string
  updatedAt: string
}
