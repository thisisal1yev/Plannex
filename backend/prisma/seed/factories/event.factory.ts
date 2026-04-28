import type { Faker } from '@faker-js/faker';
import { EventStatus } from '../../../generated/prisma/enums';
import { daysFromNow, addHours } from '../helpers/dates';
import { validateDateOrder } from '../helpers/validators';

export type GeneratedEvent = {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  categoryName: string;
  capacity: number;
  bannerUrls: string[];
  status: EventStatus;
};

const EVENT_TITLE_TEMPLATES = [
  '{{category}} 2026: {{topic}}',
  '{{city}} {{category}} Week',
  '{{topic}} {{category}}',
  'Annual {{category}}: {{topic}}',
];

const TOPICS = [
  'Digital Marketing', 'Web3 & Blockchain', 'Product Design',
  'Mobile Development', 'Data Science', 'Cybersecurity',
  'Fintech Revolution', 'Sustainable Tech', 'AI Innovations',
  'Creative Economy', 'Future of Work', 'EdTech Horizon',
];

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Namangan'];

const BANNER_POOL = [
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=80',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1400&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80',
  'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1400&q=80',
];

export function makeEvent(
  f: Faker,
  options: { categoryName: string; status: EventStatus },
): GeneratedEvent {
  const topic = f.helpers.arrayElement(TOPICS);
  const city = f.helpers.arrayElement(CITIES);
  const template = f.helpers.arrayElement(EVENT_TITLE_TEMPLATES);
  const title = template
    .replace('{{category}}', options.categoryName)
    .replace('{{topic}}', topic)
    .replace('{{city}}', city);

  let startOffsetDays: number;
  switch (options.status) {
    case EventStatus.PUBLISHED:   startOffsetDays =  f.number.int({ min: 5,   max: 180 }); break;
    case EventStatus.DRAFT:       startOffsetDays =  f.number.int({ min: 30,  max: 365 }); break;
    case EventStatus.COMPLETED:   startOffsetDays = -f.number.int({ min: 5,   max: 90  }); break;
    case EventStatus.CANCELLED:   startOffsetDays =  f.number.int({ min: -30, max: 30  }); break;
  }

  const startDate = daysFromNow(startOffsetDays!);
  const durationHours = f.number.int({ min: 3, max: 48 });
  const endDate = addHours(startDate, durationHours);

  validateDateOrder(startDate, endDate, `makeEvent "${title}"`);

  return {
    title,
    description: f.lorem.paragraph(2),
    startDate,
    endDate,
    categoryName: options.categoryName,
    capacity: f.number.int({ min: 50, max: 800 }),
    bannerUrls: f.helpers.arrayElements(BANNER_POOL, { min: 1, max: 2 }),
    status: options.status,
  };
}
