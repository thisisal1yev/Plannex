import 'dotenv/config';
import { hashSync } from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import {
  BookingStatus,
  EventStatus,
  PaymentProvider,
  PaymentStatus,
  VolunteerStatus,
} from '../generated/prisma/enums';
import {
  USERS,
  VENUES,
  PUBLISHED_EVENTS,
  DRAFT_EVENTS,
  COMPLETED_EVENTS,
  CANCELLED_EVENTS,
  TICKET_TIERS_BY_EVENT,
  SERVICES,
  VENUE_REVIEWS,
  SERVICE_REVIEWS,
  EVENT_REVIEWS,
} from './constants';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const createdIds = {
  users: {} as Record<string, string>,
  venues: [] as string[],
  publishedEvents: [] as string[],
  completedEvents: [] as string[],
  services: [] as string[],
  // tierIds[eventGlobalIndex][tierLocalIndex] = tierId
  tiers: [] as string[][],
};

const hashPassword = (pw: string) => hashSync(pw, 10);

// ─── Users ───────────────────────────────────────────────────────────────────
async function seedUsers() {

  
  for (const u of USERS) {
    const created = await prisma.user.create({
      data: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role as any,
        passwordHash: hashPassword('12345678'),
        isVerified: true,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
      },
    });
    createdIds.users[u.email] = created.id;
  }

  console.log(`✓ ${Object.keys(createdIds.users).length} users`);
}

// ─── Venues ──────────────────────────────────────────────────────────────────
async function seedVenues() {

  const ownerId = createdIds.users['vendor@planner.ai'];

  for (const v of VENUES) {
    const created = await prisma.venue.create({ data: { ...v, ownerId } });
    createdIds.venues.push(created.id);
  }

  console.log(`✓ ${createdIds.venues.length} venues`);
}

// ─── Events ───────────────────────────────────────────────────────────────────
async function seedEvents() {
  // Published
  for (const e of PUBLISHED_EVENTS) {
    const created = await prisma.event.create({
      data: {
        title: e.title,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        eventType: e.eventType,
        capacity: e.capacity,
        bannerUrl: e.bannerUrl,
        status: EventStatus.PUBLISHED,
        organizerId: createdIds.users[e.organizerKey],
        venueId: createdIds.venues[e.venueIndex],
      },
    });
    createdIds.publishedEvents.push(created.id);
  }

  // Completed
  for (const e of COMPLETED_EVENTS) {
    const created = await prisma.event.create({
      data: {
        title: e.title,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        eventType: e.eventType,
        capacity: e.capacity,
        bannerUrl: e.bannerUrl,
        status: EventStatus.COMPLETED,
        organizerId: createdIds.users[e.organizerKey],
        venueId: createdIds.venues[e.venueIndex],
      },
    });
    createdIds.completedEvents.push(created.id);
  }

  // Draft
  for (const e of DRAFT_EVENTS) {
    await prisma.event.createMany({
      data: {
        title: e.title,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        eventType: e.eventType,
        capacity: e.capacity,
        bannerUrl: e.bannerUrl,
        status: EventStatus.DRAFT,
        organizerId: createdIds.users[e.organizerKey],
      },
    });
  }

  // Cancelled
  for (const e of CANCELLED_EVENTS) {
    await prisma.event.createMany({
      data: {
        title: e.title,
        description: e.description,
        startDate: e.startDate,
        endDate: e.endDate,
        eventType: e.eventType,
        capacity: e.capacity,
        bannerUrl: e.bannerUrl,
        status: EventStatus.CANCELLED,
        organizerId: createdIds.users[e.organizerKey],
      },
    });
  }

  const total =
    PUBLISHED_EVENTS.length +
    COMPLETED_EVENTS.length +
    DRAFT_EVENTS.length +
    CANCELLED_EVENTS.length;
  console.log(`✓ ${total} events`);
}

