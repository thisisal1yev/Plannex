import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { venuesApi } from '@entities/venue'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { CreateReviewForm } from '@features/review-create'
import { StarRating } from '@shared/ui/StarRating'
import { Button } from '@shared/ui/Button'
import { Modal } from '@shared/ui/Modal'
import { Spinner } from '@shared/ui/Spinner'
import { useAuthStore } from '@shared/model/auth.store'
import { venueKeys } from '@shared/api/queryKeys'

export function VenueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const [imgIndex, setImgIndex] = useState(0)
  const [reviewModal, setReviewModal] = useState(false)

  const { data: venue, isLoading } = useQuery({
    queryKey: venueKeys.detail(id!),
    queryFn: () => venuesApi.get(id!),
    enabled: !!id,
  })

  const { data: reviews } = useQuery({
    queryKey: venueKeys.reviews(id!),
    queryFn: () => reviewsApi.forVenue(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (!venue) return <div className="text-center py-16 text-gray-400">Площадка не найдена</div>

  const amenities = [
    venue.hasWifi && 'WiFi',
    venue.hasParking && 'Паркинг',
    venue.hasSound && 'Звуковая система',
    venue.hasStage && 'Сцена',
    venue.isIndoor && 'Крытый зал',
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <Link to="/venues">
        <Button variant="ghost" size="sm">← Все площадки</Button>
      </Link>

      {/* Image gallery */}
      <div className="flex flex-col gap-2">
        {venue.imageUrls.length > 0 ? (
          <>
            <img
              src={venue.imageUrls[imgIndex]}
              alt={venue.name}
              className="w-full h-80 object-cover rounded-2xl"
            />
            {venue.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {venue.imageUrls.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`shrink-0 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      i === imgIndex ? 'border-indigo-500' : 'border-transparent'
                    }`}
                  >
                    <img src={url} alt="" className="h-16 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
            <svg className="h-20 w-20 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {venue.city}, {venue.address}
              </span>
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {venue.capacity} мест
              </span>
              <div className="flex items-center gap-1">
                <StarRating rating={venue.rating} />
                <span>{venue.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {venue.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Описание</h2>
              <p className="text-gray-600 leading-relaxed">{venue.description}</p>
            </div>
          )}

          {amenities.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Удобства</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a) => (
                  <span key={String(a)} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm rounded-lg font-medium">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Отзывы</h2>
              {user && (
                <Button variant="secondary" size="sm" onClick={() => setReviewModal(true)}>
                  Написать отзыв
                </Button>
              )}
            </div>
            {reviews?.data.length === 0 ? (
              <p className="text-gray-400 text-sm">Пока нет отзывов</p>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews?.data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: booking info */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <h2 className="text-2xl font-bold text-indigo-600 mb-1">${venue.pricePerDay}<span className="text-sm font-normal text-gray-400">/день</span></h2>
            <p className="text-sm text-gray-500 mb-4">Аренда площадки</p>
            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Вместимость</span>
                <span className="font-medium">{venue.capacity} чел.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Тип</span>
                <span className="font-medium">{venue.isIndoor ? 'Крытый' : 'Открытый'}</span>
              </div>
            </div>
            {user ? (
              <p className="text-xs text-gray-400 text-center">Бронирование доступно при создании события</p>
            ) : (
              <Link to="/login"><Button className="w-full">Войти для брони</Button></Link>
            )}
          </div>
        </div>
      </div>

      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Написать отзыв">
        <CreateReviewForm
          venueId={venue.id}
          queryKey={venueKeys.reviews(id!)}
          onSuccess={() => setReviewModal(false)}
        />
      </Modal>
    </div>
  )
}
