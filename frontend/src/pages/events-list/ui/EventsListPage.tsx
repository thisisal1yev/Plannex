import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal, X, CalendarRange } from 'lucide-react'
import { eventsApi } from '@entities/event'
import { EventCard } from '@entities/event'
import { Pagination } from '@shared/ui/Pagination'
import { eventKeys } from '@shared/api/queryKeys'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { Separator } from '@/shared/ui/primitives/separator'

const EVENT_TYPES = [
  { value: '', label: 'Barchasi' },
  { value: 'Konsert',      label: 'Konsert' },
  { value: 'Konferensiya', label: 'Konferensiya' },
  { value: "Ko'rgazma",    label: "Ko'rgazma" },
  { value: 'Trening',      label: 'Trening' },
  { value: 'Festival',     label: 'Festival' },
  { value: 'Ziyofat',      label: 'Ziyofat' },
]

function CardSkeleton() {
  return (
    <div className="rounded-[14px] border border-border overflow-hidden flex flex-col">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="px-4 py-3.5 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
        <Separator className="mt-1" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  )
}

export function EventsListPage() {
  const [page, setPage]         = useState(1)
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-foreground tracking-tight leading-none">
            Tadbirlar
          </h1>
          <span className="block text-[13px] text-muted-foreground/60 mt-1.5">
            {isLoading ? (
              <Skeleton className="h-3.5 w-20 inline-block" />
            ) : (
              `${data?.meta.total ?? 0} ta tadbir topildi`
            )}
          </span>
        </div>

        <button
          onClick={() => setShowDates((v) => !v)}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12px] font-medium transition-all ${
            showDates || dateFrom || dateTo
              ? 'border-gold/30 bg-gold/8 text-gold'
              : 'border-border text-muted-foreground hover:border-gold/20 hover:text-foreground'
          }`}
        >
          <CalendarRange className="size-3.5" />
          Sana
          {(dateFrom || dateTo) && (
            <span className="w-1.5 h-1.5 rounded-full bg-gold ml-0.5" />
          )}
        </button>
      </div>

      {/* ── Type pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5 scrollbar-none">
        {EVENT_TYPES.map((t) => (
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
            <p className="text-[14px] font-medium text-foreground">Tadbirlar topilmadi</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data?.data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
    </div>
  )
}
