import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '@entities/service'
import { ServiceCard } from '@entities/service'
import { Spinner } from '@shared/ui/Spinner'
import { Pagination } from '@shared/ui/Pagination'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { serviceKeys } from '@shared/api/queryKeys'
import type { ServiceCategory } from '@shared/types'

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: 'CATERING', label: 'Кейтеринг' },
  { value: 'DECORATION', label: 'Декор' },
  { value: 'SOUND', label: 'Звук' },
  { value: 'PHOTO', label: 'Фото' },
  { value: 'SECURITY', label: 'Охрана' },
]

const CITIES = ['Ташкент', 'Самарканд', 'Бухара', 'Наманган', 'Андижан', 'Фергана']

const selectCls = 'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function ServicesListPage() {
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState<ServiceCategory | ''>('')
  const [city, setCity] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Услуги</h1>
        <span className="text-sm text-muted-foreground">{data?.meta.total ?? 0} найдено</span>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Категория</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value as ServiceCategory | ''); setPage(1) }}
            className={selectCls}
          >
            <option value="">Все категории</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-[140px]">
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
          <label className="text-xs text-muted-foreground font-medium">Цена до ($)</label>
          <Input
            type="number"
            placeholder="1000"
            value={maxPrice}
            onChange={(e) => { setMaxPrice(e.target.value); setPage(1) }}
            className="w-32"
          />
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters}>Сбросить</Button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => { setCategory(''); setPage(1) }}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            !category ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
          }`}
        >
          Все
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => { setCategory(c.value); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              category === c.value ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">Услуг не найдено</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}
    </div>
  )
}
