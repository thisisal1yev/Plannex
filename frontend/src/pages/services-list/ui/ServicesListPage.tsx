import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { servicesApi, ServiceCard, SERVICE_CATEGORIES } from '@entities/service'
import { Pagination } from '@shared/ui/Pagination'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { serviceKeys } from '@shared/api/queryKeys'
import { UZBEK_CITIES } from '@shared/lib/constants'
import type { ServiceCategory } from '@shared/types'

const selectCls =
  'h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring text-foreground'

export function ServicesListPage() {
  const [page, setPage]               = useState(1)
  const [category, setCategory]       = useState<ServiceCategory | ''>('')
  const [city, setCity]               = useState('')
  const [maxPrice, setMaxPrice]       = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const hasFilters = !!category || !!city || !!maxPrice

  const { data, isLoading } = useQuery({
    queryKey: serviceKeys.list({ page, category, city, maxPrice }),
    queryFn: () =>
      servicesApi.list({
        page,
        limit: 12,
        category: category || undefined,
        city: city || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      }),
  })

  function resetFilters() {
    setCategory('')
    setCity('')
    setMaxPrice('')
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="lp-serif text-4xl md:text-5xl font-bold text-foreground leading-none">
            Xizmatlar katalogi
          </h1>
          <div className="text-right shrink-0">
            <p className="lp-serif text-3xl font-semibold text-gold leading-none">
              {data?.meta.total ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">xizmat topildi</p>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-gold/50 via-gold/15 to-transparent mt-4" />
      </div>

      {/* ── Category pills + filter toggle ── */}
      <div className="flex gap-2 flex-wrap items-center">
        <button
          onClick={() => { setCategory(''); setPage(1) }}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
            !category
              ? 'bg-gold text-navy border-gold shadow-[0_0_18px_rgba(201,150,58,0.3)]'
              : 'bg-transparent border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
          }`}
        >
          Barchasi
        </button>

        {SERVICE_CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => { setCategory(c.value); setPage(1) }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border flex items-center gap-1.5 ${
              category === c.value
                ? 'bg-gold text-navy border-gold shadow-[0_0_18px_rgba(201,150,58,0.3)]'
                : 'bg-transparent border-border text-muted-foreground hover:border-gold/40 hover:text-foreground'
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
              ? 'border-gold/50 text-gold bg-gold/5'
              : 'border-border text-muted-foreground hover:border-gold/30 hover:text-foreground'
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtr
          {hasFilters && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
        </button>
      </div>

      {/* ── Expanded filters ── */}
      {filtersOpen && (
        <div className="svc-fade svc-d1 bg-card rounded-2xl border border-border p-5 flex flex-wrap gap-4 items-end -mt-4">
          <div className="flex flex-col gap-1.5 min-w-[150px]">
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">Shahar</label>
            <select
              value={city}
              onChange={(e) => { setCity(e.target.value); setPage(1) }}
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
              onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="Xizmatlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={hasFilters ? { label: 'Filtrlarni tozalash', onClick: resetFilters } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.data.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}

      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  )
}
