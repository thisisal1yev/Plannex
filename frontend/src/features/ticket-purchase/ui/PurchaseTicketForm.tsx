import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '@entities/ticket'
import { Button } from '@shared/ui/Button'
import type { TicketTier } from '@entities/event'
import type { PaymentProvider } from '@shared/types'
import { ticketKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

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

  if (!tiers.length) return <p className="text-muted-foreground text-sm">Нет доступных билетов</p>

  const selectedTier = tiers.find((t) => t.id === tierId)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Тип билета</label>
        {tiers.map((tier) => (
          <label
            key={tier.id}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
              tierId === tier.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value={tier.id}
                checked={tierId === tier.id}
                onChange={() => setTierId(tier.id)}
                className="accent-primary"
              />
              <div>
                <p className="font-medium text-sm text-foreground">{tier.name}</p>
                <p className="text-xs text-muted-foreground">Осталось: {tier.quantity - tier.sold}</p>
              </div>
            </div>
            <span className="font-semibold text-primary">{formatUZS(tier.price)}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">Способ оплаты</label>
        <div className="flex gap-2">
          {(['CLICK', 'PAYME'] as PaymentProvider[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProvider(p)}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                provider === p ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {mutation.isError && (
        <p className="text-sm text-destructive">Ошибка при покупке. Попробуйте ещё раз.</p>
      )}
      {mutation.isSuccess && (
        <p className="text-sm text-green-500">Билет успешно куплен!</p>
      )}

      <Button onClick={() => mutation.mutate()} loading={mutation.isPending} className="w-full">
        Купить за {formatUZS(selectedTier?.price ?? 0)}
      </Button>
    </div>
  )
}
