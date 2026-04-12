import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
const { Decimal } = Prisma;
import { PrismaService } from '../prisma/prisma.service';
import { AttachServiceDto } from './dto/attach-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { QueryServicesDto } from './dto/query-services.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new service offering (admin or vendor)
   */
  async create(vendorId: string, dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: { ...dto, vendorId },
    });
  }

  /**
   * Returns paginated list of services with optional filters
   */
  async findMany(query: QueryServicesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ServiceWhereInput = {};

    if (query.category) where.category = query.category;
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.maxPrice) where.priceFrom = { lte: new Decimal(query.maxPrice) };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Returns a single service by ID
   */
  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  /**
   * Updates a service — only the owning vendor or admin
   */
  async update(id: string, dto: UpdateServiceDto, vendorId: string) {
    const service = await this.findOne(id);
    if (service.vendorId !== vendorId)
      throw new ForbiddenException('You do not own this service');
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  /**
   * Attaches a service to an event — only the event organizer
   */
  async attachToEvent(eventId: string, dto: AttachServiceDto, userId: string) {
    await this.findOne(dto.serviceId);

    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.organizerId !== userId)
      throw new ForbiddenException('You do not own this event');

    const existing = await this.prisma.eventService.findUnique({
      where: { eventId_serviceId: { eventId, serviceId: dto.serviceId } },
    });

    if (existing)
      throw new ConflictException('Service already attached to this event');

    return this.prisma.eventService.create({
      data: {
        eventId,
        serviceId: dto.serviceId,
        agreedPrice: new Decimal(dto.agreedPrice),
      },
      include: { service: true },
    });
  }

  /**
   * Returns all services attached to an event
   */
  async getEventServices(eventId: string) {
    return this.prisma.eventService.findMany({
      where: { eventId },
      include: { service: true },
    });
  }

  /**
   * Updates the booking status of an event service link — only the event organizer
   */
  async updateEventService(eventServiceId: string, status: string, userId: string) {
    const link = await this.prisma.eventService.findUnique({
      where: { id: eventServiceId },
      include: { event: true },
    });
    if (!link) throw new NotFoundException('Event service not found');
    if (link.event.organizerId !== userId)
      throw new ForbiddenException('You do not own this event');
    return this.prisma.eventService.update({
      where: { id: eventServiceId },
      data: { status: status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' },
      include: { service: true },
    });
  }

  /**
   * Removes a service from an event — only the event organizer
   */
  async removeEventService(eventServiceId: string, userId: string) {
    const link = await this.prisma.eventService.findUnique({
      where: { id: eventServiceId },
      include: { event: true },
    });
    if (!link) throw new NotFoundException('Event service not found');
    if (link.event.organizerId !== userId)
      throw new ForbiddenException('You do not own this event');
    await this.prisma.eventService.delete({ where: { id: eventServiceId } });
  }
}
