import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { EventStatus } from '../../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { QueryEventsDto } from './dto/query-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new event with optional ticket tiers (organizer only)
   */
  async create(organizerId: string, dto: CreateEventDto) {
    const { ticketTiers, categoryId, startDate, endDate, ...rest } = dto;

    return this.prisma.event.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizerId,
        category: { connect: { id: categoryId } },
        ticketTiers: ticketTiers ? { create: ticketTiers } : undefined,
      },
      include: { ticketTiers: true, square: true, category: { select: { id: true, name: true } } },
    });
  }

  /**
   * Returns paginated list of events with optional filters
   */
  async findMany(query: QueryEventsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.city) where.square = { city: query.city };
    if (query.organizerId) where.organizerId = query.organizerId;
    if (query.title) where.title = { contains: query.title, mode: 'insensitive' };

    if (query.dateFrom || query.dateTo) {
      where.startDate = {};
      if (query.dateFrom) where.startDate.gte = new Date(query.dateFrom);
      if (query.dateTo) where.startDate.lte = new Date(query.dateTo);
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: {
          organizer: { select: { id: true, firstName: true, lastName: true } },
          square: { select: { id: true, name: true, city: true } },
          ticketTiers: true,
          category: { select: { id: true, name: true } },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Returns event details by ID
   */
  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        square: true,
        ticketTiers: true,
        category: { select: { id: true, name: true } },
        eventServices: { include: { service: true } },
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    return event;
  }

  /**
   * Updates event fields — only the event owner can update
   */
  async update(userId: string, eventId: string, dto: UpdateEventDto) {
    const event = await this.findOne(eventId);

    if (event.organizerId !== userId)
      throw new ForbiddenException('Only the event owner can update it');

    const data: Prisma.EventUncheckedUpdateInput = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.event.update({
      where: { id: eventId },
      data,
      include: { ticketTiers: true, square: true, category: { select: { id: true, name: true } } },
    });
  }

  /**
   * Cancels an event — only the owner can do this
   */
  async remove(userId: string, eventId: string) {
    const event = await this.findOne(eventId);

    if (event.organizerId !== userId)
      throw new ForbiddenException('Only the event owner can cancel it');

    return this.prisma.event.update({
      where: { id: eventId },
      data: { status: EventStatus.CANCELLED },
    });
  }

  /**
   * Publishes a DRAFT event — only the owner can do this
   */
  async publish(userId: string, eventId: string) {
    const event = await this.findOne(eventId);

    if (event.organizerId !== userId)
      throw new ForbiddenException('Only the event owner can publish it');

    return this.prisma.event.update({
      where: { id: eventId },
      data: { status: EventStatus.PUBLISHED },
    });
  }

  /**
   * Returns list of ticket buyers for an event (organizer only)
   */
  async getParticipants(userId: string, eventId: string) {
    const event = await this.findOne(eventId);

    if (event.organizerId !== userId)
      throw new ForbiddenException(
        'Only the event owner can view participants',
      );

    return this.prisma.ticket.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        tier: { select: { name: true, price: true } },
      },
    });
  }
}
