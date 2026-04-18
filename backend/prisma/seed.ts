import 'dotenv/config';
import { hashSync } from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import {
  BookingStatus,
  EventStatus,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  Role,
  VolunteerRequestStatus,
} from '../generated/prisma/enums';
import {
  USERS,
  SQUARES,
  SQUARE_CATEGORIES,
  SERVICE_CATEGORIES,
  PUBLISHED_EVENTS,
  DRAFT_EVENTS,
  COMPLETED_EVENTS,
  CANCELLED_EVENTS,
  TICKET_TIERS_BY_EVENT,
  SERVICES,
  SQUARE_REVIEWS,
  SERVICE_REVIEWS,
  EVENT_REVIEWS,
  VOLUNTEER_SKILLS,
  SQUARE_CHARACTERISTICS,
} from './constants';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const createdIds = {
  users: {} as Record<string, string>,
  squareCategories: {} as Record<string, string>,
  serviceCategories: {} as Record<string, string>,
  volunteerSkills: {} as Record<string, string>,
  squareCharacteristics: {} as Record<string, string>,

  squares: [] as string[],
  publishedEvents: [] as string[],
  completedEvents: [] as string[],
  services: [] as string[],
  tiers: [] as string[][],
}

const hashPassword = (pw: string) => hashSync(pw, 10);

// ─── Categories ───────────────────────────────────────────────────────────────
async function seedCategories() {
  for (const name of SQUARE_CATEGORIES) {
    const c = await prisma.squareCategory.create({ data: { name } });
    createdIds.squareCategories[name] = c.id;
  }

  for (const name of SERVICE_CATEGORIES) {
    const c = await prisma.serviceCategory.create({ data: { name } });
    createdIds.serviceCategories[name] = c.id;
  }

  console.log('✅ Categories seeded');
}

// ─── Volunteer Skills ─────────────────────────────────────────────────────────
async function seedVolunteerSkills() {
  for (const name of VOLUNTEER_SKILLS) {
    const s = await prisma.volunteerSkills.create({ data: { name } });
    createdIds.volunteerSkills[name] = s.id;
  }

  console.log('✅ Volunteer skills seeded');
}

// ─── Square Charecteristics ─────────────────────────────────────────────────────────
async function seedSquareCharecteristics() {
  for (const name of SQUARE_CHARACTERISTICS) {
    const s = await prisma.squareCharacteristics.create({ data: { name } });
    createdIds.squareCharacteristics[name] = s.id;
  }

  console.log('✅ Square charecteristics seeded');
}

// ─── Users ────────────────────────────────────────────────────────────────────
async function seedUsers() {
  for (const u of USERS) {
    const created = await prisma.user.create({
      data: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role as Role,
        passwordHash: hashPassword('12345678'),
        isVerified: true,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
      },
    });
    createdIds.users[u.email] = created.id;
  }

  console.log('✅ Users seeded');
}

// ─── Squares ──────────────────────────────────────────────────────────────────
async function seedSquares() {
  for (const s of SQUARES) {
    const created = await prisma.square.create({
      data: {
        name: s.name,
        description: s.description,
        address: s.address,
        city: s.city,
        latitude: s.latitude,
        longitude: s.longitude,
        capacity: s.capacity,
        pricePerDay: s.pricePerDay,
        imageUrls: s.imageUrls,
        ownerId: createdIds.users[s.vendorKey],
        categoryId: createdIds.squareCategories[s.categoryName],
        characteristics: {
          connect: Object.values(createdIds.squareCharacteristics)
          .slice(0, SQUARE_CHARACTERISTICS.length)
          .map(id => ({ id })),
        },
      },
    });

    createdIds.squares.push(created.id);
  }

  console.log('✅ Squares seeded');
}

// ─── Events ───────────────────────────────────────────────────────────────────
async function seedEvents() {
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
        squareId: createdIds.squares[e.squareIndex],
      },
    });
    createdIds.publishedEvents.push(created.id);
  }

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
        squareId: createdIds.squares[e.squareIndex],
      },
    });
    createdIds.completedEvents.push(created.id);
  }

  await prisma.event.createMany({
    data: DRAFT_EVENTS.map((e) => ({
      title: e.title,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      eventType: e.eventType,
      capacity: e.capacity,
      bannerUrl: e.bannerUrl,
      status: EventStatus.DRAFT,
      organizerId: createdIds.users[e.organizerKey],
    })),
  });

  await prisma.event.createMany({
    data: CANCELLED_EVENTS.map((e) => ({
      title: e.title,
      description: e.description,
      startDate: e.startDate,
      endDate: e.endDate,
      eventType: e.eventType,
      capacity: e.capacity,
      bannerUrl: e.bannerUrl,
      status: EventStatus.CANCELLED,
      organizerId: createdIds.users[e.organizerKey],
    })),
  });

  console.log('✅ Events seeded');
}

