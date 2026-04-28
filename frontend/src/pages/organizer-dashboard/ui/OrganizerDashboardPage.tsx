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
  recentEvents: "So'nggi tadbirlar",
  allEvents: "Barchasini ko'rish",
  noEvents: "Tadbirlar yo'q",
  netRevenue: 'Sof daromad',
  myEvents: 'Mening tadbirlarim',
}

function RecentEventRow({ event }: { event: Event }) {
  const total = event.ticketTiers?.reduce((s, t) => s + t.quantity, 0) ?? 0
  const sold = event.ticketTiers?.reduce((s, t) => s + (t._count?.tickets ?? 0), 0) ?? 0
  const pct = total > 0 ? Math.round((sold / total) * 100) : 0
  const banner = event.bannerUrls?.[0]

  return (
    <Link
      to={`/my-events/${event.id}/`}
      className="hover:bg-muted/20 group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
    >
      {banner ? (
        <img
          src={banner}
          alt={event.title}
          className="border-border h-9 w-9 shrink-0 rounded-lg border object-cover"
        />
      ) : (
        <div className="bg-primary/8 border-primary/15 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
          <CalendarDays className="text-primary/50 size-4" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-[13px] font-medium">{event.title}</p>
        <p className="text-muted-foreground/50 text-[11px]">{formatDateShort(event.startDate)}</p>
      </div>

      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        {total > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="bg-border h-1.5 w-16 overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full rounded-full',
                  pct > 60 ? 'bg-emerald-500/60' : pct > 25 ? 'bg-amber-400/60' : 'bg-rose-400/60'
                )}
                style={{ width: `${pct}%` }}
              />
            </div>

            <span className="text-muted-foreground/50 text-[11px]">
              {sold}/{total}
            </span>
          </div>
        )}
      </div>

      <Badge color={EVENT_STATUS_COLOR[event.status] ?? 'gray'}>
        {EVENT_STATUS_LABEL[event.status] ?? event.status}
      </Badge>
    </Link>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="border-border bg-card rounded-lg border px-3 py-2 shadow-lg">
      <p className="text-muted-foreground/60 mb-1 text-[11px]">{label}</p>
      <p className="text-primary text-[13px] font-bold">{payload[0].value} chipta</p>
    </div>
  )
}

export function OrganizerDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: analyticsApi.dashboard,
  })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: eventKeys.myListDashboard(),
    queryFn: () => eventsApi.myList({ limit: 6 }),
  })

  if (statsLoading) return <Spinner />

  const recentEvents = eventsData?.data ?? []
  const net = (stats?.totalRevenue ?? 0) - (stats?.totalCommission ?? 0)

  const chartData = recentEvents
    .map((e) => {
      const sold = e.ticketTiers?.reduce((s, t) => s + (t._count?.tickets ?? 0), 0) ?? 0
      return {
        name: e.title.slice(0, 14) + (e.title.length > 14 ? '…' : ''),
        chipta: sold,
      }
    })
    .reverse()

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight">{STRINGS.title}</h1>
          <p className="text-muted-foreground/50 mt-0.5 text-xs">
            Tadbir statistikasi va ko'rsatkichlar
          </p>
        </div>
        <Link
          to="/my-events/create"
          className="bg-primary text-navy hover:bg-primary-light inline-flex h-9 items-center gap-1.5 rounded-xl border-0 px-4 text-[13px] font-semibold shadow-[0_4px_12px_rgba(76,140,167,0.25)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(76,140,167,0.35)]"
        >
          <Plus className="size-3.5" />
          {STRINGS.create}
        </Link>
      </div>

      {/* ── Stat Cards Row 1 ── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard
          label={STRINGS.totalEvents}
          value={stats?.totalEvents ?? 0}
          icon={CalendarDays}
          accent="primary"
        />

        <StatCard
          label={STRINGS.published}
          value={stats?.publishedEvents ?? 0}
          icon={CheckCircle2}
          accent="emerald"
        />

        <StatCard
          label={STRINGS.upcoming}
          value={stats?.upcomingEvents ?? 0}
          icon={Clock}
          accent="blue"
          sub="Kelgusi tadbirlar"
        />
      </div>

      {/* ── Stat Cards Row 2 ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label={STRINGS.ticketsSold}
          value={stats?.totalTicketsSold ?? 0}
          icon={Ticket}
          accent="amber"
        />

        <StatCard
          label={STRINGS.revenue}
          value={formatUZS(stats?.totalRevenue ?? 0)}
          icon={TrendingUp}
          accent="primary"
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
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Chart */}
        <div className="bg-card border-border rounded-xl border p-5">
          <div className="mb-4 flex items-center gap-2">
            <BadgeDollarSign className="text-primary/70 size-4" />

            <p className="text-foreground text-[13px] font-semibold">
              Chipta sotuvi (so'nggi tadbirlar)
            </p>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4c8ca7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4c8ca7" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="chipta"
                  stroke="#4c8ca7"
                  strokeWidth={2}
                  fill="url(#goldGrad)"
                  dot={{ r: 3, fill: '#4c8ca7', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#4c8ca7', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted-foreground/30 flex h-40 items-center justify-center text-[13px]">
              Ma'lumot yo'q
            </div>
          )}
        </div>

        {/* Recent Events */}
        <div className="bg-card border-border rounded-xl border p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="text-primary/70 size-4" />
              <p className="text-foreground text-[13px] font-semibold">{STRINGS.recentEvents}</p>
            </div>

            <Link
              to="/my-events"
              className="text-primary/70 hover:text-primary flex items-center gap-1 text-[11px] transition-colors"
            >
              <ListChecks className="size-3" />
              {STRINGS.allEvents}
            </Link>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {recentEvents.map((e) => (
                <RecentEventRow key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8">
              <CalendarDays className="text-muted-foreground/20 size-8" />
              <p className="text-muted-foreground/40 text-[13px]">{STRINGS.noEvents}</p>

              <Link
                to="/my-events/create"
                className="text-primary/70 hover:text-primary text-xs transition-colors"
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
