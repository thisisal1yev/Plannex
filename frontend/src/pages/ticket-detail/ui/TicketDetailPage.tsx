import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '@entities/ticket'
import { Badge } from '@shared/ui/Badge'
import { Spinner } from '@shared/ui/Spinner'
import { ticketKeys } from '@shared/api/queryKeys'

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data: ticket, isLoading } = useQuery({
    queryKey: ticketKeys.detail(id!),
    queryFn: () => ticketsApi.get(id!),
    enabled: !!id,
  })

  if (isLoading) return <Spinner />
  if (!ticket) return <p className="text-center text-gray-400 py-12">Билет не найден</p>

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Билет</h1>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-indigo-600 px-6 py-8 text-white text-center">
          <p className="text-lg font-bold">{ticket.event?.title}</p>
          <p className="text-indigo-200 text-sm mt-1">
            {ticket.event?.startDate && new Date(ticket.event.startDate).toLocaleDateString('ru-RU', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        <div className="border-t border-dashed border-gray-200" />

        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Тип</span>
            <span className="font-semibold">{ticket.tier?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Цена</span>
            <span className="font-semibold">${ticket.tier?.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Статус</span>
            <Badge color={ticket.isUsed ? 'gray' : 'green'}>
              {ticket.isUsed ? 'Использован' : 'Действителен'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Оплата</span>
            <Badge color={ticket.payment?.status === 'PAID' ? 'green' : 'yellow'}>
              {ticket.payment?.status ?? 'PENDING'}
            </Badge>
          </div>

          {/* QR Code */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-400 mb-2">QR-код</p>
            <div className="bg-gray-50 rounded-xl p-4 font-mono text-xs text-gray-600 break-all">
              {ticket.qrCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
