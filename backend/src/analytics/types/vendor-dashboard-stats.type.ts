export type VendorDashboardStats = {
  totalVenues: number
  totalServices: number
  totalRevenue: number
  avgRating: number
  pendingBookingsCount: number
  monthlyRevenue: { month: string; revenue: number }[]
  recentPendingBookings: {
    id: string
    type: 'VENUE' | 'SERVICE'
    itemName: string
    totalCost: number
    startDate: string | null
    endDate: string | null
  }[]
  recentConfirmedBookings: {
    id: string
    type: 'VENUE' | 'SERVICE'
    itemName: string
    totalCost: number
    startDate: string | null
    endDate: string | null
  }[]
}
