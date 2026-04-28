import { Faker, en } from '@faker-js/faker';
import { FAKER_SEED } from '../config';

// Module-level singleton (used by factories that don't receive `f` explicitly)
export const faker = new Faker({ locale: [en] });
faker.seed(FAKER_SEED);

/** Creates a new seeded Faker instance — call once in seed.ts and thread through seeders */
export function initFaker(): Faker {
  const f = new Faker({ locale: [en] });
  f.seed(FAKER_SEED);
  return f;
}

export function emailFromName(firstName: string, lastName: string, f: Faker = faker): string {
  const first = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const last = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const suffix = f.number.int({ min: 1, max: 999 });
  return `${first}.${last}${suffix}@example.uz`;
}

const UZ_FIRST_NAMES = [
  'Jasur', 'Bobur', 'Sardor', 'Ulugbek', 'Sherzod',
  'Dilnoza', 'Malika', 'Nilufar', 'Zulfiya', 'Feruza',
  'Otabek', 'Mirzo', 'Doniyor', 'Eldor', 'Sanjar',
  'Kamola', 'Ozoda', 'Mohira', 'Barno', 'Umida',
];

const UZ_LAST_NAMES = [
  'Karimov', 'Rahimov', 'Toshmatov', 'Ergashev', 'Xolmatov',
  'Yusupov', 'Nazarov', 'Abdullayev', 'Ismoilov', 'Hamidov',
  'Mirzayev', 'Qodirov', 'Holiqov', 'Turgunov', 'Baxtiyorov',
  'Raximova', 'Tursunova', 'Xasanova', 'Normatova', 'Salimova',
];

export function randomUzbekFullName(f: Faker): { firstName: string; lastName: string } {
  return {
    firstName: f.helpers.arrayElement(UZ_FIRST_NAMES),
    lastName: f.helpers.arrayElement(UZ_LAST_NAMES),
  };
}
