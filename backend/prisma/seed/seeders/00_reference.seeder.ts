import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import {
  SQUARE_CATEGORIES,
  SERVICE_CATEGORIES,
  EVENT_CATEGORIES,
  VOLUNTEER_SKILLS,
  SQUARE_CHARACTERISTICS,
} from '../fixtures/reference.fixture';

export async function seedReference(prisma: PrismaClient, registry: SeedRegistry): Promise<void> {
  for (const name of SQUARE_CATEGORIES) {
    const c = await prisma.squareCategory.create({ data: { name } });
    registry.setSquareCategory(name, c.id);
  }

  for (const name of SERVICE_CATEGORIES) {
    const c = await prisma.serviceCategory.create({ data: { name } });
    registry.setServiceCategory(name, c.id);
  }

  for (const name of EVENT_CATEGORIES) {
    const c = await prisma.eventCategory.create({ data: { name } });
    registry.setEventCategory(name, c.id);
  }

  for (const name of VOLUNTEER_SKILLS) {
    const s = await prisma.volunteerSkill.create({ data: { name } });
    registry.setVolunteerSkill(name, s.id);
  }

  for (const name of SQUARE_CHARACTERISTICS) {
    const s = await prisma.squareCharacteristic.create({ data: { name } });
    registry.setSquareCharacteristic(name, s.id);
  }

  console.log('✅ Reference data seeded');
}
