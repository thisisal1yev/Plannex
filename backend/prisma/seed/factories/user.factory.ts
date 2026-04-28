import { hashSync } from 'bcrypt';
import type { Faker } from '@faker-js/faker';
import { Role } from '../../../generated/prisma/enums';
import { SEED_PASSWORD } from '../config';
import { randomUzbekFullName, emailFromName } from '../helpers/faker';

export type GeneratedUser = {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  passwordHash: string;
  avatarUrl: string;
  isVerified: boolean;
  createdAt: Date;
};

export function makeUser(f: Faker, role: Role, indexHint = 0): GeneratedUser {
  const { firstName, lastName } = randomUzbekFullName(f);
  return {
    email: emailFromName(firstName, lastName, f),
    firstName,
    lastName,
    role,
    passwordHash: hashSync(SEED_PASSWORD, 10),
    avatarUrl: `https://i.pravatar.cc/150?img=${50 + indexHint}`,
    isVerified: f.datatype.boolean({ probability: 0.9 }),
    createdAt: f.date.recent({ days: 60 }),
  };
}

/** Generates N users with 70% PARTICIPANT / 15% ORGANIZER / 15% VENDOR distribution */
export function makeUsers(f: Faker, count: number): GeneratedUser[] {
  return Array.from({ length: count }, (_, i) => {
    const r = f.number.float({ min: 0, max: 1 });
    const role =
      r < 0.7  ? Role.PARTICIPANT :
      r < 0.85 ? Role.ORGANIZER :
                 Role.VENDOR;
    return makeUser(f, role, i);
  });
}
