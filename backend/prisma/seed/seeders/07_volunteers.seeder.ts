import type { Faker } from '@faker-js/faker';
import { VolunteerRequestStatus } from '../../../generated/prisma/enums';
import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import { SEED_CONFIG } from '../config';

export async function seedVolunteers(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  const volunteers = await prisma.user.findMany({
    where: { role: 'VOLUNTEER' },
    select: { id: true },
  });
  const events = await prisma.event.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true },
  });
  const skills = await prisma.volunteerSkill.findMany({ select: { id: true } });

  if (volunteers.length === 0 || events.length === 0 || skills.length === 0) {
    console.log('⚠️  Missing data for volunteers, skipping');
    return;
  }

  let count = 0;
  for (const event of events) {
    const appCount = f.number.int({
      min: SEED_CONFIG.volunteerApplicationsPerEvent.min,
      max: SEED_CONFIG.volunteerApplicationsPerEvent.max,
    });
    if (appCount === 0) continue;

    const selected = f.helpers.arrayElements(volunteers, appCount);
    for (const volunteer of selected) {
      const skill = f.helpers.arrayElement(skills);
      const r = f.number.float({ min: 0, max: 1 });
      const status =
        r < SEED_CONFIG.volunteerAcceptanceRatio
          ? VolunteerRequestStatus.ACCEPTED
          : r < 0.8
          ? VolunteerRequestStatus.PENDING
          : VolunteerRequestStatus.REJECTED;

      try {
        await prisma.volunteer.create({
          data: {
            user: { connect: { id: volunteer.id } },
            event: { connect: { id: event.id } },
            skill: { connect: { id: skill.id } },
            status,
          },
        });
        count++;
      } catch (err: any) {
        if (err.code === 'P2002') continue;
        throw err;
      }
    }
  }

  console.log(`✅ Volunteers seeded: ${count} applications`);
}
