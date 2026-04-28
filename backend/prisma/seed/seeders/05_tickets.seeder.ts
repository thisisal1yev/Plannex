import { randomUUID } from 'crypto';
import type { Faker } from '@faker-js/faker';
import { PaymentStatus, PaymentType } from '../../../generated/prisma/enums';
import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import { SEED_CONFIG, COMMISSION_RATE } from '../config';
import { makeTicketPurchases } from '../factories/ticket.factory';

export async function seedTicketsAndPayments(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  const participants = await prisma.user.findMany({
    where: { role: 'PARTICIPANT' },
    select: { id: true },
  });
  if (participants.length === 0) throw new Error('[seedTickets] No participants found');

  const events = await prisma.event.findMany({
    where: { status: { in: ['PUBLISHED', 'COMPLETED'] } },
    include: { ticketTiers: true },
  });

  let qrSeq = SEED_CONFIG.qrSeqStart;
  let ticketCount = 0;

  for (const event of events) {
    if (event.ticketTiers.length === 0) continue;

    const count = f.number.int({
      min: SEED_CONFIG.ticketsPerEvent.min,
      max: SEED_CONFIG.ticketsPerEvent.max,
    });

    const purchases = makeTicketPurchases(f, {
      eventStartDate: event.startDate,
      eventCapacity: event.capacity,
      tierCount: event.ticketTiers.length,
      participantIds: participants.map((p) => p.id),
      count,
      isEventCompleted: event.status === 'COMPLETED',
    });

    for (const p of purchases) {
      const tier = event.ticketTiers[p.tierIndex];
      const amount = Number(tier.price);
      const qrMonth = `${p.purchaseDate.getFullYear()}${String(p.purchaseDate.getMonth() + 1).padStart(2, '0')}`;

      const ticket = await prisma.ticket.create({
        data: {
          user: { connect: { id: p.userId } },
          event: { connect: { id: event.id } },
          tier: { connect: { id: tier.id } },
          pricePaid: amount,
          qrCode: `QR-${qrMonth}-${qrSeq++}`,
          isUsed: p.shouldBeUsed,
          usedAt: p.shouldBeUsed
            ? f.date.between({ from: event.startDate, to: event.endDate })
            : null,
          createdAt: p.purchaseDate,
        },
      });

      await prisma.payment.create({
        data: {
          user: { connect: { id: p.userId } },
          type: PaymentType.TICKET,
          ticket: { connect: { id: ticket.id } },
          amount,
          commission: amount * COMMISSION_RATE,
          provider: p.provider,
          providerTxId: `TX-TICKET-${randomUUID()}`,
          status: PaymentStatus.PAID,
          createdAt: p.purchaseDate,
        },
      });
      ticketCount++;
    }
  }

  console.log(`✅ Tickets & Payments seeded: ${ticketCount} tickets`);
}
