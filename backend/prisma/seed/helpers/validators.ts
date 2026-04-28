export class SeedValidationError extends Error {
  constructor(message: string) {
    super(`[SeedValidation] ${message}`);
    this.name = 'SeedValidationError';
  }
}

export function validateAgreedPrice(agreedPrice: number, priceFrom: number, context: string) {
  if (agreedPrice < priceFrom) {
    throw new SeedValidationError(
      `${context}: agreedPrice (${agreedPrice}) < service.priceFrom (${priceFrom})`,
    );
  }
}

export function validateCapacity(sold: number, capacity: number, context: string) {
  if (sold > capacity) {
    throw new SeedValidationError(
      `${context}: tickets sold (${sold}) > event.capacity (${capacity})`,
    );
  }
}

export function validateDateOrder(start: Date, end: Date, context: string) {
  if (end.getTime() <= start.getTime()) {
    throw new SeedValidationError(
      `${context}: endDate (${end.toISOString()}) must be after startDate (${start.toISOString()})`,
    );
  }
}

export function validatePositiveNumber(value: number, fieldName: string, context: string) {
  if (value <= 0) {
    throw new SeedValidationError(
      `${context}: ${fieldName} must be positive, got ${value}`,
    );
  }
}
