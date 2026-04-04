import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Star,
  Wifi,
  Car,
  Volume2,
  Music,
  Home,
  Sun,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import { venuesApi } from "@entities/venue";
import { reviewsApi } from "@entities/review";
import { ReviewCard } from "@entities/review";
import { CreateReviewForm } from "@features/review-create";
import { StarRating } from "@shared/ui/StarRating";
import { Modal } from "@shared/ui/Modal";
import { useAuthStore } from "@shared/model/auth.store";
import { venueKeys } from "@shared/api/queryKeys";
import { formatUZS } from "@shared/lib/dateUtils";
import { Skeleton } from "@/shared/ui/primitives/skeleton";
import { Separator } from "@/shared/ui/primitives/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/ui/primitives/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/primitives/tooltip";
import { Button } from "@/shared/ui/primitives/button";

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
  );
}

export function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [imgIndex, setImgIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [reviewModal, setReviewModal] = useState(false);

  const { data: venue, isLoading } = useQuery({
    queryKey: venueKeys.detail(id!),
    queryFn: () => venuesApi.get(id!),
    enabled: !!id,
  });

  const { data: reviews } = useQuery({
    queryKey: venueKeys.reviews(id!),
    queryFn: () => reviewsApi.forVenue(id!),
    enabled: !!id,
  });

  if (isLoading) return <DetailSkeleton />;

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-16 h-16 rounded-2xl bg-card border border-border/60 flex items-center justify-center">
          <Home className="size-7 text-muted-foreground/20" />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-semibold text-foreground">
            Maydon topilmadi
          </p>
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
    );
  }

  const avgRating = reviews?.data.length
    ? reviews.data.reduce((sum, r) => sum + r.rating, 0) / reviews.data.length
    : venue.rating;

  const amenityItems = [
    venue.hasWifi && { Icon: Wifi, label: "WiFi" },
    venue.hasParking && { Icon: Car, label: "Parkovka" },
    venue.hasSound && { Icon: Volume2, label: "Ovoz tizimi" },
    venue.hasStage && { Icon: Music, label: "Sahna" },
    venue.isIndoor && { Icon: Home, label: "Yopiq zal" },
    !venue.isIndoor && { Icon: Sun, label: "Ochiq maydon" },
  ].filter(Boolean) as Array<{ Icon: typeof Wifi; label: string }>;

  return (
    <div className="flex flex-col gap-0 pb-16">
      {/* Cinematic hero */}
      <div className="relative w-full h-[58vh] min-h-[380px] max-h-[560px] overflow-hidden rounded-2xl">
        {venue.imageUrls.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            className="w-full h-full"
            onSwiper={(s) => {
              setSwiper(s);
            }}
            onSlideChange={(s) => setImgIndex(s.realIndex)}
          >
            {venue.imageUrls.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-navy to-navy-2 z-0" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10 z-10" />

        {/* Back button */}
        <div className="absolute top-5 left-5 z-10">
          <Link to="/venues">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm flex items-center gap-2 group"
            >
              <ArrowLeft
                size={24}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              <span className="text-[10px] tracking-[0.15em] uppercase text-white/80 hover:text-white">
                Barcha maydonlar
              </span>
            </Button>
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 mx-auto z-10">
          <span className="inline-flex items-center text-xs font-medium uppercase tracking-[0.18em] text-gold-light/90 mb-3 bg-black/45 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gold/20">
            {venue.isIndoor ? "Yopiq zal" : "Ochiq maydon"}
          </span>
          <h1 className="lp-serif text-4xl md:text-5xl font-bold text-white leading-tight mb-3 max-w-2xl drop-shadow-lg">
            {venue.name}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <StarRating rating={venue.rating} />

              <span className="text-gold-light font-medium">
                {venue.rating.toFixed(1)}
              </span>
            </div>

            <span className="text-white/25">•</span>

            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-gold/60" />
              {venue.city}
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {venue.imageUrls.length > 1 && (
          <div className="absolute bottom-6 right-6 flex gap-1.5 z-10">
            {venue.imageUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => {
                  swiper?.slideTo(i);
                  setImgIndex(i);
                }}
                className={`h-12 w-16 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  i === imgIndex
                    ? "border-gold shadow-[0_0_14px_rgba(201,150,58,0.5)]"
                    : "border-white/20 opacity-55 hover:opacity-100"
                }`}
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Main content: two-column ── */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left column ── */}
        <div className="lg:col-span-7 flex flex-col gap-5">
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
                Sharhlar
                {reviews?.data.length ? ` (${reviews.data.length})` : ""}
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
                <p className="text-[13px] text-muted-foreground/40">
                  Hozircha sharhlar yo'q
                </p>
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Navigation]}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                loop={reviews.data.length >= 2}
                spaceBetween={12}
                slidesPerView={1}
                navigation={{
                  prevEl: ".prev",
                  nextEl: ".next",
                }}
              >
                <div className="flex items-center mt-2 space-x-1">
                  <button
                    type="button"
                    className="prev ml-auto w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-gold/30 hover:bg-card transition-all duration-200 shadow-sm"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  <button
                    type="button"
                    className="next w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-gold/30 hover:bg-card transition-all duration-200 shadow-sm"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>

                {reviews.data.map((review) => (
                  <SwiperSlide key={review.id} className="!w-full">
                    <ReviewCard review={review} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        {/* ── Right column: booking card ── */}
        <div className="lg:col-span-5">
          <div className="top-20 bg-card rounded-2xl overflow-hidden">
            <div className="h-[3px] bg-linear-to-r from-gold-dark via-gold to-gold-light" />
            {/* Gold top accent */}

            <CardHeader className="pb-5 pt-5">
              <div className="text-[34px] font-bold text-gold leading-none tracking-tight">
                {formatUZS(venue.pricePerDay)}
              </div>

              <CardTitle className="text-[12px] font-normal text-muted-foreground/45 mt-1.5">
                kuniga ijarasi
              </CardTitle>

              <CardDescription className="text-[12px] text-muted-foreground/35 mt-0">
                {venue.city} • {venue.isIndoor ? "Yopiq zal" : "Ochiq maydon"}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-0 pt-0 pb-5">
              <Separator className="opacity-8 mb-4" />

              <div className="flex flex-col divide-y divide-white/5">
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">
                    Sig'imi
                  </span>

                  <span className="text-[13px] font-semibold text-cream/82">
                    {venue.capacity} kishi
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">
                    Turi
                  </span>

                  <span className="text-[13px] font-semibold text-cream/82">
                    {venue.isIndoor ? "Yopiq zal" : "Ochiq maydon"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">
                    Reyting
                  </span>

                  <div className="flex items-center gap-1.5">
                    <StarRating rating={avgRating} />

                    <span className="text-[13px] font-semibold text-cream/82">
                      {avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px] text-muted-foreground/50">
                    Manzil
                  </span>

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
          </div>
        </div>
      </div>

      <Modal
        open={reviewModal}
        onClose={() => setReviewModal(false)}
        title="Sharh yozish"
      >
        <CreateReviewForm
          venueId={venue.id}
          queryKey={venueKeys.reviews(id!)}
          onSuccess={() => setReviewModal(false)}
        />
      </Modal>
    </div>
  );
}
