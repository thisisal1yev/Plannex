import { memo, useState, useRef, useMemo } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@entities/user'
import { eventsApi, MyEventCard } from '@entities/event'
import { servicesApi, MyServiceCard } from '@entities/service'
import { venuesApi, MyVenueCard } from '@entities/venue'
import { reviewsApi } from '@entities/review'
import type { Review } from '@entities/review'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { EmptyState } from '@shared/ui/EmptyState'
import { Spinner } from '@shared/ui/Spinner'
import { CardSkeleton } from '@shared/ui/CardSkeleton'
import { StarRating } from '@shared/ui/StarRating'
import type { UpdateUserDto } from '@entities/user'
import { userKeys, eventKeys, serviceKeys, venueKeys } from '@shared/api/queryKeys'
import { uploadToImgbb } from '@shared/api/imgbbService'
import {
  CheckCircle2,
  Phone,
  Calendar,
  Shield,
  Pencil,
  X,
  Check,
  ChevronRight,
  CalendarRange,
  Wrench,
  Building2,
  MessageSquare,
  Plus,
  Camera,
  LoaderCircle,
} from 'lucide-react'

// ─── Constants ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  ORGANIZER: 'Tashkilotchi',
  PARTICIPANT: 'Ishtirokchi',
  ADMIN: 'Administrator',
  VENDOR: 'Vendor',
  VOLUNTEER: 'Volontyor',
}

