import { memo } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import { formatDateShort, formatUZS } from '@shared/lib/dateUtils'
import { cn } from '@shared/lib/utils'
import type { Ticket } from '../model/types'

interface TicketCardProps {
  ticket: Ticket
  index?: number
  className?: string
}

const STATUS_COLOR = {
  used: '#9CA3AF',
  active: '#34D399',
}

const shimmerStyle = {
  background: 'linear-gradient(90deg, transparent 0%, #4c8ca7 40%, #7ab8cc 60%, transparent 100%)',
} as const

const overlayStyle = {
  background: 'linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.45) 45%, transparent 75%)',
} as const

export const TicketCard = memo(function TicketCard({ ticket, index = 0, className }: TicketCardProps) {
  const banner = ticket.event?.bannerUrls?.[0]
  const title = ticket.event?.title ?? 'Tadbir'
  const start = ticket.event?.startDate ? formatDateShort(ticket.event.startDate) : null
  const dot = ticket.isUsed ? STATUS_COLOR.used : STATUS_COLOR.active
  const statusLabel = ticket.isUsed ? 'Ishlatilgan' : 'Amal qiladi'

  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className={cn(
        'group bg-card hover:border-primary/30! relative flex animate-[svc-in_0.45s_ease-out_both] flex-col overflow-hidden rounded-2xl border border-white/8 transition-all duration-280 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-y-[-5px] hover:shadow-[0_14px_40px_rgba(0,0,0,0.14),0_0_0_1px_rgba(76,140,167,0.28)]',
        className
      )}
      style={{ animationDelay: `${(index % 12) * 0.04}s` }}
    >
      {/* Animated shimmer rule */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-0.5 origin-center scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
        style={shimmerStyle}
      />

      {/* ── Image ── */}
      <div className="relative h-52 shrink-0 overflow-hidden">
        {banner ? (
          <img
            src={banner}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="from-navy-2 to-navy-dark flex h-full w-full items-center justify-center bg-linear-to-br">
            <span className="text-primary/8 font-serif text-[90px] leading-none font-bold select-none">
              {title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Cinematic gradient */}
        <div className="pointer-events-none absolute inset-0" style={overlayStyle} />

        <div className="absolute top-3 flex w-full items-center justify-between px-4">
          {/* Tier name — top left */}
          {ticket.tier?.name && (
            <div className="flex items-baseline gap-1 rounded-lg border border-white/10 bg-[rgba(8,15,25,0.55)] px-2.5 py-1.5 backdrop-blur-sm">
              <span className="text-cream/90 text-xs leading-none font-semibold">
                {ticket.tier.name}
              </span>
            </div>
          )}

          {/* Status badge — top right */}
          <div
            className="ml-auto inline-flex items-center gap-[5px] rounded-full border px-[9px] py-[3px] text-[10px] font-medium backdrop-blur-sm"
            style={{
              color: dot,
              borderColor: `${dot}33`,
              background: 'rgba(8,15,25,0.55)',
            }}
          >
            <span
              className="inline-block h-[5px] w-[5px] shrink-0 rounded-full"
              style={{ background: dot }}
            />
            {statusLabel}
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 px-4 pb-3.5">
          <h3 className="text-cream/95 group-hover:text-primary-light line-clamp-2 font-serif text-xl font-bold transition-colors duration-200">
            {title}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="flex flex-col gap-2 px-4 py-3">
        <div className="text-cream/40 flex items-center gap-1.5 text-xs">
          {start && (
            <>
              <Calendar className="text-primary/40 h-3 w-3 shrink-0" />
              <span className="group-hover:text-primary transition-colors duration-200">{start}</span>
            </>
          )}

          {ticket.event?.venue && (
            <>
              <span className="text-cream/15 mx-0.5">•</span>
              <MapPin className="text-primary/40 h-3 w-3 shrink-0" />
              <span className="group-hover:text-primary truncate transition-colors duration-200">
                {ticket.event.venue.city}
              </span>
            </>
          )}

          {ticket.tier?.price != null && (
            <>
              <span className="text-cream/15 mx-0.5">•</span>
              <span className="group-hover:text-primary transition-colors duration-200">
                {formatUZS(ticket.tier.price)}
              </span>
            </>
          )}
        </div>

        <div className="group-hover:border-t-primary-dark/30 flex items-center justify-between border-t border-white/5 pt-2 transition-colors duration-200">
          <span className="text-primary/70 group-hover:text-primary ml-auto flex items-center gap-1 text-xs font-medium transition-colors duration-200">
            Batafsil
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
})
