import { hashSync } from 'bcrypt';
import { ServiceCategory } from '../generated/prisma/enums';

export const HASHED_PASSWORD = hashSync('12345678', 10);

// ─── Users ──────────────────────────────────────────────────────────────────
// createdAt spread across last 4 months so weekly-growth chart has real data
export const USERS = [
  {
    email: 'admin@planner.ai',
    firstName: 'Elon',
    lastName: 'Musk',
    role: 'ADMIN',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg',
    createdAt: new Date('2025-12-01T09:00:00Z'),
  },
  {
    email: 'organizer@planner.ai',
    firstName: 'Sam',
    lastName: 'Altman',
    role: 'ORGANIZER',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/f/f8/Sam_Altman_TechCrunch_SF_2019_Day_2_Oct_3_%28cropped_3%29.jpg',
    createdAt: new Date('2026-01-10T09:00:00Z'),
  },
  {
    email: 'organizer2@planner.ai',
    firstName: 'Sundar',
    lastName: 'Pichai',
    role: 'ORGANIZER',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sundar_Pichai_-_2023_%28cropped%29.jpg',
    createdAt: new Date('2026-01-14T09:00:00Z'),
  },
  {
    email: 'vendor@planner.ai',
    firstName: 'Linus',
    lastName: 'Torvalds',
    role: 'VENDOR',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/e8/Lc3_2018_%28263682303%29_%28cropped%29.jpeg',
    createdAt: new Date('2026-01-20T09:00:00Z'),
  },
  {
    email: 'vendor2@planner.ai',
    firstName: 'Tim',
    lastName: 'Cook',
    role: 'VENDOR',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/88/Tim_Cook_March_2026_%28cropped%29.jpg',
    createdAt: new Date('2026-02-04T09:00:00Z'),
  },
  // Week 1: Feb 15–22
  {
    email: 'volunteer@planner.ai',
    firstName: 'Jensen',
    lastName: 'Huang',
    role: 'VOLUNTEER',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Jen-Hsun_Huang_2025.jpg',
    createdAt: new Date('2026-02-16T10:00:00Z'),
  },
  {
    email: 'volunteer2@planner.ai',
    firstName: 'Satya',
    lastName: 'Nadella',
    role: 'VOLUNTEER',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg',
    createdAt: new Date('2026-02-21T10:00:00Z'),
  },
  // Week 2: Feb 22 – Mar 1
  {
    email: 'participant@planner.ai',
    firstName: 'Mark',
    lastName: 'Zuckerberg',
    role: 'PARTICIPANT',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/2/21/Mark_Zuckerberg_in_September_2025_%28cropped%29.jpg',
    createdAt: new Date('2026-02-24T10:00:00Z'),
  },
  {
    email: 'participant2@planner.ai',
    firstName: 'Jeff',
    lastName: 'Bezos',
    role: 'PARTICIPANT',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/03/Jeff_Bezos_visits_LAAFB_SMC_%283908618%29_%28cropped%29.jpeg',
    createdAt: new Date('2026-02-27T10:00:00Z'),
  },
  // Week 3: Mar 1–8
  {
    email: 'participant3@planner.ai',
    firstName: 'Bill',
    lastName: 'Gates',
    role: 'PARTICIPANT',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/88/Bill_Gates_at_the_European_Commission_-_2025_-_P067383-987995_%28cropped%29.jpg',
    createdAt: new Date('2026-03-03T10:00:00Z'),
  },
  {
    email: 'participant4@planner.ai',
    firstName: 'Sheryl',
    lastName: 'Sandberg',
    role: 'PARTICIPANT',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/61/Sheryl_Sandberg_WEF_2013_%28crop_by_James_Tamim%29.jpg',
    createdAt: new Date('2026-03-06T10:00:00Z'),
  },
  // Week 4: Mar 8–15
  {
    email: 'participant5@planner.ai',
    firstName: 'Reed',
    lastName: 'Hastings',
    role: 'PARTICIPANT',
    avatarUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Re_publica_2015_-_Tag_1_%2817381870955%29_%28cropped%29.jpg',
    createdAt: new Date('2026-03-11T10:00:00Z'),
  },
];

