import { Link } from 'react-router'
import { Badge } from '@shared/ui/Badge'
import { EVENT_STATUS_COLOR } from '../model/constants'
import { formatDateShort } from '@shared/lib/dateUtils'
import type { Event } from '../model/types'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const start = formatDateShort(event.startDate)

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      {event.bannerUrl ? (
        <img src={event.bannerUrl} alt={event.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="h-44 w-full bg-primary/10 flex items-center justify-center">
          <svg className="h-12 w-12 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {event.title}
          </h3>
          <Badge color={EVENT_STATUS_COLOR[event.status]}>{event.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{start}</p>
        {event.venue && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {event.venue.city}
          </p>
        )}
        <p className="text-xs text-muted-foreground/70 mt-auto">{event.eventType} · {event.capacity} o'rin</p>
      </div>
    </Link>
  )
}
