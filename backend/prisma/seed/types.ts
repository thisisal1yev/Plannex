import type {
  Role,
  EventStatus,
  BookingStatus,
  PaymentProvider,
  VolunteerRequestStatus,
} from '../../generated/prisma/enums';
import { SeedValidationError } from './helpers/validators';

// ─── Curated key enums ────────────────────────────────────────────────────────

export enum CuratedUserKey {
  ADMIN = 'ADMIN',
  ORGANIZER_1 = 'ORGANIZER_1',
  ORGANIZER_2 = 'ORGANIZER_2',
  VENDOR_1 = 'VENDOR_1',
  VENDOR_2 = 'VENDOR_2',
  VOLUNTEER_1 = 'VOLUNTEER_1',
  VOLUNTEER_2 = 'VOLUNTEER_2',
  PARTICIPANT_1 = 'PARTICIPANT_1',
  PARTICIPANT_2 = 'PARTICIPANT_2',
  PARTICIPANT_3 = 'PARTICIPANT_3',
  PARTICIPANT_4 = 'PARTICIPANT_4',
  PARTICIPANT_5 = 'PARTICIPANT_5',
}

export enum CuratedSquareKey {
  TASHKENT_CITY_HALL = 'TASHKENT_CITY_HALL',
  SAMARKAND_GARDEN = 'SAMARKAND_GARDEN',
  BUKHARA_CONFERENCE = 'BUKHARA_CONFERENCE',
  NAVOI_PALACE = 'NAVOI_PALACE',
  ANDIJAN_EXPO = 'ANDIJAN_EXPO',
}

export enum CuratedServiceKey {
  PREMIUM_CATERING = 'PREMIUM_CATERING',
  ELITE_SOUND = 'ELITE_SOUND',
  CAPTURE_PHOTO = 'CAPTURE_PHOTO',
  ELEGANT_DECOR = 'ELEGANT_DECOR',
  SECURE_GUARD = 'SECURE_GUARD',
  SAMARKAND_CATERING = 'SAMARKAND_CATERING',
}

export enum CuratedEventKey {
  MARKETING_FORUM = 'MARKETING_FORUM',
  TECH_MEETUP = 'TECH_MEETUP',
  JAZZ_FESTIVAL = 'JAZZ_FESTIVAL',
  UX_WORKSHOP = 'UX_WORKSHOP',
  SILK_ROAD_EXHIBITION = 'SILK_ROAD_EXHIBITION',
  NEW_YEAR_TECH_PARTY = 'NEW_YEAR_TECH_PARTY',
  SILK_ROAD_CUISINE_FAIR = 'SILK_ROAD_CUISINE_FAIR',
}

// ─── Seed input types ─────────────────────────────────────────────────────────

export type UserSeed = {
  key: CuratedUserKey;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatarUrl?: string;
  createdAt?: Date;
};

export type SquareSeed = {
  key: CuratedSquareKey;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  capacity: number;
  pricePerDay: number;
  imageUrls: string[];
  ownerKey: CuratedUserKey;
  categoryName: string;
  characteristicNames: string[];
};

export type ServiceSeed = {
  key: CuratedServiceKey;
  name: string;
  description: string;
  priceFrom: number;
  city: string;
  imageUrls: string[];
  vendorKey: CuratedUserKey;
  categoryName: string;
};

export type EventSeed = {
  key: CuratedEventKey;
  title: string;
  description: string;
  startOffsetDays: number;
  startHour: number;
  durationHours: number;
  categoryName: string;
  capacity: number;
  bannerUrls: string[];
  status: EventStatus;
  organizerKey: CuratedUserKey;
  squareKey?: CuratedSquareKey;
};

export type TicketTierSeed = {
  name: string;
  price: number;
  quantity: number;
};

export type SquareReviewSeed = {
  userKey: CuratedUserKey;
  squareKey: CuratedSquareKey;
  rating: number;
  comment: string;
};

export type ServiceReviewSeed = {
  userKey: CuratedUserKey;
  serviceKey: CuratedServiceKey;
  rating: number;
  comment: string;
};

export type EventReviewSeed = {
  userKey: CuratedUserKey;
  eventKey: CuratedEventKey;
  rating: number;
  comment: string;
};

export type SquareBookingSeed = {
  squareKey: CuratedSquareKey;
  eventKey: CuratedEventKey;
  userKey: CuratedUserKey;
  status: BookingStatus;
  totalCost: number;
  provider: PaymentProvider;
};

export type EventServiceLinkSeed = {
  eventKey: CuratedEventKey;
  serviceKey: CuratedServiceKey;
  organizerKey: CuratedUserKey;
  agreedPrice: number;
  status: BookingStatus;
};

