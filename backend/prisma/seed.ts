import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { SeedRegistry } from './seed/types';
import { initFaker } from './seed/helpers/faker';
import { seedReference } from './seed/seeders/00_reference.seeder';
import { seedUsers } from './seed/seeders/01_users.seeder';
import { seedSquares } from './seed/seeders/02_squares.seeder';
import { seedServices } from './seed/seeders/03_services.seeder';
import { seedEvents } from './seed/seeders/04_events.seeder';
import { seedTicketsAndPayments } from './seed/seeders/05_tickets.seeder';
import { seedBookings } from './seed/seeders/06_bookings.seeder';
import { seedVolunteers } from './seed/seeders/07_volunteers.seeder';
import { seedReviews } from './seed/seeders/08_reviews.seeder';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function up() {
  const start = Date.now();
  const registry = new SeedRegistry();
  const f = initFaker();

  await seedReference(prisma, registry);
  await seedUsers(prisma, registry, f);
  await seedSquares(prisma, registry, f);
  await seedServices(prisma, registry, f);
  await seedEvents(prisma, registry, f);
  await seedTicketsAndPayments(prisma, registry, f);
  await seedBookings(prisma, registry, f);
  await seedVolunteers(prisma, registry, f);
  await seedReviews(prisma, registry, f);

  console.log(`✅ Seed completed in ${((Date.now() - start) / 1000).toFixed(1)}s`);
}

async function down() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "RatingStats",
      "Review",
      "Volunteer",
      "VolunteerSkill",
      "SquareCharacteristic",
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
      "EventCategory",
      "Square",
      "Service",
      "SquareCategory",
      "ServiceCategory",
      "User"
    RESTART IDENTITY CASCADE
  `);
  console.log('🧹 Tables truncated');
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
