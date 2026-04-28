import { CuratedUserKey, CuratedServiceKey, type ServiceSeed } from '../types';

export const CURATED_SERVICES: ServiceSeed[] = [
  {
    key: CuratedServiceKey.PREMIUM_CATERING,
    name: 'Premium Catering Service',
    categoryName: 'Katering',
    description:
      "Har qanday miqyosdagi tadbirlar uchun to'liq katering. 20+ oshpazdan iborat jamoa.",
    priceFrom: 15000000,
    city: 'Toshkent',
    imageUrls: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: CuratedUserKey.VENDOR_1,
  },
  {
    key: CuratedServiceKey.ELITE_SOUND,
    name: 'Elite Sound & Light',
    categoryName: 'Ovoz va yoruglik',
    description: "Professional ovoz va yorug'lik jihozlarini ijaraga berish.",
    priceFrom: 8000000,
    city: 'Toshkent',
    imageUrls: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: CuratedUserKey.VENDOR_1,
  },
  {
    key: CuratedServiceKey.CAPTURE_PHOTO,
    name: 'Capture Moments Photography',
    categoryName: 'Foto va video',
    description:
      'Professional foto va video. Reportaj, portretlar, dron suratga olish.',
    priceFrom: 3000000,
    city: 'Toshkent',
    imageUrls: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: CuratedUserKey.VENDOR_2,
  },
  {
    key: CuratedServiceKey.ELEGANT_DECOR,
    name: 'Elegant Decor Studio',
    categoryName: 'Dekor',
    description: 'Har qanday format uchun mualliflik dekori va floristika.',
    priceFrom: 5000000,
    city: 'Toshkent',
    imageUrls: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: CuratedUserKey.VENDOR_2,
  },
  {
    key: CuratedServiceKey.SECURE_GUARD,
    name: 'SecureGuard Services',
    categoryName: 'Xavfsizlik',
    description: "Professional qo'riqlash: kirish nazorati, VIP-hamrohlik.",
    priceFrom: 2000000,
    city: 'Toshkent',
    imageUrls: [
      'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: CuratedUserKey.VENDOR_1,
  },
  {
    key: CuratedServiceKey.SAMARKAND_CATERING,
    name: 'Samarkand Catering House',
    categoryName: 'Katering',
    description:
      "Tadbiringizda o'zbek milliy taomlari. Palov, samsa va shirinliklar.",
    priceFrom: 8000000,
    city: 'Samarqand',
    imageUrls: [
      'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&auto=format&fit=crop&q=80',
    ],
    vendorKey: CuratedUserKey.VENDOR_1,
  },
];
