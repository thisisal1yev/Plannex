import { useRef, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Funnel } from 'lucide-react'
import { ServiceCard } from '@entities/service'
import { useInfiniteServices } from '@entities/service/model/service.infinite'
import { useIntersectionObserver } from '@shared/hooks/useIntersectionObserver'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { UZBEK_CITIES } from '@shared/lib/constants'
import { categoriesApi } from '@shared/api/categoriesApi'
import { categoryKeys } from '@shared/api/queryKeys'

const selectCls =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring text-foreground'

const chipCls = (active: boolean) =>
  `px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
    active
      ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]'
      : 'bg-transparent border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
  }`

export function ServicesListPage() {
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: categoryKeys.serviceCategories(),
    queryFn: categoriesApi.listServiceCategories,
    staleTime: Infinity,
  })

  const hasFilters = !!category || !!city || !!maxPrice

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteServices({
    category: category || undefined,
    city: city || undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  })

  const sentinelRef = useRef<HTMLDivElement>(null)
  const onIntersect = useCallback(() => {
    fetchNextPage()
  }, [fetchNextPage])
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
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-foreground font-serif text-4xl leading-none font-bold md:text-5xl">
            Xizmatlar katalogi
          </h1>
          <div className="shrink-0 text-right">
            <p className="text-primary font-serif text-3xl leading-none font-semibold">
              {total ?? '—'}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs">xizmat topildi</p>
          </div>
        </div>
        <div className="from-primary/50 via-primary/15 mt-4 h-px bg-linear-to-r to-transparent" />
      </div>

      {/* ── Category pills + filter toggle ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* "Barchasi" chip */}
        <button onClick={() => setCategory('')} className={chipCls(!category)}>
          Barchasi
        </button>

        {/* Category chips — skeleton while loading */}
        {categoriesLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted/30 h-9 w-24 animate-pulse rounded-full" />
            ))
          : categories?.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.name)}
                className={chipCls(category === c.name)}
              >
                {c.name}
              </button>
            ))}

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`ml-auto flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
            filtersOpen || hasFilters
              ? 'border-primary/50 text-primary bg-primary/5'
              : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
          }`}
        >
          <Funnel className="h-3.5 w-3.5" />
          Filtr
          {hasFilters && <span className="bg-primary h-1.5 w-1.5 rounded-full" />}
        </button>
      </div>

      {/* ── Expanded filters ── */}
      {filtersOpen && (
        <div className="bg-card border-border -mt-4 flex animate-[svc-in_0.45s_ease-out_both] flex-wrap items-end gap-4 rounded-2xl border p-5">
          <div className="flex min-w-[150px] flex-col gap-1.5">
            <label className="text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase">
              Shahar
            </label>

            <select value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
              <option value="">Barcha shaharlar</option>
              {UZBEK_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-muted-foreground/60 text-[10px] font-medium tracking-widest uppercase">
              Narx gacha (so'm)
            </label>

            <Input
              type="number"
              placeholder="1 000 000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-36"
            />
          </div>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-destructive"
            >
              Tozalash
            </Button>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="Xizmatlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={hasFilters ? { label: 'Filtrlarni tozalash', onClick: resetFilters } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
