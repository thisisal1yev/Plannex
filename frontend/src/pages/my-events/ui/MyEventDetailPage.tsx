import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Users,
  Pencil,
  Trash2,
  ChevronRight,
  UserCheck,
  Heart,
  Wrench,
  Clock,
  Send,
  Ticket,
} from 'lucide-react'
import { eventsApi, EVENT_STATUS_COLOR, EVENT_STATUS_LABEL } from '@entities/event'
import { PublishEventButton } from '@features/event-publish'
import { Spinner } from '@shared/ui/Spinner'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { eventKeys } from '@shared/api/queryKeys'
import { formatDateTime, formatDateShort } from '@shared/lib/dateUtils'

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      <Skeleton className="mb-6 h-4 w-32" />
      <Skeleton
        className="h-[480px] w-full"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
      />
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="flex flex-col gap-3 pl-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-3 gap-px">
            <Skeleton className="h-24 rounded-none" />
            <Skeleton className="h-24 rounded-none" />
            <Skeleton className="h-24 rounded-none" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function MyEventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [imgIndex, setImgIndex] = useState(0)

  const { data: event, isLoading } = useQuery({
    queryKey: eventKeys.detail(id!),
    queryFn: () => eventsApi.get(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => eventsApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.myList() })
      navigate('/my-events')
    },
  })

  if (isLoading) return <DetailSkeleton />

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <div className="bg-card border-border/60 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <CalendarDays className="text-muted-foreground/20 size-7" />
        </div>
        <div className="text-center">
          <p className="text-foreground/60 font-serif text-lg">Tadbir topilmadi</p>
          <p className="text-muted-foreground/40 mt-1 text-xs">
            Bunday tadbir mavjud emas yoki o'chirilgan
          </p>
        </div>
        <Link
          to="/my-events"
          className="text-primary/60 hover:text-primary text-xs tracking-[0.12em] uppercase transition-colors"
        >
          ← Mening tadbirlarim
        </Link>
      </div>
    )
  }

  const statusColor = EVENT_STATUS_COLOR[event.status] ?? 'gray'
  const statusLabel = EVENT_STATUS_LABEL[event.status] ?? event.status

  const statusBorderBg: Record<string, string> = {
    gray: 'border-border bg-muted/30 text-muted-foreground',
    green: 'border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400',
    red: 'border-destructive/40 bg-destructive/10 text-destructive',
    indigo: 'border-primary/40 bg-primary/10 text-primary',
  }

  const totalTickets = event.ticketTiers?.reduce((s, t) => s + t.quantity, 0) ?? 0
  const soldTickets = event.ticketTiers?.reduce((s, t) => s + (t._count?.tickets ?? 0), 0) ?? 0

  const navTiles = [
    {
      to: `/my-events/${id}/participants`,
      icon: UserCheck,
      label: 'Ishtirokchilar',
      sub: `${soldTickets} chipta`,
    },
    { to: `/my-events/${id}/volunteers`, icon: Heart, label: "Ko'ngillilar", sub: 'Arizalar' },
    { to: `/my-events/${id}/services`, icon: Wrench, label: 'Xizmatlar', sub: 'Biriktirilgan' },
  ]

  return (
    <div className="flex flex-col pb-16">
      {/* ── Cinematic hero ── */}
      <div className="relative h-[58vh] max-h-[560px] min-h-[380px] w-full overflow-hidden rounded-2xl">
        {event.bannerUrls && event.bannerUrls.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            className="h-full w-full"
            onSwiper={(s) => setSwiper(s)}
            onSlideChange={(s) => setImgIndex(s.realIndex)}
          >
            {event.bannerUrls.map((url, idx) => (
              <SwiperSlide key={`${url}-${idx}`}>
                <img src={url} alt={event.title} className="h-full w-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="from-navy to-navy-2 absolute inset-0 z-0 bg-linear-to-br" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/25 to-black/10" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-20">
          <Link to="/my-events">
            <button className="group flex items-center gap-2 rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />

              <span className="text-[10px] tracking-[0.15em] uppercase">Orqaga</span>
            </button>
          </Link>
        </div>

        {/* Status badge */}
        <div className="absolute top-5 right-5 z-20">
          <div
            className="inline-flex items-center gap-[5px] rounded-full border px-[10px] py-[4px] text-[10px] font-medium backdrop-blur-sm"
            style={{
              color: statusColor,
              borderColor: `${statusColor}44`,
              background: 'rgba(8,15,25,0.65)',
            }}
          >
            <span
              className="inline-block h-[5px] w-[5px] shrink-0 rounded-full"
              style={{ background: statusColor }}
            />
            {statusLabel}
          </div>
        </div>

        {/* Thumbnail strip */}
        {(event.bannerUrls?.length ?? 0) > 1 && (
          <div className="absolute right-6 bottom-6 z-20 flex gap-1.5">
            {event.bannerUrls!.map((url, i) => (
              <button
                key={i}
                onClick={() => {
                  swiper?.slideTo(i)
                  setImgIndex(i)
                }}
                className={`h-12 w-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                  i === imgIndex
                    ? 'border-primary shadow-[0_0_14px_rgba(76,140,167,0.5)]'
                    : 'border-white/20 opacity-55 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8">
          {event.eventType && (
            <span className="text-primary-light/90 border-primary/20 mb-3 inline-flex items-center rounded-full border bg-black/45 px-3 py-1.5 text-xs font-medium tracking-[0.18em] uppercase backdrop-blur-sm">
              {event.eventType}
            </span>
          )}
          <h1 className="mb-2 max-w-2xl font-serif text-3xl leading-tight font-bold text-white drop-shadow-lg md:text-4xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="text-primary/60 h-3.5 w-3.5" />
              <span>{formatDateShort(event.startDate)}</span>
            </div>
            {event.venue && (
              <>
                <span className="text-white/25">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="text-primary/60 h-3.5 w-3.5" />
                  <span>{event.venue.city}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          {/* Schedule */}
          <section>
            <h2 className="text-muted-foreground/35 mb-5 text-[10px] font-semibold tracking-[0.22em] uppercase">
              Jadval
            </h2>
            <div className="bg-border/30 grid grid-cols-3 gap-px overflow-hidden rounded-xl">
              <div className="bg-card/50 flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Boshlanish
                  </span>
                </div>
                <p className="text-foreground/85 font-mono text-sm font-semibold tracking-tight">
                  {formatDateTime(event.startDate)}
                </p>
              </div>
              <div className="bg-card/50 flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Tugash
                  </span>
                </div>
                <p className="text-foreground/85 font-mono text-sm font-semibold tracking-tight">
                  {formatDateTime(event.endDate)}
                </p>
              </div>
              <div className="bg-card/50 flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Sig'im
                  </span>
                </div>
                <p className="text-foreground/85 font-mono text-sm font-semibold tracking-tight">
                  {event.capacity.toLocaleString()} o'rin
                </p>
              </div>
            </div>
          </section>

          {/* Description */}
          {event.description && (
            <section className="border-primary/30 border-l-2 pl-6">
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Tadbir haqida
              </h2>
              <p className="text-foreground/70 text-sm leading-[1.9] whitespace-pre-line">
                {event.description}
              </p>
            </section>
          )}

          {/* Venue */}
          {event.venue && (
            <section>
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Manzil
              </h2>
              <Link to={`/venues/${event.venue.id}`} className="group block">
                <div className="border-border/50 hover:border-primary/25 bg-card/35 relative overflow-hidden rounded-xl border transition-all duration-300">
                  <div className="from-primary/60 via-primary/25 absolute top-0 bottom-0 left-0 w-[2px] bg-linear-to-b to-transparent" />
                  <div className="flex items-center justify-between gap-3 p-5 pl-7">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/8 border-primary/12 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                        <MapPin className="text-primary/55 size-4" />
                      </div>
                      <div>
                        <p className="text-foreground/85 group-hover:text-primary text-sm font-semibold transition-colors duration-200">
                          {event.venue.name}
                        </p>
                        <p className="text-muted-foreground/45 mt-0.5 text-xs">
                          {event.venue.city}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground/20 group-hover:text-primary size-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Ticket tiers */}
          {event.ticketTiers && event.ticketTiers.length > 0 && (
            <section>
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Chipta turlari
              </h2>
              <div className="flex flex-col gap-2.5">
                {event.ticketTiers.map((tier) => {
                  const pct =
                    tier.quantity > 0
                      ? Math.round(((tier._count?.tickets ?? 0) / tier.quantity) * 100)
                      : 0
                  return (
                    <div
                      key={tier.id}
                      className="border-border/50 bg-card/35 relative overflow-hidden rounded-xl border"
                    >
                      <div className="from-primary/60 via-primary/25 absolute top-0 bottom-0 left-0 w-[2px] bg-linear-to-b to-transparent" />
                      <div className="flex items-center justify-between gap-3 p-5 pl-7">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/8 border-primary/12 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border">
                            <Ticket className="text-primary/55 size-3.5" />
                          </div>
                          <div>
                            <p className="text-foreground/85 text-sm font-semibold">{tier.name}</p>
                            <p className="text-muted-foreground/45 mt-0.5 text-xs">
                              {tier._count?.tickets ?? 0} / {tier.quantity} sotilgan
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <p className="text-primary/70 text-xs font-semibold whitespace-nowrap">
                            {Number(tier.price).toLocaleString('uz-UZ')} so'm
                          </p>

                          <div className="bg-border h-1 w-20 overflow-hidden rounded-full">
                            <div
                              className={`h-full rounded-full transition-all ${
                                pct > 60
                                  ? 'bg-emerald-500/60'
                                  : pct > 25
                                    ? 'bg-amber-400/60'
                                    : 'bg-rose-400/60'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Sub-page navigation */}
          <section>
            <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
              Boshqaruv
            </h2>
            <div className="flex flex-col gap-2.5">
              {navTiles.map(({ to, icon: Icon, label, sub }) => (
                <Link key={to} to={to} className="group block">
                  <div className="border-border/50 hover:border-primary/25 bg-card/35 relative overflow-hidden rounded-xl border transition-all duration-300">
                    <div className="from-primary/60 via-primary/25 absolute top-0 bottom-0 left-0 w-[2px] bg-linear-to-b to-transparent" />
                    <div className="flex items-center justify-between gap-3 p-5 pl-7">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/8 border-primary/12 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                          <Icon className="text-primary/55 size-4" />
                        </div>
                        <div>
                          <p className="text-foreground/85 group-hover:text-primary text-sm font-semibold transition-colors duration-200">
                            {label}
                          </p>
                          <p className="text-muted-foreground/45 mt-0.5 text-xs">{sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="text-muted-foreground/20 group-hover:text-primary size-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-4 lg:sticky lg:top-20">
            {/* Actions panel */}
            <div className="border-primary/18 bg-card relative overflow-hidden rounded-xl border">
              <div className="from-primary/9 border-primary/12 relative border-b bg-linear-to-r to-transparent px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary/45 mb-1 text-[9px] font-medium tracking-[0.25em] uppercase">
                      Tadbir boshqaruvi
                    </p>
                    
                    <p className="text-foreground/90 font-serif text-lg font-bold">Harakatlar</p>
                  </div>
                  {totalTickets > 0 && (
                    <div className="text-right">
                      <p className="text-primary/70 font-mono text-xl font-bold">
                        {soldTickets}

                        <span className="text-muted-foreground/30 text-sm">/{totalTickets}</span>
                      </p>

                      <p className="text-muted-foreground/40 text-[10px] tracking-wide">
                        chipta sotildi
                      </p>
                    </div>
                  )}
                </div>
                <span className="border-primary/18 absolute top-2.5 right-2.5 h-3 w-3 border-t border-r" />
                <span className="border-primary/18 absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l" />
              </div>

              <div className="flex flex-col gap-2.5 p-5">
                {/* Status info */}
                <div
                  className={`group flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all ${statusBorderBg[statusColor] ?? statusBorderBg.gray}`}
                >
                  <Clock className="size-3.5 shrink-0" />

                  <span className="text-xs font-medium">Holat: {statusLabel}</span>
                </div>

                {/* Edit */}
                <Link to={`/my-events/${id}/edit`} className="block">
                  <button className="group border-border/60 bg-muted/20 text-foreground/70 hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-xs font-medium transition-all">
                    <Pencil className="size-3.5" />
                    Tahrirlash
                  </button>
                </Link>

                {/* Publish */}
                {event.status === 'DRAFT' && (
                  <div className="[&>button]:h-10 [&>button]:w-full">
                    <PublishEventButton eventId={id!} />
                  </div>
                )}

                {/* Share / announce placeholder */}
                {event.status === 'PUBLISHED' && (
                  <button
                    disabled
                    className="border-border/40 text-muted-foreground/30 flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border text-xs font-medium"
                  >
                    <Send className="size-3.5" />
                    E'lon yuborish (tez kunda)
                  </button>
                )}

                {/* Delete */}
                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (
                      confirm("Tadbirni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.")
                    ) {
                      deleteMutation.mutate()
                    }
                  }}
                  className="border-destructive/20 text-destructive/60 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {deleteMutation.isPending ? (
                    <Spinner />
                  ) : (
                    <>
                      <Trash2 className="size-3.5" />
                      O'chirish
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick stats card */}
            <div className="border-border/45 bg-card/35 rounded-xl border p-5">
              <p className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Statistika
              </p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sig'im", value: event.capacity.toLocaleString(), icon: Users },
                  {
                    label: 'Chipta',
                    value: totalTickets > 0 ? `${soldTickets}/${totalTickets}` : '—',
                    icon: Ticket,
                  },
                  { label: 'Tur', value: event.ticketTiers?.length ?? 0, icon: Ticket },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="bg-muted/10 flex flex-col items-center gap-1 rounded-lg px-2 py-3"
                  >
                    <Icon className="text-primary/40 mb-0.5 size-3.5" />
                    <p className="text-foreground/80 font-mono font-bold">{value}</p>
                    <p className="text-muted-foreground/35 text-[9px] tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
