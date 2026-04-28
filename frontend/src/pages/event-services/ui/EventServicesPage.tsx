import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Wrench, Plus, Trash2, CheckCircle, XCircle,
  ChefHat, Camera, Music, Palette, ShieldCheck, MapPin,
} from 'lucide-react'
import { eventsApi } from '@entities/event'
import { servicesApi, SERVICE_CATEGORY_LABEL } from '@entities/service'
import type { EventService } from '@entities/service'
import { Spinner } from '@shared/ui/Spinner'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { eventKeys, serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'
import { cn } from '@shared/lib/utils'

const CATEGORY_TABS = [
  { value: '',            label: 'Barchasi' },
  { value: 'CATERING',   label: 'Katering' },
  { value: 'DECORATION', label: 'Dekor' },
  { value: 'SOUND',      label: 'Ovoz' },
  { value: 'PHOTO',      label: 'Foto' },
  { value: 'SECURITY',   label: 'Xavfsizlik' },
]

const STATUS_CONFIG: Record<string, { label: string; bar: string; badge: string }> = {
  PENDING:   { label: 'Kutilmoqda',   bar: 'bg-amber-400/50',        badge: 'text-amber-400 bg-amber-400/10 border-amber-400/25' },
  CONFIRMED: { label: 'Tasdiqlangan', bar: 'bg-emerald-400/60',      badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' },
  CANCELLED: { label: 'Bekor',        bar: 'bg-muted-foreground/20', badge: 'text-muted-foreground/60 bg-muted/20 border-border' },
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  CATERING: ChefHat, PHOTO: Camera, SOUND: Music, DECORATION: Palette, SECURITY: ShieldCheck,
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
    label: `${s.name} — ${SERVICE_CATEGORY_LABEL[s.category?.name ?? ''] ?? s.category?.name} • ${s.city}`,
  })) ?? []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-sm bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Plus className="size-4 text-primary" />
            </div>
            <p className="font-semibold text-[15px] text-foreground">Xizmat qo'shish</p>
          </div>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <Select
            label="Xizmat"
            options={[{ value: '', label: 'Xizmatni tanlang' }, ...serviceOptions]}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          />
          <Input
            label="Kelishilgan narx (so'm)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {attachMutation.isError && (
            <p className="text-[12px] text-destructive bg-destructive/8 px-3 py-2 rounded-lg border border-destructive/20">
              Qo'shishda xatolik yuz berdi
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => attachMutation.mutate()}
              disabled={!serviceId || !price || attachMutation.isPending}
              className="flex-1 h-10 rounded-xl text-[13px] font-semibold bg-primary text-navy hover:bg-primary-light disabled:opacity-40 transition-all duration-200 shadow-[0_4px_12px_rgba(76,140,167,0.25)]"
            >
              {attachMutation.isPending ? 'Yuklanmoqda...' : 'Biriktirish'}
            </button>
            <button
              onClick={onClose}
              className="px-5 h-10 rounded-xl text-[13px] text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-colors"
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

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <Spinner />
    </div>
  )

  const all            = attached ?? []
  const filtered       = category ? all.filter((es) => es.service?.category?.name === category) : all
  const total          = all.reduce((s, es) => s + (Number(es.agreedPrice) || 0), 0)
  const confirmedCount = all.filter((es) => es.status === 'CONFIRMED').length
  const pendingCount   = all.filter((es) => es.status === 'PENDING').length

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Wrench className="size-4 text-primary/80" />
              </div>
              <h1 className="text-[20px] font-bold text-foreground tracking-tight">Xizmatlar boshqaruvi</h1>
              {all.length > 0 && (
                <span className="text-[11px] text-muted-foreground/50 border border-border rounded-full px-2.5 py-0.5 bg-muted/10">
                  {all.length} ta
                </span>
              )}
            </div>

            {all.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {confirmedCount > 0 && (
                  <div className="flex items-center gap-1.5 h-7 px-3 rounded-full text-[11px] font-medium bg-emerald-400/8 border border-emerald-400/20 text-emerald-400">
                    <CheckCircle className="size-3" />
                    {confirmedCount} tasdiqlangan
                  </div>
                )}
                {pendingCount > 0 && (
                  <div className="flex items-center gap-1.5 h-7 px-3 rounded-full text-[11px] font-medium bg-amber-400/8 border border-amber-400/20 text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400/70" />
                    {pendingCount} kutilmoqda
                  </div>
                )}
                {total > 0 && (
                  <div className="h-7 px-3 rounded-full text-[11px] font-medium bg-primary/8 border border-primary/20 text-primary flex items-center">
                    Jami: {formatUZS(total)}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setAttachOpen(true)}
            className="inline-flex items-center gap-1.5 h-10 px-5 rounded-xl text-[13px] font-semibold bg-primary text-navy hover:bg-primary-light shadow-[0_4px_16px_rgba(76,140,167,0.2)] transition-all duration-200 shrink-0"
          >
            <Plus className="size-3.5" />
            Xizmat qo'shish
          </button>
        </div>

        <div className="h-px bg-linear-to-r from-primary/30 via-primary/8 to-transparent" />
      </div>

      {/* ── Category chips ── */}
      <div className="flex gap-2 flex-wrap items-center">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border whitespace-nowrap',
              category === tab.value
                ? 'bg-primary text-navy border-primary shadow-[0_0_18px_rgba(76,140,167,0.3)]'
                : 'bg-transparent border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Service list ── */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-border/60 bg-card/40">
            <div className="w-12 h-12 rounded-2xl bg-muted/20 border border-border/60 flex items-center justify-center mx-auto mb-3">
              <Wrench className="size-5 text-muted-foreground/30" />
            </div>
            <p className="text-[13px] font-medium text-muted-foreground/40">Xizmatlar biriktirilmagan</p>
            <p className="text-[12px] text-muted-foreground/25 mt-1">Xizmat qo'shish tugmasi orqali qo'shing</p>
          </div>
        ) : (
          filtered.map((es: EventService) => {
            const CategoryIcon = CATEGORY_ICON[es.service?.category?.name ?? ''] ?? Wrench
            const status  = es.status ?? 'PENDING'
            const cfg     = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING
            const isPending   = status === 'PENDING'
            const isConfirmed = status === 'CONFIRMED'
            const isMutating  = statusMutation.isPending || removeMutation.isPending

            return (
              <div
                key={es.id}
                className="group relative bg-card rounded-2xl border border-border/60 hover:border-border transition-all duration-200 overflow-hidden"
              >
                {/* Left status accent bar */}
                <div className={cn('absolute left-0 top-0 bottom-0 w-[3px]', cfg.bar)} />

                <div className="flex items-center gap-4 px-5 py-4 pl-6">
                  {/* Category icon */}
                  <div className="w-10 h-10 rounded-xl bg-primary/8 border border-primary/12 flex items-center justify-center shrink-0">
                    <CategoryIcon className="size-[18px] text-primary/60" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate leading-snug">
                      {es.service?.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-muted-foreground/50">
                        {SERVICE_CATEGORY_LABEL[es.service?.category?.name ?? ''] ?? es.service?.category?.name}
                      </span>
                      {(es.service as any)?.city && (
                        <>
                          <span className="text-[10px] text-muted-foreground/25">•</span>
                          <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground/40">
                            <MapPin className="size-2.5" />
                            {(es.service as any).city}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-[15px] font-bold text-primary/90 leading-none">
                      {formatUZS(Number(es.agreedPrice))}
                    </p>
                    <p className="text-[10px] text-muted-foreground/30 mt-0.5">kelishilgan</p>
                  </div>

                  {/* Status badge */}
                  <div className={cn(
                    'hidden md:flex items-center h-6 px-2.5 rounded-full text-[11px] font-medium border shrink-0',
                    cfg.badge,
                  )}>
                    {cfg.label}
                  </div>

                  {/* Actions — revealed on hover */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                    {isPending && (
                      <button
                        onClick={() => statusMutation.mutate({ esId: es.id, status: 'CONFIRMED' })}
                        disabled={isMutating}
                        className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-medium text-emerald-400 bg-emerald-400/8 border border-emerald-400/20 hover:bg-emerald-400/15 disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="size-3" />
                        Tasdiqlash
                      </button>
                    )}
                    {(isPending || isConfirmed) && (
                      <button
                        onClick={() => statusMutation.mutate({ esId: es.id, status: 'CANCELLED' })}
                        disabled={isMutating}
                        className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-medium text-amber-400 bg-amber-400/8 border border-amber-400/20 hover:bg-amber-400/15 disabled:opacity-50 transition-colors"
                      >
                        <XCircle className="size-3" />
                        Bekor
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm("Xizmatni o'chirasizmi?")) removeMutation.mutate(es.id)
                      }}
                      disabled={isMutating}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-medium text-destructive/80 bg-destructive/8 border border-destructive/20 hover:bg-destructive/15 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="size-3" />
                      O'chirish
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {attachOpen && <AttachModal eventId={id!} onClose={() => setAttachOpen(false)} />}
    </div>
  )
}
