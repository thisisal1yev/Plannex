import { Link } from 'react-router'
import { StarRating } from '@shared/ui/StarRating'
import { formatUZS } from '@shared/lib/dateUtils'
import type { Venue } from '../model/types'

interface VenueCardProps {
  venue: Venue
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className="group flex flex-col rounded-[14px] overflow-hidden border border-white/7 bg-white/3 no-underline backdrop-blur-xs transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-[5px] hover:border-gold/28 hover:shadow-[0_20px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,150,58,0.12)]"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 shrink-0">
        {venue.imageUrls[0] ? (
          <>
            <img
              src={venue.imageUrls[0]}
              alt={venue.name}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,15,25,0.75)_0%,transparent_55%)] pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full bg-gold/6 flex items-center justify-center">
            <svg className="w-11 h-11 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}

        <div className="absolute bottom-2.5 left-3 text-[11px] text-cream/75 bg-[rgba(8,15,25,0.65)] backdrop-blur-sm px-[9px] py-[3px] rounded-full border border-cream/12">
          {venue.capacity} o'rin
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 flex flex-col gap-2.5 flex-1">
        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-cream/92 leading-[1.35] line-clamp-1 transition-colors duration-200 group-hover:text-gold-light">
            {venue.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <StarRating rating={venue.rating} />
            <span className="text-[11px] text-cream/45">{venue.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[13px] text-cream/38">
          <svg className="w-[13px] h-[13px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {venue.city}, {venue.address}
        </div>

        {/* Amenity tags */}
        {(venue.hasWifi || venue.hasParking || venue.hasSound || venue.hasStage || venue.isIndoor) && (
          <div className="flex gap-[5px] flex-wrap">
            {venue.hasWifi    && <span className="inline-flex items-center text-[11px] py-[3px] px-2 rounded-full bg-white/5 border border-white/9 text-cream/50">WiFi</span>}
            {venue.hasParking && <span className="inline-flex items-center text-[11px] py-[3px] px-2 rounded-full bg-white/5 border border-white/9 text-cream/50">Parkovka</span>}
            {venue.hasSound   && <span className="inline-flex items-center text-[11px] py-[3px] px-2 rounded-full bg-white/5 border border-white/9 text-cream/50">Ovoz</span>}
            {venue.hasStage   && <span className="inline-flex items-center text-[11px] py-[3px] px-2 rounded-full bg-white/5 border border-white/9 text-cream/50">Sahna</span>}
            {venue.isIndoor   && <span className="inline-flex items-center text-[11px] py-[3px] px-2 rounded-full bg-white/5 border border-white/9 text-cream/50">Yopiq</span>}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-t-white/5">
          <span className="text-[13px] text-gold font-semibold">
            {formatUZS(venue.pricePerDay)}<span className="text-[11px] font-normal text-gold/70">/kun</span>
          </span>
          <span className="text-[13px] text-gold flex items-center gap-1 font-medium">
            Batafsil
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
