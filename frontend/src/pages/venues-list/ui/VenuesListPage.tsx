import { useRef, useState, useCallback } from "react";
import { Funnel } from "lucide-react";
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

const chipCls = (active: boolean) =>
  `px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border whitespace-nowrap ${
    active
      ? "bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]"
      : "bg-transparent border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
  }`

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
      <div className="flex gap-2 flex-wrap items-center">
        {CITY_OPTIONS.map((c) => (
          <button
            key={c.value}
            onClick={() => setCity(c.value)}
            className={chipCls(city === c.value)}
          >
            {c.label}
          </button>
        ))}

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={`ml-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
            showAdvanced || hasAdvancedFilters
              ? "border-primary/50 text-primary bg-primary/5"
              : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
          }`}
        >
          <Funnel className="h-3.5 w-3.5" />
          Filtr
          {hasAdvancedFilters && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </button>
      </div>

      {/* ── Advanced filters (collapsible) ── */}
      {showAdvanced && (
        <div className="animate-[svc-in_0.45s_ease-out_both] bg-card rounded-2xl border border-border p-5 flex flex-wrap gap-4 items-end -mt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">O'rindan (min)</label>
            <input
              type="number"
              placeholder="100"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="h-9 w-32 px-3 text-sm bg-background border border-input rounded-lg focus:outline-none focus:border-ring transition-colors text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">Narx gacha (UZS/kun)</label>
            <input
              type="number"
              placeholder="5 000 000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-9 w-40 px-3 text-sm bg-background border border-input rounded-lg focus:outline-none focus:border-ring transition-colors text-foreground"
            />
          </div>
          {hasAdvancedFilters && (
            <button
              onClick={() => { setMinCapacity(""); setMaxPrice(""); }}
              className="h-9 px-3 text-sm text-muted-foreground hover:text-destructive border border-border rounded-lg transition-colors"
            >
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
