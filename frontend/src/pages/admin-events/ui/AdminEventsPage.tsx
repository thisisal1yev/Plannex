import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, CalendarDays, CheckCircle, Trash2 } from 'lucide-react'
import { eventsApi, EVENT_STATUS_COLOR } from '@entities/event'
import type { Event } from '@entities/event'
import { Badge } from '@shared/ui/Badge'
import { Pagination } from '@shared/ui/Pagination'
import { Spinner } from '@shared/ui/Spinner'
import { eventKeys } from '@shared/api/queryKeys'
import { formatDateDefault } from '@shared/lib/dateUtils'

const STATUS_TABS = [
  { value: '',          label: 'Barchasi' },
  { value: 'DRAFT',     label: 'Kutilmoqda' },
  { value: 'PUBLISHED', label: 'Nashr' },
  { value: 'COMPLETED', label: 'Tugallandi' },
  { value: 'CANCELLED', label: 'Bekor' },
]

const STATUS_LABELS: Record<string, string> = {
  DRAFT:     'Kutilmoqda',
  PUBLISHED: 'Nashr',
  CANCELLED: 'Bekor',
  COMPLETED: 'Tugallandi',
}

export function AdminEventsPage() {
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: eventKeys.list({ page, search, status }),
    queryFn: () => eventsApi.list({ page, limit: 20, status: status || undefined }),
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => eventsApi.publish(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all() }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.all() }),
  })

  const events = data?.data ?? []
  const isPending = publishMutation.isPending || deleteMutation.isPending

  const filtered = search
    ? events.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()))
    : events

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-[18px] font-bold text-foreground tracking-tight">Tadbirlar</h1>
        {data?.meta && (
          <span className="text-[11px] font-medium text-muted-foreground/60 border border-border rounded-full px-2.5 py-0.5 bg-muted/30">
            {data.meta.total} ta
          </span>
        )}
      </div>

      {/* ── Status tabs + Search ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/60">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatus(tab.value); setPage(1) }}
              className={`h-7 px-3 rounded-md text-[12px] font-medium transition-all ${
                status === tab.value
                  ? 'bg-card text-foreground shadow-sm border border-border/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Tadbir nomini qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52 h-9 pl-8 pr-3 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:border-gold/40 transition-colors placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-muted-foreground/50">
                Tadbirlar topilmadi
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/10">
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-5 py-2.5">Tadbir</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden md:table-cell">Turi</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden sm:table-cell">Boshlanish</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5">Holat</th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e: Event) => (
                    <tr key={e.id} className="border-b border-border/40 last:border-0 hover:bg-muted/15 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {e.bannerUrl ? (
                            <img src={e.bannerUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gold/8 border border-gold/12 flex items-center justify-center shrink-0">
                              <CalendarDays className="size-3.5 text-gold/60" />
                            </div>
                          )}
                          <div>
                            <p className="text-[13px] font-medium text-foreground leading-none line-clamp-1">{e.title}</p>
                            {e.organizer && (
                              <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                                {e.organizer.firstName} {e.organizer.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground hidden md:table-cell">{e.eventType}</td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground hidden sm:table-cell">
                        {formatDateDefault(e.startDate)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge color={EVENT_STATUS_COLOR[e.status] ?? 'gray'}>
                          {STATUS_LABELS[e.status] ?? e.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          {e.status === 'DRAFT' && (
                            <button
                              onClick={() => publishMutation.mutate(e.id)}
                              disabled={isPending}
                              className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/8 border border-emerald-500/20 hover:bg-emerald-500/15 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle className="size-3" />
                              Nashr
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm("Tadbirni o'chirasizmi?")) deleteMutation.mutate(e.id)
                            }}
                            disabled={isPending}
                            className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-red-500 bg-red-500/8 border border-red-500/20 hover:bg-red-500/15 disabled:opacity-50 transition-colors"
                          >
                            <Trash2 className="size-3" />
                            O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  )
}
