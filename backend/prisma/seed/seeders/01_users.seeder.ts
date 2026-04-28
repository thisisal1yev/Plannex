import { hashSync } from 'bcrypt';
import type { Faker } from '@faker-js/faker';
import { Role } from '../../../generated/prisma/enums';
import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import { SEED_CONFIG, SEED_PASSWORD } from '../config';
import { CURATED_USERS } from '../fixtures/users.fixture';
import { makeUsers } from '../factories/user.factory';

export async function seedUsers(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  const hash = hashSync(SEED_PASSWORD, 10);

  for (const u of CURATED_USERS) {
    const created = await prisma.user.create({
      data: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        passwordHash: hash,
        isVerified: true,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
      },
    });
    registry.setUser(u.key, created.id);
    if (u.role === Role.PARTICIPANT) {
      registry.addParticipant(created.id);
    }
  }

  const generated = makeUsers(f, SEED_CONFIG.extraUsers);
  for (let i = 0; i < generated.length; i++) {
    const u = generated[i];
    const created = await prisma.user.create({ data: u });
    registry.setUser(`generated_user_${i}`, created.id);
    if (u.role === Role.PARTICIPANT) {
      registry.addParticipant(created.id);
    }
  }

  console.log(`✅ Users seeded: ${CURATED_USERS.length} curated + ${generated.length} generated`);
}
