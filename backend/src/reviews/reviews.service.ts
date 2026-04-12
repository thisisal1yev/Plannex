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
   * Automatically recalculates the target's RatingStats.
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
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
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
          author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
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
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
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
   * Recalculates RatingStats for a venue based on all its reviews
   */
  private async recalculateVenueRating(venueId: string) {
    const reviews = await this.prisma.review.findMany({ where: { venueId } });
    const count = reviews.length;
    if (count === 0) return;

    const avg = reviews.reduce((s, r) => s + r.rating, 0) / count;
    const stats = {
      avg,
      count,
      one:   reviews.filter((r) => r.rating === 1).length,
      two:   reviews.filter((r) => r.rating === 2).length,
      three: reviews.filter((r) => r.rating === 3).length,
      four:  reviews.filter((r) => r.rating === 4).length,
      five:  reviews.filter((r) => r.rating === 5).length,
    };

    await this.prisma.ratingStats.upsert({
      where: { venueId },
      update: stats,
      create: { venueId, ...stats },
    });
  }

  /**
   * Recalculates RatingStats for a service based on all its reviews
   */
  private async recalculateServiceRating(serviceId: string) {
    const reviews = await this.prisma.review.findMany({ where: { serviceId } });
    const count = reviews.length;
    if (count === 0) return;

    const avg = reviews.reduce((s, r) => s + r.rating, 0) / count;
    const stats = {
      avg,
      count,
      one:   reviews.filter((r) => r.rating === 1).length,
      two:   reviews.filter((r) => r.rating === 2).length,
      three: reviews.filter((r) => r.rating === 3).length,
      four:  reviews.filter((r) => r.rating === 4).length,
      five:  reviews.filter((r) => r.rating === 5).length,
    };

    await this.prisma.ratingStats.upsert({
      where: { serviceId },
      update: stats,
      create: { serviceId, ...stats },
    });
  }
}
