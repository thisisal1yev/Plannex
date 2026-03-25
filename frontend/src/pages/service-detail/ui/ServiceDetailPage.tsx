import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { servicesApi } from '@entities/service'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { CreateReviewForm } from '@features/review-create'
import { StarRating } from '@shared/ui/StarRating'
import { Button } from '@shared/ui/Button'
import { Modal } from '@shared/ui/Modal'
import { Spinner } from '@shared/ui/Spinner'
import { useAuthStore } from '@shared/model/auth.store'
import { serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

const CATEGORY_LABEL: Record<string, string> = {
  CATERING: 'Katering',
  DECORATION: 'Bezak',
  SOUND: 'Ovoz',
  PHOTO: 'Foto',
  SECURITY: 'Xavfsizlik',
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

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (!service) return (
    <div className="flex flex-col items-center py-20 gap-2">
      <p className="lp-serif text-2xl text-muted-foreground/40">Xizmat topilmadi</p>
    </div>
  )

  const mainImage = service.imageUrls[imgIndex]

  return (
    <div className="flex flex-col">
      {/* Cinematic hero */}
      <div className="relative w-full h-[58vh] min-h-[380px] max-h-[560px] overflow-hidden rounded-2xl">
        {mainImage ? (
          <img
            src={mainImage}
            alt={service.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-navy to-navy-2" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-10">
          <Link to="/services">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm"
            >
              ← Barcha xizmatlar
            </Button>
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 mx-auto">
          <span className="inline-flex items-center text-xs font-medium uppercase tracking-[0.18em] text-gold-light/90 mb-3 bg-black/45 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold/20">
            {CATEGORY_LABEL[service.category]}
          </span>
          <h1 className="lp-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-3 max-w-2xl drop-shadow-lg">
            {service.name}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <StarRating rating={service.rating} />
              <span className="text-gold-light font-medium">{service.rating.toFixed(1)}</span>
            </div>
            <span className="text-white/25">·</span>
            <div className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {service.city}
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {service.imageUrls.length > 1 && (
          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {service.imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`h-12 w-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  i === imgIndex
                    ? 'border-gold shadow-[0_0_14px_rgba(201,150,58,0.5)]'
                    : 'border-white/20 opacity-55 hover:opacity-100'
                }`}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: description + reviews */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {service.description && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="lp-serif text-2xl font-semibold text-foreground whitespace-nowrap">Xizmat haqida</h2>
                  <div className="flex-1 h-px bg-linear-to-r from-border to-transparent" />
                </div>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{service.description}</p>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="lp-serif text-2xl font-semibold text-foreground whitespace-nowrap">Sharhlar</h2>
                <div className="flex-1 h-px bg-linear-to-r from-border to-transparent" />
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewModal(true)}
                    className="border-gold/40 text-gold hover:bg-gold/5 hover:border-gold/60 shrink-0"
                  >
                    + Sharh yozish
                  </Button>
                )}
              </div>

              {reviews?.data.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="lp-serif text-xl text-muted-foreground/35">Hozircha sharhlar yo'q</p>
                  <p className="text-sm text-muted-foreground/25 mt-1">Birinchi bo'ling!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {reviews?.data.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: pricing card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-card rounded-2xl border border-border overflow-hidden">
              {/* Gold top accent */}
              <div className="h-[3px] bg-linear-to-r from-gold-dark via-gold to-gold-light" />

              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">Narxdan boshlab</p>
                <p className="lp-serif text-3xl font-bold text-gold leading-none mb-5">
                  {formatUZS(service.priceFrom)}
                </p>

                <div className="flex flex-col mb-6">
                  <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Turkum</span>
                    <span className="text-sm font-medium text-foreground">{CATEGORY_LABEL[service.category]}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Shahar</span>
                    <span className="text-sm font-medium text-foreground">{service.city}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5">
                    <span className="text-sm text-muted-foreground">Reyting</span>
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={service.rating} />
                      <span className="text-sm font-medium text-foreground">{service.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {user ? (
                  <p className="text-xs text-muted-foreground/55 text-center leading-relaxed">
                    "Mening tadbirlarim" bo'limida tadbirga ulang
                  </p>
                ) : (
                  <Link to="/login">
                    <button className="lp-btn-gold w-full text-center">
                      Bog'lanish uchun kiring
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Sharh yozish">
        <CreateReviewForm
          serviceId={service.id}
          queryKey={serviceKeys.reviews(id!)}
          onSuccess={() => setReviewModal(false)}
        />
      </Modal>
    </div>
  )
}
