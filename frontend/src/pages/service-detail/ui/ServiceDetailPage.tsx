import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'

import { servicesApi } from '@entities/service'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { CreateReviewForm } from '@features/review-create'
import { StarRating } from '@shared/ui/StarRating'
import { Modal } from '@shared/ui/Modal'
import { useAuthStore } from '@shared/model/auth.store'
import { serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { Separator } from '@/shared/ui/primitives/separator'
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/primitives/card'
import { Button } from '@/shared/ui/primitives/button'

import 'swiper/swiper.css'

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      <Skeleton className="mb-8 h-4 w-24" />

      <div className="mb-8 flex flex-col gap-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-14 w-1/2" />
        <div className="mt-1 flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-px" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <Skeleton className="h-[460px] rounded-2xl" />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Skeleton className="h-12 rounded-xl" />
          <div className="border-border/20 flex flex-col gap-3 border-l pl-5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const user = useAuthStore((s) => s.user)
  const [imgIndex, setImgIndex] = useState(0)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
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

  if (isLoading) return <DetailSkeleton />

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <div className="bg-card border-border/60 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <Star className="text-muted-foreground/20 size-7" />
        </div>

        <div className="text-center">
          <p className="text-foreground text-[15px] font-semibold">Xizmat topilmadi</p>
          <p className="text-muted-foreground/50 mt-1 text-[13px]">
            Bu xizmat mavjud emas yoki o'chirilgan
          </p>
        </div>

        <Link
          to="/services"
          className="border-border text-muted-foreground hover:text-foreground hover:border-primary/30 flex h-8 items-center rounded-lg border px-4 text-xs transition-colors"
        >
          Barcha xizmatlar
        </Link>
      </div>
    )
  }

  const avgRating = service.ratingStats?.avg ?? null

  return (
    <div className="flex flex-col gap-0 pb-16">
      {/* Hero */}
      <div className="relative h-[58vh] max-h-[560px] min-h-[380px] w-full overflow-hidden rounded-2xl">
        {service.imageUrls.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            className="h-full w-full"
            onSwiper={(s) => setSwiper(s)}
            onSlideChange={(s) => setImgIndex(s.realIndex)}
          >
            {service.imageUrls.map((img, i) => (
              <SwiperSlide key={i}>
                <img src={img} alt={service.name} className="h-full w-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="from-navy to-navy-2 absolute inset-0 z-0 bg-linear-to-br" />
        )}

        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/25 to-black/10" />

        <div className="absolute top-5 left-5 z-10">
          <Link to="/services">
            <Button
              variant="ghost"
              size="sm"
              className="group flex items-center gap-2 border border-white/20 text-white/80 backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={24} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="text-[10px] tracking-[0.15em] text-white/80 uppercase hover:text-white">
                Barcha xizmatlar
              </span>
            </Button>
          </Link>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto px-6 pb-8">
          <span className="text-primary-light/90 border-primary/20 mb-3 inline-flex items-center rounded-full border bg-black/45 px-3 py-1.5 text-xs font-medium tracking-[0.18em] uppercase backdrop-blur-sm">
            {service.category?.name ?? '—'}
          </span>
          <h1 className="font-serif mb-3 max-w-2xl text-4xl leading-tight font-bold text-white drop-shadow-lg md:text-5xl">
            {service.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <StarRating rating={avgRating ?? 0} />
              <span className="text-primary-light font-medium">
                {parseFloat((avgRating ?? 0).toFixed(1))}
              </span>
            </div>

            <span className="text-white/25">•</span>

            <div className="flex items-center gap-1">
              <MapPin className="text-primary/60 h-3.5 w-3.5" />
              {service.city}
            </div>
          </div>
        </div>

        {service.imageUrls.length > 1 && (
          <div className="absolute right-6 bottom-6 z-10 flex gap-1.5">
            {service.imageUrls.map((url, i) => (
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
      </div>

      {/* Main content */}
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left column */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          {/* Vendor block */}
          {service.vendor && (
            <div className="border-border/50 bg-card/35 relative overflow-hidden rounded-xl border">
              <div className="from-primary/60 via-primary/25 absolute top-0 bottom-0 left-0 w-[2px] bg-linear-to-b to-transparent" />
              <div className="flex items-center gap-4 p-5 pl-7">
                <div className="bg-primary/8 border-primary/12 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border">
                  <Users className="text-primary/55 size-4" />
                </div>
                <div>
                  <p className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Xizmat ko'rsatuvchi
                  </p>
                  <p className="text-foreground/85 text-[14px] font-semibold">
                    {service.vendor.firstName} {service.vendor.lastName}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {service.description && (
            <div className="border-primary/18 border-l pl-5">
              <p className="text-muted-foreground/72 text-[15px] leading-[1.8]">
                {service.description}
              </p>
            </div>
          )}

          {/* Reviews */}
          <div>
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
                    <span className="text-muted-foreground/35 text-[11px]">
                      — {service.ratingStats?.count ?? 0} ta sharh
                    </span>
                  </div>
                ) : (
                  <p className="text-muted-foreground/30 mt-1.5 text-[11px]">Hali sharh yo'q</p>
                )}
              </div>

              {user && (
                <button
                  onClick={() => setReviewModal(true)}
                  className="border-primary/18 text-primary/60 hover:bg-primary/7 hover:text-primary hover:border-primary/35 h-8 rounded-lg border px-4 text-[10px] font-medium tracking-[0.12em] uppercase transition-all duration-200"
                >
                  Sharh yozish
                </button>
              )}
            </div>

            {!reviews?.data.length ? (
              <div className="border-border/35 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-10">
                <Star className="text-muted-foreground/12 size-6" />
                <p className="text-muted-foreground/35 text-[12px] tracking-wide">
                  Hozircha sharhlar yo'q
                </p>
                {user && (
                  <button
                    onClick={() => setReviewModal(true)}
                    className="text-primary/50 hover:text-primary text-[10px] tracking-[0.12em] uppercase transition-colors"
                  >
                    Birinchi bo'lib sharh yozing
                  </button>
                )}
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                loop={reviews.data.length >= 2}
                spaceBetween={12}
                slidesPerView={1}
                navigation={reviews.data.length >= 2 ? { prevEl: '.prev', nextEl: '.next' } : false}
              >
                {reviews.data.length >= 2 && (
                  <div className="mt-2 flex items-center space-x-1">
                    <button
                      type="button"
                      className="prev bg-card/90 border-border/50 text-foreground/60 hover:text-foreground hover:border-primary/30 hover:bg-card ml-auto flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-200"
                    >
                      <ChevronLeft className="size-5" />
                    </button>
                    <button
                      type="button"
                      className="next bg-card/90 border-border/50 text-foreground/60 hover:text-foreground hover:border-primary/30 hover:bg-card flex h-9 w-9 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-all duration-200"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </div>
                )}

                {reviews.data.map((review) => (
                  <SwiperSlide key={review.id} className="!w-full">
                    <ReviewCard review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        {/* Right column: booking card */}
        <div className="lg:col-span-5">
          <div className="bg-card top-20 overflow-hidden rounded-2xl">
            <div className="from-primary-dark via-primary to-primary-light h-[3px] bg-linear-to-r" />

            <CardHeader className="pt-5 pb-5">
              <div className="text-primary text-[34px] leading-none font-bold tracking-tight">
                {formatUZS(service.priceFrom)}
              </div>

              <CardTitle className="text-muted-foreground/45 mt-1.5 text-[12px] font-normal">
                dan boshlab
              </CardTitle>

              <CardDescription className="text-muted-foreground/35 mt-0 text-[12px]">
                {service.city} • {service.category?.name ?? '—'}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-0 pt-0 pb-5">
              <Separator className="mb-4 opacity-8" />

              <div className="flex flex-col divide-y divide-white/5">
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground/50 text-[13px]">Turkum</span>
                  <span className="text-cream/82 text-[13px] font-semibold">
                    {service.category?.name ?? '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground/50 text-[13px]">Shahar</span>
                  <span className="text-cream/82 text-[13px] font-semibold">{service.city}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground/50 text-[13px]">Reyting</span>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={avgRating ?? 0} />
                    <span className="text-cream/82 text-[13px] font-semibold">
                      {avgRating != null ? parseFloat(avgRating.toFixed(1)) : 0}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-4 opacity-8" />

              {user ? (
                <div className="bg-primary/5 border-primary/10 text-primary/55 rounded-xl border px-4 py-3.5 text-center text-[12px] leading-relaxed">
                  "Mening tadbirlarim" bo'limida tadbirga ulang
                </div>
              ) : (
                <Link to="/login" className="block">
                  <button className="bg-primary text-background hover:bg-primary/88 h-10 w-full cursor-pointer rounded-xl text-[13px] font-semibold transition-colors">
                    Bog'lanish uchun kiring
                  </button>
                </Link>
              )}
            </CardContent>
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
