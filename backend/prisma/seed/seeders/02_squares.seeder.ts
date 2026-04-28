import type { Faker } from '@faker-js/faker';
import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import { SEED_CONFIG } from '../config';
import { CURATED_SQUARES } from '../fixtures/squares.fixture';
import { SQUARE_CATEGORIES, SQUARE_CHARACTERISTICS } from '../fixtures/reference.fixture';

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Andijon', 'Namangan', "Farg'ona"];
const VENUE_TYPES = ['Center', 'Hall', 'Hub', 'Plaza', 'Arena', 'Garden'];

export async function seedSquares(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  for (const s of CURATED_SQUARES) {
    const charIds = s.characteristicNames.map((name) => ({
      id: registry.getSquareCharacteristic(name),
    }));

    const created = await prisma.square.create({
      data: {
        name: s.name,
        description: s.description,
        address: s.address,
        city: s.city,
        latitude: s.latitude,
        longitude: s.longitude,
        capacity: s.capacity,
        pricePerDay: s.pricePerDay,
        imageUrls: s.imageUrls,
        owner: { connect: { id: registry.getUser(s.ownerKey) } },
        category: { connect: { id: registry.getSquareCategory(s.categoryName) } },
        characteristics: { connect: charIds },
      },
    });
    registry.setSquare(s.key, created.id);
  }

  const vendors = await prisma.user.findMany({
    where: { role: 'VENDOR' },
    select: { id: true },
  });
  if (vendors.length === 0) throw new Error('[seedSquares] No vendors found');

  for (let i = 0; i < SEED_CONFIG.extraSquares; i++) {
    const city = f.helpers.arrayElement(CITIES);
    const type = f.helpers.arrayElement(VENUE_TYPES);
    const categoryName = f.helpers.arrayElement(SQUARE_CATEGORIES);
    const charNames = f.helpers.arrayElements(SQUARE_CHARACTERISTICS, { min: 2, max: 4 });
    const owner = f.helpers.arrayElement(vendors);

    const created = await prisma.square.create({
      data: {
        name: `${city} ${type} ${i + 1}`,
        description: f.lorem.paragraph(),
        address: f.location.streetAddress(),
        city,
        latitude: f.location.latitude({ min: 39, max: 42 }),
        longitude: f.location.longitude({ min: 64, max: 72 }),
        capacity: f.number.int({ min: 50, max: 1000 }),
        pricePerDay: f.number.int({ min: 2_000_000, max: 20_000_000 }),
        imageUrls: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=80'],
        owner: { connect: { id: owner.id } },
        category: { connect: { id: registry.getSquareCategory(categoryName) } },
        characteristics: {
          connect: charNames.map((n) => ({ id: registry.getSquareCharacteristic(n) })),
        },
      },
    });
    registry.setSquare(`generated_square_${i}`, created.id);
  }

  console.log(`✅ Squares seeded: ${CURATED_SQUARES.length} curated + ${SEED_CONFIG.extraSquares} generated`);
}