// ─── Venues ─────────────────────────────────────────────────────────────────
export const VENUES = [
  {
    name: 'Tashkent City Hall',
    description:
      "Toshkentning markazida zamonaviy jihozlangan premium maydon. 500 kishigacha sig'imi bor.",
    address: "Amir Temur shoh ko'chasi, 1",
    city: 'Toshkent',
    latitude: 41.3115,
    longitude: 69.2401,
    capacity: 500,
    pricePerDay: 10000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    rating: 4.5,
    imageUrls: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor@planner.ai',
  },
  {
    name: 'Samarkand Garden',
    description:
      'Samarqandning tarixiy yodgorliklariga qarab turadigan manzarali ochiq maydon. Outdoor tadbirlar uchun ideal.',
    address: "Registon ko'chasi, 15",
    city: 'Samarqand',
    latitude: 39.627,
    longitude: 66.975,
    capacity: 300,
    pricePerDay: 7000000,
    isIndoor: false,
    hasWifi: false,
    hasParking: true,
    hasSound: false,
    hasStage: false,
    rating: 4.8,
    imageUrls: [
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor@planner.ai',
  },
  {
    name: 'Bukhara Conference Hall',
    description:
      "Buxoroning tarixiy markazida an'anaviy me'morchilik uslubidagi zamonaviy konferens-markaz.",
    address: "Po-i-Kalon ko'chasi, 8",
    city: 'Buxoro',
    latitude: 39.7747,
    longitude: 64.4286,
    capacity: 200,
    pricePerDay: 5000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    rating: 4.2,
    imageUrls: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582481725274-d63bdf929a90?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor@planner.ai',
  },
  {
    name: 'Navoi Palace',
    description:
      "Tantanali tadbirlar, to'ylar va korporativ gala-kechalar uchun hashamatli saroy.",
    address: "Navoiy ko'chasi, 30",
    city: 'Toshkent',
    latitude: 41.3205,
    longitude: 69.2654,
    capacity: 800,
    pricePerDay: 18000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    rating: 4.9,
    imageUrls: [
      'https://images.unsplash.com/photo-1561489396-888724a1543d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor2@planner.ai',
  },
  {
    name: 'Andijan Expo Center',
    description:
      "Ko'rgazmalar, yarmarkalar va ommaviy tadbirlar uchun moslashuvchan rejalashtirish imkoniyatli keng ko'rgazma markazi.",
    address: 'Bobur prospekti, 55',
    city: 'Andijon',
    latitude: 40.7829,
    longitude: 72.3442,
    capacity: 1000,
    pricePerDay: 8000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: false,
    hasStage: false,
    rating: 4.0,
    imageUrls: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor2@planner.ai',
  },
];

// ─── Published Events ────────────────────────────────────────────────────────
export const PUBLISHED_EVENTS = [
  {
    title: 'Marketing Forum 2026',
    description:
      'Toshkentda sanoat yetakchilarining ishtirokidagi yillik marketing konferensiyasi. Networking, masterklaslar va Markaziy Osiyoning yetakchi brendlaridan taqdimotlar.',
    startDate: new Date('2026-05-20T10:00:00Z'),
    endDate: new Date('2026-05-20T18:00:00Z'),
    eventType: 'Konferensiya',
    capacity: 300,
    bannerUrl: [
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1400&auto=format&fit=crop&q=80',
    ],
    venueIndex: 0,
    organizerKey: 'organizer@planner.ai',
  },
  {
    title: 'Tech Startup Meetup',
    description:
      'Texnologiya tadbirkorlari va investorlar uchun networking uchrashuvi. Pitch-sessiyalar, mentorlik va tajriba almashish.',
    startDate: new Date('2026-06-15T18:00:00Z'),
    endDate: new Date('2026-06-15T22:00:00Z'),
    eventType: 'Mitap',
    capacity: 100,
    bannerUrl: [
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&auto=format&fit=crop&q=80',
    ],
    venueIndex: 1,
    organizerKey: 'organizer2@planner.ai',
  },
  {
    title: 'Tashkent Jazz Festival',
    description:
      "Ochiq havoda o'tkaziladigan yillik jazz festivali. O'zbekiston, Rossiya va Yevropadan 15 ta guruh. Uch sahna, food-zona va art-installatsiyalar.",
    startDate: new Date('2026-07-10T17:00:00Z'),
    endDate: new Date('2026-07-12T23:00:00Z'),
    eventType: 'Festival',
    capacity: 500,
    bannerUrl: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    ],
    venueIndex: 3,
    organizerKey: 'organizer@planner.ai',
  },
  {
    title: 'UX/UI Design Workshop',
    description:
      "Mahsulot dizayni bo'yicha ikki kunlik amaliy workshop. Figma, foydalanuvchi tadqiqotlari, prototiplash va keyslarni tanqidiy tahlil.",
    startDate: new Date('2026-04-25T09:00:00Z'),
    endDate: new Date('2026-04-26T18:00:00Z'),
    eventType: 'Trening',
    capacity: 50,
    bannerUrl: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    ],
    venueIndex: 2,
    organizerKey: 'organizer2@planner.ai',
  },
  {
    title: "Ko'rgazma «Ipak yo'li»",
    description:
      "Markaziy Osiyo mamlakatlaridan 30 ta rassomning guruh ko'rgazmasi. Rasm, haykaltaroshlik, installatsiyalar va raqamli san'at.",
    startDate: new Date('2026-05-01T10:00:00Z'),
    endDate: new Date('2026-05-15T20:00:00Z'),
    eventType: "Ko'rgazma",
    capacity: 200,
    bannerUrl: [
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    ],
    venueIndex: 4,
    organizerKey: 'organizer@planner.ai',
  },
];

