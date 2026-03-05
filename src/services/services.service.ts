import {
  ConflictException,
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
        orderBy: { rating: 'desc' },
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
   * Updates a service
   */
  async update(id: string, dto: UpdateServiceDto) {
    await this.findOne(id);
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  /**
   * Attaches a service to an event with agreed price
   */
  async attachToEvent(eventId: string, dto: AttachServiceDto) {
    await this.findOne(dto.serviceId);

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
}