// ─── Ticket Tiers ─────────────────────────────────────────────────────────────
async function seedTicketTiers() {
  const allEventIds = [
    ...createdIds.publishedEvents,
    ...createdIds.completedEvents,
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

  console.log('✅ Ticket tiers seeded');
}

// ─── Tickets & Payments ───────────────────────────────────────────────────────
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
    {
      participantKey: 'participant@planner.ai',
      eventIdx: 0,
      tierIdx: 1,
      date: new Date('2025-12-08T10:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant2@planner.ai',
      eventIdx: 0,
      tierIdx: 1,
      date: new Date('2025-12-14T11:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant3@planner.ai',
      eventIdx: 5,
      tierIdx: 0,
      date: new Date('2025-12-20T14:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant4@planner.ai',
      eventIdx: 0,
      tierIdx: 2,
      date: new Date('2026-01-05T09:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant5@planner.ai',
      eventIdx: 2,
      tierIdx: 0,
      date: new Date('2026-01-10T10:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant@planner.ai',
      eventIdx: 1,
      tierIdx: 0,
      date: new Date('2026-01-16T13:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant2@planner.ai',
      eventIdx: 2,
      tierIdx: 1,
      date: new Date('2026-01-21T11:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant3@planner.ai',
      eventIdx: 3,
      tierIdx: 0,
      date: new Date('2026-01-28T15:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant4@planner.ai',
      eventIdx: 4,
      tierIdx: 0,
      date: new Date('2026-02-06T10:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant5@planner.ai',
      eventIdx: 3,
      tierIdx: 1,
      date: new Date('2026-02-12T12:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant@planner.ai',
      eventIdx: 6,
      tierIdx: 1,
      date: new Date('2026-02-18T14:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant2@planner.ai',
      eventIdx: 2,
      tierIdx: 2,
      date: new Date('2026-02-24T11:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant3@planner.ai',
      eventIdx: 4,
      tierIdx: 1,
      date: new Date('2026-03-02T09:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant4@planner.ai',
      eventIdx: 0,
      tierIdx: 0,
      date: new Date('2026-03-07T10:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant5@planner.ai',
      eventIdx: 5,
      tierIdx: 0,
      date: new Date('2026-03-12T13:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant@planner.ai',
      eventIdx: 2,
      tierIdx: 0,
      date: new Date('2026-03-14T10:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant@planner.ai',
      eventIdx: 4,
      tierIdx: 0,
      date: new Date('2026-03-16T11:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant2@planner.ai',
      eventIdx: 1,
      tierIdx: 0,
      date: new Date('2026-03-14T12:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant2@planner.ai',
      eventIdx: 6,
      tierIdx: 0,
      date: new Date('2026-03-17T09:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant3@planner.ai',
      eventIdx: 0,
      tierIdx: 0,
      date: new Date('2026-03-15T10:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant3@planner.ai',
      eventIdx: 2,
      tierIdx: 1,
      date: new Date('2026-03-18T14:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant4@planner.ai',
      eventIdx: 1,
      tierIdx: 0,
      date: new Date('2026-03-15T11:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant4@planner.ai',
      eventIdx: 2,
      tierIdx: 0,
      date: new Date('2026-03-19T09:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
    {
      participantKey: 'participant5@planner.ai',
      eventIdx: 0,
      tierIdx: 0,
      date: new Date('2026-03-16T10:00:00Z'),
      provider: PaymentProvider.CLICK,
    },
    {
      participantKey: 'participant5@planner.ai',
      eventIdx: 4,
      tierIdx: 1,
      date: new Date('2026-03-20T14:00:00Z'),
      provider: PaymentProvider.PAYME,
    },
  ];

  const COMMISSION_RATE = 0.1;
  let qrSeq = 1000;

  for (const p of purchases) {
    const userId = createdIds.users[p.participantKey];
    const eventId = allEventIds[p.eventIdx];
    const tierId = createdIds.tiers[p.eventIdx][p.tierIdx];

    const tier = await prisma.ticketTier.findUnique({ where: { id: tierId } });
    if (!tier) continue;

    const amount = Number(tier.price);
    const commission = amount * COMMISSION_RATE;

    const ticket = await prisma.ticket.create({
      data: {
        userId,
        eventId,
        tierId,
        qrCode: `QR-${p.date.getFullYear()}${String(p.date.getMonth() + 1).padStart(2, '0')}-${qrSeq++}`,
        isUsed: p.eventIdx >= 5,
        createdAt: p.date,
      },
    });

    await prisma.payment.create({
      data: {
        userId,
        type: PaymentType.TICKET,
        ticketId: ticket.id,
        amount,
        commission,
        provider: p.provider,
        providerTxId: `TX-${Date.now()}-${qrSeq}`,
        status: PaymentStatus.PAID,
        createdAt: p.date,
      },
    });
  }

  console.log('✅ Tickets and payments seeded');
}

// ─── Bookings (squares) ───────────────────────────────────────────────────────
async function seedBookings() {
  const bookingsData = [
    {
      squareId: createdIds.squares[0],
      eventId: createdIds.publishedEvents[0],
      userId: createdIds.users['organizer@planner.ai'],
      startDate: new Date('2026-05-20T08:00:00Z'),
      endDate: new Date('2026-05-20T20:00:00Z'),
      status: BookingStatus.CONFIRMED,
      totalCost: 10000000,
    },
    {
      squareId: createdIds.squares[3],
      eventId: createdIds.publishedEvents[2],
      userId: createdIds.users['organizer@planner.ai'],
      startDate: new Date('2026-07-10T15:00:00Z'),
      endDate: new Date('2026-07-12T23:59:00Z'),
      status: BookingStatus.CONFIRMED,
      totalCost: 54000000,
    },
    {
      squareId: createdIds.squares[2],
      eventId: createdIds.publishedEvents[3],
      userId: createdIds.users['organizer2@planner.ai'],
      startDate: new Date('2026-04-25T08:00:00Z'),
      endDate: new Date('2026-04-26T20:00:00Z'),
      status: BookingStatus.CONFIRMED,
      totalCost: 10000000,
    },
    {
      squareId: createdIds.squares[1],
      eventId: createdIds.publishedEvents[1],
      userId: createdIds.users['organizer2@planner.ai'],
      startDate: new Date('2026-06-15T16:00:00Z'),
      endDate: new Date('2026-06-15T23:00:00Z'),
      status: BookingStatus.PENDING,
      totalCost: 7000000,
    },
  ];

  for (const b of bookingsData) {
    const booking = await prisma.booking.create({
      data: {
        userId: b.userId,
        squareId: b.squareId,
        startDate: b.startDate,
        endDate: b.endDate,
        status: b.status,
        totalCost: b.totalCost,
      },
    });

    if (b.status === BookingStatus.CONFIRMED) {
      await prisma.payment.create({
        data: {
          userId: b.userId,
          type: PaymentType.SQUARE,
          bookingId: booking.id,
          amount: b.totalCost,
          commission: b.totalCost * 0.1,
          provider: PaymentProvider.CLICK,
          providerTxId: `TX-SQUARE-${Date.now()}`,
          status: PaymentStatus.PAID,
        },
      });
    }
  }

  console.log('✅ Bookings seeded');
}

// ─── Services ─────────────────────────────────────────────────────────────────
async function seedServices() {
  for (const s of SERVICES) {
    const created = await prisma.service.create({
      data: {
        name: s.name,
        description: s.description,
        priceFrom: s.priceFrom,
        city: s.city,
        imageUrls: s.imageUrls,
        vendorId: createdIds.users[s.vendorKey],
        categoryId: createdIds.serviceCategories[s.categoryName],
      },
    });
    createdIds.services.push(created.id);
  }

  console.log('✅ Services seeded');
}

// ─── Event Services ───────────────────────────────────────────────────────────
async function seedEventServices() {
  const links = [
    {
      eventIdx: 0,
      serviceIdx: 0,
      agreedPrice: 12000000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 0,
      serviceIdx: 1,
      agreedPrice: 7000000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 0,
      serviceIdx: 2,
      agreedPrice: 3000000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 2,
      serviceIdx: 1,
      agreedPrice: 8000000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 2,
      serviceIdx: 2,
      agreedPrice: 3500000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 2,
      serviceIdx: 4,
      agreedPrice: 2000000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 3,
      serviceIdx: 3,
      agreedPrice: 4000000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 4,
      serviceIdx: 4,
      agreedPrice: 1500000,
      status: BookingStatus.PENDING,
    },
    {
      eventIdx: 4,
      serviceIdx: 3,
      agreedPrice: 5000000,
      status: BookingStatus.CONFIRMED,
    },
    {
      eventIdx: 1,
      serviceIdx: 0,
      agreedPrice: 6000000,
      status: BookingStatus.PENDING,
    },
  ];

  for (const l of links) {
    const es = await prisma.eventService.create({
      data: {
        eventId: createdIds.publishedEvents[l.eventIdx],
        serviceId: createdIds.services[l.serviceIdx],
        agreedPrice: l.agreedPrice,
        status: l.status
      },
    });

    if (l.status === BookingStatus.CONFIRMED) {
      const booking = await prisma.booking.create({
        data: {
          userId: createdIds.users['organizer@planner.ai'],
          eventServiceId: es.id,
          status: BookingStatus.CONFIRMED,
          totalCost: l.agreedPrice,
        },
      });

      await prisma.payment.create({
        data: {
          userId: createdIds.users['organizer@planner.ai'],
          type: PaymentType.SERVICE,
          bookingId: booking.id,
          amount: l.agreedPrice,
          commission: l.agreedPrice * 0.1,
          provider: PaymentProvider.PAYME,
          providerTxId: `TX-SERVICE-${Date.now()}-${l.serviceIdx}`,
          status: PaymentStatus.PAID,
        },
      });
    }
  }

  console.log('✅ Event services seeded');
}

// ─── Volunteers ───────────────────────────────────────────────────────────────
async function seedVolunteers() {
  const apps = [
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 0,
      skillName: 'registration',
      status: VolunteerRequestStatus.ACCEPTED,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 0,
      skillName: 'translation',
      status: VolunteerRequestStatus.ACCEPTED,
    },
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 1,
      skillName: 'tech support',
      status: VolunteerRequestStatus.PENDING,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 1,
      skillName: 'registration',
      status: VolunteerRequestStatus.REJECTED,
    },
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 2,
      skillName: 'stage management',
      status: VolunteerRequestStatus.ACCEPTED,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 2,
      skillName: 'audio monitoring',
      status: VolunteerRequestStatus.PENDING,
    },
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 3,
      skillName: 'coordination',
      status: VolunteerRequestStatus.REJECTED,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 3,
      skillName: 'design review',
      status: VolunteerRequestStatus.ACCEPTED,
    },
    {
      userKey: 'volunteer@planner.ai',
      eventIdx: 4,
      skillName: 'art installation',
      status: VolunteerRequestStatus.PENDING,
    },
    {
      userKey: 'volunteer2@planner.ai',
      eventIdx: 4,
      skillName: 'art curation',
      status: VolunteerRequestStatus.ACCEPTED,
    },
  ];

  for (const a of apps) {
    await prisma.volunteer.create({
      data: {
        userId: createdIds.users[a.userKey],
        eventId: createdIds.publishedEvents[a.eventIdx],
        skillId: createdIds.volunteerSkills[a.skillName],
        status: a.status,
      },
    });
  }

  console.log('✅ Volunteers seeded');
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
async function seedReviews() {
  for (const r of SQUARE_REVIEWS) {
    await prisma.review.create({
      data: {
        authorId: createdIds.users[r.userKey],
        squareId: createdIds.squares[r.squareIdx],
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

  console.log('✅ Reviews seeded');
}

// ─── Rating Stats ─────────────────────────────────────────────────────────────
async function seedRatingStats() {
  const compute = (ratings: number[]) => ({
    avg: ratings.reduce((s, r) => s + r, 0) / ratings.length,
    count: ratings.length,
    one: ratings.filter((r) => r === 1).length,
    two: ratings.filter((r) => r === 2).length,
    three: ratings.filter((r) => r === 3).length,
    four: ratings.filter((r) => r === 4).length,
    five: ratings.filter((r) => r === 5).length,
  });

  for (const squareId of createdIds.squares) {
    const reviews = await prisma.review.findMany({ where: { squareId } });
    if (!reviews.length) continue;
    await prisma.ratingStats.create({
      data: {
        squareId,
        ...compute(reviews.map((r) => r.rating)),
        updatedAt: new Date(),
      },
    });
  }

  for (const serviceId of createdIds.services) {
    const reviews = await prisma.review.findMany({ where: { serviceId } });
    if (!reviews.length) continue;
    await prisma.ratingStats.create({
      data: {
        serviceId,
        ...compute(reviews.map((r) => r.rating)),
        updatedAt: new Date(),
      },
    });
  }

  console.log('✅ Rating stats seeded');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function up() {
  await seedCategories();
  await seedVolunteerSkills();
  await seedSquareCharecteristics();
  await seedUsers();
  await seedSquares();
  await seedEvents();
  await seedTicketTiers();
  await seedTicketsAndPayments();
  await seedBookings();
  await seedServices();
  await seedEventServices();
  await seedVolunteers();
  await seedReviews();
  await seedRatingStats();
  console.log('✅ Done');
}

async function down() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "RatingStats",
      "Review",
      "Volunteer",
      "VolunteerSkills",
      "SquareCharacteristics",
      "ServiceBadge",
      "SquareBadge",
      "Badge",
      "Boost",
      "Payment",
      "Booking",
      "EventService",
      "Ticket",
      "TicketTier",
      "Event",
      "Square",
      "Service",
      "SquareCategory",
      "ServiceCategory",
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
