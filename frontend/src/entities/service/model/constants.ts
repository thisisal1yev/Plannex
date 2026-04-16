import type { BadgeColor } from '@shared/ui/Badge'
import type { BookingStatus } from '@shared/types'

// Local type for display purposes only — no longer a backend enum
type ServiceCategoryKey = 'CATERING' | 'DECORATION' | 'SOUND' | 'PHOTO' | 'SECURITY'

// label values match backend DB category names for use as filter values
export const SERVICE_CATEGORIES: { value: ServiceCategoryKey; label: string; icon: string }[] = [
  { value: 'CATERING',   label: 'Katering',        icon: '🍽' },
  { value: 'DECORATION', label: 'Dekor',            icon: '✦'  },
  { value: 'SOUND',      label: 'Ovoz va yoruglik', icon: '♪'  },
  { value: 'PHOTO',      label: 'Foto va video',    icon: '◉'  },
  { value: 'SECURITY',   label: 'Xavfsizlik',       icon: '◈'  },
]

export const SERVICE_CATEGORY_COLOR: Record<string, BadgeColor> = {
  CATERING: 'green',
  DECORATION: 'indigo',
  SOUND: 'blue',
  PHOTO: 'yellow',
  SECURITY: 'gray',
}

export const SERVICE_CATEGORY_LABEL: Record<string, string> = {
  CATERING: 'Katering',
  DECORATION: 'Dekor',
  SOUND: 'Ovoz va yoruglik',
  PHOTO: 'Foto va video',
  SECURITY: 'Xavfsizlik',
}

export const BOOKING_STATUS_COLOR: Record<BookingStatus, BadgeColor> = {
  CONFIRMED: 'green',
  CANCELLED: 'red',
  PENDING: 'yellow',
}
