import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Wrench,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  ChefHat,
  Camera,
  Music,
  Palette,
  ShieldCheck,
} from 'lucide-react'
import { eventsApi } from '@entities/event'
import { servicesApi, BOOKING_STATUS_COLOR, SERVICE_CATEGORY_LABEL } from '@entities/service'
import type { EventService } from '@entities/service'
import { Badge } from '@shared/ui/Badge'
import { Spinner } from '@shared/ui/Spinner'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { eventKeys, serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'
import { cn } from '@shared/lib/utils'

const STRINGS = {
  title: 'Xizmatlar boshqaruvi',
  add: '+ Xizmat qo\'shish',
  all: 'Barchasi',
  empty: 'Xizmatlar biriktirilmagan',
  confirm: 'Tasdiqlash',
  cancel: 'Bekor qilish',
  remove: 'O\'chirish',
  total: 'Jami',
  modalTitle: 'Xizmat qo\'shish',
  modalService: 'Xizmat',
  modalSelect: 'Xizmatni tanlang',
  modalPrice: 'Kelishilgan narx (so\'m)',
  modalAttach: 'Biriktirish',
  modalError: 'Qo\'shishda xatolik',
}

const CATEGORY_TABS = [
  { value: '',           label: STRINGS.all },
  { value: 'CATERING',   label: 'Кейтеринг' },
  { value: 'DECORATION', label: 'Декор' },
  { value: 'SOUND',      label: 'Звук' },
  { value: 'PHOTO',      label: 'Фото' },
  { value: 'SECURITY',   label: 'Охрана' },
]

const STATUS_LABELS: Record<string, string> = {
  PENDING:   'Kutilmoqda',
  CONFIRMED: 'Tasdiqlangan',
  CANCELLED: 'Bekor',
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  CATERING:   ChefHat,
  PHOTO:      Camera,
  SOUND:      Music,
  DECORATION: Palette,
  SECURITY:   ShieldCheck,
}

function AttachModal({ eventId, onClose }: { eventId: string; onClose: () => void }) {
  const queryClient = useQueryClient()
  const [serviceId, setServiceId] = useState('')
  const [price, setPrice]         = useState('')

  const { data: allServices } = useQuery({
    queryKey: serviceKeys.allFlat(),
    queryFn: () => servicesApi.list({ limit: 100 }),
  })

  const attachMutation = useMutation({
    mutationFn: () => eventsApi.attachService(eventId, { serviceId, agreedPrice: parseFloat(price) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.services(eventId) })
      onClose()
    },
  })

  const serviceOptions = allServices?.data.map((s) => ({
    value: s.id,
    label: `${s.name} — ${SERVICE_CATEGORY_LABEL[s.category] ?? s.category} • ${s.city}`,
  })) ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-5">
        <p className="font-semibold text-[14px] text-foreground mb-4">{STRINGS.modalTitle}</p>
        <div className="flex flex-col gap-3">
          <Select
            label={STRINGS.modalService}
            options={[{ value: '', label: STRINGS.modalSelect }, ...serviceOptions]}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          />
          <Input
            label={STRINGS.modalPrice}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {attachMutation.isError && (
            <p className="text-[12px] text-destructive">{STRINGS.modalError}</p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => attachMutation.mutate()}
              disabled={!serviceId || !price || attachMutation.isPending}
              className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-gold text-navy hover:bg-gold-light disabled:opacity-40 transition-colors"
            >
              {STRINGS.modalAttach}
            </button>
            <button
              onClick={onClose}
              className="px-4 h-9 rounded-lg text-[13px] text-muted-foreground hover:text-foreground border border-border transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EventServicesPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [attachOpen, setAttachOpen] = useState(false)
  const [category, setCategory]     = useState('')

  const { data: attached, isLoading } = useQuery({
    queryKey: eventKeys.services(id!),
    queryFn: () => eventsApi.services(id!),
    enabled: !!id,
  })

  const statusMutation = useMutation({
    mutationFn: ({ esId, status }: { esId: string; status: string }) =>
      eventsApi.updateEventService(id!, esId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.services(id!) }),
  })

  const removeMutation = useMutation({
    mutationFn: (esId: string) => eventsApi.removeEventService(id!, esId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.services(id!) }),
  })

  if (isLoading) return <Spinner />

  const filtered = category
    ? (attached ?? []).filter((es) => es.service?.category === category)
    : (attached ?? [])

  const total = (attached ?? []).reduce((s, es) => s + (Number(es.agreedPrice) || 0), 0)

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <Wrench className="size-5 text-gold/70 shrink-0" />
          <h1 className="text-[18px] font-bold text-foreground tracking-tight">{STRINGS.title}</h1>
          {(attached?.length ?? 0) > 0 && (
            <span className="text-[11px] text-muted-foreground/50 border border-border rounded-full px-2.5 py-0.5 bg-muted/20">
              {attached!.length} ta
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {total > 0 && (
            <span className="text-[12px] text-muted-foreground/60">
              {STRINGS.total}: <span className="font-semibold text-gold">{formatUZS(total)}</span>
            </span>
          )}
          <button
            onClick={() => setAttachOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl text-[13px] font-semibold bg-gold text-navy hover:bg-gold-light shadow-[0_4px_12px_rgba(201,150,58,0.2)] transition-all duration-200"
          >
            <Plus className="size-3.5" />
            {STRINGS.add}
          </button>
        </div>
      </div>

      {/* ── Category filter tabs ── */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 border border-border/50 w-fit">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={cn(
              'h-7 px-3 rounded-md text-[12px] font-medium transition-all',
              category === tab.value
                ? 'bg-card text-foreground shadow-sm border border-border/60'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Service cards ── */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 && (
          <div className="py-16 text-center rounded-xl border border-border bg-card">
            <Wrench className="size-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-[13px] text-muted-foreground/40">{STRINGS.empty}</p>
          </div>
        )}

        {filtered.map((es: EventService) => {
          const CategoryIcon = CATEGORY_ICON[es.service?.category ?? ''] ?? Wrench
          const isPending   = es.status === 'PENDING'
          const isConfirmed = es.status === 'CONFIRMED'
          const isMutating  = statusMutation.isPending || removeMutation.isPending

          return (
            <div
              key={es.id}
              className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 group hover:border-border/80 transition-colors"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-gold/8 border border-gold/12 flex items-center justify-center shrink-0">
                <CategoryIcon className="size-4 text-gold/60" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{es.service?.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground/50">
                    {SERVICE_CATEGORY_LABEL[es.service?.category ?? ''] ?? es.service?.category}
                  </span>

                  <span className="text-[11px] text-muted-foreground/30">•</span>
                  
                  <span className="text-[11px] font-semibold text-gold/80">{formatUZS(Number(es.agreedPrice))}</span>
                </div>
              </div>

              {/* Status badge */}
              <Badge color={BOOKING_STATUS_COLOR[es.status] ?? 'gray'}>
                {STATUS_LABELS[es.status] ?? es.status}
              </Badge>

              {/* Action buttons (visible on hover) */}
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {isPending && (
                  <button
                    onClick={() => statusMutation.mutate({ esId: es.id, status: 'CONFIRMED' })}
                    disabled={isMutating}
                    className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-emerald-500 bg-emerald-500/8 border border-emerald-500/20 hover:bg-emerald-500/15 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle className="size-3" />
                    {STRINGS.confirm}
                  </button>
                )}
                {(isPending || isConfirmed) && (
                  <button
                    onClick={() => statusMutation.mutate({ esId: es.id, status: 'CANCELLED' })}
                    disabled={isMutating}
                    className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-amber-500 bg-amber-500/8 border border-amber-500/20 hover:bg-amber-500/15 disabled:opacity-50 transition-colors"
                  >
                    <XCircle className="size-3" />
                    {STRINGS.cancel}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (window.confirm('Xizmatni o\'chirasizmi?')) removeMutation.mutate(es.id)
                  }}
                  disabled={isMutating}
                  className="flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-red-500 bg-red-500/8 border border-red-500/20 hover:bg-red-500/15 disabled:opacity-50 transition-colors"
                >
                  <Trash2 className="size-3" />
                  {STRINGS.remove}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {attachOpen && <AttachModal eventId={id!} onClose={() => setAttachOpen(false)} />}
    </div>
  )
}
