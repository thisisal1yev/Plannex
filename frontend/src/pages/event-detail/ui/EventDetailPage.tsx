import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, CalendarDays, Users, Tag, MapPin,
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
import { Separator } from '@/shared/ui/primitives/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/primitives/card'

const STATUS_LABELS: Record<string, string> = {
  DRAFT:     'Qoralama',
  PUBLISHED: "E'lonlangan",
  CANCELLED: 'Bekor qilingan',
  COMPLETED: 'Yakunlangan',
}

function MetaChip({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground/80 bg-card/80 border border-border/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
      <Icon className="size-3.5 text-gold/70 shrink-0" />
      <span>{children}</span>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="w-full h-[360px] rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-5">
          <Skeleton className="h-8 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-64 rounded-xl" />
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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border flex items-center justify-center">
          <CalendarDays className="size-6 text-muted-foreground/30" />
        </div>
        <p className="text-[14px] text-muted-foreground">Tadbir topilmadi</p>
        <Link to="/events" className="text-[12px] text-gold hover:text-gold-light transition-colors">
          ← Barcha tadbirlar
        </Link>
      </div>
    )
  }

  const start = formatDateTime(event.startDate)
  const end   = formatDateTime(event.endDate)
  const avgRating = reviews?.data.length
    ? (reviews.data.reduce((s, r) => s + r.rating, 0) / reviews.data.length).toFixed(1)
    : null

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* ── Back nav ── */}
      <Link
        to="/events"
        className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground/60 hover:text-gold transition-colors w-fit group"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        Barcha tadbirlar
      </Link>

      {/* ── Hero banner ── */}
      <div className="relative w-full h-[340px] rounded-2xl overflow-hidden">
        {event.bannerUrl ? (
          <>
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {/* gradient overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,15,25,0.88)_0%,rgba(8,15,25,0.3)_50%,transparent_100%)]" />
          </>
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gold/8 via-card to-card flex items-center justify-center border border-border">
            <CalendarDays className="size-16 text-gold/20" />
          </div>
        )}

        {/* Overlaid info on banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-[11px] font-medium text-gold/90 bg-gold/12 border border-gold/25 rounded-full px-2.5 py-1">
              {event.eventType}
            </span>
            <Badge color={EVENT_STATUS_COLOR[event.status]}>
              {STATUS_LABELS[event.status] ?? event.status}
            </Badge>
            {avgRating && (
              <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
                <Star className="size-3 fill-current" />
                {avgRating}
              </span>
            )}
          </div>
          <h1 className="lp-serif text-[28px] sm:text-[34px] font-bold text-cream/95 leading-tight max-w-3xl">
            {event.title}
          </h1>
        </div>
      </div>

      {/* ── Meta chips ── */}
      <div className="flex flex-wrap gap-2">
        <MetaChip icon={CalendarDays}>{formatDateShort(event.startDate)}</MetaChip>
        <MetaChip icon={Users}>{event.capacity} o'rin</MetaChip>
        <MetaChip icon={Tag}>{event.eventType}</MetaChip>
        {event.venue && (
          <MetaChip icon={MapPin}>{event.venue.city}</MetaChip>
        )}
      </div>

      <Separator />

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left column ── */}
        <div className="lg:col-span-7 flex flex-col gap-7">

          {/* Description */}
          {event.description && (
            <section>
              <h2 className="text-[13px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mb-3">
                Tadbir haqida
              </h2>
              <p className="text-[14px] text-foreground/80 leading-[1.75] whitespace-pre-line">
                {event.description}
              </p>
            </section>
          )}

          {/* Venue */}
          {event.venue && (
            <>
              <Separator />
              <section>
                <h2 className="text-[13px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mb-3">
                  Manzil
                </h2>
                <Link to={`/venues/${event.venue.id}`} className="group block">
                  <Card className="ring-0 border border-border hover:border-gold/25 transition-colors">
                    <CardContent className="flex items-center justify-between gap-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0">
                          <MapPin className="size-4 text-gold/70" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-foreground group-hover:text-gold transition-colors">
                            {event.venue.name}
                          </p>
                          <p className="text-[12px] text-muted-foreground/60 mt-0.5">
                            {event.venue.city}, {event.venue.address}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground/30 shrink-0 group-hover:text-gold transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              </section>
            </>
          )}

          {/* Schedule */}
          <Separator />
          <section>
            <h2 className="text-[13px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em] mb-3">
              Jadval
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-3.5 text-emerald-500" />
                  <span className="text-[11px] text-muted-foreground/50 uppercase tracking-[0.08em] font-medium">Boshlanish</span>
                </div>
                <p className="text-[13px] font-semibold text-foreground">{start}</p>
              </div>
              <div className="rounded-xl border border-border bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-3.5 text-red-400" />
                  <span className="text-[11px] text-muted-foreground/50 uppercase tracking-[0.08em] font-medium">Tugash</span>
                </div>
                <p className="text-[13px] font-semibold text-foreground">{end}</p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <Separator />
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[13px] font-semibold text-muted-foreground/50 uppercase tracking-[0.1em]">
                  Sharhlar
                </h2>
                {avgRating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="size-3.5 text-amber-400 fill-current" />
                    <span className="text-[13px] font-semibold text-foreground">{avgRating}</span>
                    <span className="text-[12px] text-muted-foreground/50">
                      ({reviews?.data.length} ta sharh)
                    </span>
                  </div>
                )}
              </div>
              {user && (
                <button
                  onClick={() => setReviewModal(true)}
                  className="h-8 px-4 rounded-lg border border-gold/25 bg-gold/8 text-[12px] font-medium text-gold hover:bg-gold/12 transition-colors"
                >
                  Sharh yozish
                </button>
              )}
            </div>

            {!reviews?.data.length ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/10 py-10 text-center">
                <Star className="size-6 text-muted-foreground/20 mx-auto mb-2" />
                <p className="text-[13px] text-muted-foreground/50">Hozircha sharhlar yo'q</p>
                {user && (
                  <button
                    onClick={() => setReviewModal(true)}
                    className="mt-3 text-[12px] text-gold hover:text-gold-light transition-colors"
                  >
                    Birinchi bo'lib sharh yozing
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Right column ── */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="lg:sticky lg:top-20 flex flex-col gap-4">

            {/* Ticket purchase */}
            {event.status === 'PUBLISHED' && event.ticketTiers && event.ticketTiers.length > 0 && (
              <Card className="ring-0 border border-gold/15 bg-card">
                <CardHeader className="border-b border-border/60 py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[14px] font-semibold">Chipta sotib olish</CardTitle>
                    <span className="text-[11px] text-gold bg-gold/8 border border-gold/20 rounded-full px-2 py-0.5">
                      {event.ticketTiers.length} xil
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 pb-4">
                  {user ? (
                    <PurchaseTicketForm eventId={event.id} tiers={event.ticketTiers} />
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/8 border border-gold/15 flex items-center justify-center mx-auto mb-3">
                        <Users className="size-5 text-gold/60" />
                      </div>
                      <p className="text-[13px] text-muted-foreground/60 mb-4">
                        Chipta sotib olish uchun kiring
                      </p>
                      <Link
                        to="/login"
                        className="block w-full h-9 rounded-lg bg-gold text-navy text-[13px] font-semibold flex items-center justify-center hover:bg-gold-light transition-colors"
                      >
                        Kirish
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Volunteer */}
            {event.status === 'PUBLISHED' && user && (
              <Card className="ring-0 border border-border">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center shrink-0">
                      <Heart className="size-4 text-emerald-500/70" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">Ko'ngilli bo'lish</p>
                      <p className="text-[12px] text-muted-foreground/60 mt-0.5">
                        Tadbirni tashkil etishda yordam bering
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVolunteerModal(true)}
                    className="w-full h-9 rounded-lg border border-border text-[13px] font-medium text-foreground/70 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                  >
                    Ariza topshirish
                  </button>
                </CardContent>
              </Card>
            )}

            {/* Not published state */}
            {event.status !== 'PUBLISHED' && (
              <Card className="ring-0 border border-border">
                <CardContent className="py-6 text-center">
                  <Badge color={EVENT_STATUS_COLOR[event.status]}>
                    {STATUS_LABELS[event.status] ?? event.status}
                  </Badge>
                  <p className="text-[12px] text-muted-foreground/50 mt-2">
                    Bu tadbir hozirda faol emas
                  </p>
                </CardContent>
              </Card>
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
