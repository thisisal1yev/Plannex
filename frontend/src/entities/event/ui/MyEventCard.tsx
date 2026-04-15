import { Link } from 'react-router'
import { Calendar, MapPin, ArrowRight, Pencil, Users, Trash2, Send } from 'lucide-react'
import { formatDateShort } from '@shared/lib/dateUtils'
import { cn } from '@/shared/lib/utils'
import type { Event } from '../model/types'
import { EVENT_STATUS_COLOR, EVENT_STATUS_LABEL } from '../model/constants'

interface MyEventCardProps {
  event: Event
  index?: number
  onDelete: (id: string) => void
  isDeleting?: boolean
  className?: string
}

export function MyEventCard({ event, index = 0, onDelete, isDeleting = false, className }: MyEventCardProps) {
  const start = formatDateShort(event.startDate)
  const statusColor = EVENT_STATUS_COLOR[event.status] ?? 'gray'
  const statusLabel = EVENT_STATUS_LABEL[event.status] ?? event.status

  const fadeDelay = `svc-d${(index % 12) + 1}`

  return (
    <div
      className={cn(
        `svc-card svc-fade ${fadeDelay} group relative flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-card`,
        className
      )}
    >
      {/* Animated gold shimmer rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-10 pointer-events-none origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #4c8ca7 40%, #7ab8cc 60%, transparent 100%)',
        }}
      />

      {/* ── Image ── */}
      <div className="relative overflow-hidden h-52 shrink-0">
        {event.bannerUrl?.[0] ? (
          <img
            src={event.bannerUrl[0]}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-navy-2 to-navy-dark flex items-center justify-center">
            <span className="lp-serif text-[90px] font-bold leading-none select-none text-gold/8">
              {event.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Cinematic gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.45) 45%, transparent 75%)',
          }}
        />

        <div className="absolute top-3 px-4 flex items-center justify-between w-full">
          {/* Capacity */}
          <div
            className="flex items-baseline gap-1 backdrop-blur-sm bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2.5 py-1.5"
          >
            <span className="text-[18px] font-bold text-cream/90 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {event.capacity.toLocaleString()}
            </span>
            <span className="text-[10px] text-cream/45">o'rin</span>
          </div>

          {/* Status badge */}
          <div
            className="inline-flex items-center gap-[5px] text-[10px] font-medium py-[3px] px-[9px] rounded-full border backdrop-blur-sm"
            style={{
              color: statusColor,
              borderColor: `${statusColor}33`,
              background: 'rgba(8,15,25,0.55)',
            }}
          >
            <span className="w-[5px] h-[5px] rounded-full shrink-0 inline-block" style={{ background: statusColor }} />
            {statusLabel}
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 px-4">
          {event.eventType && (
            <div className="text-xs uppercase tracking-widest text-gold/60 font-medium">{event.eventType}</div>
          )}
          <div className="pb-3.5">
            <h3 className="lp-serif text-[20px] font-bold leading- line-clamp-2 text-cream/95 transition-colors duration-200 group-hover:text-gold-light">
              {event.title}
            </h3>
          </div>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Date & Location */}
        <div className="flex items-center gap-1.5 text-[12px] text-cream/40">
          <Calendar className="w-3 h-3 shrink-0 text-gold/40" />
          <span className="group-hover:text-gold transition-colors duration-200">{start}</span>

          {event.venue && (
            <>
              <span className="text-cream/15 mx-0.5 group-hover:text-gold transition-colors duration-200">•</span>
              <MapPin className="w-3 h-3 shrink-0 text-gold/40 group-hover:text-gold transition-colors duration-200" />
              <span className="truncate group-hover:text-gold transition-colors duration-200">{event.venue.city}</span>
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
          {event.status === 'DRAFT' && (
            <button
              className="inline-flex items-center gap-1.5 text-[11px] font-medium py-[5px] px-3 rounded-full
                bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              onClick={() => {
                // Publish action will be handled by parent
              }}
            >
              <Send className="w-3 h-3" />
              E'lon qilish
            </button>
          )}

          <Link
            to={`/my-events/${event.id}/edit`}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium py-[5px] px-3 rounded-full
              bg-white/5 border border-white/10 text-cream/70 hover:bg-white/10 hover:text-cream transition-colors"
          >
            <Pencil className="w-3 h-3" />
            Tahrirlash
          </Link>

          <Link
            to={`/my-events/${event.id}/participants`}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium py-[5px] px-3 rounded-full
              bg-white/5 border border-white/10 text-cream/70 hover:bg-white/10 hover:text-cream transition-colors"
          >
            <Users className="w-3 h-3" />
            Ishtirokchilar
          </Link>

          <button
            className="inline-flex items-center gap-1.5 text-[11px] font-medium py-[5px] px-3 rounded-full
              bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors ml-auto"
            disabled={isDeleting}
            onClick={() => onDelete(event.id)}
          >
            <Trash2 className="w-3 h-3" />
            {isDeleting ? 'O\'chirilmoqda...' : 'Bekor qilish'}
          </button>
        </div>

        {/* Footer link */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[11px] text-cream/30">ID: {event.id.slice(0, 8)}</span>
          <span className="text-[12px] text-gold/70 font-medium flex items-center gap-1 group-hover:text-gold transition-colors duration-200">
            Ko'rish
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </div>
  )
}
