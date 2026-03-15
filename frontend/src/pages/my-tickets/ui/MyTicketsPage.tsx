import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { ticketsApi } from '@entities/ticket'
import { Badge } from '@shared/ui/Badge'
import { Spinner } from '@shared/ui/Spinner'
import { ticketKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

export function MyTicketsPage() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ticketKeys.myList(),
    queryFn: ticketsApi.myTickets,
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Мои билеты</h1>

      {tickets?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">У вас пока нет билетов</p>
          <Link to="/events" className="text-primary hover:underline text-sm">Найти события →</Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {tickets?.map((ticket) => (
          <Link
            key={ticket.id}
            to={`/tickets/${ticket.id}`}
            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
          >
            <div>
              <p className="font-semibold text-foreground">{ticket.event?.title ?? 'Событие'}</p>
              <p className="text-sm text-muted-foreground">{ticket.tier?.name} · {formatUZS(ticket.tier?.price ?? 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {ticket.event?.startDate && new Date(ticket.event.startDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={ticket.isUsed ? 'gray' : 'green'}>
                {ticket.isUsed ? 'Использован' : 'Действителен'}
              </Badge>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
