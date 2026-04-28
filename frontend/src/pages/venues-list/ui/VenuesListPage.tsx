import { useRef, useState, useCallback } from "react";
import { X } from "lucide-react";
import { VenueCard } from "@entities/venue";
import { useInfiniteVenues } from "@entities/venue/model/venue.infinite";
import { useIntersectionObserver } from "@shared/hooks/useIntersectionObserver";
import { CardSkeleton } from "@shared/ui/CardSkeleton";
import { EmptyState } from "@shared/ui/EmptyState";
import { Spinner } from "@shared/ui/Spinner";
import { UZBEK_CITIES } from "@shared/lib/constants";

const CITY_OPTIONS = [
  { value: "", label: "Barcha shaharlar" },
  ...UZBEK_CITIES.map((c) => ({ value: c, label: c })),
];

export function VenuesListPage() {
  const [city, setCity]               = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxPrice, setMaxPrice]       = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasAdvancedFilters = !!minCapacity || !!maxPrice;
  const hasFilters = !!city || hasAdvancedFilters;

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteVenues({
    city: city || undefined,
    minCapacity: minCapacity ? Number(minCapacity) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const onIntersect = useCallback(() => { fetchNextPage() }, [fetchNextPage]);
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage);

  const venues = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta.total;

  function resetFilters() {
    setCity("");
    setMinCapacity("");
    setMaxPrice("");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-none">
            Maydonlar
          </h1>

          <div className="text-right shrink-0">
            <p className="font-serif text-3xl font-semibold text-primary leading-none">
              {total ?? "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              maydon topildi
            </p>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-primary/50 via-primary/15 to-transparent mt-4" />
      </div>

      {/* ── City pills + advanced filter toggle ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-none">
        {CITY_OPTIONS.map((c) => (
          <button
            key={c.value}
            onClick={() => setCity(c.value)}
            className={`shrink-0 h-8 px-4 rounded-full text-[12px] font-medium border transition-all duration-150 whitespace-nowrap ${
              city === c.value
                ? "bg-primary/12 border-primary/30 text-primary"
                : "bg-transparent border-border text-muted-foreground hover:border-primary/20 hover:text-foreground hover:bg-muted/30"
            }`}
          >
            {c.label}
          </button>
        ))}

        <div className="w-px h-4 bg-border shrink-0" />

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium border transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
            showAdvanced || hasAdvancedFilters
              ? "bg-primary/12 border-primary/30 text-primary"
              : "bg-transparent border-border text-muted-foreground hover:border-primary/20 hover:text-foreground hover:bg-muted/30"
          }`}
        >
          Filtr
          {hasAdvancedFilters && (
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          )}
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

      {/* ── Advanced filters (collapsible) ── */}
      {showAdvanced && (
        <div className="rounded-xl border border-border/60 bg-card/50 p-4 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-[0.08em]">
              O'rindan (min)
            </label>
            <input
              type="number"
              placeholder="100"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="h-8 w-32 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary/40 transition-colors text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-[0.08em]">
              Narx gacha (UZS/kun)
            </label>
            <input
              type="number"
              placeholder="5 000 000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-8 w-40 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary/40 transition-colors text-foreground"
            />
          </div>
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : venues.length === 0 ? (
        <EmptyState
          title="Maydonlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={
            hasFilters
              ? { label: "Filtrlarni tozalash", onClick: resetFilters }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map((venue, i) => (
            <VenueCard key={venue.id} venue={venue} index={i} />
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