// ─── Draft Events (pending admin review) ────────────────────────────────────
export const DRAFT_EVENTS = [
  {
    title: 'AI & Data Science Conference',
    description:
      "Sun'iy intellekt va ma'lumotlar tahlili bo'yicha xalqaro konferensiya. Yetakchi tadqiqotchilar va amaliyotchilardan ma'ruzalar.",
    startDate: new Date('2026-09-10T09:00:00Z'),
    endDate: new Date('2026-09-11T18:00:00Z'),
    eventType: 'Konferensiya',
    capacity: 400,
    bannerUrl: [
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    ],
    organizerKey: 'organizer2@planner.ai',
  },
  {
    title: 'Startup Demo Day',
    description:
      "Startaplarni investorlar oldida namoyish qilish kuni. 20 ta jamoa o'z mahsulotlari va biznes-modellarini taqdim etadi.",
    startDate: new Date('2026-08-05T10:00:00Z'),
    endDate: new Date('2026-08-05T19:00:00Z'),
    eventType: 'Mitap',
    capacity: 150,
    bannerUrl: [
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    ],
    organizerKey: 'organizer@planner.ai',
  },
  {
    title: 'Fashion Week Tashkent 2026',
    description:
      "Toshkentda moda haftasi: O'zbekistondan 40 ta dizayner va Yevropadan mehmonlarning kolleksiya namoyishlari.",
    startDate: new Date('2026-10-01T12:00:00Z'),
    endDate: new Date('2026-10-07T22:00:00Z'),
    eventType: 'Namoyish',
    capacity: 600,
    bannerUrl: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    ],
    organizerKey: 'organizer2@planner.ai',
  },
  {
    title: 'Corporate Team Building',
    description:
      "Korporativ jamoalar uchun professional team building. Kvestlar, ishbilarmon o'yinlar va jamoa treninglari.",
    startDate: new Date('2026-07-20T09:00:00Z'),
    endDate: new Date('2026-07-20T18:00:00Z'),
    eventType: 'Trening',
    capacity: 80,
    bannerUrl: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&auto=format&fit=crop&q=80',
    ],
    organizerKey: 'organizer@planner.ai',
  },
];

