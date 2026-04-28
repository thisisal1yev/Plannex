import { EventStatus } from '../../../generated/prisma/enums';
import {
  CuratedUserKey,
  CuratedSquareKey,
  CuratedEventKey,
  type EventSeed,
} from '../types';

export const PUBLISHED_EVENTS: EventSeed[] = [
  {
    key: CuratedEventKey.MARKETING_FORUM,
    title: 'Marketing Forum 2026',
    description:
      'Toshkentda sanoat yetakchilarining ishtirokidagi yillik marketing konferensiyasi.',
    startOffsetDays: 29,
    startHour: 10,
    durationHours: 8,
    categoryName: 'Konferensiya',
    capacity: 300,
    bannerUrls: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.PUBLISHED,
    organizerKey: CuratedUserKey.ORGANIZER_1,
    squareKey: CuratedSquareKey.TASHKENT_CITY_HALL,
  },
  {
    key: CuratedEventKey.TECH_MEETUP,
    title: 'Tech Startup Meetup',
    description:
      'Texnologiya tadbirkorlari va investorlar uchun networking uchrashuvi.',
    startOffsetDays: 55,
    startHour: 18,
    durationHours: 4,
    categoryName: 'Mitap',
    capacity: 100,
    bannerUrls: [
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.PUBLISHED,
    organizerKey: CuratedUserKey.ORGANIZER_2,
    squareKey: CuratedSquareKey.SAMARKAND_GARDEN,
  },
  {
    key: CuratedEventKey.JAZZ_FESTIVAL,
    title: 'Tashkent Jazz Festival',
    description:
      "Ochiq havoda o'tkaziladigan yillik jazz festivali. 15 ta guruh, uch sahna.",
    startOffsetDays: 80,
    startHour: 17,
    durationHours: 54,
    categoryName: 'Festival',
    capacity: 500,
    bannerUrls: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.PUBLISHED,
    organizerKey: CuratedUserKey.ORGANIZER_1,
    squareKey: CuratedSquareKey.NAVOI_PALACE,
  },
  {
    key: CuratedEventKey.UX_WORKSHOP,
    title: 'UX/UI Design Workshop',
    description:
      "Mahsulot dizayni bo'yicha ikki kunlik amaliy workshop. Figma, prototiplash.",
    startOffsetDays: 4,
    startHour: 9,
    durationHours: 33,
    categoryName: 'Trening',
    capacity: 50,
    bannerUrls: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.PUBLISHED,
    organizerKey: CuratedUserKey.ORGANIZER_2,
    squareKey: CuratedSquareKey.BUKHARA_CONFERENCE,
  },
  {
    key: CuratedEventKey.SILK_ROAD_EXHIBITION,
    title: "Ko'rgazma «Ipak yo'li»",
    description:
      "Markaziy Osiyo mamlakatlaridan 30 ta rassomning guruh ko'rgazmasi.",
    startOffsetDays: 10,
    startHour: 10,
    durationHours: 346,
    categoryName: "Ko'rgazma",
    capacity: 200,
    bannerUrls: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.PUBLISHED,
    organizerKey: CuratedUserKey.ORGANIZER_1,
    squareKey: CuratedSquareKey.ANDIJAN_EXPO,
  },
];

export const COMPLETED_EVENTS: EventSeed[] = [
  {
    key: CuratedEventKey.NEW_YEAR_TECH_PARTY,
    title: 'New Year Tech Party 2025',
    description:
      'Toshkent IT-hamjamiyatining bayram kechasi. DJ set va networking.',
    startOffsetDays: -115,
    startHour: 20,
    durationHours: 7,
    categoryName: 'Kecha',
    capacity: 200,
    bannerUrls: [
      'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.COMPLETED,
    organizerKey: CuratedUserKey.ORGANIZER_1,
    squareKey: CuratedSquareKey.TASHKENT_CITY_HALL,
  },
  {
    key: CuratedEventKey.SILK_ROAD_CUISINE_FAIR,
    title: 'Silk Road Cuisine Fair',
    description:
      'Markaziy Osiyo milliy oshxonalarining gastro-yarmarkasi. 50 ta restoran.',
    startOffsetDays: -96,
    startHour: 11,
    durationHours: 58,
    categoryName: 'Festival',
    capacity: 800,
    bannerUrls: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.COMPLETED,
    organizerKey: CuratedUserKey.ORGANIZER_2,
    squareKey: CuratedSquareKey.ANDIJAN_EXPO,
  },
];

export const DRAFT_EVENTS: EventSeed[] = [
  {
    key: 'AI_CONFERENCE' as CuratedEventKey,
    title: 'AI & Data Science Conference',
    description:
      "Sun'iy intellekt va ma'lumotlar tahlili bo'yicha xalqaro konferensiya.",
    startOffsetDays: 142,
    startHour: 9,
    durationHours: 33,
    categoryName: 'Konferensiya',
    capacity: 400,
    bannerUrls: [
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.DRAFT,
    organizerKey: CuratedUserKey.ORGANIZER_2,
  },
  {
    key: 'STARTUP_DEMO_DAY' as CuratedEventKey,
    title: 'Startup Demo Day',
    description:
      "20 ta jamoa o'z mahsulotlari va biznes-modellarini investorlar oldida taqdim etadi.",
    startOffsetDays: 106,
    startHour: 10,
    durationHours: 9,
    categoryName: 'Mitap',
    capacity: 150,
    bannerUrls: [
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.DRAFT,
    organizerKey: CuratedUserKey.ORGANIZER_1,
  },
];

export const CANCELLED_EVENTS: EventSeed[] = [
  {
    key: 'WINTER_MUSIC_FEST' as CuratedEventKey,
    title: 'Winter Music Fest',
    description:
      'Qishki musiqa festivali — ob-havo sharoiti tufayli bekor qilindi.',
    startOffsetDays: -70,
    startHour: 17,
    durationHours: 6,
    categoryName: 'Festival',
    capacity: 300,
    bannerUrls: [
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&auto=format&fit=crop&q=80',
    ],
    status: EventStatus.CANCELLED,
    organizerKey: CuratedUserKey.ORGANIZER_1,
  },
];

