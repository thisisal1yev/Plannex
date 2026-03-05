import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { QueryReviewsDto } from './dto/query-reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a review for a venue, service, or event.
   * Automatically recalculates the target's rating.
   */
  async create(authorId: string, dto: CreateReviewDto) {
    if (!dto.venueId && !dto.serviceId && !dto.eventId)
      throw new BadRequestException(
        'Provide at least one of: venueId, serviceId, eventId',
      );

    const review = await this.prisma.review.create({
      data: {
        authorId,
        venueId: dto.venueId,
        serviceId: dto.serviceId,
        eventId: dto.eventId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    // Recalculate ratings asynchronously
    if (dto.venueId) await this.recalculateVenueRating(dto.venueId);
    if (dto.serviceId) await this.recalculateServiceRating(dto.serviceId);

    return review;
  }

  /**
   * Returns reviews for a venue with pagination
   */
  async getVenueReviews(venueId: string, query: QueryReviewsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = { venueId };
    if (query.minRating) where.rating = { gte: query.minRating };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Returns reviews for a service with pagination
   */
  async getServiceReviews(serviceId: string, query: QueryReviewsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = { serviceId };
    if (query.minRating) where.rating = { gte: query.minRating };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Returns reviews for an event with pagination
   */
  async getEventReviews(eventId: string, query: QueryReviewsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = { eventId };
    if (query.minRating) where.rating = { gte: query.minRating };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Recalculates average rating for a venue
   */
  private async recalculateVenueRating(venueId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { venueId },
      _avg: { rating: true },
    });

    await this.prisma.venue.update({
      where: { id: venueId },
      data: { rating: agg._avg.rating ?? 0 },
    });
  }

  /**
   * Recalculates average rating for a service
   */
  private async recalculateServiceRating(serviceId: string) {
    const agg = await this.prisma.review.aggregate({
      where: { serviceId },
      _avg: { rating: true },
    });

    await this.prisma.service.update({
      where: { id: serviceId },
      data: { rating: agg._avg.rating ?? 0 },
    });
  }
}
