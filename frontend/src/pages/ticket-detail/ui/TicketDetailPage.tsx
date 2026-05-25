import { useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarDays, MapPin, Users, QrCode } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { ticketsApi } from '@entities/ticket'
import { ticketKeys } from '@shared/api/queryKeys'
import { formatDateTime, formatUZS } from '@shared/lib/dateUtils'
import { DetailPageSkeleton } from '@shared/ui/DetailPageSkeleton'
import { Button } from '@/shared/ui/primitives/button'

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Kutilmoqda',
  PAID: "To'langan",
  FAILED: 'Xato',
  REFUNDED: 'Qaytarilgan',
}

const PAYMENT_STATUS_DOT: Record<string, string> = {
  PENDING: '#F59E0B',
  PAID: '#34D399',
  FAILED: '#F87171',
  REFUNDED: '#818CF8',
}

const PROVIDER_LABEL: Record<string, string> = {
  CLICK: 'Click',
  PAYME: 'Payme',
}

export function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [imgIndex, setImgIndex] = useState(0)
  const onSwiperInit = useCallback((s: SwiperInstance) => {
    swiperRef.current = s
  }, [])

  const { data: ticket, isLoading } = useQuery({
    queryKey: ticketKeys.detail(id!),
    queryFn: () => ticketsApi.get(id!),
    enabled: !!id,
  })

  if (isLoading) return <DetailPageSkeleton />

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <div className="bg-card border-border/60 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <QrCode className="text-muted-foreground/20 size-7" />
        </div>
        <div className="text-center">
          <p className="text-foreground/60 font-serif text-lg">Chipta topilmadi</p>
          <p className="text-muted-foreground/40 mt-1 text-xs">
            Bunday chipta mavjud emas yoki o'chirilgan
          </p>
        </div>
        <Link
          to="/tickets"
          className="text-primary/60 hover:text-primary text-[11px] tracking-[0.12em] uppercase transition-colors"
        >
          ← Mening chiptalarim
        </Link>
      </div>
    )
  }

  const event = ticket.event
  const tier = ticket.tier
  const payment = ticket.payment
  const bannerUrls = event?.bannerUrls ?? []
  const start = event?.startDate ? formatDateTime(event.startDate) : null
  const end = event?.endDate ? formatDateTime(event.endDate) : null
  const isUsedDot = ticket.isUsed ? '#9CA3AF' : '#34D399'
  const paymentDot = PAYMENT_STATUS_DOT[payment?.status ?? 'PENDING']

  return (
    <div className="grid grid-cols-1 pb-16">
      {/* ── Cinematic hero ── */}
      <div className="relative h-[58vh] max-h-140 min-h-95 w-full overflow-hidden rounded-2xl">
        {bannerUrls.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            className="h-full w-full"
            onSwiper={onSwiperInit}
            onSlideChange={(s) => setImgIndex(s.realIndex)}
          >
            {bannerUrls.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={event?.title} className="h-full w-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="from-navy to-navy-2 absolute inset-0 bg-linear-to-br" />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-10">
          <Link to="/tickets">
            <Button
              variant="ghost"
              size="sm"
              className="group flex items-center gap-2 border border-white/20 text-white/80 backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={24} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="text-[10px] tracking-[0.15em] text-white/80 uppercase hover:text-white">
                Mening chiptalarim
              </span>
            </Button>
          </Link>
        </div>

        {/* Status badge — top right */}
        <div className="absolute top-5 right-5 z-10">
          <div
            className="inline-flex items-center gap-1.25 rounded-full border px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm"
            style={{
              color: isUsedDot,
              borderColor: `${isUsedDot}33`,
              background: 'rgba(8,15,25,0.55)',
            }}
          >
            <span
              className="inline-block h-1.25 w-1.25 shrink-0 rounded-full"
              style={{ background: isUsedDot }}
            />
            {ticket.isUsed ? 'Ishlatilgan' : 'Amal qiladi'}
          </div>
        </div>

        {/* Thumbnail strip */}
        {(bannerUrls?.length ?? 0) > 1 && (
          <div className="absolute right-6 bottom-6 z-20 flex gap-1.5">
            {bannerUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => {
                  swiperRef.current?.slideTo(i)
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
          {event?.eventType && (
            <span className="text-primary-light/90 border-primary/20 mb-3 inline-flex items-center rounded-full border bg-black/45 px-3 py-1.5 text-xs font-medium tracking-[0.18em] uppercase backdrop-blur-sm">
              {event.eventType}
            </span>
          )}
          <h1 className="mb-2 max-w-2xl font-serif text-3xl leading-tight font-bold text-white drop-shadow-lg md:text-4xl">
            {event?.title ?? 'Tadbir'}
          </h1>
          {start && (
            <div className="flex items-center gap-1.5 text-sm text-white/70">
              <CalendarDays className="text-primary/60 h-3.5 w-3.5" />
              <span>{start}</span>
              {event?.city && (
                <>
                  <span className="text-white/25">•</span>
                  <MapPin className="text-primary/60 h-3.5 w-3.5" />
                  <span>{event.city}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          {/* Description */}
          {event?.description && (
            <section className="border-primary/30 border-l-2 pl-6">
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Tadbir haqida
              </h2>
              <p className="text-foreground/70 text-sm leading-[1.9] whitespace-pre-line">
                {event.description}
              </p>
            </section>
          )}

          {/* Schedule */}
          {(start || end || event?.capacity) && (
            <section>
              <h2 className="text-muted-foreground/35 mb-5 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Jadval
              </h2>
              <div className="bg-border/30 grid grid-cols-3 gap-px overflow-hidden rounded-xl">
                {start && (
                  <div className="bg-card/50 flex flex-col gap-2.5 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                        Boshlanish
                      </span>
                    </div>
                    <p className="text-foreground/85 font-mono text-[15px] font-semibold tracking-tight">
                      {start}
                    </p>
                  </div>
                )}
                {end && (
                  <div className="bg-card/50 flex flex-col gap-2.5 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                      <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                        Tugash
                      </span>
                    </div>
                    <p className="text-foreground/85 font-mono text-[15px] font-semibold tracking-tight">
                      {end}
                    </p>
                  </div>
                )}
                {event?.capacity && (
                  <div className="bg-card/50 flex flex-col gap-2.5 px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                      <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                        Sig'im
                      </span>
                    </div>
                    <p className="text-foreground/85 font-mono text-[15px] font-semibold tracking-tight">
                      {event.capacity} o'rin
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Organizer */}
          {event?.organizer && (
            <section>
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Tashkilotchi
              </h2>
              <div className="border-border/50 hover:border-primary/25 bg-card/35 relative overflow-hidden rounded-xl border transition-all duration-300">
                <div className="from-primary/60 via-primary/25 absolute top-0 bottom-0 left-0 w-0.5 bg-linear-to-b to-transparent" />
                <div className="flex items-center gap-4 p-5 pl-7">
                  <div className="bg-primary/8 border-primary/12 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                    <Users className="text-primary/55 size-4" />
                  </div>
                  <div>
                    <p className="text-foreground/85 text-sm font-semibold">
                      {event.organizer.firstName} {event.organizer.lastName}
                    </p>
                    <p className="text-muted-foreground/45 mt-0.5 text-xs">
                      {event.organizer.email}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Venue */}
          {event?.venue && (
            <section>
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Manzil
              </h2>
              <Link to={`/venues/${event.venue.id}`} className="group block">
                <div className="border-border/50 hover:border-primary/25 bg-card/35 relative overflow-hidden rounded-xl border transition-all duration-300">
                  <div className="from-primary/60 via-primary/25 absolute top-0 bottom-0 left-0 w-0.5 bg-linear-to-b to-transparent" />
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
                          {event.venue.city}, {event.venue.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}
        </div>

        {/* ── Right column — ticket stub ── */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-20">
            <div className="border-primary/18 bg-card relative overflow-hidden rounded-xl border">
              {/* Stub header */}
              <div className="from-primary/9 border-primary/12 relative border-b bg-linear-to-r to-transparent px-5 py-5">
                <p className="text-primary/45 mb-1 text-[9px] font-medium tracking-[0.25em] uppercase">
                  Chipta #{ticket.id.slice(-8).toUpperCase()}
                </p>
                <p className="text-foreground/90 font-serif text-lg font-bold">
                  {tier?.name ?? 'Chipta'}
                </p>
                {tier?.price != null && (
                  <p className="text-primary/60 mt-0.5 text-sm font-semibold">
                    {formatUZS(tier.price)}
                  </p>
                )}
                <span className="border-primary/18 absolute top-2.5 right-2.5 h-3 w-3 border-t border-r" />
                <span className="border-primary/18 absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l" />
              </div>

              {/* Perforated separator */}
              <div className="border-border/50 relative border-t border-dashed">
                <span className="bg-background border-border/40 absolute top-1/2 -left-3 h-5 w-5 -translate-y-1/2 rounded-full border" />
                <span className="bg-background border-border/40 absolute top-1/2 -right-3 h-5 w-5 -translate-y-1/2 rounded-full border" />
              </div>

              {/* Stub body */}
              <div className="flex flex-col gap-4 px-5 py-5">
                {/* Status row */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground/50 text-xs">Holat</span>
                  <div
                    className="inline-flex items-center gap-1.25 rounded-full border px-2.25 py-0.75 text-[10px] font-medium"
                    style={{
                      color: isUsedDot,
                      borderColor: `${isUsedDot}33`,
                      background: `${isUsedDot}0d`,
                    }}
                  >
                    <span
                      className="inline-block h-1.25 w-1.25 shrink-0 rounded-full"
                      style={{ background: isUsedDot }}
                    />
                    {ticket.isUsed ? 'Ishlatilgan' : 'Amal qiladi'}
                  </div>
                </div>

                {/* Payment rows */}
                {payment && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/50 text-xs">To'lov holati</span>
                      <div
                        className="inline-flex items-center gap-1.25 rounded-full border px-2.25 py-0.75 text-[10px] font-medium"
                        style={{
                          color: paymentDot,
                          borderColor: `${paymentDot}33`,
                          background: `${paymentDot}0d`,
                        }}
                      >
                        <span
                          className="inline-block h-1.25 w-1.25 shrink-0 rounded-full"
                          style={{ background: paymentDot }}
                        />
                        {PAYMENT_STATUS_LABEL[payment.status] ?? payment.status}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/50 text-xs">To'lov tizimi</span>
                      <span className="text-foreground/75 text-xs font-semibold">
                        {PROVIDER_LABEL[payment.provider] ?? payment.provider}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground/50 text-xs">Summa</span>
                      <span className="text-foreground/75 text-xs font-semibold">
                        {formatUZS(payment.amount)}
                      </span>
                    </div>

                    {payment.commission > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground/50 text-xs">Komissiya</span>
                        <span className="text-foreground/50 text-xs">
                          {formatUZS(payment.commission)}
                        </span>
                      </div>
                    )}

                    {payment.providerTxId && (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground/50 shrink-0 text-xs">
                          Tranzaksiya ID
                        </span>
                        <span
                          className="text-foreground/50 max-w-35 truncate font-mono text-[10px]"
                          title={payment.providerTxId}
                        >
                          {payment.providerTxId}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Divider */}
                <div className="border-border/30 border-t border-dashed" />

                {/* QR code */}
                <div className="flex flex-col items-center gap-3 pt-1">
                  <div className="bg-primary/6 border-primary/12 flex h-10 w-10 items-center justify-center rounded-xl border">
                    <QrCode className="text-primary/55 size-5" />
                  </div>
                  <p className="text-muted-foreground/40 text-[10px] tracking-[0.14em] uppercase">
                    QR-kod
                  </p>
                  <div className="bg-muted/40 border-border/30 text-muted-foreground/60 w-full rounded-lg border p-3 text-center font-mono text-[10px] leading-relaxed break-all">
                    {ticket.qrCode}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
