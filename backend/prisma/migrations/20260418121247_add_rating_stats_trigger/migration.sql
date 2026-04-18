-- ─────────────────────────────────────────────────────────────────────────────
-- Функция пересчёта RatingStats для одного target (square или service)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION recalc_rating_stats_for_target(
  p_square_id  TEXT,
  p_service_id TEXT
) RETURNS VOID AS $$
DECLARE
  v_avg   FLOAT;
  v_count INT;
  v_one   INT;
  v_two   INT;
  v_three INT;
  v_four  INT;
  v_five  INT;
BEGIN
  -- Считаем агрегаты из Review
  SELECT
    COALESCE(AVG(rating)::float, 0),
    COUNT(*)::int,
    COUNT(*) FILTER (WHERE rating = 1)::int,
    COUNT(*) FILTER (WHERE rating = 2)::int,
    COUNT(*) FILTER (WHERE rating = 3)::int,
    COUNT(*) FILTER (WHERE rating = 4)::int,
    COUNT(*) FILTER (WHERE rating = 5)::int
  INTO v_avg, v_count, v_one, v_two, v_three, v_four, v_five
  FROM "Review"
  WHERE
    (p_square_id  IS NOT NULL AND "squareId"  = p_square_id)
    OR
    (p_service_id IS NOT NULL AND "serviceId" = p_service_id);

  -- Если отзывов не осталось — удаляем RatingStats
  IF v_count = 0 THEN
    DELETE FROM "RatingStats"
    WHERE
      (p_square_id  IS NOT NULL AND "squareId"  = p_square_id)
      OR
      (p_service_id IS NOT NULL AND "serviceId" = p_service_id);
    RETURN;
  END IF;

  -- Upsert: обновляем существующую или вставляем новую
  IF p_square_id IS NOT NULL THEN
    INSERT INTO "RatingStats" (
      id, "squareId", avg, count, one, two, three, four, five, "updatedAt"
    )
    VALUES (
      gen_random_uuid(), p_square_id,
      v_avg, v_count, v_one, v_two, v_three, v_four, v_five, NOW()
    )
    ON CONFLICT ("squareId") DO UPDATE SET
      avg         = EXCLUDED.avg,
      count       = EXCLUDED.count,
      one         = EXCLUDED.one,
      two         = EXCLUDED.two,
      three       = EXCLUDED.three,
      four        = EXCLUDED.four,
      five        = EXCLUDED.five,
      "updatedAt" = NOW();
  ELSIF p_service_id IS NOT NULL THEN
    INSERT INTO "RatingStats" (
      id, "serviceId", avg, count, one, two, three, four, five, "updatedAt"
    )
    VALUES (
      gen_random_uuid(), p_service_id,
      v_avg, v_count, v_one, v_two, v_three, v_four, v_five, NOW()
    )
    ON CONFLICT ("serviceId") DO UPDATE SET
      avg         = EXCLUDED.avg,
      count       = EXCLUDED.count,
      one         = EXCLUDED.one,
      two         = EXCLUDED.two,
      three       = EXCLUDED.three,
      four        = EXCLUDED.four,
      five        = EXCLUDED.five,
      "updatedAt" = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql;


-- ─────────────────────────────────────────────────────────────────────────────
-- Функция-триггер: вызывается при INSERT/UPDATE/DELETE Review
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trg_review_sync_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- При UPDATE таргет мог поменяться (теоретически) — обновляем оба
  IF TG_OP = 'UPDATE' THEN
    -- Старый таргет (если был square/service)
    IF OLD."squareId" IS NOT NULL OR OLD."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(OLD."squareId", OLD."serviceId");
    END IF;
    -- Новый таргет
    IF NEW."squareId" IS NOT NULL OR NEW."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(NEW."squareId", NEW."serviceId");
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW."squareId" IS NOT NULL OR NEW."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(NEW."squareId", NEW."serviceId");
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD."squareId" IS NOT NULL OR OLD."serviceId" IS NOT NULL THEN
      PERFORM recalc_rating_stats_for_target(OLD."squareId", OLD."serviceId");
    END IF;
    RETURN OLD;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- ─────────────────────────────────────────────────────────────────────────────
-- Сам триггер
-- ─────────────────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS review_sync_rating_stats ON "Review";

CREATE TRIGGER review_sync_rating_stats
  AFTER INSERT OR UPDATE OR DELETE ON "Review"
  FOR EACH ROW
  EXECUTE FUNCTION trg_review_sync_rating_stats();