const ROLE_COLORS: Record<string, string> = {
  ORGANIZER: 'bg-primary/10 text-primary border-primary/20',
  PARTICIPANT: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  ADMIN: 'bg-red-500/10 text-red-600 border-red-500/20',
  VENDOR: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  VOLUNTEER: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const Avatar = memo(function Avatar({
  firstName,
  lastName,
  avatarUrl,
}: {
  firstName: string
  lastName: string
  avatarUrl?: string
}) {
  if (avatarUrl)
    return <img src={avatarUrl} alt={firstName} className="h-full w-full object-cover" />
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
  return <span className="text-primary text-4xl font-bold select-none">{initials}</span>
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatRelativeDate(iso: string) {
  const diffDays = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (diffDays === 0) return 'Bugun'
  if (diffDays === 1) return 'Kecha'
  if (diffDays < 7) return `${diffDays} kun oldin`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta oldin`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} oy oldin`
  return `${Math.floor(diffDays / 365)} yil oldin`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionHeader = memo(function SectionHeader({
  icon,
  title,
  count,
  href,
  createHref,
  createLabel,
}: {
  icon: React.ReactNode
  title: string
  count?: number
  href: string
  createHref?: string
  createLabel?: string
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
          {icon}
        </div>
        <h2 className="text-foreground text-xl font-bold">{title}</h2>
        {count !== undefined && count > 0 && (
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {createHref && (
          <Link
            to={createHref}
            className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            {createLabel ?? 'Yaratish'}
          </Link>
        )}
        <Link
          to={href}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
        >
          Barchasi
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
})

type ReviewWithCtx = Review & { entityName: string; entityType: 'event' | 'service' | 'venue' }

const ProfileReviewCard = memo(function ProfileReviewCard({ review }: { review: ReviewWithCtx }) {
  const initials = review.author ? `${review.author.firstName[0]}${review.author.lastName[0]}` : '?'
  const fullName = review.author ? `${review.author.firstName} ${review.author.lastName}` : 'Anonim'

  const entityIcon =
    review.entityType === 'event' ? (
      <CalendarRange className="h-3 w-3" />
    ) : review.entityType === 'service' ? (
      <Wrench className="h-3 w-3" />
    ) : (
      <Building2 className="h-3 w-3" />
    )

  return (
    <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {review.author?.avatarUrl ? (
            <img
              src={review.author.avatarUrl}
              alt={fullName}
              className="ring-primary/20 h-10 w-10 shrink-0 rounded-full object-cover ring-2"
            />
          ) : (
            <div className="bg-primary/10 border-primary/15 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-foreground truncate text-sm font-semibold">{fullName}</p>
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1">
              {entityIcon}
              <span className="max-w-40 truncate text-xs">{review.entityName}</span>
            </div>
          </div>
        </div>
        <span className="text-muted-foreground mt-0.5 shrink-0 text-xs">
          {formatRelativeDate(review.createdAt)}
        </span>
      </div>

      <StarRating rating={review.rating} />

      {review.comment && (
        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  )
})

// ─── Main component ───────────────────────────────────────────────────────────

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const role = user?.role
  const canHaveEvents = role === 'ORGANIZER' || role === 'ADMIN'
  const canHaveServices = role === 'VENDOR' || role === 'ADMIN'
  const canHaveVenues = role === 'VENDOR' || role === 'ADMIN'

  // ── Profile data ──
  const { data, isLoading } = useQuery({
    queryKey: userKeys.me(),
    queryFn: usersApi.me,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserDto>({
    values: data
      ? { firstName: data.firstName, lastName: data.lastName, phone: data.phone }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updated) => {
      queryClient.setQueryData(userKeys.me(), updated)
      if (user) setUser({ ...user, ...updated })
      setIsEditing(false)
    },
  })

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (!file.type.startsWith('image/')) {
      setAvatarUploadError('Faqat rasm fayllari qabul qilinadi')
      return
    }
    if (file.size > 32 * 1024 * 1024) {
      setAvatarUploadError('Fayl hajmi 32 MB dan oshmasligi kerak')
      return
    }

    setAvatarUploadError(null)
    setIsUploadingAvatar(true)

    try {
      const { url } = await uploadToImgbb(file)
      const updated = await usersApi.updateMe({ avatarUrl: url })
      queryClient.setQueryData(userKeys.me(), updated)
      if (user) setUser({ ...user, ...updated })
    } catch {
      setAvatarUploadError('Rasm yuklashda xatolik yuz berdi')
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  // ── Content queries ──
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: eventKeys.myList(),
    queryFn: () => eventsApi.myList({ limit: 4 }),
    enabled: canHaveEvents,
  })

  const { data: servicesData, isLoading: servicesLoading } = useQuery({
    queryKey: serviceKeys.myList(),
    queryFn: () => servicesApi.myList({ limit: 4 }),
    enabled: canHaveServices,
  })

  const { data: venuesData, isLoading: venuesLoading } = useQuery({
    queryKey: venueKeys.myList(),
    queryFn: () => venuesApi.myList({ limit: 4 }),
    enabled: canHaveVenues,
  })

  // ── Review items: fetch reviews for first few owned items unconditionally ──
  const reviewItems = useMemo(() => {
    type Item = { type: 'event' | 'service' | 'venue'; id: string; name: string }
    const items: Item[] = []
    eventsData?.data
      .slice(0, 3)
      .forEach((e) => items.push({ type: 'event', id: e.id, name: e.title }))
    servicesData?.data
      .slice(0, 2)
      .forEach((s) => items.push({ type: 'service', id: s.id, name: s.name }))
    venuesData?.data
      .slice(0, 2)
      .forEach((v) => items.push({ type: 'venue', id: v.id, name: v.name }))
    return items
  }, [eventsData, servicesData, venuesData])

  const reviewResults = useQueries({
    queries: reviewItems.map((item) => ({
      queryKey:
        item.type === 'event'
          ? eventKeys.reviews(item.id)
          : item.type === 'service'
            ? serviceKeys.reviews(item.id)
            : venueKeys.reviews(item.id),
      queryFn: () =>
        item.type === 'event'
          ? reviewsApi.forEvent(item.id, { limit: 3 })
          : item.type === 'service'
            ? reviewsApi.forService(item.id, { limit: 3 })
            : reviewsApi.forVenue(item.id, { limit: 3 }),
    })),
  })

  const allReviews: ReviewWithCtx[] = useMemo(() => {
    return reviewResults
      .flatMap((r, idx) =>
        (r.data?.data ?? []).map((review) => ({
          ...review,
          entityName: reviewItems[idx]?.name ?? '',
          entityType: reviewItems[idx]?.type ?? ('event' as const),
        }))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  }, [reviewResults, reviewItems])

  // ── Derived values ──
  const fullName = `${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim()
  const roleLabel = ROLE_LABELS[data?.role ?? ''] ?? data?.role
  const roleColor = ROLE_COLORS[data?.role ?? ''] ?? 'bg-primary/10 text-primary border-primary/20'
  const events = eventsData?.data ?? []
  const services = servicesData?.data ?? []
  const venues = venuesData?.data ?? []

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    )

  return (
    <div className="flex flex-col gap-10">
      {/* ══════════════════ PROFILE INFO ══════════════════ */}
      <div className="space-y-5">
        <h1 className="text-foreground mb-6 text-2xl font-bold">Profil</h1>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
          {/* ── Left: identity sidebar ── */}
          <div className="flex flex-col gap-4">
            {/* Avatar + name */}
            <div className="bg-card border-border flex flex-col items-center gap-4 rounded-2xl border p-6">
              <div className="relative">
                <div
                  className="bg-primary/8 border-border group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 shadow-sm"
                  onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                  role="button"
                  aria-label="Profil rasmini o'zgartirish"
                  title="Profil rasmini o'zgartirish"
                >
                  <Avatar
                    firstName={data?.firstName ?? ''}
                    lastName={data?.lastName ?? ''}
                    avatarUrl={data?.avatarUrl}
                  />
                  {isUploadingAvatar ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <LoaderCircle className="h-7 w-7 animate-spin text-white" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-7 w-7 text-white" />
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />

                {data?.isVerified && (
                  <div className="absolute -right-1.5 -bottom-1.5 rounded-full bg-emerald-500 p-0.5 shadow">
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-foreground text-lg leading-tight font-semibold">{fullName}</p>
                <span
                  className={`mt-1.5 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleColor}`}
                >
                  {roleLabel}
                </span>
              </div>
              {avatarUploadError && (
                <p className="text-destructive bg-destructive/8 border-destructive/20 w-full rounded-lg border px-3 py-2 text-center text-xs">
                  {avatarUploadError}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="bg-card border-border flex flex-col gap-3 rounded-2xl border p-5">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Ma'lumotlar
              </p>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="bg-primary/8 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <Shield className="text-primary h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="text-foreground max-w-45 truncate font-medium">{data?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="bg-primary/8 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <Phone className="text-primary h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Telefon</p>
                  <p className="text-foreground font-medium">
                    {data?.phone ? (
                      <span className="flex items-center gap-1">
                        {data.phone}
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Ko'rsatilmagan</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <div className="bg-primary/8 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <Calendar className="text-primary h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">A'zo bo'lgan sana</p>
                  <p className="text-foreground font-medium">
                    {data?.createdAt ? formatDate(data.createdAt) : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification badge */}
            <div
              className={`rounded-2xl border p-4 ${data?.isVerified ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`h-2 w-2 shrink-0 rounded-full ${data?.isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`}
                />
                <p
                  className={`text-sm font-medium ${data?.isVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}
                >
                  {data?.isVerified ? 'Hisob tasdiqlangan' : 'Hisob tasdiqlanmagan'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: edit form ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border-border overflow-hidden rounded-2xl border">
              <div className="border-border flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h2 className="text-foreground font-semibold">Shaxsiy ma'lumotlar</h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Ism, familiya va aloqa ma'lumotlaringiz
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Tahrirlash
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      reset()
                    }}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Bekor qilish
                  </button>
                )}
              </div>

              <div className="p-6">
                {isEditing ? (
                  <form
                    onSubmit={handleSubmit((d) => mutation.mutate(d))}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        label="Ism"
                        error={errors.firstName?.message}
                        {...register('firstName', { required: 'Majburiy maydon' })}
                      />
                      <Input
                        label="Familiya"
                        error={errors.lastName?.message}
                        {...register('lastName', { required: 'Majburiy maydon' })}
                      />
                    </div>
                    <Input
                      label="Telefon raqami"
                      placeholder="+998 90 123 45 67"
                      {...register('phone')}
                    />
                    {mutation.isError && (
                      <p className="text-destructive bg-destructive/8 border-destructive/20 rounded-lg border px-3 py-2 text-sm">
                        Saqlashda xatolik yuz berdi
                      </p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button type="submit" loading={mutation.isPending} size="sm">
                        Saqlash
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false)
                          reset()
                        }}
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs">Ism</p>
                        <p className="text-foreground font-medium">{data?.firstName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs">Familiya</p>
                        <p className="text-foreground font-medium">{data?.lastName || '—'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 text-xs">Telefon raqami</p>
                      <p className="text-foreground font-medium">
                        {data?.phone || (
                          <span className="text-muted-foreground text-sm italic">
                            Ko'rsatilmagan
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card border-border overflow-hidden rounded-2xl border">
              <div className="border-border border-b px-6 py-4">
                <h2 className="text-foreground font-semibold">Kirish ma'lumotlari</h2>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Hisobingizga kirish uchun ishlatiladigan email
                </p>
              </div>
              <div className="p-6">
                <p className="text-muted-foreground mb-1 text-xs">Email manzil</p>
                <div className="flex items-center gap-2">
                  <p className="text-foreground font-medium">{data?.email}</p>
                  {data?.isVerified && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════ EVENTS ══════════════════ */}
      {canHaveEvents && (
        <div>
          <SectionHeader
            icon={<CalendarRange className="text-primary h-4 w-4" />}
            title="Mening tadbirlarim"
            count={eventsData?.meta.total}
            href="/my-events"
            createHref="/my-events/create"
            createLabel="Yaratish"
          />
          {eventsLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              variant="section"
              icon={CalendarRange}
              title="Hozircha tadbirlar yo'q"
              action={{ label: 'Birinchi tadbir yaratish', href: '/my-events/create' }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {events.map((event, index) => (
                <MyEventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ SERVICES ══════════════════ */}
      {canHaveServices && (
        <div>
          <SectionHeader
            icon={<Wrench className="text-primary h-4 w-4" />}
            title="Mening xizmatlarim"
            count={servicesData?.meta.total}
            href="/my-services"
            createHref="/my-services/create"
            createLabel="Yaratish"
          />
          {servicesLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              variant="section"
              icon={Wrench}
              title="Hozircha xizmatlar yo'q"
              action={{ label: 'Birinchi xizmat yaratish', href: '/my-services/create' }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service, index) => (
                <MyServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ VENUES ══════════════════ */}
      {canHaveVenues && (
        <div>
          <SectionHeader
            icon={<Building2 className="text-primary h-4 w-4" />}
            title="Mening maydonlarim"
            count={venuesData?.meta.total}
            href="/my-venues"
            createHref="/my-venues/create"
            createLabel="Yaratish"
          />
          {venuesLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : venues.length === 0 ? (
            <EmptyState
              variant="section"
              icon={Building2}
              title="Hozircha maydonlar yo'q"
              action={{ label: 'Birinchi maydon yaratish', href: '/my-venues/create' }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {venues.map((venue, index) => (
                <MyVenueCard key={venue.id} venue={venue} index={index} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════ REVIEWS ══════════════════ */}
      {allReviews.length > 0 && (
        <div>
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <MessageSquare className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="text-foreground text-xl font-bold">So'nggi sharhlar</h2>
            <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs font-medium">
              {allReviews.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allReviews.map((review) => (
              <ProfileReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
