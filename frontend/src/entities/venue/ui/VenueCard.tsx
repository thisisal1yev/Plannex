import { Link } from 'react-router'
import { ArrowRight, Building2, MapPin, Star } from 'lucide-react'
import { formatUZS } from '@shared/lib/dateUtils'
import { cn } from '@/shared/lib/utils'
import type { Venue } from '../model/types'

interface VenueCardProps {
  venue: Venue
  index: number
  className?: string
}

export function VenueCard({ venue, className, index = 0 }: VenueCardProps) {
  const amenities = (venue.characteristics ?? []).map((c) => ({ key: c.id, label: c.name }))

  return (
    <Link
      to={`/venues/${venue.id}`}
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
        {venue.imageUrls[0] ? (
          <img
            src={venue.imageUrls[0]}
            alt={venue.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="from-navy-2 to-navy-dark flex h-full w-full items-center justify-center bg-linear-to-br">
            <Building2 className="text-primary/8 h-16 w-16" strokeWidth={1} />
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

        <div className="absolute top-3 flex w-full items-center justify-between px-4">
          {/* Capacity — top left stat */}
          <div className="flex items-baseline gap-1 rounded-lg border border-white/10 bg-[rgba(8,15,25,0.55)] px-2.5 py-1.5 backdrop-blur-sm">
            <span
              className="text-cream/90 text-lg leading-none font-bold"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {venue.capacity.toLocaleString()}
            </span>
            <span className="text-cream/45 text-[10px]">o'rin</span>
          </div>

          {/* Rating — top right */}
          {venue.ratingStats && venue.ratingStats.count > 0 ? (
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[rgba(8,15,25,0.55)] px-2 py-1.5 backdrop-blur-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />

              <span className="text-cream/80 text-xs font-medium">
                {venue.ratingStats.avg.toFixed(1)}
              </span>

              <span className="text-cream/40 text-[10px]">({venue.ratingStats.count})</span>
            </div>
          ) : null}
        </div>

        {/* Name bleeds over image bottom */}
        <div className="absolute right-0 bottom-0 left-0 px-4 pb-3.5">
          <h3 className="text-cream/95 group-hover:text-primary-light line-clamp-1 font-serif text-[20px] leading-[1.22] font-bold transition-colors duration-200">
            {venue.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="flex flex-col gap-2.5 px-4 py-3">
        {/* Location */}
        <div className="text-cream/40 flex items-center gap-1.5 text-xs">
          <MapPin className="text-primary/40 group-hover:text-primary h-3 w-3 shrink-0 transition-colors duration-200" />

          <span className="group-hover:text-primary truncate transition-colors duration-200">
            {venue.city}, {venue.address}
          </span>
        </div>

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {amenities.map(({ key, label }) => (
              <span
                key={key}
                className="text-cream/45 inline-flex items-center rounded-full border border-white/8 bg-white/4 px-2 py-[3px] text-[10px] tracking-wide"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
          <div>
            <p className="text-cream/25 mb-0.5 text-[9px] tracking-widest uppercase">Kunlik narx</p>

            <span className="text-primary text-[14px] leading-none font-semibold">
              {formatUZS(venue.pricePerDay)}
              <span className="text-primary/55 text-[11px] font-normal">/kun</span>
            </span>
          </div>

          <span className="text-primary/70 group-hover:text-primary flex items-center gap-1 text-[12px] font-medium transition-colors duration-200">
            Batafsil
            <ArrowRight className="h-3 w-3 transition-all duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
