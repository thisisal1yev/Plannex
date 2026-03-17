import { Link } from 'react-router'
import { formatDateShort } from '@shared/lib/dateUtils'
import type { Event } from '../model/types'

interface EventCardProps {
  event: Event
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT:     'Qoralama',
  PUBLISHED: "E'lonlangan",
  CANCELLED: 'Bekor qilingan',
  COMPLETED: 'Yakunlangan',
}

const STATUS_DOT: Record<string, string> = {
  DRAFT:     '#9CA3AF',
  PUBLISHED: '#34D399',
  CANCELLED: '#F87171',
  COMPLETED: '#818CF8',
}

export function EventCard({ event }: EventCardProps) {
  const start = formatDateShort(event.startDate)
  const dot   = STATUS_DOT[event.status]  ?? '#9CA3AF'
  const label = STATUS_LABEL[event.status] ?? event.status

  return (
    <Link
      to={`/events/${event.id}`}
      className="group flex flex-col rounded-[14px] overflow-hidden border border-white/7 bg-white/3 no-underline backdrop-blur-xs transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:-translate-y-[5px] hover:border-gold/28 hover:shadow-[0_20px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,150,58,0.12)]"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 shrink-0">
        {event.bannerUrl ? (
          <>
            <img
              src={event.bannerUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,15,25,0.75)_0%,transparent_55%)] pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full bg-gold/6 flex items-center justify-center">
            <svg className="w-11 h-11 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {event.eventType && (
          <div className="absolute bottom-2.5 left-3 text-[11px] text-cream/75 bg-[rgba(8,15,25,0.65)] backdrop-blur-sm px-[9px] py-[3px] rounded-full border border-cream/12">
            {event.eventType}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 flex flex-col gap-2.5 flex-1">
        {/* Title + badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-cream/92 leading-[1.35] line-clamp-2 transition-colors duration-200 group-hover:text-gold-light">
            {event.title}
          </h3>
          <span
            className="inline-flex items-center gap-[5px] text-[11px] font-medium py-[3px] px-[9px] rounded-full border border-current opacity-85 shrink-0"
            style={{ color: dot }}
          >
            <span className="w-[5px] h-[5px] rounded-full shrink-0 inline-block" style={{ background: dot }} />
            {label}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-[13px] text-cream/45">
          <svg className="w-[13px] h-[13px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {start}
        </div>

        {/* Venue */}
        {event.venue && (
          <div className="flex items-center gap-1.5 text-[13px] text-cream/38">
            <svg className="w-[13px] h-[13px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {event.venue.city}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-t-white/5">
          <span className="text-[11px] text-cream/30">
            {event.capacity} o'rin
          </span>
          <span className="text-[11px] text-gold flex items-center gap-1 font-medium">
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
