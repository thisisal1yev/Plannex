import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PaymentStatus } from '../../generated/prisma/enums';
const { Decimal } = Prisma;
import { generateQRCode } from '../common/utils/qr.util';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { ValidateQrDto } from './dto/validate-qr.dto';

const COMMISSION_RATE = 0.1; // 10%

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Purchases a ticket: creates Payment + Ticket + increments tier.sold
   * All operations run in a single Prisma transaction
   */
  async purchase(userId: string, eventId: string, dto: PurchaseTicketDto) {
    const tier = await this.prisma.ticketTier.findUnique({
      where: { id: dto.tierId },
      include: { event: true },
    });

    if (!tier) throw new NotFoundException('Ticket tier not found');
    if (tier.eventId !== eventId)
      throw new BadRequestException('Tier does not belong to this event');
    if (tier.sold >= tier.quantity)
      throw new BadRequestException('No tickets remaining in this tier');

    const amount = new Decimal(tier.price);
    const commission = amount.mul(COMMISSION_RATE);
    const qrCode = generateQRCode();

    const [payment, ticket] = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId,
          eventId,
          amount,
          commission,
          provider: dto.provider,
          status: PaymentStatus.PAID, // Stub: mark as paid immediately
        },
      });

      const ticket = await tx.ticket.create({
        data: {
          userId,
          eventId,
          tierId: dto.tierId,
          paymentId: payment.id,
          qrCode,
        },
      });

      await tx.ticketTier.update({
        where: { id: dto.tierId },
        data: { sold: { increment: 1 } },
      });

      return [payment, ticket];
    });

    return { payment, ticket };
  }

  /**
   * Returns all tickets for the current user
   */
  async getMyTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        event: {
          select: { id: true, title: true, startDate: true, endDate: true },
        },
        tier: { select: { name: true, price: true } },
        payment: { select: { status: true, amount: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Returns a ticket by ID
   */
  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
        tier: true,
        payment: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    return ticket;
  }

  /**
   * Validates a ticket by QR code — marks it as used (organizer use)
   */
  async validateQR(dto: ValidateQrDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCode: dto.qrCode },
      include: {
        user: { select: { firstName: true, lastName: true } },
        tier: true,
      },
    });

    if (!ticket) throw new NotFoundException('Invalid QR code');
    if (ticket.isUsed) throw new BadRequestException('Ticket already used');

    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: { isUsed: true },
    });

    return { valid: true, ticket };
  }
}
