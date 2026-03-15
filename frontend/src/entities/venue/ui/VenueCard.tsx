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
      className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      {venue.imageUrls[0] ? (
        <img src={venue.imageUrls[0]} alt={venue.name} className="h-44 w-full object-cover" />
      ) : (
        <div className="h-44 w-full bg-emerald-500/10 flex items-center justify-center">
          <svg className="h-12 w-12 text-emerald-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{venue.name}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {venue.city}, {venue.address}
        </p>
        <div className="flex items-center gap-1">
          <StarRating rating={venue.rating} />
          <span className="text-xs text-muted-foreground/70">{venue.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm text-muted-foreground">{venue.capacity} o'rin</span>
          <span className="font-semibold text-primary">{formatUZS(venue.pricePerDay)}/kun</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {venue.hasWifi && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">WiFi</span>}
          {venue.hasParking && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Parkovka</span>}
          {venue.hasSound && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Ovoz</span>}
          {venue.hasStage && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Sahna</span>}
          {venue.isIndoor && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Yopiq</span>}
        </div>
      </div>
    </Link>
  )
}
