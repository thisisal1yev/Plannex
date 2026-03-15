export interface AdminPendingEvent {
  id: string;
  title: string;
  eventType: string;
  bannerUrl: string | null;
  startDate: Date;
  status: string;
  organizer: { firstName: string; lastName: string };
}

export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  pendingEvents: number;
  totalRevenue: number;
  weeklyGrowth: { week: string; users: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  recentPendingEvents: AdminPendingEvent[];
}
