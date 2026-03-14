import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { venuesApi } from '@entities/venue'
import { VenueCard } from '@entities/venue'
import { Spinner } from '@shared/ui/Spinner'
import { Pagination } from '@shared/ui/Pagination'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { venueKeys } from '@shared/api/queryKeys'

const CITIES = ['Ташкент', 'Самарканд', 'Бухара', 'Наманган', 'Андижан', 'Фергана']

const selectCls = 'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function VenuesListPage() {
  const [page, setPage] = useState(1)
  const [city, setCity] = useState('')
  const [minCapacity, setMinCapacity] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [hasParking, setHasParking] = useState(false)
  const [hasWifi, setHasWifi] = useState(false)

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Площадки</h1>
        <span className="text-sm text-muted-foreground">{data?.meta.total ?? 0} найдено</span>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Город</label>
          <select
            value={city}
            onChange={(e) => { setCity(e.target.value); setPage(1) }}
            className={selectCls}
          >
            <option value="">Все города</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Мест от</label>
          <Input
            type="number"
            placeholder="100"
            value={minCapacity}
            onChange={(e) => { setMinCapacity(e.target.value); setPage(1) }}
            className="w-28"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Цена до ($/день)</label>
          <Input
            type="number"
            placeholder="500"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
            className="w-32"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={hasParking}
            onChange={(e) => { setHasParking(e.target.checked); setPage(1) }}
            className="accent-primary"
          />
          Паркинг
        </label>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={hasWifi}
            onChange={(e) => { setHasWifi(e.target.checked); setPage(1) }}
            className="accent-primary"
          />
          WiFi
        </label>
        <Button variant="ghost" size="sm" onClick={resetFilters}>Сбросить</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">Площадок не найдено</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}
    </div>
  )
}
