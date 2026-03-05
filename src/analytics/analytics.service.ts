import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventStatus, PaymentStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardStats } from './types/dashboard-stats.type';
import { EventStats } from './types/event-stats.type';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

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
