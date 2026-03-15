import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { eventsApi, EVENT_STATUS_COLOR } from '@entities/event'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { PurchaseTicketForm } from '@features/ticket-purchase'
import { ApplyVolunteerForm } from '@features/volunteer-apply'
import { CreateReviewForm } from '@features/review-create'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Modal } from '@shared/ui/Modal'
import { useAuthStore } from '@shared/model/auth.store'
import { formatDateTime } from '@shared/lib/dateUtils'
import { eventKeys } from '@shared/api/queryKeys'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const [volunteerModal, setVolunteerModal] = useState(false)
  const [reviewModal, setReviewModal] = useState(false)

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

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (!event) return <div className="text-center py-16 text-muted-foreground">Tadbir topilmadi</div>

  const start = formatDateTime(event.startDate)
  const end = formatDateTime(event.endDate)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/events">
        <Button variant="ghost" size="sm">← Barcha tadbirlar</Button>
      </Link>

      {event.bannerUrl ? (
        <img src={event.bannerUrl} alt={event.title} className="w-full h-72 object-cover rounded-2xl" />
      ) : (
        <div className="w-full h-72 bg-primary/10 rounded-2xl flex items-center justify-center">
          <svg className="h-20 w-20 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground flex-1">{event.title}</h1>
              <Badge color={EVENT_STATUS_COLOR[event.status]}>{event.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {start}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.capacity} o'rin
              </span>
              <span>{event.eventType}</span>
            </div>
          </div>

          {event.description && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Tavsif</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {event.venue && (
            <div className="bg-card rounded-xl border border-border p-4">
              <h2 className="text-lg font-semibold text-foreground mb-2">O'tkaziladigan joy</h2>
              <Link to={`/venues/${event.venue.id}`} className="text-primary hover:underline font-medium">
                {event.venue.name}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{event.venue.city}, {event.venue.address}</p>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="text-lg font-semibold text-foreground mb-3">Jadval</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Boshlanish</span>
                <span className="font-medium text-foreground">{start}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tugash</span>
                <span className="font-medium text-foreground">{end}</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Sharhlar</h2>
              {user && (
                <Button variant="secondary" size="sm" onClick={() => setReviewModal(true)}>
                  Sharh yozish
                </Button>
              )}
            </div>
            {reviews?.data.length === 0 ? (
              <p className="text-muted-foreground text-sm">Hozircha sharhlar yo'q</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews?.data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: ticket purchase */}
        <div className="flex flex-col gap-4">
          {event.status === 'PUBLISHED' && event.ticketTiers && event.ticketTiers.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5 sticky top-20">
              <h2 className="text-lg font-semibold text-foreground mb-4">Chipta sotib olish</h2>
              {user ? (
                <PurchaseTicketForm eventId={event.id} tiers={event.ticketTiers} />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">Chipta sotib olish uchun kiring</p>
                  <Link to="/login"><Button className="w-full">Kirish</Button></Link>
                </div>
              )}
            </div>
          )}

          {event.status === 'PUBLISHED' && user && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-lg font-semibold text-foreground mb-2">Ko'ngilli bo'lish</h2>
              <p className="text-sm text-muted-foreground mb-4">Tadbirni tashkil etishda yordam bering</p>
              <Button variant="secondary" className="w-full" onClick={() => setVolunteerModal(true)}>
                Ariza topshirish
              </Button>
            </div>
          )}
        </div>
      </div>

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
