import type { PaymentStatus, PaymentProvider } from '@shared/types'
import type { TicketTier, Event } from '../../event/model/types'
import type { User } from '../../user/model/types'

export interface TicketPayment {
  id: string
  userId: string
  ticketId: string
  amount: number
  commission: number
  provider: PaymentProvider
  providerTxId?: string
  status: PaymentStatus
  createdAt: string
}

export interface Ticket {
  id: string
  userId: string
  user?: User
  eventId: string
  event?: Event
  tierId: string
  tier?: TicketTier
  qrCode: string
  isUsed: boolean
  payment?: TicketPayment
  createdAt: string
}
