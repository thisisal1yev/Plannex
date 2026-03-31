import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  CalendarDays,
  Ticket,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  Plus,
  ListChecks,
  BadgeDollarSign,
  Percent,
} from 'lucide-react'
import { analyticsApi } from '@entities/analytics'
import { eventsApi, EVENT_STATUS_COLOR, EVENT_STATUS_LABEL } from '@entities/event'
import type { Event } from '@entities/event'
import { Badge } from '@shared/ui/Badge'
import { Spinner } from '@shared/ui/Spinner'
import { StatCard } from '@shared/ui/StatCard'
import { analyticsKeys, eventKeys } from '@shared/api/queryKeys'
import { formatUZS, formatDateShort } from '@shared/lib/dateUtils'
import { cn } from '@shared/lib/utils'

const STRINGS = {
  title: 'Boshqaruv paneli',
  create: 'Tadbir yaratish',
  totalEvents: 'Jami tadbirlar',
  published: 'Nashr etilgan',
  upcoming: 'Yaqinlashayotgan',
  ticketsSold: 'Chiptalar sotilgan',
  revenue: 'Umumiy daromad',
  commission: 'Platforma komissiyasi',
  recentEvents: 'So\'nggi tadbirlar',
  allEvents: 'Barchasini ko\'rish',
  noEvents: 'Tadbirlar yo\'q',
  netRevenue: 'Sof daromad',
  myEvents: 'Mening tadbirlarim',
}


function RecentEventRow({ event }: { event: Event }) {
  const sold = event.ticketTiers?.reduce((s, t) => s + t.sold, 0) ?? 0
  const total = event.ticketTiers?.reduce((s, t) => s + t.quantity, 0) ?? 0
  const pct = total > 0 ? Math.round((sold / total) * 100) : 0

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/20 transition-colors group">
      {event.bannerUrl ? (
        <img src={event.bannerUrl} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-border" />
      ) : (
        <div className="w-9 h-9 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0">
          <CalendarDays className="size-4 text-gold/50" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate">{event.title}</p>
        <p className="text-[11px] text-muted-foreground/50">{formatDateShort(event.startDate)}</p>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        {total > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className={cn('h-full rounded-full', pct > 60 ? 'bg-emerald-500/60' : pct > 25 ? 'bg-amber-400/60' : 'bg-rose-400/60')}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[11px] text-muted-foreground/50">{sold}/{total}</span>
          </div>
        )}
      </div>
      <Badge color={EVENT_STATUS_COLOR[event.status] ?? 'gray'}>
        {EVENT_STATUS_LABEL[event.status] ?? event.status}
      </Badge>
      <Link
        to={`/my-events/${event.id}/participants`}
        className="opacity-0 group-hover:opacity-100 text-[11px] text-gold/70 hover:text-gold transition-all shrink-0"
      >
        →
      </Link>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-[11px] text-muted-foreground/60 mb-1">{label}</p>
      <p className="text-[13px] font-bold text-gold">{formatUZS(payload[0].value)}</p>
    </div>
  )
}

export function OrganizerDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: analyticsApi.dashboard,
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: eventKeys.list({ limit: 6, my: true }),
    queryFn: () => eventsApi.list({ limit: 6 }),
  })

  if (statsLoading) return <Spinner />

  const recentEvents = eventsData?.data ?? []
  const net = (stats?.totalRevenue ?? 0) - (stats?.totalCommission ?? 0)

  const chartData = recentEvents.map((e) => ({
    name: e.title.slice(0, 14) + (e.title.length > 14 ? '…' : ''),
    chipta: e.ticketTiers?.reduce((s, t) => s + t.sold, 0) ?? 0,
  })).reverse()

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">{STRINGS.title}</h1>
          <p className="text-[12px] text-muted-foreground/50 mt-0.5">Tadbir statistikasi va ko'rsatkichlar</p>
        </div>
        <Link
          to="/my-events/create"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-[13px] font-semibold bg-gold text-navy border-0 hover:bg-gold-light shadow-[0_4px_12px_rgba(201,150,58,0.25)] hover:shadow-[0_4px_16px_rgba(201,150,58,0.35)] transition-all duration-200"
        >
          <Plus className="size-3.5" />
          {STRINGS.create}
        </Link>
      </div>

      {/* ── Stat Cards Row 1 ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label={STRINGS.totalEvents}  value={stats?.totalEvents ?? 0}     icon={CalendarDays}    accent="gold" />
        <StatCard label={STRINGS.published}     value={stats?.publishedEvents ?? 0} icon={CheckCircle2}    accent="emerald" />
        <StatCard label={STRINGS.upcoming}      value={stats?.upcomingEvents ?? 0}  icon={Clock}           accent="blue"
          sub="Kelgusi tadbirlar" />
      </div>

      {/* ── Stat Cards Row 2 ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label={STRINGS.ticketsSold}   value={stats?.totalTicketsSold ?? 0} icon={Ticket}          accent="amber" />
        <StatCard
          label={STRINGS.revenue}
          value={formatUZS(stats?.totalRevenue ?? 0)}
          icon={TrendingUp}
          accent="gold"
          sub={`${STRINGS.netRevenue}: ${formatUZS(net)}`}
        />
        <StatCard
          label={STRINGS.commission}
          value={formatUZS(stats?.totalCommission ?? 0)}
          icon={Percent}
          accent="rose"
          sub="Platforma ulushi"
        />
      </div>

      {/* ── Bottom grid: chart + recent events ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Chart */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <BadgeDollarSign className="size-4 text-gold/70" />
            <p className="text-[13px] font-semibold text-foreground">Chipta sotuvi (so'nggi tadbirlar)</p>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c9963a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c9963a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="chipta"
                  stroke="#c9963a"
                  strokeWidth={2}
                  fill="url(#goldGrad)"
                  dot={{ r: 3, fill: '#c9963a', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#c9963a', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-[13px] text-muted-foreground/30">
              Ma'lumot yo'q
            </div>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-gold/70" />
              <p className="text-[13px] font-semibold text-foreground">{STRINGS.recentEvents}</p>
            </div>
            <Link to="/my-events" className="text-[11px] text-gold/70 hover:text-gold transition-colors flex items-center gap-1">
              <ListChecks className="size-3" />
              {STRINGS.allEvents}
            </Link>
          </div>
          {eventsLoading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : recentEvents.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {recentEvents.map((e) => <RecentEventRow key={e.id} event={e} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8">
              <CalendarDays className="size-8 text-muted-foreground/20" />
              <p className="text-[13px] text-muted-foreground/40">{STRINGS.noEvents}</p>
              <Link
                to="/my-events/create"
                className="text-[12px] text-gold/70 hover:text-gold transition-colors"
              >
                Birinchi tadbiringizni yarating →
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
