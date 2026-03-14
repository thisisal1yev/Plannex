import type { BadgeColor } from '@shared/ui/Badge'

export const EVENT_STATUS_COLOR: Record<string, BadgeColor> = {
  DRAFT: 'gray',
  PUBLISHED: 'green',
  CANCELLED: 'red',
  COMPLETED: 'indigo',
}
