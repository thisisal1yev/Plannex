import type { Faker } from '@faker-js/faker';
import { PaymentProvider } from '../../../generated/prisma/enums';
import { validateCapacity } from '../helpers/validators';

export type GeneratedTicketPurchase = {
  userId: string;
  tierIndex: number;
  purchaseDate: Date;
  provider: PaymentProvider;
  shouldBeUsed: boolean;
};

export function makeTicketPurchases(
  f: Faker,
  params: {
    eventStartDate: Date;
    eventCapacity: number;
    tierCount: number;
    participantIds: string[];
    count: number;
    isEventCompleted: boolean;
  },
): GeneratedTicketPurchase[] {
  validateCapacity(params.count, params.eventCapacity, 'makeTicketPurchases');

  const purchaseWindowStart = new Date(params.eventStartDate.getTime() - 60 * 86400000);
  const purchaseWindowEnd = new Date(params.eventStartDate.getTime() - 86400000);

  // Shuffle participants to avoid duplicate (userId, eventId) pairs
  const shuffled = f.helpers.shuffle([...params.participantIds]);
  const selected = shuffled.slice(0, Math.min(params.count, shuffled.length));

  return selected.map((userId) => ({
    userId,
    tierIndex: f.number.int({ min: 0, max: params.tierCount - 1 }),
    purchaseDate: f.date.between({ from: purchaseWindowStart, to: purchaseWindowEnd }),
    provider: f.helpers.arrayElement([PaymentProvider.CLICK, PaymentProvider.PAYME]),
    shouldBeUsed: params.isEventCompleted
      ? f.datatype.boolean({ probability: 0.8 })
      : false,
  }));
}
