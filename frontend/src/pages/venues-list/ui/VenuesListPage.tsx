import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, X, Wifi, Car } from 'lucide-react'
import { venuesApi } from '@entities/venue'
import { VenueCard } from '@entities/venue'
import { Pagination } from '@shared/ui/Pagination'
import { venueKeys } from '@shared/api/queryKeys'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { Separator } from '@/shared/ui/primitives/separator'

const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', "Farg'ona"]

const CITY_OPTIONS = [
  { value: '', label: 'Barcha shaharlar' },
  ...CITIES.map((c) => ({ value: c, label: c })),
]

function CardSkeleton() {
  return (
    <div className="rounded-[14px] border border-white/7 overflow-hidden flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="px-4 py-3.5 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Separator className="mt-1 opacity-20" />
        <div className="flex justify-between">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3.5 w-14" />
        </div>
      </div>
    </div>
  )
}

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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-foreground tracking-tight leading-none">
            Maydonlar
          </h1>
          <span className="block text-[13px] text-muted-foreground/60 mt-1.5">
            {isLoading ? (
              <Skeleton className="h-3.5 w-20 inline-block" />
            ) : (
              `${data?.meta.total ?? 0} ta maydon topildi`
            )}
          </span>
        </div>

        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12px] font-medium transition-all ${
            showAdvanced || hasAdvancedFilters
              ? 'border-gold/30 bg-gold/8 text-gold'
              : 'border-border text-muted-foreground hover:border-gold/20 hover:text-foreground'
          }`}
        >
          <SlidersHorizontal className="size-3.5" />
          Filtrlar
          {hasAdvancedFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-gold ml-0.5" />
          )}
        </button>
      </div>

      {/* ── City pills ── */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/8 border border-gold/15 flex items-center justify-center">
            <SlidersHorizontal className="size-5 text-gold/50" />
          </div>
          <div className="text-center">
            <p className="text-[14px] font-medium text-foreground">Maydonlar topilmadi</p>
            <p className="text-[12px] text-muted-foreground/50 mt-1">Filtrlarni o'zgartirib ko'ring</p>
          </div>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="h-8 px-4 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors"
            >
              Filtrlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  )
}
