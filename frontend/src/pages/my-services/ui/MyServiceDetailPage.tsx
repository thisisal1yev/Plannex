import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import { ArrowLeft, MapPin, Pencil, Trash2, Star, Banknote, Wrench } from 'lucide-react'
import { servicesApi } from '@entities/service'
import { Spinner } from '@shared/ui/Spinner'
import { serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'
import { DetailPageSkeleton } from '@shared/ui/DetailPageSkeleton'
import { StarRating } from '@/shared/ui/StarRating'

const emptyHeroStyle = {
  background: 'linear-gradient(135deg, rgba(8,15,25,0.98) 0%, rgba(8,15,25,0.95) 100%)',
} as const

export function MyServiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [imgIndex, setImgIndex] = useState(0)

  const { data: service, isLoading } = useQuery({
    queryKey: serviceKeys.detail(id!),
    queryFn: () => servicesApi.get(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: () => servicesApi.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.myList() })
      navigate('/my-services')
    },
  })

  if (isLoading) return <DetailPageSkeleton />

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24">
        <div className="bg-card border-border/60 flex h-16 w-16 items-center justify-center rounded-2xl border">
          <Wrench className="text-muted-foreground/20 size-7" />
        </div>
        <div className="text-center">
          <p className="text-foreground/60 font-serif text-lg">Xizmat topilmadi</p>
          <p className="text-muted-foreground/40 mt-1 text-xs">
            Bunday xizmat mavjud emas yoki o'chirilgan
          </p>
        </div>
        <Link
          to="/my-services"
          className="text-primary/60 hover:text-primary text-xs tracking-[0.12em] uppercase transition-colors"
        >
          ← Mening xizmatlarim
        </Link>
      </div>
    )
  }

  const rating = service.ratingStats?.avg ?? 0
  const reviewCount = service.ratingStats?.count ?? 0

  return (
    <div className="grid grid-cols-1 pb-16">
      {/* ── Cinematic hero ── */}
      <div className="relative h-[58vh] max-h-140 min-h-95 w-full overflow-hidden rounded-2xl">
        {service.imageUrls && service.imageUrls.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            className="h-full w-full"
            onSwiper={(s) => setSwiper(s)}
            onSlideChange={(s) => setImgIndex(s.realIndex)}
          >
            {service.imageUrls.map((url, idx) => (
              <SwiperSlide key={`${url}-${idx}`}>
                <img src={url} alt={service.name} className="h-full w-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div
            className="absolute inset-0 z-0 flex items-center justify-center"
            style={emptyHeroStyle}
          >
            <span className="text-[140px] leading-none opacity-10 select-none">◆</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-10 bg-linear-to-t from-black/85 via-black/25 to-black/10" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-20">
          <Link to="/my-services">
            <button className="group flex items-center gap-2 rounded-lg border border-white/20 bg-black/20 px-3 py-1.5 text-white/80 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
              <span className="text-[10px] tracking-[0.15em] uppercase">Orqaga</span>
            </button>
          </Link>
        </div>

        {/* Category badge */}
        <div className="absolute top-5 right-5 z-20">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-[rgba(8,15,25,0.65)] px-2.5 py-1 text-[10px] font-medium backdrop-blur-sm">
            <span>◆</span>
            {service.category?.name}
          </div>
        </div>

        {/* Thumbnail strip */}
        {(service.imageUrls?.length ?? 0) > 1 && (
          <div className="absolute right-6 bottom-6 z-20 flex gap-1.5">
            {service.imageUrls!.map((url, i) => (
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
          <h1 className="mb-2 max-w-2xl font-serif text-3xl leading-tight font-bold text-white drop-shadow-lg md:text-4xl">
            {service.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
            <div className="flex items-center gap-1">
              <StarRating rating={rating} />
              <span className="text-white/40">({reviewCount})</span>
            </div>

            <span className="text-white/25">•</span>

            <div className="flex items-center gap-1.5">
              <MapPin className="text-primary/60 h-3.5 w-3.5" />
              <span>{service.city}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* ── Left column ── */}
        <div className="flex flex-col gap-8 lg:col-span-7">
          {/* Info grid */}
          <section>
            <h2 className="text-muted-foreground/35 mb-5 text-[10px] font-semibold tracking-[0.22em] uppercase">
              Ma'lumotlar
            </h2>

            <div className="bg-border/30 grid grid-cols-3 gap-px overflow-hidden rounded-xl">
              <div className="bg-card/50 flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Kategoriya
                  </span>
                </div>

                <p className="text-foreground/85 font-mono text-sm font-semibold tracking-tight">
                  {service.category?.name}
                </p>
              </div>
              <div className="bg-card/50 flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Narx (dan)
                  </span>
                </div>
                <p className="text-foreground/85 font-mono text-sm font-semibold tracking-tight">
                  {formatUZS(service.priceFrom)}
                </p>
              </div>
              <div className="bg-card/50 flex flex-col gap-2.5 px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span className="text-muted-foreground/35 text-[10px] tracking-[0.18em] uppercase">
                    Reyting
                  </span>
                </div>

                <p className="text-foreground/85 font-mono text-sm font-semibold tracking-tight">
                  {rating > 0 ? `${rating.toFixed(1)} / 5` : '—'}
                </p>
              </div>
            </div>
          </section>

          {/* Description */}
          {service.description && (
            <section className="border-l-2 pl-6">
              <h2 className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Xizmat haqida
              </h2>
              <p className="text-foreground/70 text-sm leading-[1.9] whitespace-pre-line">
                {service.description}
              </p>
            </section>
          )}
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
                      Xizmat boshqaruvi
                    </p>
                    <p className="text-foreground/90 font-serif text-lg font-bold">Harakatlar</p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xl font-bold">
                      <span>◆</span>
                    </p>

                    <p className="text-muted-foreground/40 text-[10px] tracking-wide">
                      {service.category?.name}
                    </p>
                  </div>
                </div>
                <span className="border-primary/18 absolute top-2.5 right-2.5 h-3 w-3 border-t border-r" />
                <span className="border-primary/18 absolute bottom-2.5 left-2.5 h-3 w-3 border-b border-l" />
              </div>

              <div className="flex flex-col gap-2.5 p-5">
                {/* Edit */}
                <Link to={`/my-services/${id}/edit`} className="block">
                  <button className="group border-border/60 bg-muted/20 text-foreground/70 hover:border-primary/30 hover:bg-primary/5 hover:text-primary flex h-10 w-full items-center justify-center gap-2 rounded-lg border text-xs font-medium transition-all">
                    <Pencil className="size-3.5" />
                    Tahrirlash
                  </button>
                </Link>

                {/* Delete */}
                <button
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    if (
                      confirm("Xizmatni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.")
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

            {/* Quick stats */}
            <div className="border-border/45 bg-card/35 rounded-xl border p-5">
              <p className="text-muted-foreground/35 mb-4 text-[10px] font-semibold tracking-[0.22em] uppercase">
                Statistika
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'Narx',
                    value: `${(service.priceFrom / 1_000_000).toFixed(1)}M`,
                    icon: Banknote,
                  },
                  {
                    label: 'Reyting',
                    value: rating > 0 ? rating.toFixed(1) : '—',
                    icon: Star,
                  },
                  {
                    label: 'Sharhlar',
                    value: reviewCount > 0 ? reviewCount : '—',
                    icon: Star,
                  },
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
