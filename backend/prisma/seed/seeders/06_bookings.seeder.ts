import { randomUUID } from 'crypto';
import type { Faker } from '@faker-js/faker';
import {
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
} from '../../../generated/prisma/enums';
import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import { SEED_CONFIG, COMMISSION_RATE } from '../config';
import { validateAgreedPrice } from '../helpers/validators';

export async function seedBookings(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  // ── 1. Square bookings ────────────────────────────────────────────────────────
  const eventsWithSquares = await prisma.event.findMany({
    where: {
      status: { in: ['PUBLISHED', 'COMPLETED'] },
      squareId: { not: null },
    },
    include: { square: true },
  });

  let squareBookingCount = 0;
  for (const event of eventsWithSquares) {
    if (!event.square) continue;

    const pricePerDay = Number(event.square.pricePerDay);
    const durationDays = Math.max(
      1,
      Math.ceil((event.endDate.getTime() - event.startDate.getTime()) / 86_400_000),
    );
    const totalCost = pricePerDay * durationDays;
    const isPending = f.datatype.boolean({ probability: SEED_CONFIG.pendingBookingRatio });
    const status = isPending ? BookingStatus.PENDING : BookingStatus.CONFIRMED;
    const provider = f.helpers.arrayElement([PaymentProvider.CLICK, PaymentProvider.PAYME]);

    const booking = await prisma.booking.create({
      data: {
        user: { connect: { id: event.organizerId } },
        square: { connect: { id: event.square.id } },
        startDate: event.startDate,
        endDate: event.endDate,
        status,
        totalCost,
      },
    });

    await prisma.payment.create({
      data: {
        user: { connect: { id: event.organizerId } },
        type: PaymentType.SQUARE,
        booking: { connect: { id: booking.id } },
        amount: totalCost,
        commission: totalCost * COMMISSION_RATE,
        provider,
        providerTxId: isPending ? null : `TX-SQUARE-${randomUUID()}`,
        status: isPending ? PaymentStatus.PENDING : PaymentStatus.PAID,
      },
    });
    squareBookingCount++;
  }

  // ── 2. EventService bookings ──────────────────────────────────────────────────
  const publishedEvents = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, organizerId: true },
  });

  const services = await prisma.service.findMany({
    select: { id: true, priceFrom: true },
  });

  if (services.length === 0) {
    console.log('⚠️  No services found, skipping EventService bookings');
    console.log(`✅ Bookings seeded: ${squareBookingCount} square + 0 service`);
    return;
  }

  let eventServiceCount = 0;
  for (const event of publishedEvents) {
    const selected = f.helpers.arrayElements(services, { min: 0, max: 3 });
    for (const service of selected) {
      const priceFrom = Number(service.priceFrom);
      const markup = f.number.float({ min: 1.0, max: 1.5 });
      const agreedPrice = Math.round(priceFrom * markup);
      validateAgreedPrice(agreedPrice, priceFrom, `EventService event=${event.id}`);

      const isPending = f.datatype.boolean({ probability: SEED_CONFIG.pendingBookingRatio });
      const status = isPending ? BookingStatus.PENDING : BookingStatus.CONFIRMED;

      try {
        const es = await prisma.eventService.create({
          data: {
            event: { connect: { id: event.id } },
            service: { connect: { id: service.id } },
            agreedPrice,
            status,
          },
        });

        const booking = await prisma.booking.create({
          data: {
            user: { connect: { id: event.organizerId } },
            eventService: { connect: { id: es.id } },
            status,
            totalCost: agreedPrice,
          },
        });

        await prisma.payment.create({
          data: {
            user: { connect: { id: event.organizerId } },
            type: PaymentType.SERVICE,
            booking: { connect: { id: booking.id } },
            amount: agreedPrice,
            commission: agreedPrice * COMMISSION_RATE,
            provider: f.helpers.arrayElement([PaymentProvider.CLICK, PaymentProvider.PAYME]),
            providerTxId: isPending ? null : `TX-SERVICE-${randomUUID()}`,
            status: isPending ? PaymentStatus.PENDING : PaymentStatus.PAID,
          },
        });
        eventServiceCount++;
      } catch (err: any) {
        if (err.code === 'P2002') continue; // [eventId, serviceId] unique constraint
        throw err;
      }
    }
  }

  console.log(`✅ Bookings seeded: ${squareBookingCount} square + ${eventServiceCount} service`);
}