// ─── Ticket Tiers ─────────────────────────────────────────────────────────────
// TICKET_TIERS_BY_EVENT[0..4] → published events
// TICKET_TIERS_BY_EVENT[5..6] → completed events
async function seedTicketTiers() {

  const allEventIds = [
    ...createdIds.publishedEvents, // indices 0-4
    ...createdIds.completedEvents, // indices 5-6
  ];

  for (let i = 0; i < TICKET_TIERS_BY_EVENT.length; i++) {
    const eventId = allEventIds[i];
    const tierIds: string[] = [];

    for (const t of TICKET_TIERS_BY_EVENT[i]) {
      const created = await prisma.ticketTier.create({
        data: { ...t, eventId },
      });
      tierIds.push(created.id);
    }

    createdIds.tiers.push(tierIds);
  }

  console.log(`✓ ${TICKET_TIERS_BY_EVENT.flat().length} ticket tiers`);
}

// ─── Tickets & Payments ───────────────────────────────────────────────────────
// Purchase plan (spread across Dec 2025 – Mar 2026 for revenue chart):
//  eventIdx = index in [publishedEvents(0-4), completedEvents(5-6)]
//  tierIdx  = tier index within that event's tiers
async function seedTicketsAndPayments() {

  const allEventIds = [
    ...createdIds.publishedEvents,
    ...createdIds.completedEvents,
  ];

  const purchases: Array<{
    participantKey: string;
    eventIdx: number;
    tierIdx: number;
    date: Date;
    provider: PaymentProvider;
  }> = [
    // ── December 2025 ──
    { participantKey: 'participant@planner.ai',  eventIdx: 0, tierIdx: 1, date: new Date('2025-12-08T10:00:00Z'), provider: PaymentProvider.CLICK },
    { participantKey: 'participant2@planner.ai', eventIdx: 0, tierIdx: 1, date: new Date('2025-12-14T11:00:00Z'), provider: PaymentProvider.PAYME },
    { participantKey: 'participant3@planner.ai', eventIdx: 5, tierIdx: 0, date: new Date('2025-12-20T14:00:00Z'), provider: PaymentProvider.CLICK },
    // ── January 2026 ──
    { participantKey: 'participant4@planner.ai', eventIdx: 0, tierIdx: 2, date: new Date('2026-01-05T09:00:00Z'), provider: PaymentProvider.PAYME },
    { participantKey: 'participant5@planner.ai', eventIdx: 2, tierIdx: 0, date: new Date('2026-01-10T10:00:00Z'), provider: PaymentProvider.CLICK },
    { participantKey: 'participant@planner.ai',  eventIdx: 1, tierIdx: 0, date: new Date('2026-01-16T13:00:00Z'), provider: PaymentProvider.CLICK },
    { participantKey: 'participant2@planner.ai', eventIdx: 2, tierIdx: 1, date: new Date('2026-01-21T11:00:00Z'), provider: PaymentProvider.PAYME },
    { participantKey: 'participant3@planner.ai', eventIdx: 3, tierIdx: 0, date: new Date('2026-01-28T15:00:00Z'), provider: PaymentProvider.CLICK },
    // ── February 2026 ──
    { participantKey: 'participant4@planner.ai', eventIdx: 4, tierIdx: 0, date: new Date('2026-02-06T10:00:00Z'), provider: PaymentProvider.PAYME },
    { participantKey: 'participant5@planner.ai', eventIdx: 3, tierIdx: 1, date: new Date('2026-02-12T12:00:00Z'), provider: PaymentProvider.CLICK },
    { participantKey: 'participant@planner.ai',  eventIdx: 6, tierIdx: 1, date: new Date('2026-02-18T14:00:00Z'), provider: PaymentProvider.PAYME },
    { participantKey: 'participant2@planner.ai', eventIdx: 2, tierIdx: 2, date: new Date('2026-02-24T11:00:00Z'), provider: PaymentProvider.CLICK },
    // ── March 2026 ──
    { participantKey: 'participant3@planner.ai', eventIdx: 4, tierIdx: 1, date: new Date('2026-03-02T09:00:00Z'), provider: PaymentProvider.PAYME },
    { participantKey: 'participant4@planner.ai', eventIdx: 0, tierIdx: 0, date: new Date('2026-03-07T10:00:00Z'), provider: PaymentProvider.CLICK },
    { participantKey: 'participant5@planner.ai', eventIdx: 5, tierIdx: 0, date: new Date('2026-03-12T13:00:00Z'), provider: PaymentProvider.PAYME },
  ];

  const COMMISSION_RATE = 0.1;
  let qrSeq = 1000;

  for (const p of purchases) {
    const userId = createdIds.users[p.participantKey];
    const eventId = allEventIds[p.eventIdx];
    const tierId = createdIds.tiers[p.eventIdx][p.tierIdx];

    // get tier price
    const tier = await prisma.ticketTier.findUnique({ where: { id: tierId } });
    if (!tier) continue;

    const amount = Number(tier.price);
    const commission = amount * COMMISSION_RATE;

    const payment = await prisma.payment.create({
      data: {
        userId,
        eventId,
        amount,
        commission,
        provider: p.provider,
        providerTxId: `TX-${Date.now()}-${qrSeq}`,
        status: PaymentStatus.PAID,
        createdAt: p.date,
      },
    });

    await prisma.ticket.create({
      data: {
        userId,
        eventId,
        tierId,
        paymentId: payment.id,
        qrCode: `QR-${p.date.getFullYear()}${String(p.date.getMonth() + 1).padStart(2, '0')}-${qrSeq++}`,
        isUsed: p.eventIdx >= 5, // completed events → ticket already used
        createdAt: p.date,
      },
    });

    await prisma.ticketTier.update({
      where: { id: tierId },
      data: { sold: { increment: 1 } },
    });
  }

  console.log(`✓ ${purchases.length} payments & tickets`);
}

