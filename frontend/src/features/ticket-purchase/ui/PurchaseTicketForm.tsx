import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '@entities/ticket'
import { Button } from '@shared/ui/Button'
import type { TicketTier } from '@entities/event'
import type { PaymentProvider } from '@shared/types'
import { ticketKeys } from '@shared/api/queryKeys'

interface PurchaseTicketFormProps {
  eventId: string
  tiers: TicketTier[]
  onSuccess?: () => void
}

export function PurchaseTicketForm({ eventId, tiers, onSuccess }: PurchaseTicketFormProps) {
  const [tierId, setTierId] = useState(tiers[0]?.id ?? '')
  const [provider, setProvider] = useState<PaymentProvider>('CLICK')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => ticketsApi.purchase(eventId, { tierId, provider }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.myList() })
      onSuccess?.()
    },
  })

  if (!tiers.length) return <p className="text-gray-500 text-sm">Нет доступных билетов</p>

  const selectedTier = tiers.find((t) => t.id === tierId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Тип билета</label>
        {tiers.map((tier) => (
          <label
            key={tier.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              tierId === tier.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value={tier.id}
                checked={tierId === tier.id}
                onChange={() => setTierId(tier.id)}
                className="accent-indigo-600"
              />
              <div>
                <p className="font-medium text-sm">{tier.name}</p>
                <p className="text-xs text-gray-500">Осталось: {tier.quantity - tier.sold}</p>
              </div>
            </div>
            <span className="font-semibold text-indigo-600">${tier.price}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Способ оплаты</label>
        <div className="flex gap-2">
          {(['CLICK', 'PAYME'] as PaymentProvider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                provider === p ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">Ошибка при покупке. Попробуйте ещё раз.</p>
      )}
      {mutation.isSuccess && (
        <p className="text-sm text-green-600">Билет успешно куплен!</p>
      )}

      <Button onClick={() => mutation.mutate()} loading={mutation.isPending} className="w-full">
        Купить за ${selectedTier?.price ?? 0}
      </Button>
    </div>
  )
}
