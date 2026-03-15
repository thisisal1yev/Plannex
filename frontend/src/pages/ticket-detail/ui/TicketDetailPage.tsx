import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '@entities/ticket'
import { Badge } from '@shared/ui/Badge'
import { Spinner } from '@shared/ui/Spinner'
import { ticketKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: ticket, isLoading } = useQuery({
    queryKey: ticketKeys.detail(id!),
    queryFn: () => ticketsApi.get(id!),
    enabled: !!id,
  })

  if (isLoading) return <Spinner />
  if (!ticket) return <p className="text-center text-muted-foreground py-12">Билет не найден</p>

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Билет</h1>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="bg-primary px-6 py-8 text-primary-foreground text-center">
          <p className="text-lg font-bold">{ticket.event?.title}</p>
          <p className="text-primary-foreground/70 text-sm mt-1">
            {ticket.event?.startDate && new Date(ticket.event.startDate).toLocaleDateString('ru-RU', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        <div className="border-t border-dashed border-border" />

        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Тип</span>
            <span className="font-semibold text-foreground">{ticket.tier?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Цена</span>
            <span className="font-semibold text-foreground">{formatUZS(ticket.tier?.price ?? 0)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Статус</span>
            <Badge color={ticket.isUsed ? 'gray' : 'green'}>
              {ticket.isUsed ? 'Использован' : 'Действителен'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Оплата</span>
            <Badge color={ticket.payment?.status === 'PAID' ? 'green' : 'yellow'}>
              {ticket.payment?.status ?? 'PENDING'}
            </Badge>
          </div>

          {/* QR Code */}
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground mb-2">QR-код</p>
            <div className="bg-muted/50 rounded-xl p-4 font-mono text-xs text-muted-foreground break-all">
              {ticket.qrCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