// ─── Completed Events ────────────────────────────────────────────────────────
export const COMPLETED_EVENTS = [
  {
    title: 'New Year Tech Party 2025',
    description:
      'Toshkent IT-hamjamiyatining bayram kechasi. DJ set, texnologik aktivatsiyalar va networking.',
    startDate: new Date('2025-12-27T20:00:00Z'),
    endDate: new Date('2025-12-28T03:00:00Z'),
    eventType: 'Kecha',
    capacity: 200,
    bannerUrl: [
      'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop&q=80',
    ],
    venueIndex: 0,
    organizerKey: 'organizer@planner.ai',
  },
  {
    title: 'Silk Road Cuisine Fair',
    description:
      'Markaziy Osiyo milliy oshxonalarining gastro-yarmarkasi. 50 ta restoran, oshpazlardan masterklaslar.',
    startDate: new Date('2026-01-15T11:00:00Z'),
    endDate: new Date('2026-01-17T21:00:00Z'),
    eventType: 'Festival',
    capacity: 800,
    bannerUrl: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400&auto=format&fit=crop&q=80',
    ],
    venueIndex: 4,
    organizerKey: 'organizer2@planner.ai',
  },
];

// ─── Cancelled Events ────────────────────────────────────────────────────────
export const CANCELLED_EVENTS = [
  {
    title: 'Winter Music Fest',
    description:
      'Qishki musiqa festivali — ob-havo sharoiti tufayli bekor qilindi.',
    startDate: new Date('2026-02-10T17:00:00Z'),
    endDate: new Date('2026-02-10T23:00:00Z'),
    eventType: 'Festival',
    capacity: 300,
    bannerUrl: [
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1400&auto=format&fit=crop&q=80',
    ],
    organizerKey: 'organizer@planner.ai',
  },
  {
    title: 'Photography Masterclass',
    description:
      "Professional fotografiya bo'yicha masterklas — keyingi chorakka ko'chirildi.",
    startDate: new Date('2026-03-01T10:00:00Z'),
    endDate: new Date('2026-03-01T18:00:00Z'),
    eventType: 'Trening',
    capacity: 30,
    bannerUrl: [
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1400&auto=format&fit=crop&q=80',
    ],
    organizerKey: 'organizer2@planner.ai',
  },
];

// ─── Ticket Tiers (per published event by index, then completed events) ───────
// Index matches PUBLISHED_EVENTS order, then COMPLETED_EVENTS
export const TICKET_TIERS_BY_EVENT: Array<
  Array<{ name: string; price: number; quantity: number }>
> = [
  // Event 0 – Marketing Forum
  [
    { name: 'Early Bird', price: 150000, quantity: 50 },
    { name: 'Standard', price: 200000, quantity: 200 },
    { name: 'VIP', price: 500000, quantity: 50 },
  ],
  // Event 1 – Tech Startup Meetup
  [
    { name: 'General', price: 100000, quantity: 80 },
    { name: 'VIP', price: 300000, quantity: 20 },
  ],
  // Event 2 – Jazz Festival
  [
    { name: 'General', price: 150000, quantity: 300 },
    { name: 'VIP', price: 400000, quantity: 100 },
    { name: 'VVIP', price: 800000, quantity: 20 },
  ],
  // Event 3 – UX Workshop
  [
    { name: 'Regular', price: 250000, quantity: 40 },
    { name: 'Pro', price: 400000, quantity: 10 },
  ],
  // Event 4 – Art Exhibition
  [
    { name: 'Standard', price: 50000, quantity: 150 },
    { name: 'Premium', price: 200000, quantity: 30 },
  ],
  // Completed Event 0 – New Year Tech Party
  [
    { name: 'Standard', price: 100000, quantity: 150 },
    { name: 'VIP', price: 300000, quantity: 30 },
  ],
  // Completed Event 1 – Silk Road Cuisine Fair
  [
    { name: 'Entry', price: 80000, quantity: 600 },
    { name: 'Premium', price: 250000, quantity: 50 },
  ],
];

