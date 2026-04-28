export interface AdminPendingEvent {
  id: string;
  title: string;
  category: { id: string; name: string };
  bannerUrls: string[];
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
