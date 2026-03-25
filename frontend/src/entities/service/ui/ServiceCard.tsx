import { Link } from 'react-router'
import { StarRating } from '@shared/ui/StarRating'
import { formatUZS } from '@shared/lib/dateUtils'
import type { Service } from '../model/types'

interface ServiceCardProps {
  service: Service
  index?: number
}

const CATEGORY_LABEL: Record<string, string> = {
  CATERING: 'Katering',
  DECORATION: 'Bezak',
  SOUND: 'Ovoz',
  PHOTO: 'Foto',
  SECURITY: 'Xavfsizlik',
}

const CATEGORY_ICON: Record<string, string> = {
  CATERING: '🍽',
  DECORATION: '✦',
  SOUND: '♪',
  PHOTO: '◉',
  SECURITY: '◈',
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const fadeDelay = `svc-d${(index % 12) + 1}`

  return (
    <Link
      to={`/services/${service.id}`}
      className={`svc-card svc-fade ${fadeDelay} group flex flex-col bg-card rounded-2xl border border-border overflow-hidden`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {service.imageUrls[0] ? (
          <img
            src={service.imageUrls[0]}
            alt={service.name}
            className="h-full w-full object-cover group-hover:scale-[1.05] transition-transform duration-500"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-navy-3 to-navy-2 flex items-center justify-center">
            <svg className="h-14 w-14 text-gold/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
        <span className="absolute top-3 right-3 text-[11px] font-medium tracking-wide px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-gold-light border border-gold/20 leading-none flex items-center gap-1">
          <span className="text-[10px]">{CATEGORY_ICON[service.category]}</span>
          {CATEGORY_LABEL[service.category]}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="lp-serif text-[1.1rem] font-semibold leading-snug text-foreground group-hover:text-gold transition-colors duration-200 line-clamp-2">
          {service.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg className="h-3 w-3 shrink-0 text-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {service.city}
        </div>

        <div className="flex items-center gap-1.5">
          <StarRating rating={service.rating} />
          <span className="text-xs text-muted-foreground/70">{service.rating.toFixed(1)}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Narxdan boshlab</p>
            <p className="text-gold font-semibold text-sm leading-none">{formatUZS(service.priceFrom)}</p>
          </div>
          <span className="text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium">
            Ko'rish →
          </span>
        </div>
      </div>
    </Link>
  )
}