// ─── Services ────────────────────────────────────────────────────────────────
export const SERVICES = [
  {
    name: 'Premium Catering Service',
    category: ServiceCategory.CATERING,
    description:
      "Har qanday miqyosdagi tadbirlar uchun to'liq katering: banketlar, furshetlar, kofe-tanaffuslar. 20+ oshpazdan iborat jamoa.",
    priceFrom: 15000000,
    city: 'Toshkent',
    rating: 4.8,
    imageUrls: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor@planner.ai',
  },
  {
    name: 'Elite Sound & Light',
    category: ServiceCategory.SOUND,
    description:
      "Tadbirda texnik bilan professional ovoz va yorug'lik jihozlarini ijaraga berish.",
    priceFrom: 8000000,
    city: 'Toshkent',
    rating: 4.5,
    imageUrls: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor@planner.ai',
  },
  {
    name: 'Capture Moments Photography',
    category: ServiceCategory.PHOTO,
    description:
      'Tadbirlarni professional foto va video suratga olish. Reportaj, portretlar, dron orqali aerial suratga olish.',
    priceFrom: 3000000,
    city: 'Toshkent',
    rating: 4.9,
    imageUrls: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor2@planner.ai',
  },
  {
    name: 'Elegant Decor Studio',
    category: ServiceCategory.DECORATION,
    description:
      "Har qanday format uchun mualliflik dekori va floristika: to'ylar, konferensiyalar, ko'rgazmalar. To'liq tsikl.",
    priceFrom: 5000000,
    city: 'Toshkent',
    rating: 4.6,
    imageUrls: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor2@planner.ai',
  },
  {
    name: 'SecureGuard Services',
    category: ServiceCategory.SECURITY,
    description:
      "Tadbirlarni professional qo'riqlash: kirish nazorati, VIP-hamrohlik, videokuzatuv.",
    priceFrom: 2000000,
    city: 'Toshkent',
    rating: 3.8,
    imageUrls: [
      'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor@planner.ai',
  },
  {
    name: 'Samarkand Catering House',
    category: ServiceCategory.CATERING,
    description:
      "Tadbiringizda o'zbek milliy taomlari. Palov, samsa, go'shtli taomlar va shirinliklar.",
    priceFrom: 8000000,
    city: 'Samarqand',
    rating: 4.7,
    imageUrls: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor@planner.ai',
  },
  {
    name: 'Bukhara Photo & Video',
    category: ServiceCategory.PHOTO,
    description:
      'Buxoradagi foto va video ishlab chiqarish studiyasi. Hujjatli suratga olish, intervyu, masterklaslar.',
    priceFrom: 2000000,
    city: 'Buxoro',
    rating: 4.3,
    imageUrls: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor2@planner.ai',
  },
  {
    name: 'Event Decor Andijan',
    category: ServiceCategory.DECORATION,
    description:
      'Andijonda maydonlarni dekorativ bezash. Pardalar, gul arkalari, bannerlar, tematik dekor.',
    priceFrom: 3000000,
    city: 'Andijon',
    rating: 4.1,
    imageUrls: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: 'vendor2@planner.ai',
  },
];

// ─── Venue Reviews ──────────────────────────────────────────────────────────
export const VENUE_REVIEWS = [
  {
    userKey: 'participant@planner.ai',
    venueIdx: 0,
    rating: 5,
    comment:
      'Отличная площадка в самом центре города, всё оборудование работает идеально.',
  },
  {
    userKey: 'participant2@planner.ai',
    venueIdx: 0,
    rating: 4,
    comment:
      'Хорошее место, персонал профессиональный. Небольшие проблемы с парковкой.',
  },
  {
    userKey: 'participant3@planner.ai',
    venueIdx: 1,
    rating: 5,
    comment:
      'Незабываемая атмосфера Самарканда. Лучшая открытая площадка для мероприятий.',
  },
  {
    userKey: 'participant4@planner.ai',
    venueIdx: 2,
    rating: 4,
    comment: 'Уютный конференц-зал, хорошая акустика и стабильный Wi-Fi.',
  },
  {
    userKey: 'participant5@planner.ai',
    venueIdx: 3,
    rating: 5,
    comment:
      'Дворец — это что-то невероятное. Гости в восторге, рекомендую для гала-вечеров.',
  },
  {
    userKey: 'participant@planner.ai',
    venueIdx: 4,
    rating: 4,
    comment:
      'Просторный выставочный центр, удобная логистика и большая парковка.',
  },
  // Additional copies with variations
  {
    userKey: 'participant2@planner.ai',
    venueIdx: 1,
    rating: 4,
    comment:
      'Красивый вид на Регистан, но вечером немного прохладно — стоит учесть при планировании.',
  },
  {
    userKey: 'participant5@planner.ai',
    venueIdx: 0,
    rating: 5,
    comment:
      'Парковку решили, а зал превзошёл ожидания. Звук и свет на высшем уровне.',
  },
  {
    userKey: 'participant@planner.ai',
    venueIdx: 2,
    rating: 5,
    comment:
      'Камерная атмосфера Бухары идеально подошла для нашей конференции. Персонал — супер!',
  },
  {
    userKey: 'participant3@planner.ai',
    venueIdx: 3,
    rating: 4,
    comment:
      'Роскошный зал, но цена кусается. Для особого случая — однозначно стоит.',
  },
  {
    userKey: 'participant4@planner.ai',
    venueIdx: 4,
    rating: 5,
    comment:
      'Экспо-центр удобен для масштабных мероприятий. Логистика продумана до мелочей.',
  },
  {
    userKey: 'participant5@planner.ai',
    venueIdx: 1,
    rating: 5,
    comment:
      'Самарканд — это магия! Открытая площадка, звёзды, живая музыка. Незабываемо.',
  },
];

// ─── Service Reviews ────────────────────────────────────────────────────────
export const SERVICE_REVIEWS = [
  {
    userKey: 'participant@planner.ai',
    serviceIdx: 0,
    rating: 5,
    comment:
      'Кейтеринг на высшем уровне! Еда была восхитительной, команда очень профессиональна.',
  },
  {
    userKey: 'participant2@planner.ai',
    serviceIdx: 1,
    rating: 4,
    comment:
      'Отличное звуковое оборудование, техник был всегда рядом и всё оперативно настраивал.',
  },
  {
    userKey: 'participant3@planner.ai',
    serviceIdx: 2,
    rating: 5,
    comment:
      'Фотографы работали незаметно, а результат превзошёл все ожидания. Очень рекомендую!',
  },
  {
    userKey: 'participant4@planner.ai',
    serviceIdx: 3,
    rating: 5,
    comment: 'Декор был стильным и элегантным, точно в рамках нашей концепции.',
  },
  {
    userKey: 'participant5@planner.ai',
    serviceIdx: 4,
    rating: 3,
    comment:
      'Охрана выглядела профессионально, но реагировала медленно на некоторые ситуации.',
  },
  {
    userKey: 'participant@planner.ai',
    serviceIdx: 5,
    rating: 5,
    comment:
      'Самсибой и плов были просто великолепны. Гости из Европы были в шоке от качества!',
  },
  // Additional copies with variations
  {
    userKey: 'participant2@planner.ai',
    serviceIdx: 0,
    rating: 5,
    comment:
      'Банкет прошёл безупречно. Меню разнообразное, подача — как в ресторане.',
  },
  {
    userKey: 'participant4@planner.ai',
    serviceIdx: 2,
    rating: 4,
    comment:
      'Фотографии получились живыми и эмоциональными. Дрон-съёмка — отдельный плюс!',
  },
  {
    userKey: 'participant3@planner.ai',
    serviceIdx: 3,
    rating: 5,
    comment:
      'Цветочные арки и центральная инсталляция — именно то, что мы хотели. Спасибо команде!',
  },
  {
    userKey: 'participant5@planner.ai',
    serviceIdx: 1,
    rating: 5,
    comment:
      'Звук был чистым даже при полной заполненности зала. Техник — настоящий профи.',
  },
  {
    userKey: 'participant@planner.ai',
    serviceIdx: 3,
    rating: 4,
    comment:
      'Декор стильный, но хотелось бы больше внимания к деталям на столах.',
  },
  {
    userKey: 'participant4@planner.ai',
    serviceIdx: 5,
    rating: 5,
    comment:
      'Самаркандский кейтеринг — это бренд. Вкус аутентичный, обслуживание на уровне.',
  },
];

// ─── Event Reviews ──────────────────────────────────────────────────────────
export const EVENT_REVIEWS = [
  {
    userKey: 'participant@planner.ai',
    eventIdx: 0,
    rating: 5,
    comment:
      'Лучшая маркетинговая конференция, на которой я был. Спикеры — топ-уровня.',
  },
  {
    userKey: 'participant2@planner.ai',
    eventIdx: 0,
    rating: 4,
    comment: 'Очень информативно, полезные контакты. Буду участвовать снова.',
  },
  {
    userKey: 'participant3@planner.ai',
    eventIdx: 1,
    rating: 5,
    comment:
      'Митап организован на отлично: питч-сессии живые, нетворкинг насыщенный.',
  },
  {
    userKey: 'participant4@planner.ai',
    eventIdx: 2,
    rating: 5,
    comment:
      'Незабываемый фестиваль! Три дня джаза, food-зона и арт. Приду снова.',
  },
  {
    userKey: 'participant5@planner.ai',
    eventIdx: 3,
    rating: 4,
    comment:
      'Воркшоп дал реальные навыки. Кейсы актуальные, преподаватели отзывчивые.',
  },
  {
    userKey: 'participant3@planner.ai',
    eventIdx: 4,
    rating: 5,
    comment:
      'Выставка впечатляет — работы художников из разных стран создают уникальный диалог.',
  },
  // Additional copies with variations
  {
    userKey: 'participant5@planner.ai',
    eventIdx: 0,
    rating: 5,
    comment:
      'Нетворкинг-сессия стоила всего билета! Нашёл двух клиентов и ментора.',
  },
  {
    userKey: 'participant4@planner.ai',
    eventIdx: 1,
    rating: 4,
    comment: 'Питч-сессии полезные, но хотелось бы больше времени на Q&A.',
  },
  {
    userKey: 'participant@planner.ai',
    eventIdx: 2,
    rating: 4,
    comment:
      'Джаз звучал потрясающе! Единственное — еда могла бы быть разнообразнее.',
  },
  {
    userKey: 'participant2@planner.ai',
    eventIdx: 3,
    rating: 5,
    comment:
      'Figma-лаборатория — это находка. Теперь работаю в 2 раза быстрее после советов тренеров.',
  },
  {
    userKey: 'participant5@planner.ai',
    eventIdx: 4,
    rating: 4,
    comment:
      'Кураторы подобрали сильные работы. Навигация по залам могла бы быть лучше.',
  },
  {
    userKey: 'participant@planner.ai',
    eventIdx: 1,
    rating: 5,
    comment:
      'Инвесторы реальные, а не «понарошку». Два стартапа уже получили финансирование!',
  },
];
