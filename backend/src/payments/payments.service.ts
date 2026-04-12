import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { ClickWebhookDto } from './dto/click-webhook.dto';
import { PaymeWebhookDto } from './dto/payme-webhook.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns all payments for the current user across all payment types
   */
  async getMyPayments(userId: string) {
    const [ticketPayments, venuePayments, servicePayments] =
      await this.prisma.$transaction([
        this.prisma.ticketPayment.findMany({
          where: { userId },
          include: {
            ticket: {
              select: {
                id: true,
                qrCode: true,
                event: { select: { id: true, title: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.venueBookingPayment.findMany({
          where: { userId },
          include: {
            venueBooking: {
              include: { venue: { select: { id: true, name: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.servicePayment.findMany({
          where: { userId },
          include: {
            eventService: {
              include: { service: { select: { id: true, name: true } } },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ]);

    return { ticketPayments, venuePayments, servicePayments };
  }

  /**
   * Returns a single ticket payment by ID
   */
  async findOne(id: string) {
    const payment = await this.prisma.ticketPayment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        ticket: {
          include: { event: { select: { id: true, title: true } } },
        },
      },
    });

    if (!payment) throw new NotFoundException('Payment not found');

    return payment;
  }

  /**
   * Handles Click payment webhook — updates ticket payment status
   */
  async handleClickWebhook(
    dto: ClickWebhookDto,
  ): Promise<{ error: number; error_note: string }> {
    const payment = await this.prisma.ticketPayment.findFirst({
      where: { id: dto.merchant_trans_id },
    });

    if (!payment) return { error: -5, error_note: 'Payment not found' };

    // action=0: prepare, action=1: complete
    if (dto.action === 1 && payment.status === PaymentStatus.PENDING) {
      await this.prisma.ticketPayment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PAID, providerTxId: dto.click_trans_id },
      });
    }

    return { error: 0, error_note: 'Success' };
  }

  /**
   * Handles Payme (Merchant) RPC webhook
   */
  async handlePaymeWebhook(
    dto: PaymeWebhookDto,
  ): Promise<{ result: unknown } | { error: unknown }> {
    switch (dto.method) {
      case 'CheckPerformTransaction':
        return { result: { allow: true } };

      case 'CreateTransaction': {
        const paymentId = (
          dto.params.account as Record<string, string> | undefined
        )?.order_id;
        const payment = await this.prisma.ticketPayment.findFirst({
          where: { id: paymentId },
        });
        if (!payment)
          return { error: { code: -31050, message: 'Order not found' } };
        return {
          result: {
            create_time: Date.now(),
            transaction: payment.id,
            state: 1,
          },
        };
      }

      case 'PerformTransaction': {
        const paymentId = dto.params.id as string | undefined;
        await this.prisma.ticketPayment.updateMany({
          where: { id: paymentId, status: PaymentStatus.PENDING },
          data: {
            status: PaymentStatus.PAID,
            providerTxId: dto.params.paycom_transaction_id as
              | string
              | undefined,
          },
        });
        return {
          result: {
            transaction: paymentId,
            perform_time: Date.now(),
            state: 2,
          },
        };
      }

      case 'CancelTransaction': {
        const paymentId = dto.params.id as string | undefined;
        await this.prisma.ticketPayment.updateMany({
          where: { id: paymentId },
          data: { status: PaymentStatus.REFUNDED },
        });
        return {
          result: {
            transaction: paymentId,
            cancel_time: Date.now(),
            state: -1,
          },
        };
      }

      default:
        return { error: { code: -32601, message: 'Method not found' } };
    }
  }
}
