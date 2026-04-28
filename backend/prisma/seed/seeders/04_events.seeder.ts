import type { Faker } from '@faker-js/faker';
import type { PrismaClient } from '../../../generated/prisma/client';
import { EventStatus } from '../../../generated/prisma/enums';
import type { SeedRegistry } from '../types';
import { CuratedEventKey } from '../types';
import { SEED_CONFIG } from '../config';
import { daysFromNow, addHours } from '../helpers/dates';
import { validateDateOrder } from '../helpers/validators';
import {
  PUBLISHED_EVENTS,
  COMPLETED_EVENTS,
  DRAFT_EVENTS,
  CANCELLED_EVENTS,
} from '../fixtures/events.fixture';
import { TICKET_TIERS_BY_EVENT } from '../fixtures/ticket-tiers.fixture';
import { EVENT_CATEGORIES } from '../fixtures/reference.fixture';
import { makeEvent } from '../factories/event.factory';
import type { EventSeed } from '../types';

async function insertCuratedEvent(
  prisma: PrismaClient,
  registry: SeedRegistry,
  e: EventSeed,
): Promise<string> {
  const startDate = addHours(daysFromNow(e.startOffsetDays), e.startHour);
  const endDate = addHours(startDate, e.durationHours);
  validateDateOrder(startDate, endDate, `curated event "${e.title}"`);

  const created = await prisma.event.create({
    data: {
      title: e.title,
      description: e.description,
      startDate,
      endDate,
      category: { connect: { id: registry.getEventCategory(e.categoryName) } },
      capacity: e.capacity,
      bannerUrls: e.bannerUrls,
      status: e.status,
      organizer: { connect: { id: registry.getUser(e.organizerKey) } },
      ...(e.squareKey
        ? { square: { connect: { id: registry.getSquare(e.squareKey) } } }
        : {}),
    },
  });

  registry.setEvent(e.key, created.id);

  // Seed ticket tiers if defined for this event
  const tiers = TICKET_TIERS_BY_EVENT[e.key as CuratedEventKey];
  if (tiers) {
    const tierIds: string[] = [];
    for (const t of tiers) {
      const tc = await prisma.ticketTier.create({
        data: { name: t.name, price: t.price, quantity: t.quantity, event: { connect: { id: created.id } } },
      });
      tierIds.push(tc.id);
    }
    registry.setTiers(created.id, tierIds);
  }

  return created.id;
}

export async function seedEvents(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  const allCurated = [...PUBLISHED_EVENTS, ...COMPLETED_EVENTS, ...DRAFT_EVENTS, ...CANCELLED_EVENTS];
  for (const e of allCurated) {
    await insertCuratedEvent(prisma, registry, e);
  }

  const organizers = await prisma.user.findMany({
    where: { role: 'ORGANIZER' },
    select: { id: true },
  });
  const squares = await prisma.square.findMany({ select: { id: true } });

  for (let i = 0; i < SEED_CONFIG.extraEvents; i++) {
    const categoryName = f.helpers.arrayElement(EVENT_CATEGORIES);
    const generated = makeEvent(f, { categoryName, status: EventStatus.PUBLISHED });
    const organizer = f.helpers.arrayElement(organizers);
    const square = f.helpers.arrayElement(squares);

    const created = await prisma.event.create({
      data: {
        title: generated.title,
        description: generated.description,
        startDate: generated.startDate,
        endDate: generated.endDate,
        category: { connect: { id: registry.getEventCategory(generated.categoryName) } },
        capacity: generated.capacity,
        bannerUrls: generated.bannerUrls,
        status: generated.status,
        organizer: { connect: { id: organizer.id } },
        square: { connect: { id: square.id } },
      },
    });
    registry.setEvent(`generated_event_${i}`, created.id);

    const standardPrice = f.number.int({ min: 50_000, max: 200_000 });
    const vipPrice = standardPrice * f.number.int({ min: 2, max: 4 });
    const tierIds: string[] = [];
    for (const t of [
      { name: 'Standard', price: standardPrice, quantity: Math.floor(generated.capacity * 0.8) },
      { name: 'VIP',      price: vipPrice,       quantity: Math.floor(generated.capacity * 0.2) },
    ]) {
      const tc = await prisma.ticketTier.create({
        data: { ...t, event: { connect: { id: created.id } } },
      });
      tierIds.push(tc.id);
    }
    registry.setTiers(created.id, tierIds);
  }

  console.log(`✅ Events seeded: ${allCurated.length} curated + ${SEED_CONFIG.extraEvents} generated`);
}
