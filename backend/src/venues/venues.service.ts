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
   * Creates a new square (admin or vendor)
   */
  async create(ownerId: string, dto: CreateVenueDto) {
    return this.prisma.square.create({
      data: { ...dto, ownerId },
    });
  }

  /**
   * Returns paginated list of squares with optional filters
   */
  async findMany(query: QueryVenuesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.SquareWhereInput = {};

    if (query.ownerId) where.ownerId = query.ownerId;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.minCapacity) where.capacity = { gte: query.minCapacity };
    if (query.maxPrice)
      where.pricePerDay = { lte: new Decimal(query.maxPrice) };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.square.findMany({
        where,
        skip,
        take: limit,
        include: { ratingStats: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.square.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Returns square details by ID
   */
  async findOne(id: string) {
    const square = await this.prisma.square.findUnique({
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

    if (!square) throw new NotFoundException('Square not found');

    return square;
  }

  /**
   * Updates a square (owner or admin)
   */
  async update(userId: string, squareId: string, dto: UpdateVenueDto) {
    const square = await this.findOne(squareId);

    if (square.ownerId !== userId)
      throw new ForbiddenException('Only the square owner can update it');

    return this.prisma.square.update({ where: { id: squareId }, data: dto });
  }

  /**
   * Books a square for an event — checks availability and calculates total cost
   */
  async book(userId: string, squareId: string, dto: BookVenueDto) {
    const square = await this.findOne(squareId);

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    // Check if square is available for requested dates
    const conflict = await this.prisma.booking.findFirst({
      where: {
        squareId,
        status: { not: BookingStatus.CANCELLED },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
    });

    if (conflict)
      throw new BadRequestException(
        'Square is not available for selected dates',
      );

    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const totalCost = new Decimal(square.pricePerDay).mul(days);

    return this.prisma.booking.create({
      data: {
        squareId,
        userId,
        startDate: start,
        endDate: end,
        totalCost,
      },
    });
  }

  /**
   * Checks if square is available for given dates
   */
  async checkAvailability(squareId: string, dto: CheckAvailabilityDto) {
    await this.findOne(squareId);

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    const conflict = await this.prisma.booking.findFirst({
      where: {
        squareId,
        status: { not: BookingStatus.CANCELLED },
        OR: [{ startDate: { lte: end }, endDate: { gte: start } }],
      },
    });

    return { available: !conflict };
  }
}
