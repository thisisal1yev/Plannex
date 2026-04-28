import { Link } from 'react-router'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { formatDateShort } from '@shared/lib/dateUtils'
import { cn } from '@/shared/lib/utils'
import type { Event } from '../model/types'
import { EVENT_STATUS_COLOR, EVENT_STATUS_LABEL } from '../model/constants'

interface MyEventCardProps {
  event: Event
  index?: number
  className?: string
}

export function MyEventCard({
  event,
  index = 0,
  className,
}: MyEventCardProps) {
  const start = formatDateShort(event.startDate)
  const statusColor = EVENT_STATUS_COLOR[event.status] ?? 'gray'
  const statusLabel = EVENT_STATUS_LABEL[event.status] ?? event.status

  return (
    <Link
      to={`/my-events/${event.id}`}
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
        {event.bannerUrls?.[0] ? (
          <img
            src={event.bannerUrls[0]}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="from-navy-2 to-navy-dark flex h-full w-full items-center justify-center bg-linear-to-br">
            <span className="text-primary/8 font-serif text-[90px] leading-none font-bold select-none">
              {event.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Cinematic gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.45) 45%, transparent 75%)',
          }}
        />

        <div className="absolute top-3 flex w-full items-center justify-between px-4">
          {/* Capacity */}
          <div className="flex items-baseline gap-1 rounded-lg border border-white/10 bg-[rgba(8,15,25,0.55)] px-2.5 py-1.5 backdrop-blur-sm">
            <span
              className="text-cream/90 text-[18px] leading-none font-bold"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {event.capacity.toLocaleString()}
            </span>
            <span className="text-cream/45 text-[10px]">o'rin</span>
          </div>

          {/* Status badge */}
          <div
            className="inline-flex items-center gap-[5px] rounded-full border px-[9px] py-[3px] text-[10px] font-medium backdrop-blur-sm"
            style={{
              color: statusColor,
              borderColor: `${statusColor}33`,
              background: 'rgba(8,15,25,0.55)',
            }}
          >
            <span
              className="inline-block h-[5px] w-[5px] shrink-0 rounded-full"
              style={{ background: statusColor }}
            />
            {statusLabel}
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 px-4">
          {event.eventType && (
            <div className="text-primary/60 text-xs font-medium tracking-widest uppercase">
              {event.eventType}
            </div>
          )}
          <div className="pb-3.5">
            <h3 className="leading- text-cream/95 group-hover:text-primary-light line-clamp-2 font-serif text-[20px] font-bold transition-colors duration-200">
              {event.title}
            </h3>
          </div>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {/* Date & Location */}
        <div className="text-cream/40 flex items-center gap-1.5 text-[12px]">
          <Calendar className="text-primary/40 h-3 w-3 shrink-0" />
          <span className="group-hover:text-primary transition-colors duration-200">{start}</span>

          {event.venue && (
            <>
              <span className="text-cream/15 group-hover:text-primary mx-0.5 transition-colors duration-200">
                •
              </span>
              <MapPin className="text-primary/40 group-hover:text-primary h-3 w-3 shrink-0 transition-colors duration-200" />
              <span className="group-hover:text-primary truncate transition-colors duration-200">
                {event.venue.city}
              </span>
            </>
          )}
        </div>

        {/* Footer link */}
        <div className="flex items-center justify-between border-t border-white/5 pt-1">
          <span className="text-cream/30 text-[11px]">ID: {event.id.slice(0, 8)}</span>
          <span className="text-primary/70 group-hover:text-primary flex items-center gap-1 text-[12px] font-medium transition-colors duration-200">
            Ko'rish
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
