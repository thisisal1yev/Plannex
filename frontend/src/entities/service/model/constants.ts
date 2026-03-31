import type { BadgeColor } from '@shared/ui/Badge'
import type { BookingStatus, ServiceCategory } from '@shared/types'

export const SERVICE_CATEGORIES: { value: ServiceCategory; label: string; icon: string }[] = [
  { value: 'CATERING',   label: 'Katering',   icon: '🍽' },
  { value: 'DECORATION', label: 'Bezak',       icon: '✦'  },
  { value: 'SOUND',      label: 'Ovoz',        icon: '♪'  },
  { value: 'PHOTO',      label: 'Foto',        icon: '◉'  },
  { value: 'SECURITY',   label: 'Xavfsizlik',  icon: '◈'  },
]

export const SERVICE_CATEGORY_COLOR: Record<string, BadgeColor> = {
  CATERING: 'green',
  DECORATION: 'indigo',
  SOUND: 'blue',
  PHOTO: 'yellow',
  SECURITY: 'gray',
}

export const SERVICE_CATEGORY_LABEL: Record<string, string> = {
  CATERING: 'Кейтеринг',
  DECORATION: 'Декор',
  SOUND: 'Звук',
  PHOTO: 'Фото',
  SECURITY: 'Охрана',
}

export const BOOKING_STATUS_COLOR: Record<BookingStatus, BadgeColor> = {
  CONFIRMED: 'green',
  CANCELLED: 'red',
  PENDING: 'yellow',
}
