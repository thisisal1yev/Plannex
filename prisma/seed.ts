import 'dotenv/config';
import { hashSync } from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';
import { EventStatus } from '../generated/prisma/enums';
import { EVENTS, TICKET_TIERS, SERVICES, VENUES, USERS } from './constants';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({adapter});

const createdIds = {
  users: {} as Record<string, string>,
  venues: [] as string[],
  events: [] as string[],
  services: [] as string[],
};

const hashPassword = (password: string) => hashSync(password, 10);

async function seedUsers() {
  console.log('👤 Creating users...');

  for (const userData of USERS) {
    const created = await prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role as any,
        passwordHash: hashPassword('12345678'),
        isVerified: true,
      },
    });

    createdIds.users[userData.email] = created.id;
    console.log(`   ✓ Created user: ${userData.email}`);
  }

  console.log(`   Total: ${Object.keys(createdIds.users).length} users\n`);
}

async function seedVenues() {
  console.log('🏟 Creating venues...');

  const ownerId = createdIds.users['admin@planner.ai'];

  for (const venueData of VENUES) {
    const created = await prisma.venue.create({
      data: {
        ...venueData,
        ownerId,
      },
    });

    createdIds.venues.push(created.id);
    console.log(`   ✓ Created venue: ${created.name}`);
  }

  console.log(`   Total: ${createdIds.venues.length} venues\n`);
}

async function seedEvents() {
  console.log('🎉 Creating events...');

  const organizerId = createdIds.users['organizer@planner.ai'];
  const venueId = createdIds.venues[0];

  for (const eventData of EVENTS) {
    const created = await prisma.event.create({
      data: {
        ...eventData,
        organizerId,
        venueId,
        status: EventStatus.PUBLISHED,
      },
    });

    createdIds.events.push(created.id);
    console.log(`   ✓ Created event: ${created.title}`);
  }

  console.log(`   Total: ${createdIds.events.length} events\n`);
}

async function seedTicketTiers() {
  console.log('🎫 Creating ticket tiers...');

  const eventId = createdIds.events[0];

  for (const tierData of TICKET_TIERS) {
    await prisma.ticketTier.create({
      data: {
        ...tierData,
        eventId,
      },
    });
    console.log(`   ✓ Created tier: ${tierData.name}`);
  }

  console.log(`   Total: ${TICKET_TIERS.length} ticket tiers\n`);
}

async function seedServices() {
  console.log('🛠 Creating services...');

  const vendorId = createdIds.users['vendor@planner.ai'];

  for (const serviceData of SERVICES) {
    const created = await prisma.service.create({
      data: {
        ...serviceData,
        vendorId,
      },
    });

    createdIds.services.push(created.id);
    console.log(`   ✓ Created service: ${created.name}`);
  }

  console.log(`   Total: ${createdIds.services.length} services\n`);
}

async function seedVolunteerApplications() {
  console.log('🙋 Creating volunteer applications...');

  const volunteerId = createdIds.users['volunteer@planner.ai'];
  const eventId = createdIds.events[0];

  await prisma.volunteerApplication.create({
    data: {
      userId: volunteerId,
      eventId,
      skills: ['registration', 'guest support', 'translation'],
      status: 'PENDING',
    },
  });

  console.log(`   ✓ Created volunteer application\n`);
}

async function seedReviews() {
  console.log('⭐ Creating reviews...');

  const adminId = createdIds.users['admin@planner.ai'];
  const venueId = createdIds.venues[0];
  const serviceId = createdIds.services[0];
  const eventId = createdIds.events[0];

  // Review for venue
  await prisma.review.create({
    data: {
      authorId: adminId,
      venueId,
      rating: 5,
      comment: 'Excellent venue with great facilities!',
    },
  });
  console.log('   ✓ Created venue review');

  // Review for service
  await prisma.review.create({
    data: {
      authorId: adminId,
      serviceId,
      rating: 4,
      comment: 'Great service, professional team.',
    },
  });
  console.log('   ✓ Created service review');

  // Review for event
  await prisma.review.create({
    data: {
      authorId: adminId,
      eventId,
      rating: 5,
      comment: 'Amazing event, well organized!',
    },
  });
  console.log('   ✓ Created event review\n');
}

async function up() {
  console.log('🌱 Starting PLANNEX seed...\n');

  await seedUsers();
  await seedVenues();
  await seedEvents();
  await seedTicketTiers();
  await seedServices();
  await seedVolunteerApplications();
  await seedReviews();

  console.log('✅ Seed completed successfully!');
}

async function down() {
  console.log('🧹 Cleaning database...\n');

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Review",
      "VolunteerApplication",
      "EventService",
      "VenueBooking",
      "Ticket",
      "TicketTier",
      "Payment",
      "Event",
      "Venue",
      "Service",
      "User"
    RESTART IDENTITY CASCADE
  `);

  console.log('✅ Database cleaned!\n');
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
