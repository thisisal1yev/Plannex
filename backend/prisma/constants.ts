import { hashSync } from 'bcrypt';

export const HASHED_PASSWORD = hashSync('12345678', 10);

export const USERS = [
  {
    email: 'admin@planner.ai',
    firstName: 'Elon',
    lastName: 'Musk',
    role: 'ADMIN',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    email: 'organizer@planner.ai',
    firstName: 'Sam',
    lastName: 'Altman',
    role: 'ORGANIZER',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
  },
  {
    email: 'vendor@planner.ai',
    firstName: 'Linus',
    lastName: 'Torvalds',
    role: 'VENDOR',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
  },
  {
    email: 'volunteer@planner.ai',
    firstName: 'Jensen',
    lastName: 'Huang',
    role: 'VOLUNTEER',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    email: 'participant@planner.ai',
    firstName: 'Mark',
    lastName: 'Zuckerberg',
    role: 'PARTICIPANT',
    avatarUrl: 'https://i.pravatar.cc/150?img=20',
  },
];

export const VENUES = [
  {
    name: 'Tashkent City Hall',
    description: 'Премиальная площадка в сердце Ташкента с современным оборудованием и вместимостью до 500 человек.',
    address: 'Амира Темура пр-т, 1',
    city: 'Ташкент',
    latitude: 41.3115,
    longitude: 69.2401,
    capacity: 500,
    pricePerDay: 10000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Samarkand Garden',
    description: 'Живописная открытая площадка с видом на исторические памятники Самарканда. Идеально для outdoor-мероприятий.',
    address: 'ул. Регистан, 15',
    city: 'Самарканд',
    latitude: 39.627,
    longitude: 66.975,
    capacity: 300,
    pricePerDay: 7000000,
    isIndoor: false,
    hasWifi: false,
    hasParking: true,
    hasSound: false,
    hasStage: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Bukhara Conference Hall',
    description: 'Современный конференц-центр с традиционной архитектурой в историческом центре Бухары.',
    address: 'ул. По-и-Калон, 8',
    city: 'Бухара',
    latitude: 39.7747,
    longitude: 64.4286,
    capacity: 200,
    pricePerDay: 5000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582481725274-d63bdf929a90?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Navoi Palace',
    description: 'Роскошный дворец для торжественных мероприятий, свадеб и корпоративных гала-вечеров.',
    address: 'ул. Навои, 30',
    city: 'Ташкент',
    latitude: 41.3205,
    longitude: 69.2654,
    capacity: 800,
    pricePerDay: 18000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: true,
    hasStage: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1561489396-888724a1543d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Andijan Expo Center',
    description: 'Просторный выставочный центр с гибкой планировкой. Подходит для выставок, ярмарок и массовых мероприятий.',
    address: 'пр-т Бабура, 55',
    city: 'Андижан',
    latitude: 40.7829,
    longitude: 72.3442,
    capacity: 1000,
    pricePerDay: 8000000,
    isIndoor: true,
    hasWifi: true,
    hasParking: true,
    hasSound: false,
    hasStage: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80',
    ],
  },
];

export const EVENTS = [
  {
    title: 'Marketing Forum 2026',
    description: 'Ежегодная маркетинговая конференция в Ташкенте с участием лидеров индустрии. Нетворкинг, мастер-классы и презентации от ведущих брендов.',
    startDate: new Date('2026-05-20T10:00:00Z'),
    endDate: new Date('2026-05-20T18:00:00Z'),
    eventType: 'Конференция',
    capacity: 300,
    bannerUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&auto=format&fit=crop&q=80',
  },
  {
    title: 'Tech Startup Meetup',
    description: 'Нетворкинг-встреча для технологических предпринимателей и инвесторов. Питч-сессии, менторство и обмен опытом.',
    startDate: new Date('2026-06-15T18:00:00Z'),
    endDate: new Date('2026-06-15T22:00:00Z'),
    eventType: 'Митап',
    capacity: 100,
    bannerUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1400&auto=format&fit=crop&q=80',
  },
  {
    title: 'Ташкент Jazz Festival',
    description: 'Ежегодный джазовый фестиваль под открытым небом. 15 групп из Узбекистана, России и Европы.',
    startDate: new Date('2026-07-10T17:00:00Z'),
    endDate: new Date('2026-07-12T23:00:00Z'),
    eventType: 'Фестиваль',
    capacity: 500,
    bannerUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&auto=format&fit=crop&q=80',
  },
  {
    title: 'UX/UI Design Workshop',
    description: 'Практический двухдневный воркшоп по дизайну продукта. Figma, исследования пользователей, прототипирование.',
    startDate: new Date('2026-04-25T09:00:00Z'),
    endDate: new Date('2026-04-26T18:00:00Z'),
    eventType: 'Тренинг',
    capacity: 50,
    bannerUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&auto=format&fit=crop&q=80',
  },
  {
    title: 'Выставка современного искусства «Шёлковый путь»',
    description: 'Групповая выставка 30 художников из стран Центральной Азии. Живопись, скульптура, инсталляции.',
    startDate: new Date('2026-05-01T10:00:00Z'),
    endDate: new Date('2026-05-15T20:00:00Z'),
    eventType: 'Выставка',
    capacity: 200,
    bannerUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1400&auto=format&fit=crop&q=80',
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
    description: 'Полный кейтеринг для мероприятий любого масштаба: банкеты, фуршеты, кофе-брейки.',
    priceFrom: 15000000,
    city: 'Ташкент',
    imageUrls: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Elite Sound & Light',
    category: 'SOUND',
    description: 'Профессиональное звуковое и световое оборудование в аренду с техником на мероприятии.',
    priceFrom: 8000000,
    city: 'Ташкент',
    imageUrls: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Capture Moments Photography',
    category: 'PHOTO',
    description: 'Профессиональная фото- и видеосъёмка мероприятий. Репортаж, портреты, aerial-съёмка.',
    priceFrom: 3000000,
    city: 'Ташкент',
    imageUrls: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542744095-291d1f67b221?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Elegant Decor Studio',
    category: 'DECORATION',
    description: 'Авторский декор и флористика для любого формата: свадьбы, конференции, выставки.',
    priceFrom: 5000000,
    city: 'Ташкент',
    imageUrls: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'SecureGuard Services',
    category: 'SECURITY',
    description: 'Профессиональная охрана мероприятий: контроль доступа, работа с VIP-гостями, видеонаблюдение.',
    priceFrom: 2000000,
    city: 'Ташкент',
    imageUrls: [
      'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&auto=format&fit=crop&q=80',
    ],
  },
  {
    name: 'Samarkand Catering House',
    category: 'CATERING',
    description: 'Узбекская национальная кухня на вашем мероприятии. Плов, самса, мясные блюда и десерты.',
    priceFrom: 8000000,
    city: 'Самарканд',
    imageUrls: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
    ],
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
