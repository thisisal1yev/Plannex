import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, CalendarDays, Users, MapPin,
  Clock, Star, ChevronRight, Heart,
} from 'lucide-react'
import { eventsApi, EVENT_STATUS_COLOR } from '@entities/event'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { PurchaseTicketForm } from '@features/ticket-purchase'
import { ApplyVolunteerForm } from '@features/volunteer-apply'
import { CreateReviewForm } from '@features/review-create'
import { Badge } from '@shared/ui/Badge'
import { Modal } from '@shared/ui/Modal'
import { useAuthStore } from '@shared/model/auth.store'
import { formatDateTime, formatDateShort } from '@shared/lib/dateUtils'
import { eventKeys } from '@shared/api/queryKeys'
import { Skeleton } from '@/shared/ui/primitives/skeleton'

const STATUS_LABELS: Record<string, string> = {
  DRAFT:     'Qoralama',
  PUBLISHED: "E'lonlangan",
  CANCELLED: 'Bekor qilingan',
  COMPLETED: 'Yakunlangan',
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      <Skeleton className="h-4 w-32 mb-6" />
      <Skeleton className="w-full h-[480px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 92%, 0 100%)' }} />
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-10">
          <div className="pl-6 flex flex-col gap-3">
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
  const [reviewModal, setReviewModal]       = useState(false)

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
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border/60 flex items-center justify-center">
          <CalendarDays className="size-7 text-muted-foreground/20" />
        </div>
        <div className="text-center">
          <p className="lp-serif text-[18px] text-foreground/60">Tadbir topilmadi</p>
          <p className="text-[12px] text-muted-foreground/40 mt-1">Bunday tadbir mavjud emas yoki o'chirilgan</p>
        </div>
        <Link to="/events" className="text-[11px] tracking-[0.12em] uppercase text-gold/60 hover:text-gold transition-colors">
          ← Barcha tadbirlar
        </Link>
      </div>
    )
  }

  const start    = formatDateTime(event.startDate)
  const end      = formatDateTime(event.endDate)
  const avgRating = reviews?.data.length
    ? (reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length).toFixed(1)
    : null
  const reviewCount = reviews?.data.length ?? 0

  return (
    <div className="flex flex-col pb-16">

      {/* ── Back nav ── */}
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground/35 hover:text-gold/70 transition-colors w-fit group mb-7"
      >
        <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
        Barcha tadbirlar
      </Link>

      {/* ── Cinematic hero ── */}
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 93%, 0 100%)' }}
      >
        <div className="relative w-full h-[480px]">
          {event.bannerUrl ? (
            <>
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(0.8) contrast(1.08)', transform: 'scale(1.04)' }}
              />
              {/* Cinematic multi-layer gradient */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(8,15,25,0.97) 0%, rgba(8,15,25,0.55) 38%, rgba(8,15,25,0.12) 65%, transparent 100%)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgba(8,15,25,0.45) 0%, transparent 55%)' }}
              />
            </>
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gold/6 via-card to-navy-3 flex items-center justify-center">
              <CalendarDays className="size-24 text-gold/8" />
            </div>
          )}

          {/* Top-right: status + rating */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            {avgRating && (
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-300 bg-gold/50 border border-amber-400/20 backdrop-blur-sm rounded-md px-2.5 py-1.5 tracking-wide">
                <Star className="size-3 fill-current" />
                {avgRating}
              </span>
            )}
            <Badge color={EVENT_STATUS_COLOR[event.status]}>
              {STATUS_LABELS[event.status] ?? event.status}
            </Badge>
          </div>

          {/* Bottom: date rule + title + meta */}
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-10">
            {/* Date accent line */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold/50" />
              <span className="text-[10px] tracking-[0.22em] uppercase text-gold/55 font-medium">
                {formatDateShort(event.startDate)}
              </span>
              <span className="text-[10px] text-muted-foreground/30">·</span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/35">
                {event.eventType}
              </span>
            </div>

            <h1 className="lp-serif text-[40px] sm:text-[54px] font-bold text-cream/95 leading-[1.03] max-w-3xl">
              {event.title}
            </h1>

            <div className="mt-5 flex items-center gap-5 flex-wrap">
              <div className="flex items-center gap-1.5 text-[11px] text-cream/40">
                <Users className="size-3" />
                <span>{event.capacity} o'rin</span>
              </div>
              {event.venue && (
                <div className="flex items-center gap-1.5 text-[11px] text-cream/40">
                  <MapPin className="size-3" />
                  <span>{event.venue.city}</span>
                </div>
              )}
              {avgRating && (
                <div className="flex items-center gap-1.5 text-[11px] text-cream/40">
                  <Star className="size-3" />
                  <span>{reviewCount} ta sharh</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* ── Left column ── */}
        <div className="lg:col-span-7 flex flex-col gap-8">

          {/* Description */}
          {event.description && (
            <section className="border-l-2 border-gold/30 pl-6">
              <h2 className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-[0.22em] mb-4">
                Tadbir haqida
              </h2>
              <p className="text-[14px] text-foreground/70 leading-[1.9] whitespace-pre-line">
                {event.description}
              </p>
            </section>
          )}

          {/* Schedule */}
          <section>
            <h2 className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-[0.22em] mb-5">
              Jadval
            </h2>
            <div className="grid grid-cols-2 gap-px bg-border/30 rounded-xl overflow-hidden">
              <div className="bg-card/50 px-6 py-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-[10px] text-muted-foreground/35 uppercase tracking-[0.18em]">Boshlanish</span>
                </div>
                <p className="text-[17px] font-semibold text-foreground/85 font-mono tracking-tight">{start}</p>
              </div>
              <div className="bg-card/50 px-6 py-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span className="text-[10px] text-muted-foreground/35 uppercase tracking-[0.18em]">Tugash</span>
                </div>
                <p className="text-[17px] font-semibold text-foreground/85 font-mono tracking-tight">{end}</p>
              </div>
            </div>
          </section>

          {/* Venue */}
          {event.venue && (
            <section>
              <h2 className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-[0.22em] mb-4">
                Manzil
              </h2>
              <Link to={`/venues/${event.venue.id}`} className="group block">
                <div className="relative overflow-hidden rounded-xl border border-border/50 hover:border-gold/25 transition-all duration-300 bg-card/35">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-linear-to-b from-gold/60 via-gold/25 to-transparent" />
                  <div className="flex items-center justify-between gap-3 p-5 pl-7">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/8 border border-gold/12 flex items-center justify-center shrink-0">
                        <MapPin className="size-4 text-gold/55" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-foreground/85 group-hover:text-gold transition-colors duration-200">
                          {event.venue.name}
                        </p>
                        <p className="text-[12px] text-muted-foreground/45 mt-0.5">
                          {event.venue.city}, {event.venue.address}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground/20 shrink-0 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Reviews */}
          <section>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-[0.22em]">
                  Sharhlar
                </h2>
                {avgRating ? (
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="flex gap-px">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            parseFloat(avgRating) >= i
                              ? 'text-amber-400 fill-amber-400'
                              : parseFloat(avgRating) >= i - 0.5
                              ? 'text-amber-400 fill-amber-400/50'
                              : 'text-muted-foreground/15'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[13px] font-semibold text-foreground/80">{avgRating}</span>
                    <span className="text-[11px] text-muted-foreground/35">— {reviewCount} ta sharh</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-muted-foreground/30 mt-1.5">Hali sharh yo'q</p>
                )}
              </div>
              {user && (
                <button
                  onClick={() => setReviewModal(true)}
                  className="h-8 px-4 rounded-lg border border-gold/18 text-[10px] tracking-[0.12em] uppercase font-medium text-gold/60 hover:bg-gold/7 hover:text-gold hover:border-gold/35 transition-all duration-200"
                >
                  Sharh yozish
                </button>
              )}
            </div>

            {reviewCount === 0 ? (
              <div className="rounded-xl border border-dashed border-border/35 py-14 text-center">
                <div className="flex justify-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="size-5 text-muted-foreground/8" />
                  ))}
                </div>
                <p className="text-[12px] text-muted-foreground/35 tracking-wide">Hozircha sharhlar yo'q</p>
                {user && (
                  <button
                    onClick={() => setReviewModal(true)}
                    className="mt-3 text-[10px] tracking-[0.12em] uppercase text-gold/50 hover:text-gold transition-colors"
                  >
                    Birinchi bo'lib sharh yozing
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews!.data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-20 flex flex-col gap-4">

            {/* Ticket purchase — premium ticket stub */}
            {event.status === 'PUBLISHED' && event.ticketTiers && event.ticketTiers.length > 0 && (
              <div className="relative overflow-hidden rounded-xl border border-gold/18 bg-card">
                {/* Stub header */}
                <div className="relative bg-linear-to-r from-gold/9 to-transparent border-b border-gold/12 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-gold/45 font-medium mb-1">
                        Event Ticket
                      </p>
                      <p className="lp-serif text-[18px] font-bold text-foreground/90">
                        Chipta sotib olish
                      </p>
                    </div>
                    <span className="text-[9px] tracking-[0.12em] uppercase text-gold/55 bg-gold/8 border border-gold/15 rounded px-2.5 py-1.5">
                      {event.ticketTiers.length} xil
                    </span>
                  </div>
                  {/* Corner accent marks */}
                  <span className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-gold/18" />
                  <span className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-gold/18" />
                </div>

                <div className="p-5 pt-4">
                  {user ? (
                    <PurchaseTicketForm eventId={event.id} tiers={event.ticketTiers} />
                  ) : (
                    <div className="text-center py-5">
                      <div className="w-11 h-11 rounded-xl bg-gold/7 border border-gold/12 flex items-center justify-center mx-auto mb-3">
                        <Users className="size-5 text-gold/50" />
                      </div>
                      <p className="text-[12px] text-muted-foreground/45 mb-5 leading-relaxed">
                        Chipta sotib olish uchun<br />tizimga kiring
                      </p>
                      <Link
                        to="/login"
                        className="w-full h-9 rounded-lg bg-gold text-navy text-[12px] font-semibold flex items-center justify-center hover:bg-gold-light transition-colors tracking-wide"
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
              <div className="rounded-xl border border-border/45 bg-card/35 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/7 border border-emerald-500/12 flex items-center justify-center shrink-0">
                    <Heart className="size-3.5 text-emerald-500/55" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground/80">Ko'ngilli bo'lish</p>
                    <p className="text-[11px] text-muted-foreground/40 mt-0.5 leading-relaxed">
                      Tadbirni tashkil etishda yordam bering
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setVolunteerModal(true)}
                  className="w-full h-9 rounded-lg border border-emerald-500/12 text-[11px] tracking-[0.1em] uppercase font-medium text-emerald-600/60 dark:text-emerald-400/60 hover:border-emerald-500/28 hover:bg-emerald-500/5 hover:text-emerald-500 transition-all duration-200"
                >
                  Ariza topshirish
                </button>
              </div>
            )}

            {/* Not published state */}
            {event.status !== 'PUBLISHED' && (
              <div className="rounded-xl border border-border/40 bg-card/25 p-7 text-center">
                <div className="w-10 h-10 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center mx-auto mb-4">
                  <Clock className="size-4 text-muted-foreground/30" />
                </div>
                <Badge color={EVENT_STATUS_COLOR[event.status]}>
                  {STATUS_LABELS[event.status] ?? event.status}
                </Badge>
                <p className="text-[11px] text-muted-foreground/35 mt-2.5 tracking-wide">
                  Bu tadbir hozirda faol emas
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      <Modal open={volunteerModal} onClose={() => setVolunteerModal(false)} title="Ko'ngilli arizasi">
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
