import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '@entities/service'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { CreateReviewForm } from '@features/review-create'
import { Badge } from '@shared/ui/Badge'
import { StarRating } from '@shared/ui/StarRating'
import { Button } from '@shared/ui/Button'
import { Modal } from '@shared/ui/Modal'
import { Spinner } from '@shared/ui/Spinner'
import { useAuthStore } from '@shared/model/auth.store'
import { serviceKeys } from '@shared/api/queryKeys'

const categoryLabel: Record<string, string> = {
  CATERING: 'Кейтеринг',
  DECORATION: 'Декор',
  SOUND: 'Звук',
  PHOTO: 'Фото',
  SECURITY: 'Охрана',
}

const categoryColor: Record<string, 'indigo' | 'green' | 'yellow' | 'blue' | 'gray'> = {
  CATERING: 'green',
  DECORATION: 'indigo',
  SOUND: 'blue',
  PHOTO: 'yellow',
  SECURITY: 'gray',
}

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const [imgIndex, setImgIndex] = useState(0)
  const [reviewModal, setReviewModal] = useState(false)

  const { data: service, isLoading } = useQuery({
    queryKey: serviceKeys.detail(id!),
    queryFn: () => servicesApi.get(id!),
    enabled: !!id,
  })

  const { data: reviews } = useQuery({
    queryKey: serviceKeys.reviews(id!),
    queryFn: () => reviewsApi.forService(id!),
    enabled: !!id,
  })

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (!service) return <div className="text-center py-16 text-gray-400">Услуга не найдена</div>

  return (
    <div className="flex flex-col gap-6">
      <Link to="/services">
        <Button variant="ghost" size="sm">← Все услуги</Button>
      </Link>

      {/* Image gallery */}
      <div className="flex flex-col gap-2">
        {service.imageUrls.length > 0 ? (
          <>
            <img
              src={service.imageUrls[imgIndex]}
              alt={service.name}
              className="w-full h-72 object-cover rounded-2xl"
            />
            {service.imageUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {service.imageUrls.map((url, i) => (
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
          <div className="w-full h-72 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
            <svg className="h-20 w-20 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 flex-1">{service.name}</h1>
              <Badge color={categoryColor[service.category]}>{categoryLabel[service.category]}</Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {service.city}
              </span>
              <div className="flex items-center gap-1">
                <StarRating rating={service.rating} />
                <span>{service.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {service.description && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Описание</h2>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
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

        {/* Right: pricing */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-20">
            <h2 className="text-2xl font-bold text-indigo-600 mb-1">от ${service.priceFrom}</h2>
            <p className="text-sm text-gray-500 mb-4">Стоимость услуги</p>
            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Категория</span>
                <span className="font-medium">{categoryLabel[service.category]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Город</span>
                <span className="font-medium">{service.city}</span>
              </div>
            </div>
            {user ? (
              <p className="text-xs text-gray-400 text-center">Подключите услугу к событию в разделе "Мои события"</p>
            ) : (
              <Link to="/login"><Button className="w-full">Войти для связи</Button></Link>
            )}
          </div>
        </div>
      </div>

      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Написать отзыв">
        <CreateReviewForm
          serviceId={service.id}
          queryKey={serviceKeys.reviews(id!)}
          onSuccess={() => setReviewModal(false)}
        />
      </Modal>
    </div>
  )
}
