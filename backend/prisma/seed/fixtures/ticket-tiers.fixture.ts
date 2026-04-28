import { CuratedEventKey, type TicketTierSeed } from '../types';

export const TICKET_TIERS_BY_EVENT: Partial<Record<CuratedEventKey, TicketTierSeed[]>> = {
  [CuratedEventKey.MARKETING_FORUM]: [
    { name: 'Early Bird', price: 150000, quantity: 50 },
    { name: 'Standard',   price: 200000, quantity: 200 },
    { name: 'VIP',        price: 500000, quantity: 50 },
  ],
  [CuratedEventKey.TECH_MEETUP]: [
    { name: 'General', price: 100000, quantity: 80 },
    { name: 'VIP',     price: 300000, quantity: 20 },
  ],
  [CuratedEventKey.JAZZ_FESTIVAL]: [
    { name: 'General', price: 150000, quantity: 300 },
    { name: 'VIP',     price: 400000, quantity: 100 },
    { name: 'VVIP',    price: 800000, quantity: 20 },
  ],
  [CuratedEventKey.UX_WORKSHOP]: [
    { name: 'Regular', price: 250000, quantity: 40 },
    { name: 'Pro',     price: 400000, quantity: 10 },
  ],
  [CuratedEventKey.SILK_ROAD_EXHIBITION]: [
    { name: 'Standard', price: 50000,  quantity: 150 },
    { name: 'Premium',  price: 200000, quantity: 30 },
  ],
  [CuratedEventKey.NEW_YEAR_TECH_PARTY]: [
    { name: 'Standard', price: 100000, quantity: 150 },
    { name: 'VIP',      price: 300000, quantity: 30 },
  ],
  [CuratedEventKey.SILK_ROAD_CUISINE_FAIR]: [
    { name: 'Entry',   price: 80000,  quantity: 600 },
    { name: 'Premium', price: 250000, quantity: 50 },
  ],
};
