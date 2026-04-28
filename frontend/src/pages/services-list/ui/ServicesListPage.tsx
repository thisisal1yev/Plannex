import { useRef, useState, useCallback } from 'react'
import { Funnel } from 'lucide-react'
import { ServiceCard, SERVICE_CATEGORIES } from '@entities/service'
import { useInfiniteServices } from '@entities/service/model/service.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { UZBEK_CITIES } from '@shared/lib/constants'

const selectCls =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring text-foreground'

export function ServicesListPage() {
  const [category, setCategory] = useState('')
  const [city, setCity]         = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hasFilters = !!category || !!city || !!maxPrice

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteServices({
    category: category || undefined,
    city: city || undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => { fetchNextPage() }, [fetchNextPage])
  useIntersectionObserver(sentinelRef, onIntersect, hasNextPage && !isFetchingNextPage)

  const services = data?.pages.flatMap((p) => p.data) ?? []
  const total = data?.pages[0]?.meta.total

  function resetFilters() {
    setCategory('')
    setCity('')
    setMaxPrice('')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-none">
            Xizmatlar katalogi
          </h1>
          <div className="text-right shrink-0">
            <p className="font-serif text-3xl font-semibold text-primary leading-none">
              {total ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">xizmat topildi</p>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-primary/50 via-primary/15 to-transparent mt-4" />
      </div>

      {/* ── Category pills + filter toggle ── */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => setCategory('')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
            !category
              ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]'
              : 'bg-transparent border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
          }`}
        >
          Barchasi
        </button>

        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.label)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
              category === c.label
                ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]'
                : 'bg-transparent border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
            }`}
          >
            <span className="text-[13px]">{c.icon}</span>
            {c.label}
          </button>
        ))}

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`ml-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
            filtersOpen || hasFilters
              ? 'border-primary/50 text-primary bg-primary/5'
              : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
          }`}
        >
          <Funnel className="h-3.5 w-3.5" />
          Filtr
          {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
        </button>
      </div>

      {/* ── Expanded filters ── */}
      {filtersOpen && (
        <div className="animate-[svc-in_0.45s_ease-out_both] bg-card rounded-2xl border border-border p-5 flex flex-wrap gap-4 items-end -mt-4">
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">Shahar</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={selectCls}
            >
              <option value="">Barcha shaharlar</option>
              {UZBEK_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">Narx gacha (so'm)</label>
            <Input
              type="number"
              placeholder="1 000 000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-36"
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground hover:text-destructive">
              Tozalash
            </Button>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="Xizmatlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={hasFilters ? { label: 'Filtrlarni tozalash', onClick: resetFilters } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
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
  )
}
