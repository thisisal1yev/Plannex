import { Link } from 'react-router'
import { ArrowRight, MapPin, Star } from 'lucide-react'
import { formatUZS } from '@shared/lib/dateUtils'
import { cn } from '@/shared/lib/utils'
import type { Service } from '../model/types'

interface ServiceCardProps {
  service: Service
  index: number
  className?: string
}

const CATEGORY_LABEL: Record<string, string> = {
  CATERING: 'Katering',
  DECORATION: 'Bezak',
  SOUND: 'Ovoz',
  PHOTO: 'Foto',
  SECURITY: 'Xavfsizlik',
}

const CATEGORY_GLYPH: Record<string, string> = {
  CATERING: '🍽',
  DECORATION: '✦',
  SOUND: '♪',
  PHOTO: '◉',
  SECURITY: '◈',
}

// Subtle per-category accent hue for the image placeholder bg
const CATEGORY_BG: Record<string, string> = {
  CATERING: 'from-[#1a1208] to-[#080f19]',
  DECORATION: 'from-[#0e1520] to-[#080f19]',
  SOUND: 'from-[#0a1418] to-[#080f19]',
  PHOTO: 'from-[#12120a] to-[#080f19]',
  SECURITY: 'from-[#0f1010] to-[#080f19]',
}

export function ServiceCard({ service, className, index = 0 }: ServiceCardProps) {
  const glyph = CATEGORY_GLYPH[service.category?.name ?? ''] ?? '✦'
  const catBg = CATEGORY_BG[service.category?.name ?? ''] ?? 'from-[#0f1925] to-[#080f19]'
  const label = CATEGORY_LABEL[service.category?.name ?? ''] ?? service.category?.name

  return (
    <Link
      to={`/services/${service.id}`}
      className={cn(
        `group bg-card hover:border-primary/30! relative flex animate-[svc-in_0.45s_ease-out_both] flex-col overflow-hidden rounded-2xl border border-white/8 transition-all duration-280 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-y-[-5px] hover:shadow-[0_14px_40px_rgba(0,0,0,0.14),0_0_0_1px_rgba(76,140,167,0.28)]`,
        className
      )}
      style={{ animationDelay: `${(index % 12) * 0.04}s` }}
    >
      {/* Animated primary shimmer rule */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-[2px] origin-center scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, #4c8ca7 40%, #7ab8cc 60%, transparent 100%)',
        }}
      />

      {/* ── Image ── */}
      <div className="relative h-52 shrink-0 overflow-hidden">
        {service.imageUrls[0] ? (
          <img
            src={service.imageUrls[0]}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div
            className={`h-full w-full bg-linear-to-br ${catBg} flex items-center justify-center`}
          >
            {/* Large watermark glyph in empty state */}
            <span className="text-[80px] leading-none opacity-[0.07] select-none">{glyph}</span>
          </div>
        )}

        {/* Gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.4) 45%, transparent 75%)',
          }}
        />

        {/* Category pill — top left */}
        <div className="border-primary/20 group-hover:text-primary absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border bg-[rgba(8,15,25,0.6)] px-[10px] py-1 text-center text-xs font-medium backdrop-blur-sm transition-colors duration-300">
          <span className="text-xs leading-none">{glyph}</span>
          <span>{label}</span>
        </div>

        {/* Rating — top right */}
        {service.ratingStats && service.ratingStats.count > 0 ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg border border-white/10 bg-[rgba(8,15,25,0.55)] px-2 py-1.5 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />

            <span className="text-cream/80 text-[12px] font-medium">
              {service.ratingStats.avg.toFixed(1)}
            </span>

            <span className="text-cream/40 text-[10px]">({service.ratingStats.count})</span>
          </div>
        ) : null}

        {/* Name bleeds over image bottom */}
        <div className="absolute right-0 bottom-0 left-0 px-4 pb-3.5">
          <h3 className="text-cream/95 group-hover:text-primary-light line-clamp-2 font-serif text-[20px] leading-[1.22] font-bold transition-colors duration-200">
            {service.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {/* Location */}
        <div className="text-cream/40 flex items-center gap-1.5 text-[12px]">
          <MapPin className="text-primary/40 h-3 w-3 shrink-0" />
          {service.city}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2">
          <div>
            <p className="text-cream/25 mb-0.5 text-[9px] tracking-widest uppercase">
              Narxdan boshlab
            </p>
            <span className="text-primary text-[14px] leading-none font-semibold">
              {formatUZS(service.priceFrom)}
            </span>
          </div>
          <span className="text-primary/70 group-hover:text-primary flex items-center gap-1 text-[12px] font-medium transition-colors duration-200">
            Batafsil
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