// ─── Venue Bookings ───────────────────────────────────────────────────────────
async function seedVenueBookings() {

  const bookings = [
    {
      venueId: createdIds.venues[0],
      eventId: createdIds.publishedEvents[0],   // Marketing Forum → City Hall
      startDate: new Date('2026-05-20T08:00:00Z'),
      endDate: new Date('2026-05-20T20:00:00Z'),
      status: BookingStatus.CONFIRMED,
      totalCost: 10000000,
    },
    {
      venueId: createdIds.venues[3],
      eventId: createdIds.publishedEvents[2],   // Jazz Festival → Navoi Palace
      startDate: new Date('2026-07-10T15:00:00Z'),
      endDate: new Date('2026-07-12T23:59:00Z'),
      status: BookingStatus.CONFIRMED,
      totalCost: 54000000,
    },
    {
      venueId: createdIds.venues[2],
      eventId: createdIds.publishedEvents[3],   // UX Workshop → Bukhara Hall
      startDate: new Date('2026-04-25T08:00:00Z'),
      endDate: new Date('2026-04-26T20:00:00Z'),
      status: BookingStatus.CONFIRMED,
      totalCost: 10000000,
    },
    {
      venueId: createdIds.venues[1],
      eventId: createdIds.publishedEvents[1],   // Startup Meetup → Samarkand Garden
      startDate: new Date('2026-06-15T16:00:00Z'),
      endDate: new Date('2026-06-15T23:00:00Z'),
      status: BookingStatus.PENDING,
      totalCost: 7000000,
    },
  ];

  for (const b of bookings) {
    await prisma.venueBooking.create({ data: b });
  }

  console.log(`✓ ${bookings.length} venue bookings`);
}

// ─── Services ────────────────────────────────────────────────────────────────
async function seedServices() {

  for (const s of SERVICES) {
    const created = await prisma.service.create({
      data: {
        name: s.name,
        category: s.category,
        description: s.description,
        priceFrom: s.priceFrom,
        city: s.city,
        rating: s.rating,
        imageUrls: s.imageUrls,
        vendorId: createdIds.users[s.vendorKey],
      },
    });
    createdIds.services.push(created.id);
  }

  console.log(`✓ ${createdIds.services.length} services`);
}

