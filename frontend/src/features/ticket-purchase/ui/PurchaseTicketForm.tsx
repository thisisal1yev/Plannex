import { useState } from 'react'
import { Link } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, AlertCircle, CheckCircle2, Ticket, ExternalLink, LoaderCircle } from 'lucide-react'
import { ticketsApi } from '@entities/ticket'
import type { TicketTier } from '@entities/event'
import type { PaymentProvider } from '@shared/types'
import { ticketKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'
import { Button } from '@/shared/ui/primitives/button'
import { Separator } from '@/shared/ui/primitives/separator'
import { cn } from '@/shared/lib/utils'

interface PurchaseTicketFormProps {
  eventId: string
  tiers: TicketTier[]
  onSuccess?: () => void
}

const PROVIDERS: { id: PaymentProvider; label: string; icon: string }[] = [
  { id: 'CLICK',  label: 'Click',  icon: '⚡' },
  { id: 'PAYME',  label: 'Payme',  icon: '💳' },
]

export function PurchaseTicketForm({ eventId, tiers, onSuccess }: PurchaseTicketFormProps) {
  const [tierId,   setTierId]   = useState(tiers[0]?.id ?? '')
  const [provider, setProvider] = useState<PaymentProvider>('CLICK')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => ticketsApi.purchase(eventId, { tierId, provider }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.myList() })
      onSuccess?.()
    },
  })

  if (!tiers.length) {
    return (
      <p className="text-[12px] text-muted-foreground/50 text-center py-4">
        Mavjud chiptalar yo'q
      </p>
    )
  }

  const selectedTier = tiers.find((t) => t.id === tierId)

  return (
    <div className="flex flex-col gap-5">

      {/* ── Tier list ── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] tracking-[0.18em] uppercase font-medium text-muted-foreground/40 mb-2">
          Chipta turi
        </p>
        {tiers.map((tier) => {
          const isSelected = tierId === tier.id
          const isSoldOut  = false

          return (
            <button
              key={tier.id}
              type="button"
              disabled={isSoldOut}
              onClick={() => setTierId(tier.id)}
              className={cn(
                'group relative w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-200 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40',
                isSelected
                  ? 'border-gold/40 bg-gold/6 shadow-[0_0_0_1px_rgba(201,150,58,0.15),inset_0_1px_0_rgba(201,150,58,0.08)]'
                  : 'border-border/50 bg-card/40 hover:border-gold/20 hover:bg-card/70',
                isSoldOut && 'opacity-40 cursor-not-allowed hover:border-border/50 hover:bg-card/40',
              )}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left: check indicator + name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={cn(
                      'flex-none w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200',
                      isSelected
                        ? 'border-gold bg-gold/15 text-gold'
                        : 'border-border/50 bg-transparent',
                    )}
                  >
                    {isSelected && <Check className="size-2.5 stroke-3" />}
                  </span>
                  <div className="min-w-0">
                    <p className={cn(
                      'text-[13px] font-semibold leading-tight truncate transition-colors',
                      isSelected ? 'text-foreground' : 'text-foreground/70',
                    )}>
                      {tier.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground/40 mt-0.5">
                      {tier.quantity} ta
                    </p>
                  </div>
                </div>

                {/* Right: price */}
                <span className={cn(
                  'flex-none text-[13px] font-bold tracking-tight transition-colors',
                  isSelected ? 'text-gold' : 'text-muted-foreground/50',
                )}>
                  {formatUZS(tier.price)}
                </span>
              </div>

            </button>
          )
        })}
      </div>

      <Separator className="bg-border/30" />

      {/* ── Payment method ── */}
      <div className="flex flex-col gap-2.5">
        <p className="text-[10px] tracking-[0.18em] uppercase font-medium text-muted-foreground/40">
          To'lov usuli
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PROVIDERS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setProvider(id)}
              className={cn(
                'relative h-11 rounded-xl border text-[12px] font-semibold tracking-wide transition-all duration-200 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30',
                provider === id
                  ? 'border-gold/35 bg-gold/8 text-gold shadow-[inset_0_1px_0_rgba(201,150,58,0.12)]'
                  : 'border-border/40 bg-card/30 text-muted-foreground/50 hover:border-border hover:text-foreground/60',
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span className="text-[14px]">{icon}</span>
                {label}
              </span>
              {provider === id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-gold/60" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Status feedback ── */}
      {mutation.isError && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/6 px-4 py-3">
          <AlertCircle className="size-3.5 text-destructive shrink-0" />
          <p className="text-[12px] text-destructive/80">Xatolik yuz berdi. Qaytadan urinib ko'ring.</p>
        </div>
      )}
      {mutation.isSuccess && (
        <div className="flex flex-col gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/6 px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
            <p className="text-[12px] text-emerald-500/80">Chipta muvaffaqiyatli sotib olindi!</p>
          </div>
          <Link
            to="/tickets"
            className="inline-flex items-center gap-1 text-[12px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ExternalLink className="size-3" />
            Mening chiptalarim →
          </Link>
        </div>
      )}

      {/* ── Price summary + CTA ── */}
      <div className="flex flex-col gap-3 pt-1">
        {selectedTier && (
          <div className="flex items-center justify-between text-[12px] px-1">
            <span className="text-muted-foreground/40 tracking-wide">Jami to'lov</span>
            <span className="font-bold text-[15px] text-gold lp-serif tracking-tight">
              {formatUZS(selectedTier.price)}
            </span>
          </div>
        )}
        <Button
          size="lg"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || mutation.isSuccess}
          className={cn(
            'w-full h-11 rounded-xl text-[13px] font-semibold tracking-wide gap-2 transition-all duration-200',
            'bg-gold hover:bg-gold-light text-navy border-0',
            'shadow-[0_4px_14px_rgba(201,150,58,0.25)] hover:shadow-[0_4px_20px_rgba(201,150,58,0.35)]',
            'disabled:bg-gold/40 disabled:text-navy/60 disabled:shadow-none',
          )}
        >
          {mutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Ticket className="size-4" />
          )}
          {mutation.isPending ? 'Jarayonda...' : `Sotib olish • ${formatUZS(selectedTier?.price ?? 0)}`}
        </Button>
      </div>
    </div>
  )
}
