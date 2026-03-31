import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, Wifi, Car } from 'lucide-react'
import { venuesApi, VenueCard } from '@entities/venue'
import { Pagination } from '@shared/ui/Pagination'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { venueKeys } from '@shared/api/queryKeys'
import { UZBEK_CITIES } from '@shared/lib/constants'

const CITY_OPTIONS = [
  { value: '', label: 'Barcha shaharlar' },
  ...UZBEK_CITIES.map((c) => ({ value: c, label: c })),
]

export function VenuesListPage() {
  const [page, setPage]                 = useState(1)
  const [city, setCity]                 = useState('')
  const [minCapacity, setMinCapacity]   = useState('')
  const [maxPrice, setMaxPrice]         = useState('')
  const [hasParking, setHasParking]     = useState(false)
  const [hasWifi, setHasWifi]           = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasAdvancedFilters = !!minCapacity || !!maxPrice || hasParking || hasWifi
  const hasFilters = !!city || hasAdvancedFilters

  const { data, isLoading } = useQuery({
    queryKey: venueKeys.list({ page, city, minCapacity, maxPrice, hasParking, hasWifi }),
    queryFn: () =>
      venuesApi.list({
        page,
        limit: 12,
        city: city || undefined,
        minCapacity: minCapacity ? Number(minCapacity) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        hasParking: hasParking || undefined,
        hasWifi: hasWifi || undefined,
      }),
  })

  function resetFilters() {
    setCity('')
    setMinCapacity('')
    setMaxPrice('')
    setHasParking(false)
    setHasWifi(false)
    setPage(1)
  }

  function handleCityChange(value: string) {
    setCity(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="lp-serif text-4xl md:text-5xl font-bold text-foreground leading-none">
            Maydonlar
          </h1>
          <div className="text-right shrink-0">
            <p className="lp-serif text-3xl font-semibold text-gold leading-none">
              {data?.meta.total ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">maydon topildi</p>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-gold/50 via-gold/15 to-transparent mt-4" />
      </div>

      {/* ── City pills + advanced filter toggle ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-none">
        {CITY_OPTIONS.map((c) => (
          <button
            key={c.value}
            onClick={() => handleCityChange(c.value)}
            className={`shrink-0 h-8 px-4 rounded-full text-[12px] font-medium border transition-all duration-150 whitespace-nowrap ${
              city === c.value
                ? 'bg-gold/12 border-gold/30 text-gold'
                : 'bg-transparent border-border text-muted-foreground hover:border-gold/20 hover:text-foreground hover:bg-muted/30'
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
              ? 'bg-gold/12 border-gold/30 text-gold'
              : 'bg-transparent border-border text-muted-foreground hover:border-gold/20 hover:text-foreground hover:bg-muted/30'
          }`}
        >
          Filtr
          {hasAdvancedFilters && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
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
              onChange={(e) => { setMinCapacity(e.target.value); setPage(1) }}
              className="h-8 w-32 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-gold/40 transition-colors text-foreground"
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
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
              className="h-8 w-40 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-gold/40 transition-colors text-foreground"
            />
          </div>
          <label className="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer h-8 px-3 rounded-lg border border-border hover:border-gold/20 transition-colors select-none">
            <input
              type="checkbox"
              checked={hasParking}
              onChange={(e) => { setHasParking(e.target.checked); setPage(1) }}
              className="accent-primary"
            />
            <Car className="size-3.5" />
            Parkovka
          </label>
          <label className="flex items-center gap-2 text-[13px] text-muted-foreground cursor-pointer h-8 px-3 rounded-lg border border-border hover:border-gold/20 transition-colors select-none">
            <input
              type="checkbox"
              checked={hasWifi}
              onChange={(e) => { setHasWifi(e.target.checked); setPage(1) }}
              className="accent-primary"
            />
            <Wifi className="size-3.5" />
            WiFi
          </label>
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="Maydonlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={hasFilters ? { label: 'Filtrlarni tozalash', onClick: resetFilters } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.data.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
        </div>
      )}

      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  )
}