// ─── Event Services ───────────────────────────────────────────────────────────
async function seedEventServices() {

  const links = [
    { eventIdx: 0, serviceIdx: 0, agreedPrice: 12000000, status: BookingStatus.CONFIRMED }, // Forum ← Catering
    { eventIdx: 0, serviceIdx: 1, agreedPrice: 7000000,  status: BookingStatus.CONFIRMED }, // Forum ← Sound
    { eventIdx: 0, serviceIdx: 2, agreedPrice: 3000000,  status: BookingStatus.CONFIRMED }, // Forum ← Photo
    { eventIdx: 2, serviceIdx: 1, agreedPrice: 8000000,  status: BookingStatus.CONFIRMED }, // Jazz  ← Sound
    { eventIdx: 2, serviceIdx: 2, agreedPrice: 3500000,  status: BookingStatus.CONFIRMED }, // Jazz  ← Photo
    { eventIdx: 2, serviceIdx: 4, agreedPrice: 2000000,  status: BookingStatus.CONFIRMED }, // Jazz  ← Security
    { eventIdx: 3, serviceIdx: 3, agreedPrice: 4000000,  status: BookingStatus.CONFIRMED }, // UX    ← Decor
    { eventIdx: 4, serviceIdx: 4, agreedPrice: 1500000,  status: BookingStatus.PENDING   }, // Art   ← Security
    { eventIdx: 4, serviceIdx: 3, agreedPrice: 5000000,  status: BookingStatus.CONFIRMED }, // Art   ← Decor
    { eventIdx: 1, serviceIdx: 0, agreedPrice: 6000000,  status: BookingStatus.PENDING   }, // Startup ← Catering
  ];

  for (const l of links) {
    await prisma.eventService.create({
      data: {
        eventId: createdIds.publishedEvents[l.eventIdx],
        serviceId: createdIds.services[l.serviceIdx],
        agreedPrice: l.agreedPrice,
        status: l.status,
      },
    });
  }

  console.log(`✓ ${links.length} event-service links`);
}

// ─── Volunteer Applications ────────────────────────────────────────────────────
async function seedVolunteerApplications() {

  const apps = [
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 0,
      skills: ['registration', 'guest greeting', 'info desk'],
      status: VolunteerStatus.ACCEPTED,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 0,
      skills: ['translation', 'badge scanning', 'crowd control'],
      status: VolunteerStatus.ACCEPTED,
    },
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 2,
      skills: ['stage management', 'artist coordination'],
      status: VolunteerStatus.PENDING,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 2,
      skills: ['audio monitoring', 'lighting assistance'],
      status: VolunteerStatus.PENDING,
    },
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 3,
      skills: ['coordination', 'scheduling'],
      status: VolunteerStatus.REJECTED,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 4,
      skills: ['art curation', 'visitor guidance', 'multilingual support'],
      status: VolunteerStatus.PENDING,
    },
  ];

  for (const a of apps) {
    await prisma.volunteerApplication.create({
      data: {
        userId: createdIds.users[a.userKey],
        eventId: createdIds.publishedEvents[a.eventIdx],
        skills: a.skills,
        status: a.status,
      },
    });
  }

  console.log(`✓ ${apps.length} volunteer applications`);
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
async function seedReviews() {
  for (const r of VENUE_REVIEWS) {
    await prisma.review.create({
      data: {
        authorId: createdIds.users[r.userKey],
        venueId: createdIds.venues[r.venueIdx],
        rating: r.rating,
        comment: r.comment,
      },
    });
  }

  for (const r of SERVICE_REVIEWS) {
    await prisma.review.create({
      data: {
        authorId: createdIds.users[r.userKey],
        serviceId: createdIds.services[r.serviceIdx],
        rating: r.rating,
        comment: r.comment,
      },
    });
  }

  for (const r of EVENT_REVIEWS) {
    await prisma.review.create({
      data: {
        authorId: createdIds.users[r.userKey],
        eventId: createdIds.publishedEvents[r.eventIdx],
        rating: r.rating,
        comment: r.comment,
      },
    });
  }

  const total = VENUE_REVIEWS.length + SERVICE_REVIEWS.length + EVENT_REVIEWS.length;
  console.log(`✓ ${total} reviews`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function up() {
  await seedUsers();
  await seedVenues();
  await seedEvents();
  await seedTicketTiers();
  await seedTicketsAndPayments();
  await seedVenueBookings();
  await seedServices();
  await seedEventServices();
  await seedVolunteerApplications();
  await seedReviews();
  console.log('✅ Done');
}

async function down() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Review",
      "VolunteerApplication",
      "EventService",
      "VenueBooking",
      "Ticket",
      "Payment",
      "TicketTier",
      "Event",
      "Venue",
      "Service",
      "User"
    RESTART IDENTITY CASCADE
  `);

}

async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes('--down') || args.includes('-d')) {
      await down();
    } else if (args.includes('--seed-only') || args.includes('-s')) {
      await up();
    } else {
      await down();
      await up();
    }
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
