import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  Users, CalendarDays, Clock, TrendingUp, DollarSign,
  Search, CheckCircle, XCircle,
} from 'lucide-react'
import { analyticsApi } from '@entities/analytics/api/analyticsApi'
import { eventsApi, EVENT_STATUS_COLOR, EVENT_STATUS_LABEL } from '@entities/event'
import type { AdminPendingEvent } from '@entities/analytics/model/types'
import { Badge } from '@shared/ui/Badge'
import { Spinner } from '@shared/ui/Spinner'
import { StatCard } from '@shared/ui/StatCard'
import { analyticsKeys, eventKeys } from '@shared/api/queryKeys'
import { formatDateDefault, formatUZS } from '@shared/lib/dateUtils'

// ─── Chart tooltip ────────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  background: 'hsl(var(--card))',
  border: '1px solid rgba(76,140,167,0.18)',
  borderRadius: 8,
  fontSize: 12,
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  padding: '8px 12px',
}

// ─── Growth chart ─────────────────────────────────────────────────────────────

function GrowthChart({ data }: { data: { week: string; users: number }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[13px] font-semibold text-foreground">Foydalanuvchilar o'sishi</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5 uppercase tracking-[0.06em]">Haftalik dinamika</p>
        </div>
        <span className="text-[11px] text-primary border border-primary/20 bg-primary/5 rounded-full px-2.5 py-1 shrink-0">
          7 hafta
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C9963A" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#C9963A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Area type="monotone" dataKey="users" stroke="#C9963A" strokeWidth={2} fill="url(#gradUsers)" dot={false} activeDot={{ r: 3.5, fill: '#C9963A', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Revenue chart ────────────────────────────────────────────────────────────

function RevenueChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[13px] font-semibold text-foreground">Oylik daromad</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5 uppercase tracking-[0.06em]">Jami to'lovlar</p>
        </div>
        <span className="text-[11px] text-primary border border-primary/20 bg-primary/5 rounded-full px-2.5 py-1 shrink-0">
          12 oy
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="gradLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#9E7220" />
              <stop offset="100%" stopColor="#E8C06A" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.4} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
          <Tooltip
            formatter={(value) => {
              const n = typeof value === 'number' ? value : Number(value)
              return [formatUZS(n), 'Daromad']
            }}
            contentStyle={TOOLTIP_STYLE}
          />
          <Line type="monotone" dataKey="revenue" stroke="url(#gradLine)" strokeWidth={2} dot={false} activeDot={{ r: 3.5, fill: '#C9963A', strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: analyticsKeys.adminDashboard(),
    queryFn: analyticsApi.adminDashboard,
  })

  const publishMutation = useMutation({
    mutationFn: (id: string) => eventsApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.adminDashboard() })
      queryClient.invalidateQueries({ queryKey: eventKeys.all() })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.adminDashboard() })
      queryClient.invalidateQueries({ queryKey: eventKeys.all() })
    },
  })

  const filtered = (data?.recentPendingEvents ?? []).filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    `${e.organizer.firstName} ${e.organizer.lastName}`.toLowerCase().includes(search.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          label="Jami daromad"
          value={formatUZS(data?.totalRevenue ?? 0)}
          icon={DollarSign}
          sub="Barcha to'lovlar"
          accent="primary"
        />
        <StatCard
          label="Foydalanuvchilar"
          value={data?.totalUsers ?? 0}
          icon={Users}
          sub="Ro'yxatdan o'tganlar"
          accent="blue"
        />
        <StatCard
          label="Kutilayotgan"
          value={data?.pendingEvents ?? 0}
          icon={Clock}
          sub="Ko'rib chiqish kerak"
          trend={data && data.pendingEvents > 0 ? `${data.pendingEvents} ta` : undefined}
          trendUp={false}
          accent="amber"
        />
        <StatCard
          label="Jami tadbirlar"
          value={data?.totalEvents ?? 0}
          icon={TrendingUp}
          sub="Barcha vaqt uchun"
          accent="emerald"
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GrowthChart data={data?.weeklyGrowth ?? []} />
        <RevenueChart data={data?.monthlyRevenue ?? []} />
      </div>

      {/* ── Recent events table ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/60">
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">So'nggi kutilayotgan tadbirlar</h2>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">Tasdiqlash yoki rad etish</p>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-7 pr-3 text-[12px] bg-muted/40 border border-border rounded-lg focus:outline-none focus:border-primary/40 focus:bg-card transition-colors w-44 placeholder:text-muted-foreground/40"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-14 text-center text-[13px] text-muted-foreground/50">
            Tadbirlar topilmadi
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50 bg-muted/10">
                <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-5 py-2.5">Tadbir</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden sm:table-cell">Tashkilotchi</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden md:table-cell">Sana</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5">Holat</th>
                <th className="text-right text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-5 py-2.5">Amal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e: AdminPendingEvent) => {
                const isPending = publishMutation.isPending || deleteMutation.isPending
                const banner = e.bannerUrls?.[0]
                return (
                  <tr key={e.id} className="border-b border-border/40 last:border-0 hover:bg-muted/15 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        {banner ? (
                          <img src={banner} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/8 border border-primary/12 flex items-center justify-center shrink-0">
                            <CalendarDays className="size-3.5 text-primary/60" />
                          </div>
                        )}
                        <div>
                          <p className="text-[13px] font-medium text-foreground leading-none">{e.title}</p>
                          <p className="text-[11px] text-muted-foreground/50 mt-0.5">{e.eventType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground hidden sm:table-cell">
                      {e.organizer.firstName} {e.organizer.lastName}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground hidden md:table-cell">
                      {formatDateDefault(e.startDate)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={EVENT_STATUS_COLOR[e.status] ?? 'gray'}>
                        {EVENT_STATUS_LABEL[e.status] ?? e.status}
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
                            Tasdiqlash
                          </button>
                        )}
                        <button
                          onClick={() => { if (window.confirm("Tadbirni o'chirasizmi?")) deleteMutation.mutate(e.id) }}
                          disabled={isPending}
                          className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-red-500 bg-red-500/8 border border-red-500/20 hover:bg-red-500/15 disabled:opacity-50 transition-colors"
                        >
                          <XCircle className="size-3" />
                          Rad
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  )
}
