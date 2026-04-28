export const FAKER_SEED = 42;
export const SEED_PASSWORD = '12345678';
export const COMMISSION_RATE = 0.1;

export const SEED_CONFIG = {
  extraUsers: 8,
  extraSquares: 5,
  extraServices: 6,
  extraEvents: 5,
  ticketsPerEvent: { min: 3, max: 8 },
  reviewProbability: 0.6,
  pendingBookingRatio: 0.2,
  volunteerApplicationsPerEvent: { min: 0, max: 3 },
  volunteerAcceptanceRatio: 0.5,
  qrSeqStart: 1000,
} as const;
