import type { Faker } from '@faker-js/faker';
import type { PrismaClient } from '../../../generated/prisma/client';
import type { SeedRegistry } from '../types';
import { SEED_CONFIG } from '../config';
import { SQUARE_REVIEWS, SERVICE_REVIEWS, EVENT_REVIEWS } from '../fixtures/reviews.fixture';
import { makeReview } from '../factories/review.factory';

export async function seedReviews(
  prisma: PrismaClient,
  registry: SeedRegistry,
  f: Faker,
): Promise<void> {
  // ── 1. Curated reviews ────────────────────────────────────────────────────────
  for (const r of SQUARE_REVIEWS) {
    try {
      await prisma.review.create({
        data: {
          author: { connect: { id: registry.getUser(r.userKey) } },
          square: { connect: { id: registry.getSquare(r.squareKey) } },
          rating: r.rating,
          comment: r.comment,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') continue;
      throw err;
    }
  }

  for (const r of SERVICE_REVIEWS) {
    try {
      await prisma.review.create({
        data: {
          author: { connect: { id: registry.getUser(r.userKey) } },
          service: { connect: { id: registry.getService(r.serviceKey) } },
          rating: r.rating,
          comment: r.comment,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') continue;
      throw err;
    }
  }

  for (const r of EVENT_REVIEWS) {
    try {
      await prisma.review.create({
        data: {
          author: { connect: { id: registry.getUser(r.userKey) } },
          event: { connect: { id: registry.getEvent(r.eventKey) } },
          rating: r.rating,
          comment: r.comment,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2002') continue;
      throw err;
    }
  }

  // ── 2. Generated reviews from completed-event ticket holders ──────────────────
  const usedTickets = await prisma.ticket.findMany({
    where: { event: { status: 'COMPLETED' }, isUsed: true },
    select: {
      userId: true,
      event: { select: { id: true, squareId: true } },
    },
  });

  let generatedCount = 0;
  for (const ticket of usedTickets) {
    if (f.number.float({ min: 0, max: 1 }) > SEED_CONFIG.reviewProbability) continue;

    // Review on the event
    try {
      const review = makeReview(f);
      await prisma.review.create({
        data: {
          author: { connect: { id: ticket.userId } },
          event: { connect: { id: ticket.event.id } },
          rating: review.rating,
          comment: review.comment,
        },
      });
      generatedCount++;
    } catch (err: any) {
      if (err.code !== 'P2002') throw err;
    }

    // 50% chance: also review the square
    if (ticket.event.squareId && f.datatype.boolean({ probability: 0.5 })) {
      try {
        const review = makeReview(f);
        await prisma.review.create({
          data: {
            author: { connect: { id: ticket.userId } },
            square: { connect: { id: ticket.event.squareId } },
            rating: review.rating,
            comment: review.comment,
          },
        });
        generatedCount++;
      } catch (err: any) {
        if (err.code !== 'P2002') throw err;
      }
    }
  }

  // RatingStats are maintained automatically by the DB trigger (recalc_rating_stats_for_target)
  // which fires on every review INSERT/DELETE. No explicit seeding needed.

  const curatedTotal = SQUARE_REVIEWS.length + SERVICE_REVIEWS.length + EVENT_REVIEWS.length;
  console.log(`✅ Reviews seeded: ${curatedTotal} curated + ${generatedCount} generated`);
}
