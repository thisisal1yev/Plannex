export interface AdminPendingEvent {
  id: string
  title: string
  eventType: string
  bannerUrls: string[]
  startDate: string
  status: string
  organizer: { firstName: string; lastName: string }
}

export interface AdminStats {
  totalUsers: number
  totalEvents: number
  pendingEvents: number
  totalRevenue: number
  weeklyGrowth: { week: string; users: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
  recentPendingEvents: AdminPendingEvent[]
}

export interface DashboardStats {
  organizerId: string
  totalEvents: number
  publishedEvents: number
  totalTicketsSold: number
  totalRevenue: number
  totalCommission: number
  upcomingEvents: number
}

export interface TierStats {
  tierId: string
  name: string
  price: number
  quantity: number
  sold: number
  revenue: number
}

export interface EventStats {
  eventId: string
  title: string
  totalTickets: number
  soldTickets: number
  totalRevenue: number
  platformCommission: number
  attendanceRate: number
  tierBreakdown: TierStats[]
}
