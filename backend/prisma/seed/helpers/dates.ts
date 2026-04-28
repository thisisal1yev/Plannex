const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

export const daysFromNow = (days: number): Date =>
  new Date(Date.now() + days * DAY_MS);

export const hoursFromNow = (hours: number): Date =>
  new Date(Date.now() + hours * HOUR_MS);

export const daysAgo = (days: number): Date => daysFromNow(-days);

export const addHours = (date: Date, hours: number): Date =>
  new Date(date.getTime() + hours * HOUR_MS);

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getTime() + days * DAY_MS);

export const randomDateBetween = (start: Date, end: Date, rng: () => number): Date =>
  new Date(start.getTime() + rng() * (end.getTime() - start.getTime()));
