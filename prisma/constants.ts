import { hashSync } from 'bcrypt';

export const HASHED_PASSWORD = hashSync('12345678', 10);

export const USERS = [
  {
    email: 'admin@planner.ai',
    firstName: 'System',
    lastName: 'Admin',
    role: 'ADMIN',
  },
  {
    email: 'organizer@planner.ai',
    firstName: 'Event',
    lastName: 'Organizer',
    role: 'ORGANIZER',
  },
  {
    email: 'vendor@planner.ai',
    firstName: 'Catering',
    lastName: 'Vendor',
    role: 'VENDOR',
  },
  {
    email: 'volunteer@planner.ai',
    firstName: 'Volunteer',
    lastName: 'User',
    role: 'VOLUNTEER',
  },
  {
    email: 'participant@planner.ai',
    firstName: 'Regular',
    lastName: 'Participant',
    role: 'PARTICIPANT',
  },
];

export const VENUES = [
  {
    name: 'Tashkent City Hall',
    description: 'Premium event venue in the heart of Tashkent',
    address: 'Amir Temur Avenue 1',
    city: 'Tashkent',
    latitude: 41.3115,
    longitude: 69.2401,
    capacity: 500,
    pricePerDay: 10000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    imageUrls: ['https://example.com/venue1.jpg'],
  },
  {
    name: 'Samarkand Garden',
    description: 'Beautiful outdoor venue with historical views',
    address: 'Registan Street 15',
    city: 'Samarkand',
    latitude: 39.627,
    longitude: 66.975,
    capacity: 300,
    pricePerDay: 7000000,
    isIndoor: false,
    hasWifi: false,
    hasParking: true,
    hasSound: false,
    hasStage: false,
    imageUrls: ['https://example.com/venue2.jpg'],
  },
  {
    name: 'Bukhara Conference Hall',
    description: 'Modern conference center with traditional architecture',
    address: 'Po-i-Kalon Street 8',
    city: 'Bukhara',
    latitude: 39.7747,
    longitude: 64.4286,
    capacity: 200,
    pricePerDay: 5000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    imageUrls: ['https://example.com/venue3.jpg'],
  },
];

export const EVENTS = [
  {
    title: 'Marketing Forum 2026',
    description: 'Annual marketing conference in Tashkent with industry leaders',
    startDate: new Date('2026-05-20T10:00:00Z'),
    endDate: new Date('2026-05-20T18:00:00Z'),
    eventType: 'Conference',
    capacity: 300,
  },
  {
    title: 'Tech Startup Meetup',
    description: 'Networking event for tech entrepreneurs and investors',
    startDate: new Date('2026-06-15T18:00:00Z'),
    endDate: new Date('2026-06-15T22:00:00Z'),
    eventType: 'Meetup',
    capacity: 100,
  },
];

export const TICKET_TIERS = [
  {
    name: 'Standard',
    price: 200000,
    quantity: 200,
  },
  {
    name: 'VIP',
    price: 500000,
    quantity: 50,
  },
  {
    name: 'Early Bird',
    price: 150000,
    quantity: 50,
  },
];

export const SERVICES = [
  {
    name: 'Premium Catering Service',
    category: 'CATERING',
    description: 'Full-service catering for events of all sizes',
    priceFrom: 15000000,
    city: 'Tashkent',
    imageUrls: ['https://example.com/catering.jpg'],
  },
  {
    name: 'Elite Sound & Light',
    category: 'SOUND',
    description: 'Professional sound and lighting equipment rental',
    priceFrom: 8000000,
    city: 'Tashkent',
    imageUrls: ['https://example.com/sound.jpg'],
  },
  {
    name: 'Capture Moments Photography',
    category: 'PHOTO',
    description: 'Professional event photography and videography',
    priceFrom: 3000000,
    city: 'Tashkent',
    imageUrls: ['https://example.com/photo.jpg'],
  },
  {
    name: 'Elegant Decor Studio',
    category: 'DECORATION',
    description: 'Custom event decoration and floral arrangements',
    priceFrom: 5000000,
    city: 'Tashkent',
    imageUrls: ['https://example.com/decor.jpg'],
  },
  {
    name: 'SecureGuard Services',
    category: 'SECURITY',
    description: 'Professional security personnel for events',
    priceFrom: 2000000,
    city: 'Tashkent',
    imageUrls: ['https://example.com/security.jpg'],
  },
];

export const TASKS = [
  {
    title: 'Sign catering contract',
  },
  {
    title: 'Book sound equipment',
  },
  {
    title: 'Confirm venue setup',
  },
  {
    title: 'Send invitations to VIP guests',
  },
];
