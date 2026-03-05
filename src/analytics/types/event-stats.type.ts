export interface EventStats {
  eventId: string;
  title: string;
  totalTickets: number;
  soldTickets: number;
  totalRevenue: number;
  platformCommission: number;
  attendanceRate: number; // sold / capacity
  tierBreakdown: TierStats[];
}

export interface TierStats {
  tierId: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  revenue: number;
}
