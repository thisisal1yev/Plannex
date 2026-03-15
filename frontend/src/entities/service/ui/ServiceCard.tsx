import { Link } from 'react-router'
import { Badge } from '@shared/ui/Badge'
import { StarRating } from '@shared/ui/StarRating'
import { formatUZS } from '@shared/lib/dateUtils'
import type { Service } from '../model/types'

interface ServiceCardProps {
  service: Service
}

const categoryColor: Record<string, 'indigo' | 'green' | 'yellow' | 'blue' | 'gray'> = {
  CATERING: 'green',
  DECORATION: 'indigo',
  SOUND: 'blue',
  PHOTO: 'yellow',
  SECURITY: 'gray',
}

const categoryLabel: Record<string, string> = {
  CATERING: 'Кейтеринг',
  DECORATION: 'Декор',
  SOUND: 'Звук',
  PHOTO: 'Фото',
  SECURITY: 'Охрана',
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      to={`/services/${service.id}`}
      className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
    >
      {service.imageUrls[0] ? (
        <img src={service.imageUrls[0]} alt={service.name} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-purple-500/10 flex items-center justify-center">
          <svg className="h-10 w-10 text-purple-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{service.name}</h3>
          <Badge color={categoryColor[service.category]}>{categoryLabel[service.category]}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{service.city}</p>
        <div className="flex items-center gap-1">
          <StarRating rating={service.rating} />
          <span className="text-xs text-muted-foreground/70">{service.rating.toFixed(1)}</span>
        </div>
        <p className="font-semibold text-primary mt-auto">от {formatUZS(service.priceFrom)}</p>
      </div>
    </Link>
  )
}
