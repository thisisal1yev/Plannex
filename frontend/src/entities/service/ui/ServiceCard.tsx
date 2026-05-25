import { memo } from 'react'
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

const shimmerStyle = {
  background: 'linear-gradient(90deg, transparent 0%, #4c8ca7 40%, #7ab8cc 60%, transparent 100%)',
} as const

const overlayStyle = {
  background: 'linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.4) 45%, transparent 75%)',
} as const

export const ServiceCard = memo(function ServiceCard({ service, className, index = 0 }: ServiceCardProps) {
  return (
    <Link
      to={`/services/${service.id}`}
      className={cn(
        `group bg-card hover:border-primary/30! relative flex animate-[svc-in_0.45s_ease-out_both] flex-col overflow-hidden rounded-2xl border border-white/8 transition-all duration-280 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1.25 hover:shadow-[0_14px_40px_rgba(0,0,0,0.14),0_0_0_1px_rgba(76,140,167,0.28)]`,
        className
      )}
      style={{ animationDelay: `${(index % 12) * 0.04}s` }}
    >
      {/* Animated primary shimmer rule */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-0.5 origin-center scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={shimmerStyle}
      />

      {/* ── Image ── */}
      <div className="relative h-52 shrink-0 overflow-hidden">
        {service.imageUrls[0] ? (
          <img
            src={service.imageUrls[0]}
            alt={service.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-linear-to-br`}>
            {/* Large watermark glyph in empty state */}
            <span className="text-[80px] leading-none opacity-[0.07] select-none">◆</span>
          </div>
        )}

        {/* Gradient */}
        <div className="pointer-events-none absolute inset-0" style={overlayStyle} />

        {/* Top badges */}
        <div className="absolute top-3 flex w-full items-center justify-between px-4">
          {/* Category pill — top left */}
          <div className="border-primary/20 group-hover:text-primary inline-flex items-center gap-1.5 rounded-full border bg-[rgba(8,15,25,0.6)] px-2.5 py-1 text-center text-xs font-medium backdrop-blur-sm transition-colors duration-300">
            <span>◆</span>
            <span>{service.category?.name}</span>
          </div>

          {/* Rating — top right */}
          {service.ratingStats && service.ratingStats.count > 0 ? (
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[rgba(8,15,25,0.55)] px-2 py-1.5 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />

              <span className="text-cream/80 text-xs font-medium">
                {service.ratingStats.avg.toFixed(1)}
              </span>

              <span className="text-cream/40 text-[10px]">({service.ratingStats.count})</span>
            </div>
          ) : null}
        </div>

        {/* Name bleeds over image bottom */}
        <div className="absolute right-0 bottom-0 left-0 px-4 pb-3.5">
          <h3 className="text-cream/95 group-hover:text-primary-light line-clamp-2 font-serif text-xl leading-[1.22] font-bold transition-colors duration-200">
            {service.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {/* Location */}
        <div className="text-cream/40 flex items-center gap-1.5 text-xs">
          <MapPin className="text-primary/40 h-3 w-3 shrink-0" />
          {service.city}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2">
          <div>
            <p className="text-cream/25 mb-0.5 text-[9px] tracking-widest uppercase">
              Narxdan boshlab
            </p>

            <span className="text-primary text-sm leading-none font-semibold">
              {formatUZS(service.priceFrom)}
            </span>
          </div>

          <span className="text-primary/70 group-hover:text-primary flex items-center gap-1 text-xs font-medium transition-colors duration-200">
            Batafsil
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
})
