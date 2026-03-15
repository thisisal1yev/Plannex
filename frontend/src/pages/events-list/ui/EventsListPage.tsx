import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { EventCard } from '@entities/event'
import { Spinner } from '@shared/ui/Spinner'
import { Pagination } from '@shared/ui/Pagination'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { eventKeys } from '@shared/api/queryKeys'

const EVENT_TYPES = ['Konsert', 'Konferensiya', 'Ko\'rgazma', 'Trening', 'Festival', 'Ziyofat']

const selectCls = 'h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function EventsListPage() {
  const [page, setPage] = useState(1)
  const [eventType, setEventType] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: eventKeys.list({ page, eventType, dateFrom, dateTo, status: 'PUBLISHED' }),
    queryFn: () =>
      eventsApi.list({
        page,
        limit: 12,
        status: 'PUBLISHED',
        eventType: eventType || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
  })

  function resetFilters() {
    setEventType('')
    setDateFrom('')
    setDateTo('')
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Tadbirlar</h1>
        <span className="text-sm text-muted-foreground">{data?.meta.total ?? 0} topildi</span>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 min-w-[160px]">
          <label className="text-xs text-muted-foreground font-medium">Tadbir turi</label>
          <select
            value={eventType}
            onChange={(e) => { setEventType(e.target.value); setPage(1) }}
            className={selectCls}
          >
            <option value="">Barchasi</option>
            {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Dan</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground font-medium">Gacha</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
          />
        </div>
        <Button variant="ghost" size="sm" onClick={resetFilters}>Tozalash</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : data?.data.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">Tadbirlar topilmadi</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {data?.meta && (
        <Pagination meta={data.meta} onPageChange={setPage} />
      )}
    </div>
  )
}
