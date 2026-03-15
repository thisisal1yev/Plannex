import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventStatus, PaymentStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardStats } from './types/dashboard-stats.type';
import { EventStats } from './types/event-stats.type';
import { AdminStats } from './types/admin-stats.type';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns platform-wide statistics for admin dashboard
   */
  async getAdminStats(): Promise<AdminStats> {
    const now = new Date();

    // Build date ranges for last 4 weeks and 4 months
    const weeks: { label: string; start: Date; end: Date }[] = [];
    for (let i = 3; i >= 0; i--) {
      const end = new Date(now);
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 7);
      weeks.push({
        label: `Week ${4 - i}`,
        start,
        end,
      });
    }

    const months: { label: string; start: Date; end: Date }[] = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      months.push({
        label: d.toLocaleString('en-US', { month: 'short' }),
        start,
        end,
      });
    }

    const [totalUsers, totalEvents, pendingEvents, revenueAgg] =
      await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.event.count(),
        this.prisma.event.count({ where: { status: EventStatus.DRAFT } }),
        this.prisma.payment.aggregate({
          where: { status: PaymentStatus.PAID },
          _sum: { amount: true },
        }),
      ]);

    const weeklyGrowth = await Promise.all(
      weeks.map(async ({ label, start, end }) => ({
        week: label,
        users: await this.prisma.user.count({
          where: { createdAt: { gte: start, lte: end } },
        }),
      })),
    );

    const monthlyRevenue = await Promise.all(
      months.map(async ({ label, start, end }) => {
        const agg = await this.prisma.payment.aggregate({
          where: { status: PaymentStatus.PAID, createdAt: { gte: start, lte: end } },
          _sum: { amount: true },
        });
        return { month: label, revenue: Number(agg._sum.amount ?? 0) };
      }),
    );

    const recentPendingEvents = await this.prisma.event.findMany({
      where: { status: EventStatus.DRAFT },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        eventType: true,
        bannerUrl: true,
        startDate: true,
        status: true,
        organizer: { select: { firstName: true, lastName: true } },
      },
    });

    return {
      totalUsers,
      totalEvents,
      pendingEvents,
      totalRevenue: Number(revenueAgg._sum.amount ?? 0),
      weeklyGrowth,
      monthlyRevenue,
      recentPendingEvents,
    };
  }

  /**
   * Returns detailed statistics for a specific event (organizer only)
   */
  async getEventStats(userId: string, eventId: string): Promise<EventStats> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        ticketTiers: true,
        payments: { where: { status: PaymentStatus.PAID } },
      },
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId)
      throw new ForbiddenException('Only the event organizer can view stats');

    const totalTickets = event.ticketTiers.reduce(
      (sum, t) => sum + t.quantity,
      0,
    );
    const soldTickets = event.ticketTiers.reduce((sum, t) => sum + t.sold, 0);
    const totalRevenue = event.payments.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );
    const totalCommission = event.payments.reduce(
      (sum, p) => sum + Number(p.commission),
      0,
    );

    const tierBreakdown = event.ticketTiers.map((tier) => ({
      tierId: tier.id,
      name: tier.name,
      price: Number(tier.price),
      quantity: tier.quantity,
      sold: tier.sold,
      revenue: Number(tier.price) * tier.sold,
    }));

    return {
      eventId: event.id,
      title: event.title,
      totalTickets,
      soldTickets,
      totalRevenue,
      platformCommission: totalCommission,
      attendanceRate: totalTickets > 0 ? soldTickets / totalTickets : 0,
      tierBreakdown,
    };
  }

  /**
   * Returns overall dashboard statistics for the current organizer
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const now = new Date();

    const [
      totalEvents,
      publishedEvents,
      upcomingEvents,
      ticketAgg,
      paymentAgg,
    ] = await this.prisma.$transaction([
      this.prisma.event.count({ where: { organizerId: userId } }),
      this.prisma.event.count({
        where: { organizerId: userId, status: EventStatus.PUBLISHED },
      }),
      this.prisma.event.count({
        where: {
          organizerId: userId,
          status: EventStatus.PUBLISHED,
          startDate: { gte: now },
        },
      }),
      this.prisma.ticketTier.aggregate({
        where: { event: { organizerId: userId } },
        _sum: { sold: true },
      }),
      this.prisma.payment.aggregate({
        where: { event: { organizerId: userId }, status: PaymentStatus.PAID },
        _sum: { amount: true, commission: true },
      }),
    ]);

    return {
      organizerId: userId,
      totalEvents,
      publishedEvents,
      totalTicketsSold: ticketAgg._sum.sold ?? 0,
      totalRevenue: Number(paymentAgg._sum.amount ?? 0),
      totalCommission: Number(paymentAgg._sum.commission ?? 0),
      upcomingEvents,
    };
  }
}
