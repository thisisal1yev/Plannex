import { useRef, useState, useCallback } from "react";
import { CalendarRange, X } from "lucide-react";
import { EventCard, EVENT_TYPES } from "@entities/event";
import { useInfiniteEvents } from "@entities/event/model/event.infinite";
import { useIntersectionObserver } from "@shared/hooks/useIntersectionObserver";
import { CardSkeleton } from "@shared/ui/CardSkeleton";
import { EmptyState } from "@shared/ui/EmptyState";
import { Spinner } from "@shared/ui/Spinner";

const TYPE_FILTERS = [
  { value: "", label: "Barchasi" },
  ...EVENT_TYPES.map((t) => ({ value: t, label: t })),
];

export function EventsListPage() {
  const [eventType, setEventType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDates, setShowDates] = useState(false);

  const hasFilters = !!eventType || !!dateFrom || !!dateTo;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteEvents({
    status: "PUBLISHED",
    eventType: eventType || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const onIntersect = useCallback(() => { fetchNextPage() }, [fetchNextPage]);
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage);

  const events = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total;

  function resetFilters() {
    setEventType("");
    setDateFrom("");
    setDateTo("");
  }

  function handleTypeChange(value: string) {
    setEventType(value);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-none">
            Tadbirlar
          </h1>

          <div className="text-right shrink-0">
            <p className="font-serif text-3xl font-semibold text-primary leading-none">
              {total ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              tadbir topildi
            </p>
          </div>
        </div>

        <div className="h-px bg-linear-to-r from-primary/50 via-primary/15 to-transparent mt-4" />
      </div>

      {/* ── Type pills + date toggle ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-none">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTypeChange(t.value)}
            className={`shrink-0 h-8 px-4 rounded-full text-[12px] font-medium border transition-all duration-150 whitespace-nowrap ${
              eventType === t.value
                ? "bg-primary/12 border-primary/30 text-primary"
                : "bg-transparent border-border text-muted-foreground hover:border-primary/20 hover:text-foreground hover:bg-muted/30"
            }`}
          >
            {t.label}
          </button>
        ))}

        <div className="w-px h-4 bg-border shrink-0" />

        <button
          onClick={() => setShowDates((v) => !v)}
          className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium border transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
            showDates || dateFrom || dateTo
              ? "bg-primary/12 border-primary/30 text-primary"
              : "bg-transparent border-border text-muted-foreground hover:border-primary/20 hover:text-foreground hover:bg-muted/30"
          }`}
        >
          <CalendarRange className="size-3" />
          Sana
        </button>

        {hasFilters && (
          <>
            <div className="w-px h-4 bg-border shrink-0" />
            <button
              onClick={resetFilters}
              className="shrink-0 h-8 px-3 rounded-full text-[12px] font-medium border border-border/60 text-muted-foreground/60 hover:text-destructive hover:border-destructive/40 transition-colors flex items-center gap-1"
            >
              <X className="size-3" />
              Tozalash
            </button>
          </>
        )}
      </div>

      {/* ── Date filters (collapsible) ── */}
      {showDates && (
        <div className="rounded-xl border border-border/60 bg-card/50 p-4 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-[0.08em]">
              Boshlanish (dan)
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-8 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary/40 transition-colors text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-[0.08em]">
              Tugash (gacha)
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-8 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary/40 transition-colors text-foreground"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(""); setDateTo("") }}
              className="h-8 px-3 text-[12px] text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors flex items-center gap-1.5"
            >
              <X className="size-3" />
              Tozalash
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="Tadbirlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={
            hasFilters
              ? { label: "Filtrlarni tozalash", onClick: resetFilters }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      )}

      {/* ── Infinite scroll sentinel ── */}
      <div ref={sentinelRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  );
}
