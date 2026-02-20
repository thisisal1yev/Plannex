import { UserRole, EventStatus, ServiceType } from 'generated/prisma/enums';
import { hashSync } from 'bcrypt';

export const HASHED_PASSWORD = hashSync('12345678', 10);

export const USERS = [
  {
    email: 'admin@planner.ai',
    fullName: 'System Admin',
    role: UserRole.ADMIN,
  },
  {
    email: 'organizer@planner.ai',
    fullName: 'Event Organizer',
    role: UserRole.ORG_OWNER,
  },
  {
    email: 'vendor@planner.ai',
    fullName: 'Catering Vendor',
    role: UserRole.VENDOR,
  },
  {
    email: 'volunteer@planner.ai',
    fullName: 'Volunteer User',
    role: UserRole.VOLUNTEER,
  },
];

export const ORGANIZATION = {
  name: 'Plannex Agency',
  slug: 'planner-ai-agency',
  description: 'Professional event management agency',
};

export const VENUE = {
  name: 'Tashkent City Hall',
  city: 'Tashkent',
  address: 'Amir Temur Avenue 1',
  capacity: 500,
  priceFrom: 10000000,
};

export const EVENT = {
  title: 'Marketing Forum 2026',
  description: 'Annual marketing conference in Tashkent',
  startsAt: new Date('2026-05-20T10:00:00Z'),
  endsAt: new Date('2026-05-20T18:00:00Z'),
  status: EventStatus.PUBLISHED,
  capacity: 300,
};

export const TICKET_TYPES = [
  {
    name: 'Standard',
    price: 200000,
    quantityTotal: 200,
  },
  {
    name: 'VIP',
    price: 500000,
    quantityTotal: 50,
  },
];

export const VENDOR_SERVICE = {
  type: ServiceType.CATERING,
  title: 'Full Catering Service',
  priceFrom: 15000000,
};

export const TASKS = [
  {
    title: 'Sign catering contract',
  },
  {
    title: 'Book sound equipment',
  },
];
