import type { Faker } from '@faker-js/faker';
import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import { SEED_CONFIG } from '../config';
import { CURATED_SERVICES } from '../fixtures/services.fixture';
import { SERVICE_CATEGORIES } from '../fixtures/reference.fixture';

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon'];
const SERVICE_ADJECTIVES = ['Premium', 'Elite', 'Professional', 'Royal', 'Express'];
const SERVICE_TYPES: Record<string, string[]> = {
  'Katering':         ['Catering House', 'Food Studio', 'Kitchen'],
  'Ovoz va yoruglik': ['Sound Studio', 'Audio Lab', 'Light Works'],
  'Foto va video':    ['Photo Studio', 'Video Lab', 'Film House'],
  'Dekor':            ['Decor House', 'Design Studio', 'Floristics'],
  'Xavfsizlik':       ['Security Services', 'Guard Group', 'Safety Solutions'],
};

export async function seedServices(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  for (const s of CURATED_SERVICES) {
    const created = await prisma.service.create({
      data: {
        name: s.name,
        description: s.description,
        priceFrom: s.priceFrom,
        city: s.city,
        imageUrls: s.imageUrls,
        vendor: { connect: { id: registry.getUser(s.vendorKey) } },
        category: { connect: { id: registry.getServiceCategory(s.categoryName) } },
      },
    });
    registry.setService(s.key, created.id);
  }

  const vendors = await prisma.user.findMany({
    where: { role: 'VENDOR' },
    select: { id: true },
  });
  if (vendors.length === 0) throw new Error('[seedServices] No vendors found');

  for (let i = 0; i < SEED_CONFIG.extraServices; i++) {
    const categoryName = f.helpers.arrayElement(SERVICE_CATEGORIES);
    const adj = f.helpers.arrayElement(SERVICE_ADJECTIVES);
    const typeName = f.helpers.arrayElement(SERVICE_TYPES[categoryName] ?? ['Service']);
    const vendor = f.helpers.arrayElement(vendors);

    const created = await prisma.service.create({
      data: {
        name: `${adj} ${typeName} ${i + 1}`,
        description: f.lorem.paragraph(),
        priceFrom: f.number.int({ min: 1_000_000, max: 20_000_000 }),
        city: f.helpers.arrayElement(CITIES),
        imageUrls: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80'],
        vendor: { connect: { id: vendor.id } },
        category: { connect: { id: registry.getServiceCategory(categoryName) } },
      },
    });
    registry.setService(`generated_service_${i}`, created.id);
  }

  console.log(`✅ Services seeded: ${CURATED_SERVICES.length} curated + ${SEED_CONFIG.extraServices} generated`);
}
