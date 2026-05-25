import { useQuery } from '@tanstack/react-query'
import { TicketX } from 'lucide-react'
import { ticketsApi, TicketCard } from '@entities/ticket'
import { EmptyState } from '@shared/ui/EmptyState'
import { Spinner } from '@shared/ui/Spinner'
import { ticketKeys } from '@shared/api/queryKeys'

export function MyTicketsPage() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ticketKeys.myList(),
    queryFn: ticketsApi.myTickets,
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Mening chiptalаrim</h1>

      {tickets?.length === 0 && (
        <EmptyState
          icon={TicketX}
          title="Chiptalar yo'q"
          description="Hali birorta chipta sotib olmagansiz"
          action={{ label: 'Tadbirlarni topish', href: '/events' }}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tickets?.map((ticket, i) => (
          <TicketCard key={ticket.id} ticket={ticket} index={i} />
        ))}
      </div>
    </div>
  )
}
