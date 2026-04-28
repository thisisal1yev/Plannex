import type { Faker } from '@faker-js/faker';

const POSITIVE_COMMENTS = [
  "Juda yaxshi tajriba, yana qatnashaman.",
  "Hamma narsa a'lo darajada tashkil etilgan.",
  "Tavsiya qilaman, pul arziydi.",
  "Kutilganidan ham yaxshi chiqdi.",
  "Professional yondashuv va mehmondo'stlik.",
  "Atmosfera ajoyib, xodimlar yordamchi.",
  "Sifat yuqori darajada, mamnun qoldim.",
  "Yana kelaman, do'stlarimga ham tavsiya qilaman.",
];

const NEUTRAL_COMMENTS = [
  "Umuman yomon emas, lekin takomillashtirish mumkin.",
  "O'rtacha tajriba, hammasi standart.",
  "Yaxshi, lekin kutganimcha emas.",
  "Ba'zi kamchiliklar bor, lekin umumiy olganda ko'ngilda qoladi.",
  "Normal tashkilotchilik, ammo narx biroz qimmat.",
];

const NEGATIVE_COMMENTS = [
  "Tashkilotchilik darajasi past edi.",
  "Kutgan narsamga mos kelmadi.",
  "Narxga mos sifat emas.",
  "Yaxshilash kerak, hafsalam pir bo'ldi.",
];

export type GeneratedReview = {
  rating: number;
  comment: string;
};

/** Realistic rating distribution: 60% 5★ · 25% 4★ · 10% 3★ · 3% 2★ · 2% 1★ */
export function makeReview(f: Faker): GeneratedReview {
  const r = f.number.float({ min: 0, max: 1 });
  let rating: number;
  let pool: string[];

  if (r < 0.60) {
    rating = 5; pool = POSITIVE_COMMENTS;
  } else if (r < 0.85) {
    rating = 4; pool = POSITIVE_COMMENTS;
  } else if (r < 0.95) {
    rating = 3; pool = NEUTRAL_COMMENTS;
  } else if (r < 0.98) {
    rating = 2; pool = NEUTRAL_COMMENTS;
  } else {
    rating = 1; pool = NEGATIVE_COMMENTS;
  }

  return { rating, comment: f.helpers.arrayElement(pool) };
}
