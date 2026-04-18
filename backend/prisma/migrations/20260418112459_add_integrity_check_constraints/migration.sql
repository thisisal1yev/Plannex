-- ─────────────────────────────────────────────────────────────────────────────
-- Booking: ровно один таргет (square OR eventService)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Booking"
  ADD CONSTRAINT booking_has_single_target CHECK (
    ("squareId" IS NOT NULL AND "eventServiceId" IS NULL)
    OR
    ("squareId" IS NULL AND "eventServiceId" IS NOT NULL)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Review: ровно один таргет из трёх + рейтинг 1..5
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Review"
  ADD CONSTRAINT review_has_single_target CHECK (
    (
      ("eventId" IS NOT NULL)::int +
      ("squareId" IS NOT NULL)::int +
      ("serviceId" IS NOT NULL)::int
    ) = 1
  );

ALTER TABLE "Review"
  ADD CONSTRAINT review_rating_in_range CHECK (
    rating BETWEEN 1 AND 5
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- Boost: ровно один таргет (square OR service)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "Boost"
  ADD CONSTRAINT boost_has_single_target CHECK (
    ("squareId" IS NOT NULL AND "serviceId" IS NULL)
    OR
    ("squareId" IS NULL AND "serviceId" IS NOT NULL)
  );

-- ─────────────────────────────────────────────────────────────────────────────
-- RatingStats: ровно один таргет (square OR service)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "RatingStats"
  ADD CONSTRAINT ratingstats_has_single_target CHECK (
    ("squareId" IS NOT NULL AND "serviceId" IS NULL)
    OR
    ("squareId" IS NULL AND "serviceId" IS NOT NULL)
  );