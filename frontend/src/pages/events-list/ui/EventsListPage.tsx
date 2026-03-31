import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarRange, X } from 'lucide-react'
import { eventsApi, EventCard, EVENT_TYPES } from '@entities/event'
import { Pagination } from '@shared/ui/Pagination'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { EmptyState } from '@shared/ui/EmptyState'
import { eventKeys } from '@shared/api/queryKeys'

const TYPE_FILTERS = [
  { value: '', label: 'Barchasi' },
  ...EVENT_TYPES.map((t) => ({ value: t, label: t })),
]

export function EventsListPage() {
  const [page, setPage]           = useState(1)
  const [eventType, setEventType] = useState('')
  const [dateFrom, setDateFrom]   = useState('')
  const [dateTo, setDateTo]       = useState('')
  const [showDates, setShowDates] = useState(false)

  const hasFilters = !!eventType || !!dateFrom || !!dateTo

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

  function handleTypeChange(value: string) {
    setEventType(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h1 className="lp-serif text-4xl md:text-5xl font-bold text-foreground leading-none">
            Tadbirlar
          </h1>
          <div className="text-right shrink-0">
            <p className="lp-serif text-3xl font-semibold text-gold leading-none">
              {data?.meta.total ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">tadbir topildi</p>
          </div>
        </div>
        <div className="h-px bg-linear-to-r from-gold/50 via-gold/15 to-transparent mt-4" />
      </div>

      {/* ── Type pills + date toggle ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-none">
        {TYPE_FILTERS.map((t) => (
          <button
            key={t.value}
            onClick={() => handleTypeChange(t.value)}
            className={`shrink-0 h-8 px-4 rounded-full text-[12px] font-medium border transition-all duration-150 whitespace-nowrap ${
              eventType === t.value
                ? 'bg-gold/12 border-gold/30 text-gold'
                : 'bg-transparent border-border text-muted-foreground hover:border-gold/20 hover:text-foreground hover:bg-muted/30'
            }`}
          >
            {t.label}
          </button>
        ))}

        <div className="w-px h-4 bg-border shrink-0" />

        <button
          onClick={() => setShowDates((v) => !v)}
          className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-medium border transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap ${
            showDates || dateFrom || dateTo
              ? 'bg-gold/12 border-gold/30 text-gold'
              : 'bg-transparent border-border text-muted-foreground hover:border-gold/20 hover:text-foreground hover:bg-muted/30'
          }`}
        >
          <CalendarRange className="size-3" />
          Sana
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

      {/* ── Date filters (collapsible) ── */}
      {showDates && (
        <div className="rounded-xl border border-border/60 bg-card/50 p-4 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-[0.08em]">
              Boshlanish (dan)
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="h-8 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-gold/40 transition-colors text-foreground"
            />
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-[0.08em]">
              Tugash (gacha)
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="h-8 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-gold/40 transition-colors text-foreground"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); setPage(1) }}
              className="h-8 px-3 text-[12px] text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors flex items-center gap-1.5"
            >
              <X className="size-3" />
              Tozalash
            </button>
          )}
        </div>
      )}

      {/* ── Content ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : data?.data.length === 0 ? (
        <EmptyState
          title="Tadbirlar topilmadi"
          description="Filtrlarni o'zgartirib ko'ring"
          action={hasFilters ? { label: 'Filtrlarni tozalash', onClick: resetFilters } : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.data.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
      )}

      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  )
}
