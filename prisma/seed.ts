import { PrismaPg } from '@prisma/adapter-pg';
import { hashSync } from 'bcrypt';
import { addDays } from 'date-fns';

import { PrismaClient } from 'generated/prisma/client';
import { EventStatus } from 'generated/prisma/enums';
import {
  EVENT,
  ORGANIZATION,
  TASKS,
  TICKET_TYPES,
  USERS,
  VENDOR_SERVICE,
  VENUE,
} from './constants';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const createdIds = {
  users: {} as Record<string, string>,
  organizationId: '' as string,
  venueId: '' as string,
  eventId: '' as string,
  vendorProfileId: '' as string,
};

const hashPassword = (password: string) => hashSync(password, 10);

async function seedUsers() {
  console.log('👤 Creating users...');

  for (const user of USERS) {
    const created = await prisma.user.create({
      data: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        passwordHash: hashPassword('123456'),
      },
    });

    createdIds.users[user.email] = created.id;
  }

}

async function seedOrganization() {
  console.log('🏢 Creating organization...');

  const organizerId = createdIds.users['organizer@planner.ai'];

  const org = await prisma.organization.create({
    data: {
      ...ORGANIZATION,
      ownerId: organizerId,
    },
  });

  createdIds.organizationId = org.id;
}

async function seedVenue() {
  console.log('🏟  Creating venue...');

  const venue = await prisma.venue.create({
    data: VENUE,
  });

  createdIds.venueId = venue.id;
}

async function seedEvent() {
  console.log('🎉 Creating event...');

  const organizerId = createdIds.users['organizer@planner.ai'];

  const event = await prisma.event.create({
    data: {
      ...EVENT,
      status: EventStatus.PUBLISHED,
      organizationId: createdIds.organizationId,
      venueId: createdIds.venueId,
      createdById: organizerId,
    },
  });

  createdIds.eventId = event.id;
}

async function seedTicketTypes() {
  console.log('🎟  Creating ticket types...');

  for (const ticket of TICKET_TYPES) {
    await prisma.ticketType.create({
      data: {
        ...ticket,
        eventId: createdIds.eventId,
      },
    });
  }
}

async function seedVendor() {
  console.log('🍽  Creating vendor...');

  const vendorUserId = createdIds.users['vendor@planner.ai'];

  const vendorProfile = await prisma.vendorProfile.create({
    data: {
      userId: vendorUserId,
      displayName: 'Premium Catering',
      city: 'Tashkent',
    },
  });

  createdIds.vendorProfileId = vendorProfile.id;

  await prisma.vendorService.create({
    data: {
      ...VENDOR_SERVICE,
      vendorId: vendorProfile.id,
    },
  });
}

async function seedVolunteer() {
  console.log('🙋 Creating volunteer...');

  const volunteerUserId = createdIds.users['volunteer@planner.ai'];

  await prisma.volunteerProfile.create({
    data: {
      userId: volunteerUserId,
      city: 'Tashkent',
      skills: ['registration', 'guest support'],
    },
  });
}

async function seedTasks() {
  console.log('📋 Creating tasks...');

  for (const task of TASKS) {
    await prisma.task.create({
      data: {
        title: task.title,
        eventId: createdIds.eventId,
        dueAt: addDays(new Date(), 7),
      },
    });
  }
}

async function up() {
  console.log('🌱 Starting PLANNEX seed...\n');

  await seedUsers();
  await seedOrganization();
  await seedVenue();
  await seedEvent();
  await seedTicketTypes();
  await seedVendor();
  await seedVolunteer();
  await seedTasks();

  console.log('\n✅ Seed completed successfully!');
}

async function down() {
  console.log('🧹 Cleaning database...\n');

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE 
      "Review",
      "Task",
      "VendorService",
      "VendorProfile",
      "VolunteerProfile",
      "Ticket",
      "TicketType",
      "OrderItem",
      "Order",
      "Event",
      "Venue",
      "OrganizationMember",
      "Organization",
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
