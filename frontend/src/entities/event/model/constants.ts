import type { BadgeColor } from '@shared/ui/Badge'

export const EVENT_STATUS_COLOR: Record<string, BadgeColor> = {
  DRAFT:     'gray',
  PUBLISHED: 'green',
  CANCELLED: 'red',
  COMPLETED: 'indigo',
}

export const EVENT_STATUS_LABEL: Record<string, string> = {
  DRAFT:     'Qoralama',
  PUBLISHED: 'Nashr',
  CANCELLED: 'Bekor',
  COMPLETED: 'Tugallandi',
}

export const EVENT_TYPES = [
  'Konsert', 'Konferensiya', "Ko'rgazma", 'Trening', 'Sport', 'Festival', 'Ziyofat', 'Boshqa',
]
