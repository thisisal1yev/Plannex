import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { analyticsApi } from '@entities/analytics'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'
import { analyticsKeys } from '@shared/api/queryKeys'

const statColors = {
  indigo: 'text-indigo-600',
  green: 'text-green-600',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
} as const

function StatCard({
  label,
  value,
  color = 'indigo',
}: {
  label: string
  value: string | number
  color?: keyof typeof statColors
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${statColors[color]}`}>{value}</p>
    </div>
  )
}

export function OrganizerDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: analyticsApi.dashboard,
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Дашборд</h1>
        <Link to="/my-events/create">
          <Button>+ Создать событие</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Всего событий" value={stats?.totalEvents ?? 0} />
        <StatCard label="Опубликованных" value={stats?.publishedEvents ?? 0} color="green" />
        <StatCard label="Предстоящих" value={stats?.upcomingEvents ?? 0} color="blue" />
        <StatCard label="Билетов продано" value={stats?.totalTicketsSold ?? 0} color="purple" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-1">Общая выручка</p>
          <p className="text-3xl font-bold text-foreground">${stats?.totalRevenue?.toFixed(2) ?? '0.00'}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-1">Комиссия платформы</p>
          <p className="text-3xl font-bold text-foreground">${stats?.totalCommission?.toFixed(2) ?? '0.00'}</p>
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-5">
        <p className="font-medium text-foreground mb-3">Быстрые действия</p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/my-events/create"><Button>Создать событие</Button></Link>
          <Link to="/my-events"><Button variant="secondary">Мои события</Button></Link>
        </div>
      </div>
    </div>
  )
}
