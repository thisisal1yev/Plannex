import { memo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  Building2,
  Wrench,
  TrendingUp,
  Star,
  Clock,
  Plus,
  ChevronDown,
  CheckCircle2,
  XCircle,
  ListChecks,
} from 'lucide-react'
import { analyticsApi } from '@entities/analytics'
import type { VendorBookingItem } from '@entities/analytics'
import { analyticsKeys } from '@shared/api/queryKeys'
import { apiClient } from '@shared/api/client'
import { StatCard } from '@shared/ui/StatCard'
import { Spinner } from '@shared/ui/Spinner'
import { EmptyState } from '@shared/ui/EmptyState'
import { Badge } from '@shared/ui/Badge'
import { formatUZS, formatDateShort } from '@shared/lib/dateUtils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'

const chartMargin = { top: 4, right: 4, left: -20, bottom: 0 } as const
const axisTick = { fontSize: 10, fill: 'rgba(255,255,255,0.3)' } as const
const chartDot = { r: 3, fill: '#4c8ca7', strokeWidth: 0 } as const
const chartActiveDot = { r: 5, fill: '#4c8ca7', strokeWidth: 0 } as const

const STRINGS = {
  title: 'Boshqaruv paneli',
  subtitle: 'Maydonlar, xizmatlar va buyurtmalar statistikasi',
  newAd: "Yangi e'lon",
  newVenue: 'Yangi maydon',
  newService: 'Yangi xizmat',
  totalVenues: 'Jami maydonlar',
  totalServices: 'Jami xizmatlar',
  totalRevenue: 'Umumiy daromad',
  avgRating: "O'rtacha reyting",
  pendingBookings: 'Kutilayotgan buyurtmalar',
  confirm: 'Tasdiqlash',
  cancel: 'Bekor qilish',
  noPending: "Kutilayotgan buyurtmalar yo'q",
  revenueChart: 'Oylik daromad',
  confirmedBookings: 'Tasdiqlangan buyurtmalar',
  myVenues: 'Mening maydonlarim',
  myServices: 'Mening xizmatlarim',
  noConfirmed: "Tasdiqlangan buyurtmalar yo'q",
  noData: "Ma'lumot yo'q",
}

const RevenueTooltip = memo(function RevenueTooltip({
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
      <p className="text-primary text-[13px] font-bold">{formatUZS(payload[0].value)}</p>
    </div>
  )
})

