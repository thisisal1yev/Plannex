import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft, MapPin, Users, Star,
  Wifi, Car, Volume2, Music, Home, Sun,
} from 'lucide-react'
import { venuesApi } from '@entities/venue'
import { reviewsApi } from '@entities/review'
import { ReviewCard } from '@entities/review'
import { CreateReviewForm } from '@features/review-create'
import { StarRating } from '@shared/ui/StarRating'
import { Modal } from '@shared/ui/Modal'
import { useAuthStore } from '@shared/model/auth.store'
import { venueKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'
import { Skeleton } from '@/shared/ui/primitives/skeleton'
import { Separator } from '@/shared/ui/primitives/separator'
import { Badge } from '@/shared/ui/primitives/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/ui/primitives/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/primitives/tooltip'

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-0 pb-16">
      <Skeleton className="h-4 w-24 mb-8" />

      {/* Editorial title skeleton */}
      <div className="flex flex-col gap-3 mb-8">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="h-14 w-1/2" />
        <div className="flex items-center gap-3 mt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-px" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Gallery skeleton */}
      <div className="grid grid-cols-[1fr_80px] gap-2 h-[460px]">
        <Skeleton className="rounded-2xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-[120px] rounded-lg" />
          <Skeleton className="h-[120px] rounded-lg" />
          <Skeleton className="h-[120px] rounded-lg" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Skeleton className="h-12 rounded-xl" />
          <div className="pl-5 border-l border-border/20 flex flex-col gap-3">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-12 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

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

  if (isLoading) return <DetailSkeleton />

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border/60 flex items-center justify-center">
          <Home className="size-7 text-muted-foreground/20" />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-semibold text-foreground">Maydon topilmadi</p>
          <p className="text-[13px] text-muted-foreground/50 mt-1">
            Bu maydon mavjud emas yoki o'chirilgan
          </p>
        </div>
        <Link
          to="/venues"
          className="h-8 px-4 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors flex items-center"
        >
          Barcha maydonlar
        </Link>
      </div>
    )
  }

  const avgRating =
    reviews?.data.length
      ? reviews.data.reduce((sum, r) => sum + r.rating, 0) / reviews.data.length
      : venue.rating

  const amenityItems = [
    venue.hasWifi    && { Icon: Wifi,    label: 'WiFi' },
    venue.hasParking && { Icon: Car,     label: 'Parkovka' },
    venue.hasSound   && { Icon: Volume2, label: 'Ovoz tizimi' },
    venue.hasStage   && { Icon: Music,   label: 'Sahna' },
    venue.isIndoor   && { Icon: Home,    label: 'Yopiq zal' },
    !venue.isIndoor  && { Icon: Sun,     label: 'Ochiq maydon' },
  ].filter(Boolean) as Array<{ Icon: typeof Wifi; label: string }>

  return (
    <div className="flex flex-col gap-0 pb-16">

      {/* ── Back navigation ── */}
      <Link
        to="/venues"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground/45 hover:text-foreground mb-8 transition-colors w-fit"
      >
        <ArrowLeft className="size-3.5" />
        Barcha maydonlar
      </Link>

      {/* ── Editorial header: title leads, image illustrates ── */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-[10px] text-gold/70 font-semibold tracking-[0.18em] uppercase mb-3">
          <MapPin className="size-2.5" />
          {venue.city}
        </div>

        <h1
          className="text-[48px] sm:text-[60px] font-bold leading-[1.0] text-foreground max-w-4xl mb-5"
          style={{ fontFamily: "'lp-serif', serif" }}
        >
          {venue.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <StarRating rating={avgRating} />
            <span className="text-[14px] font-semibold text-foreground">{avgRating.toFixed(1)}</span>
            {!!reviews?.data.length && (
              <span className="text-[12px] text-muted-foreground/45">
                ({reviews.data.length} sharh)
              </span>
            )}
          </div>
          <div className="h-4 w-px bg-border/60" />
          <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground/65">
            <Users className="size-3.5" />
            {venue.capacity} o'rin
          </span>
          <div className="h-4 w-px bg-border/60" />
          <Badge variant="outline" className="text-[11px] border-border/50 text-muted-foreground/60">
            {venue.isIndoor ? 'Yopiq zal' : 'Ochiq maydon'}
          </Badge>
        </div>
      </div>

      {/* ── Gallery: main image + vertical thumbnail strip (desktop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_80px] gap-2 h-[320px] sm:h-[480px]">

        {/* Main image */}
        <div className="relative overflow-hidden rounded-2xl h-full">
          {venue.imageUrls.length > 0 ? (
            <img
              src={venue.imageUrls[imgIndex]}
              alt={venue.name}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gold/8 via-muted/20 to-background flex items-center justify-center">
              <Home className="size-20 text-gold/12" />
            </div>
          )}
          {/* Subtle depth gradient */}
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,15,25,0.25)_0%,transparent_35%)] pointer-events-none rounded-2xl" />
          {/* Rating pill */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[rgba(8,15,25,0.72)] backdrop-blur-sm rounded-full px-2.5 py-1.5 border border-white/10">
            <Star className="size-3 text-gold fill-gold" />
            <span className="text-[12px] font-semibold text-cream/90">{avgRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Vertical thumbnail strip — desktop */}
        {venue.imageUrls.length > 1 && (
          <div className="hidden sm:flex flex-col gap-2 overflow-y-auto scrollbar-none">
            {venue.imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer w-full ${
                  i === imgIndex
                    ? 'border-gold/55 shadow-[0_0_10px_rgba(201,150,58,0.22)]'
                    : 'border-transparent opacity-35 hover:opacity-65'
                }`}
              >
                <img src={url} alt="" className="w-full h-[120px] object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Horizontal thumbnail strip — mobile */}
      {venue.imageUrls.length > 1 && (
        <div className="sm:hidden flex gap-2 overflow-x-auto pb-1 mt-2 scrollbar-none">
          {venue.imageUrls.map((url, i) => (
            <button
              key={i}
              onClick={() => setImgIndex(i)}
              className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                i === imgIndex
                  ? 'border-gold/55'
                  : 'border-transparent opacity-35 hover:opacity-65'
              }`}
            >
              <img src={url} alt="" className="h-14 w-20 object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Main content: two-column ── */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left column ── */}
        <div className="lg:col-span-7 flex flex-col gap-10">

          {/* Address block */}
          <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-muted/15 border border-border/35">
            <MapPin className="size-4 text-muted-foreground/35 shrink-0" />
            <span className="text-[14px] text-muted-foreground/65">
              {venue.address}, {venue.city}
            </span>
          </div>

          {/* Description */}
          {venue.description && (
            <div className="pl-5 border-l border-gold/18">
              <p className="text-[15px] text-muted-foreground/72 leading-[1.8]">
                {venue.description}
              </p>
            </div>
          )}

          {/* Amenities — icon-only with Tooltips */}
          {amenityItems.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-[0.15em] mb-4">
                Qulayliklar
              </p>
              <TooltipProvider>
                <div className="flex flex-wrap gap-2.5">
                  {amenityItems.map(({ Icon, label }) => (
                    <Tooltip key={label}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="w-11 h-11 rounded-xl border border-white/7 bg-white/3 flex items-center justify-center backdrop-blur-xs transition-all duration-200 hover:border-gold/30 hover:bg-gold/8 cursor-default"
                        >
                          <Icon className="size-[18px] text-gold/60" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={6}>
                        <p>{label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          )}

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-semibold text-muted-foreground/35 uppercase tracking-[0.15em]">
                Sharhlar{reviews?.data.length ? ` (${reviews.data.length})` : ''}
              </p>
              {user && (
                <button
                  onClick={() => setReviewModal(true)}
                  className="h-7 px-3 rounded-lg border border-border/55 text-[12px] text-muted-foreground/60 hover:text-foreground hover:border-gold/30 transition-colors"
                >
                  + Sharh yozish
                </button>
              )}
            </div>

            {!reviews?.data.length ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-xl border border-border/30 bg-card/25">
                <Star className="size-6 text-muted-foreground/12" />
                <p className="text-[13px] text-muted-foreground/40">Hozircha sharhlar yo'q</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reviews.data.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: booking card ── */}
        <div className="lg:col-span-5">
          <Card className="sticky top-20 ring-0 border-white/8 bg-white/3 backdrop-blur-md overflow-hidden gap-0">

            {/* Gold accent bar */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-70" />

            <CardHeader className="pb-5 pt-5">
              <div className="text-[34px] font-bold text-gold leading-none tracking-tight">
                {formatUZS(venue.pricePerDay)}
              </div>
              <CardTitle className="text-[12px] font-normal text-muted-foreground/45 mt-1.5">
                kuniga ijarasi
              </CardTitle>
              <CardDescription className="text-[12px] text-muted-foreground/35 mt-0">
                {venue.city} · {venue.isIndoor ? 'Yopiq zal' : 'Ochiq maydon'}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-0 pt-0 pb-5">
              <Separator className="opacity-8 mb-4" />

              <div className="flex flex-col divide-y divide-white/5">
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">Sig'imi</span>
                  <span className="text-[13px] font-semibold text-cream/82">
                    {venue.capacity} kishi
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">Turi</span>
                  <span className="text-[13px] font-semibold text-cream/82">
                    {venue.isIndoor ? 'Yopiq zal' : 'Ochiq maydon'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">Reyting</span>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={avgRating} />
                    <span className="text-[13px] font-semibold text-cream/82">
                      {avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">Manzil</span>
                  <span className="text-[13px] font-semibold text-cream/82 text-right max-w-[160px] leading-snug">
                    {venue.address}
                  </span>
                </div>
              </div>

              <Separator className="opacity-8 my-4" />

              {user ? (
                <div className="rounded-xl bg-gold/5 border border-gold/10 px-4 py-3.5 text-[12px] text-gold/55 text-center leading-relaxed">
                  Maydonni band qilish uchun tadbir yaratishda foydalaning
                </div>
              ) : (
                <Link to="/login" className="block">
                  <button className="w-full h-10 rounded-xl bg-gold text-[13px] font-semibold text-background hover:bg-gold/88 transition-colors cursor-pointer">
                    Band qilish uchun kiring
                  </button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal open={reviewModal} onClose={() => setReviewModal(false)} title="Sharh yozish">
        <CreateReviewForm
          venueId={venue.id}
          queryKey={venueKeys.reviews(id!)}
          onSuccess={() => setReviewModal(false)}
        />
      </Modal>
    </div>
  )
}
