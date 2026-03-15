import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { analyticsApi } from '@entities/analytics'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'
import { analyticsKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
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
        <h1 className="text-2xl font-bold text-foreground">Boshqaruv paneli</h1>
        <Link to="/my-events/create">
          <Button>+ Tadbir yaratish</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Jami tadbirlar" value={stats?.totalEvents ?? 0} />
        <StatCard label="Nashr etilgan" value={stats?.publishedEvents ?? 0} />
        <StatCard label="Yaqinlashayotgan" value={stats?.upcomingEvents ?? 0} />
        <StatCard label="Chiptalar sotilgan" value={stats?.totalTicketsSold ?? 0} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-1">Umumiy daromad</p>
          <p className="text-3xl font-bold text-foreground">{formatUZS(stats?.totalRevenue ?? 0)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-sm text-muted-foreground mb-1">Platforma komissiyasi</p>
          <p className="text-3xl font-bold text-foreground">{formatUZS(stats?.totalCommission ?? 0)}</p>
        </div>
      </div>

      <div className="bg-primary/5 rounded-xl p-5">
        <p className="font-medium text-foreground mb-3">Tezkor harakatlar</p>
        <div className="flex gap-3 flex-wrap">
          <Link to="/my-events/create"><Button>Tadbir yaratish</Button></Link>
          <Link to="/my-events"><Button variant="secondary">Mening tadbirlarim</Button></Link>
        </div>
      </div>
    </div>
  )
}
