import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
const { Decimal } = Prisma;
import { BookingStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { BookVenueDto } from './dto/book-venue.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateVenueDto } from './dto/create-venue.dto';
import { QueryVenuesDto } from './dto/query-venues.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new venue (admin or vendor)
   */
  async create(ownerId: string, dto: CreateVenueDto) {
    const { characteristicIds, ...rest } = dto;
    return this.prisma.venue.create({
      data: {
        ...rest,
        ownerId,
        ...(characteristicIds?.length && {
          characteristics: { connect: characteristicIds.map((id) => ({ id })) },
        }),
      },
      include: { characteristics: true },
    });
  }

  async listCharacteristics() {
    return this.prisma.venueCharacteristic.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOrCreateCharacteristic(name: string) {
    const normalized = name.trim();
    return this.prisma.venueCharacteristic.upsert({
      where: { name: normalized },
      update: {},
      create: { name: normalized },
    });
  }

  /**
   * Returns paginated list of venues with optional filters
   */
  async findMany(query: QueryVenuesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.VenueWhereInput = {};

    if (query.ownerId) where.ownerId = query.ownerId;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.minCapacity) where.capacity = { gte: query.minCapacity };
    if (query.maxPrice)
      where.pricePerDay = { lte: new Decimal(query.maxPrice) };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.venue.findMany({
        where,
        skip,
        take: limit,
        include: { ratingStats: true, characteristics: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.venue.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Returns venue details by ID
   */
  async findOne(id: string) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: {
        ratingStats: true,
        characteristics: true,
        category: true,
        owner: {
          select: { id: true, firstName: true, lastName: true },
        },
        reviews: {
          include: {
            author: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!venue) throw new NotFoundException('Venue not found');

    return venue;
  }

  /**
   * Updates a venue (owner or admin)
   */
  async update(userId: string, venueId: string, dto: UpdateVenueDto) {
    const venue = await this.findOne(venueId);

    if (venue.ownerId !== userId)
      throw new ForbiddenException('Only the venue owner can update it');

    return this.prisma.venue.update({ where: { id: venueId }, data: dto });
  }

  /**
   * Books a venue for an event — checks availability and calculates total cost
   */
  async book(userId: string, venueId: string, dto: BookVenueDto) {
    const venue = await this.findOne(venueId);

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    // Check if venue is available for requested dates
    const conflict = await this.prisma.booking.findFirst({
      where: {
        venueId,
        status: { not: BookingStatus.CANCELLED },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
    });

    if (conflict)
      throw new BadRequestException(
        'Venue is not available for selected dates',
      );

    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const totalCost = new Decimal(venue.pricePerDay).mul(days);

    return this.prisma.booking.create({
      data: {
        venueId,
        userId,
        startDate: start,
        endDate: end,
        totalCost,
      },
    });
  }

  async updateBookingStatus(userId: string, bookingId: string, status: BookingStatus): Promise<any> {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        venue: { select: { ownerId: true } },
        eventService: { select: { service: { select: { vendorId: true } } } },
      },
    });

    if (!booking) throw new NotFoundException('Booking not found');

    const isVenueOwner = booking.venue?.ownerId === userId;
    const isServiceVendor = booking.eventService?.service.vendorId === userId;

    if (!isVenueOwner && !isServiceVendor) {
      throw new ForbiddenException('Only the venue owner or service vendor can update this booking');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }

  /**
   * Checks if venue is available for given dates
   */
  async checkAvailability(venueId: string, dto: CheckAvailabilityDto) {
    await this.findOne(venueId);

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    const conflict = await this.prisma.booking.findFirst({
      where: {
        venueId,
        status: { not: BookingStatus.CANCELLED },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
    });

    return { available: !conflict };
  }
}
