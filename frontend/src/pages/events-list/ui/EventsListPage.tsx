import { useRef, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarRange, X } from "lucide-react";
import { EventCard } from "@entities/event";
import { useInfiniteEvents } from "@entities/event/model/event.infinite";
import { useIntersectionObserver } from "@shared/hooks/useIntersectionObserver";
import { CardSkeleton } from "@shared/ui/CardSkeleton";
import { EmptyState } from "@shared/ui/EmptyState";
import { Spinner } from "@shared/ui/Spinner";
import { categoriesApi } from "@shared/api/categoriesApi";
import { categoryKeys } from "@shared/api/queryKeys";

const chipCls = (active: boolean) =>
  `px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border whitespace-nowrap ${
    active
      ? "bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]"
      : "bg-transparent border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
  }`

export function EventsListPage() {
  const [categoryId, setCategoryId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDates, setShowDates] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: categoryKeys.eventCategories(),
    queryFn: categoriesApi.listEventCategories,
    staleTime: Infinity,
  });

  const hasFilters = !!categoryId || !!dateFrom || !!dateTo;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteEvents({
    status: "PUBLISHED",
    categoryId: categoryId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const onIntersect = useCallback(() => { fetchNextPage() }, [fetchNextPage]);
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage);

  const events = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total;

  function resetFilters() {
    setCategoryId("");
    setDateFrom("");
    setDateTo("");
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
            <p className="text-xs text-muted-foreground mt-0.5">tadbir topildi</p>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-primary/50 via-primary/15 to-transparent mt-4" />
      </div>

      {/* ── Category pills + date toggle ── */}
      <div className="flex gap-2 flex-wrap items-center">
        {/* "Barchasi" chip */}
        <button onClick={() => setCategoryId("")} className={chipCls(categoryId === "")}>
          Barchasi
        </button>

        {/* Category chips — skeleton while loading */}
        {categoriesLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-full bg-muted/30 animate-pulse" />
            ))
          : categories?.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryId(c.id)}
                className={chipCls(categoryId === c.id)}
              >
                {c.name}
              </button>
            ))}

        <button
          onClick={() => setShowDates((v) => !v)}
          className={`ml-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
            showDates || !!dateFrom || !!dateTo
              ? "border-primary/50 text-primary bg-primary/5"
              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
        >
          <CalendarRange className="h-3.5 w-3.5" />
          Sana
          {(dateFrom || dateTo) && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </button>
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
          action={hasFilters ? { label: "Filtrlarni tozalash", onClick: resetFilters } : undefined}
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