export type VolunteerAppSeed = {
  userKey: CuratedUserKey;
  eventKey: CuratedEventKey;
  skillName: string;
  status: VolunteerRequestStatus;
};

// ─── SeedRegistry ─────────────────────────────────────────────────────────────

export class SeedRegistry {
  private users = new Map<string, string>();
  private squares = new Map<string, string>();
  private services = new Map<string, string>();
  private events = new Map<string, string>();
  private tiers = new Map<string, string[]>();
  private squareCategories = new Map<string, string>();
  private serviceCategories = new Map<string, string>();
  private eventCategories = new Map<string, string>();
  private volunteerSkills = new Map<string, string>();
  private squareCharacteristics = new Map<string, string>();

  private participantIds: string[] = [];

  // ── Users ──────────────────────────────────────────────────────────────────

  setUser(key: CuratedUserKey | string, id: string) {
    this.users.set(key, id);
  }

  getUser(key: CuratedUserKey | string): string {
    const id = this.users.get(key);
    if (!id) throw new SeedValidationError(`User not found: ${key}`);
    return id;
  }

  getAllUserIds(): string[] {
    return Array.from(this.users.values());
  }

  addParticipant(id: string) {
    this.participantIds.push(id);
  }

  getAllParticipantIds(): string[] {
    return [...this.participantIds];
  }

  // ── Squares ────────────────────────────────────────────────────────────────

  setSquare(key: CuratedSquareKey | string, id: string) {
    this.squares.set(key, id);
  }

  getSquare(key: CuratedSquareKey | string): string {
    const id = this.squares.get(key);
    if (!id) throw new SeedValidationError(`Square not found: ${key}`);
    return id;
  }

  getAllSquareIds(): string[] {
    return Array.from(this.squares.values());
  }

  // ── Services ───────────────────────────────────────────────────────────────

  setService(key: CuratedServiceKey | string, id: string) {
    this.services.set(key, id);
  }

  getService(key: CuratedServiceKey | string): string {
    const id = this.services.get(key);
    if (!id) throw new SeedValidationError(`Service not found: ${key}`);
    return id;
  }

  getAllServiceIds(): string[] {
    return Array.from(this.services.values());
  }

  // ── Events ─────────────────────────────────────────────────────────────────

  setEvent(key: CuratedEventKey | string, id: string) {
    this.events.set(key, id);
  }

  getEvent(key: CuratedEventKey | string): string {
    const id = this.events.get(key);
    if (!id) throw new SeedValidationError(`Event not found: ${key}`);
    return id;
  }

  getAllEventIds(): string[] {
    return Array.from(this.events.values());
  }

  // ── Tiers ──────────────────────────────────────────────────────────────────

  setTiers(eventId: string, tierIds: string[]) {
    this.tiers.set(eventId, tierIds);
  }

  getTiers(eventId: string): string[] {
    const t = this.tiers.get(eventId);
    if (!t) throw new SeedValidationError(`Tiers not found for event: ${eventId}`);
    return t;
  }

  // ── Categories ─────────────────────────────────────────────────────────────

  setSquareCategory(name: string, id: string) {
    this.squareCategories.set(name, id);
  }

  getSquareCategory(name: string): string {
    const id = this.squareCategories.get(name);
    if (!id) throw new SeedValidationError(`SquareCategory not found: ${name}`);
    return id;
  }

  setServiceCategory(name: string, id: string) {
    this.serviceCategories.set(name, id);
  }

  getServiceCategory(name: string): string {
    const id = this.serviceCategories.get(name);
    if (!id) throw new SeedValidationError(`ServiceCategory not found: ${name}`);
    return id;
  }

  setEventCategory(name: string, id: string) {
    this.eventCategories.set(name, id);
  }

  getEventCategory(name: string): string {
    const id = this.eventCategories.get(name);
    if (!id) throw new SeedValidationError(`EventCategory not found: ${name}`);
    return id;
  }

  // ── Skills & Characteristics ───────────────────────────────────────────────

  setVolunteerSkill(name: string, id: string) {
    this.volunteerSkills.set(name, id);
  }

  getVolunteerSkill(name: string): string {
    const id = this.volunteerSkills.get(name);
    if (!id) throw new SeedValidationError(`VolunteerSkill not found: ${name}`);
    return id;
  }

  getAllVolunteerSkillIds(): string[] {
    return Array.from(this.volunteerSkills.values());
  }

  setSquareCharacteristic(name: string, id: string) {
    this.squareCharacteristics.set(name, id);
  }

  getSquareCharacteristic(name: string): string {
    const id = this.squareCharacteristics.get(name);
    if (!id) throw new SeedValidationError(`SquareCharacteristic not found: ${name}`);
    return id;
  }

  getAllSquareCharacteristicIds(): string[] {
    return Array.from(this.squareCharacteristics.values());
  }
}