const BookingRow = memo(function BookingRow({
  booking,
  onConfirm,
  onCancel,
  loading,
}: {
  booking: VendorBookingItem
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  const dateRange = booking.startDate
    ? `${formatDateShort(booking.startDate)}${booking.endDate ? ` – ${formatDateShort(booking.endDate)}` : ''}`
    : '—'

  return (
    <div className="hover:bg-muted/20 flex flex-wrap items-center gap-2 rounded-lg px-3 py-2.5 transition-colors">
      <Badge color={booking.type === 'VENUE' ? 'blue' : 'indigo'}>
        {booking.type === 'VENUE' ? 'Maydon' : 'Xizmat'}
      </Badge>

      <span className="text-foreground min-w-0 flex-1 truncate text-[13px] font-medium">
        {booking.itemName}
      </span>

      <span className="text-muted-foreground/70 shrink-0 text-[13px]">
        {formatUZS(booking.totalCost)}
      </span>

      <span className="text-muted-foreground/50 shrink-0 text-[11px]">{dateRange}</span>

      <div className="flex shrink-0 gap-1.5">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 transition-colors hover:bg-emerald-500/20 disabled:pointer-events-none disabled:opacity-40 dark:text-emerald-400"
        >
          <CheckCircle2 className="size-3" />
          {STRINGS.confirm}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="text-destructive flex items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/10 px-2.5 py-1 text-[11px] font-medium transition-colors hover:bg-destructive/20 disabled:pointer-events-none disabled:opacity-40"
        >
          <XCircle className="size-3" />
          {STRINGS.cancel}
        </button>
      </div>
    </div>
  )
})

const ConfirmedBookingRow = memo(function ConfirmedBookingRow({ booking }: { booking: VendorBookingItem }) {
  const dateRange = booking.startDate
    ? `${formatDateShort(booking.startDate)}${booking.endDate ? ` – ${formatDateShort(booking.endDate)}` : ''}`
    : '—'

  return (
    <Link
      to={booking.type === 'VENUE' ? '/my-venues' : '/my-services'}
      className="hover:bg-muted/20 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
    >
      <div className="bg-primary/8 border-primary/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border">
        {booking.type === 'VENUE' ? (
          <Building2 className="text-primary/50 size-4" />
        ) : (
          <Wrench className="text-primary/50 size-4" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-[13px] font-medium">{booking.itemName}</p>
        <p className="text-muted-foreground/50 text-[11px]">{dateRange}</p>
      </div>

      <span className="text-foreground/80 shrink-0 text-[13px] font-medium">
        {formatUZS(booking.totalCost)}
      </span>
    </Link>
  )
})

export function VendorDashboardPage() {
  const queryClient = useQueryClient()

  const { data: stats, isLoading } = useQuery({
    queryKey: analyticsKeys.vendorDashboard(),
    queryFn: analyticsApi.vendorDashboard,
  })

  const mutation = useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string
      status: 'CONFIRMED' | 'CANCELLED'
    }) => apiClient.patch(`/venues/bookings/${bookingId}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.vendorDashboard() })
    },
    onError: (err) => console.error(err),
  })

  if (isLoading) return <Spinner />

  const avgRatingDisplay =
    stats && stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)} ★` : '—'

  const hasRevenueData = stats?.monthlyRevenue.some((m) => m.revenue > 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight">{STRINGS.title}</h1>
          <p className="text-muted-foreground/50 mt-0.5 text-xs">{STRINGS.subtitle}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-primary text-navy hover:bg-primary-light inline-flex h-9 items-center gap-1.5 rounded-xl border-0 px-4 text-[13px] font-semibold shadow-[0_4px_12px_rgba(76,140,167,0.25)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(76,140,167,0.35)]">
              <Plus className="size-3.5" />
              {STRINGS.newAd}
              <ChevronDown className="size-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/my-venues/create">{STRINGS.newVenue}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-services/create">{STRINGS.newService}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label={STRINGS.totalVenues}
          value={stats?.totalVenues ?? 0}
          icon={Building2}
          accent="primary"
        />
        <StatCard
          label={STRINGS.totalServices}
          value={stats?.totalServices ?? 0}
          icon={Wrench}
          accent="blue"
        />
        <StatCard
          label={STRINGS.totalRevenue}
          value={formatUZS(stats?.totalRevenue ?? 0)}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          label={STRINGS.avgRating}
          value={avgRatingDisplay}
          icon={Star}
          accent="amber"
        />
      </div>

      {/* Pending Bookings */}
      <div className="bg-card border-border rounded-xl border p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="text-primary/70 size-4" />
          <p className="text-foreground text-[13px] font-semibold">{STRINGS.pendingBookings}</p>
          {(stats?.pendingBookingsCount ?? 0) > 0 && (
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              {stats!.pendingBookingsCount}
            </span>
          )}
        </div>

        {!stats?.recentPendingBookings.length ? (
          <EmptyState icon={Clock} title={STRINGS.noPending} variant="section" />
        ) : (
          <div className="flex flex-col gap-0.5">
            {stats.recentPendingBookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                loading={mutation.isPending && mutation.variables?.bookingId === booking.id}
                onConfirm={() => mutation.mutate({ bookingId: booking.id, status: 'CONFIRMED' })}
                onCancel={() => mutation.mutate({ bookingId: booking.id, status: 'CANCELLED' })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="bg-card border-border rounded-xl border p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="text-primary/70 size-4" />
            <p className="text-foreground text-[13px] font-semibold">{STRINGS.revenueChart}</p>
          </div>

          {hasRevenueData ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart
                data={stats!.monthlyRevenue}
                margin={chartMargin}
              >
                <defs>
                  <linearGradient id="vendorRevGrad" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="month"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4c8ca7"
                  strokeWidth={2}
                  fill="url(#vendorRevGrad)"
                  dot={chartDot}
                  activeDot={chartActiveDot}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted-foreground/30 flex h-40 items-center justify-center text-[13px]">
              {STRINGS.noData}
            </div>
          )}
        </div>

        {/* Recent Confirmed Bookings */}
        <div className="bg-card border-border rounded-xl border p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListChecks className="text-primary/70 size-4" />
              <p className="text-foreground text-[13px] font-semibold">
                {STRINGS.confirmedBookings}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/my-venues"
                className="text-primary/70 hover:text-primary text-[11px] transition-colors"
              >
                {STRINGS.myVenues}
              </Link>
              <span className="text-muted-foreground/30 text-[11px]">·</span>
              <Link
                to="/my-services"
                className="text-primary/70 hover:text-primary text-[11px] transition-colors"
              >
                {STRINGS.myServices}
              </Link>
            </div>
          </div>

          {!stats?.recentConfirmedBookings.length ? (
            <div className="text-muted-foreground/30 flex h-40 items-center justify-center text-[13px]">
              {STRINGS.noConfirmed}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {stats.recentConfirmedBookings.map((booking) => (
                <ConfirmedBookingRow key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
