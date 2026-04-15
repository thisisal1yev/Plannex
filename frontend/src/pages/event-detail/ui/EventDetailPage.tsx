import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  CalendarDays,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  Heart,
  ChevronLeft,
} from 'lucide-react'
import { SwiperSlide } from 'swiper/react'
import { Swiper } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'

import { eventsApi, EVENT_STATUS_COLOR, EVENT_STATUS_LABEL } from '@entities/event'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { PurchaseTicketForm } from '@features/ticket-purchase'
import { ApplyVolunteerForm } from '@features/volunteer-apply'
import { CreateReviewForm } from '@features/review-create'
import { Badge } from '@shared/ui/Badge'
import { Modal } from '@shared/ui/Modal'
import { useAuthStore } from '@shared/model/auth.store'
import { formatDateTime } from '@shared/lib/dateUtils'
import { eventKeys } from '@shared/api/queryKeys'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { Button } from '@/shared/ui/primitives/button'
import { StarRating } from '@shared/ui/StarRating'

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      <Skeleton className="mb-6 h-4 w-32" />
      <Skeleton
        className="h-[480px] w-full"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }}
      />
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-span-7">
          <div className="flex flex-col gap-3 pl-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="grid grid-cols-2 gap-px">
            <Skeleton className="h-24 rounded-none" />
            <Skeleton className="h-24 rounded-none" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const [volunteerModal, setVolunteerModal] = useState(false)
  const [reviewModal, setReviewModal] = useState(false)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [imgIndex, setImgIndex] = useState(0)

  const { data: event, isLoading } = useQuery({
    queryKey: eventKeys.detail(id!),
    queryFn: () => eventsApi.get(id!),
    enabled: !!id,
  })

  const { data: reviews } = useQuery({
    queryKey: eventKeys.reviews(id!),
    queryFn: () => reviewsApi.forEvent(id!),
    enabled: !!id,
  })

  if (isLoading) return <DetailSkeleton />

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <div className="bg-card border-border/60 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <CalendarDays className="text-muted-foreground/20 size-7" />
        </div>

        <div className="text-center">
          <p className="lp-serif text-foreground/60 text-[18px]">Tadbir topilmadi</p>
          <p className="text-muted-foreground/40 mt-1 text-[12px]">
            Bunday tadbir mavjud emas yoki o'chirilgan
          </p>
        </div>

        <Link
          to="/events"
          className="text-gold/60 hover:text-gold text-[11px] tracking-[0.12em] uppercase transition-colors"
        >
          ← Barcha tadbirlar
        </Link>
      </div>
    )
  }

  const start = formatDateTime(event.startDate)
  const end = formatDateTime(event.endDate)
  const avgRating = event.ratingStats?.avg ?? null
  const reviewCount = event.ratingStats?.count ?? 0

  return (
    <div className="flex flex-col pb-16">
      {/* Cinematic hero */}
      <div className="relative h-[58vh] max-h-[560px] min-h-[380px] w-full overflow-hidden rounded-2xl">
        {event.bannerUrl && event.bannerUrl.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            className="h-full w-full"
            onSwiper={(s) => {
              setSwiper(s)
            }}
            onSlideChange={(s) => setImgIndex(s.realIndex)}
          >
            {event.bannerUrl.map((url, idx) => (
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
        <div className="absolute top-5 left-5 z-10">
          <Link to="/venues">
            <Button
              variant="ghost"
              size="sm"
              className="group flex items-center gap-2 border border-white/20 text-white/80 backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={24} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="text-[10px] tracking-[0.15em] text-white/80 uppercase hover:text-white">
                Barcha maydonlar
              </span>
            </Button>
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto px-6 pb-8">
          <span className="text-gold-light/90 border-gold/20 mb-3 inline-flex items-center rounded-full border bg-black/45 px-3 py-1.5 text-xs font-medium tracking-[0.18em] uppercase backdrop-blur-sm">
            {event.eventType}
          </span>

          <h1 className="lp-serif mb-3 max-w-2xl text-4xl leading-tight font-bold text-white drop-shadow-lg md:text-5xl">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <StarRating rating={avgRating ?? 0}/>

              <span className="text-gold-light font-medium">{avgRating?.toFixed(1)}</span>
            </div>

            <span className="text-white/25">•</span>

            <div className="flex items-center gap-1">
              <MapPin className="text-gold/60 h-3.5 w-3.5" />

              <span>{event.venue?.city}</span>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {(event?.bannerUrl?.length ?? 0) > 1 && (
          <div className="absolute right-6 bottom-6 z-10 flex gap-1.5">
            {event?.bannerUrl?.map((url: string, i: number) => (
              <button
                key={i}
                onClick={() => {
                  swiper?.slideTo(i)
                  setImgIndex(i)
                }}
                className={`h-12 w-16 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                  i === imgIndex
                    ? 'border-gold shadow-[0_0_14px_rgba(76,140,167,0.5)]'
                    : 'border-white/20 opacity-55 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main layout ── */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          {/* Description */}
          {event.description && (
            <section className="border-gold/30 border-l-2 pl-6">
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Tadbir haqida
              </h2>
              <p className="text-foreground/70 text-[14px] leading-[1.9] whitespace-pre-line">
                {event.description}
              </p>
            </section>
          )}

          {/* Schedule */}
          <section>
            <h2 className="text-muted-foreground/35 mb-5 text-[10px] font-semibold tracking-[0.22em] uppercase">
              Jadval
            </h2>
            <div className="bg-border/30 grid grid-cols-2 gap-px overflow-hidden rounded-xl">
              <div className="bg-card/50 flex flex-col gap-2.5 px-6 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Boshlanish
                  </span>
                </div>
                <p className="text-foreground/85 font-mono text-[17px] font-semibold tracking-tight">
                  {start}
                </p>
              </div>
              <div className="bg-card/50 flex flex-col gap-2.5 px-6 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Tugash
                  </span>
                </div>
                <p className="text-foreground/85 font-mono text-[17px] font-semibold tracking-tight">
                  {end}
                </p>
              </div>
            </div>
          </section>

          {/* Venue */}
          {event.venue && (
            <section>
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Manzil
              </h2>
              <Link to={`/venues/${event.venue.id}`} className="group block">
                <div className="border-border/50 hover:border-gold/25 bg-card/35 relative overflow-hidden rounded-xl border transition-all duration-300">
                  <div className="from-gold/60 via-gold/25 absolute top-0 bottom-0 left-0 w-[2px] bg-linear-to-b to-transparent" />
                  <div className="flex items-center justify-between gap-3 p-5 pl-7">
                    <div className="flex items-center gap-4">
                      <div className="bg-gold/8 border-gold/12 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                        <MapPin className="text-gold/55 size-4" />
                      </div>
                      <div>
                        <p className="text-foreground/85 group-hover:text-gold text-[14px] font-semibold transition-colors duration-200">
                          {event.venue.name}
                        </p>
                        <p className="text-muted-foreground/45 mt-0.5 text-[12px]">
                          {event.venue.city}, {event.venue.address}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground/20 group-hover:text-gold size-4 shrink-0 transition-all duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Reviews */}
          <section>
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-muted-foreground/35 text-[10px] font-semibold tracking-[0.22em] uppercase">
                  Sharhlar
                </h2>

                {avgRating ? (
                  <div className="mt-2.5 flex items-center gap-2">
                    <StarRating rating={avgRating} />

                    <span className="text-foreground/80 text-[13px] font-semibold">
                      {avgRating.toFixed(1)}
                    </span>

                    <span className="text-muted-foreground/35 text-[11px]">— {reviewCount} ta sharh</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground/30 mt-1.5 text-[11px]">Hali sharh yo'q</p>
                )}
              </div>

              {user && (
                <button
                  onClick={() => setReviewModal(true)}
                  className="border-gold/18 text-gold/60 hover:bg-gold/7 hover:text-gold hover:border-gold/35 h-8 rounded-lg border px-4 text-[10px] font-medium tracking-[0.12em] uppercase transition-all duration-200"
                >
                  Sharh yozish
                </button>
              )}
            </div>

            {reviewCount === 0 ? (
              <div className="border-border/35 rounded-xl border border-dashed py-14 text-center">
                <div className="mb-3 flex justify-center gap-1">
                  {avgRating != null && <StarRating rating={avgRating} />}
                </div>
                <p className="text-muted-foreground/35 text-[12px] tracking-wide">
                  Hozircha sharhlar yo'q
                </p>
                {user && (
                  <button
                    onClick={() => setReviewModal(true)}
                    className="text-gold/50 hover:text-gold mt-3 text-[10px] tracking-[0.12em] uppercase transition-colors"
                  >
                    Birinchi bo'lib sharh yozing
                  </button>
                )}
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                loop={reviewCount >= 2}
                spaceBetween={12}
                slidesPerView={1}
                navigation={{
                  prevEl: '.prev',
                  nextEl: '.next',
                }}
              >
                <div className="mt-2 flex items-center space-x-1">
                  <button
                    type="button"
                    className="prev bg-card/90 border-border/50 text-foreground/60 hover:text-foreground hover:border-gold/30 hover:bg-card ml-auto flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-200"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  <button
                    type="button"
                    className="next bg-card/90 border-border/50 text-foreground/60 hover:text-foreground hover:border-gold/30 hover:bg-card flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-200"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>

                {reviews!.data.map((review) => (
                  <SwiperSlide key={review.id} className="w-full">
                    <ReviewCard review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-4 lg:sticky lg:top-20">
            {/* Ticket purchase — premium ticket stub */}
            {event.status === 'PUBLISHED' && event.ticketTiers && event.ticketTiers.length > 0 && (
              <div className="border-gold/18 bg-card relative overflow-hidden rounded-xl border">
                {/* Stub header */}
                <div className="from-gold/9 border-gold/12 relative border-b bg-linear-to-r to-transparent px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gold/45 mb-1 text-[9px] font-medium tracking-[0.25em] uppercase">
                        Event Ticket
                      </p>

                      <p className="lp-serif text-foreground/90 text-[18px] font-bold">
                        Chipta sotib olish
                      </p>
                    </div>

                    <span className="text-gold/55 bg-gold/8 border-gold/15 rounded border px-2.5 py-1.5 text-[9px] tracking-[0.12em] uppercase">
                      {event.ticketTiers.length} xil
                    </span>
                  </div>
                  {/* Corner accent marks */}
                  <span className="border-gold/18 absolute top-2.5 right-2.5 h-3 w-3 border-t border-r" />
                  <span className="border-gold/18 absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l" />
                </div>

                <div className="p-5 pt-4">
                  {user ? (
                    <PurchaseTicketForm eventId={event.id} tiers={event.ticketTiers} />
                  ) : (
                    <div className="py-2.5 text-center">
                      <div className="bg-gold/7 border-gold/12 mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border">
                        <Users className="text-gold/50 size-5" />
                      </div>

                      <p className="text-muted-foreground/45 mb-5 text-[12px] leading-relaxed">
                        Chipta sotib olish uchun
                        <br />
                        tizimga kiring
                      </p>

                      <Link
                        to="/login"
                        className="bg-gold text-navy hover:bg-gold-light flex h-9 w-full items-center justify-center rounded-lg text-[12px] font-semibold tracking-wide transition-colors"
                      >
                        Kirish
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Volunteer card */}
            {event.status === 'PUBLISHED' && user && (
              <div className="border-border/45 bg-card/35 rounded-xl border p-5">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/12 bg-emerald-500/7">
                    <Heart className="size-3.5 text-emerald-500/55" />
                  </div>

                  <div>
                    <p className="text-foreground/80 text-[13px] font-semibold">
                      Ko'ngilli bo'lish
                    </p>

                    <p className="text-muted-foreground/40 mt-0.5 text-[11px] leading-relaxed">
                      Tadbirni tashkil etishda yordam bering
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setVolunteerModal(true)}
                  className="h-9 w-full rounded-lg border border-emerald-500/12 text-[11px] font-medium tracking-widest text-emerald-600/60 uppercase transition-all duration-200 hover:border-emerald-500/28 hover:bg-emerald-500/5 hover:text-emerald-500 dark:text-emerald-400/60"
                >
                  Ariza topshirish
                </button>
              </div>
            )}

            {/* Not published state */}
            {event.status !== 'PUBLISHED' && (
              <div className="border-border/40 bg-card/25 rounded-xl border p-7 text-center">
                <div className="bg-muted/30 border-border/40 mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl border">
                  <Clock className="text-muted-foreground/30 size-4" />
                </div>

                <Badge color={EVENT_STATUS_COLOR[event.status]}>
                  {EVENT_STATUS_LABEL[event.status] ?? event.status}
                </Badge>

                <p className="text-muted-foreground/35 mt-2.5 text-[11px] tracking-wide">
                  Bu tadbir hozirda faol emas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal
        open={volunteerModal}
        onClose={() => setVolunteerModal(false)}
        title="Ko'ngilli arizasi"
      >
        <ApplyVolunteerForm eventId={event.id} onSuccess={() => setVolunteerModal(false)} />
      </Modal>

      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Sharh yozish">
        <CreateReviewForm
          eventId={event.id}
          queryKey={eventKeys.reviews(id!)}
          onSuccess={() => setReviewModal(false)}
        />
      </Modal>
    </div>
  )
}
