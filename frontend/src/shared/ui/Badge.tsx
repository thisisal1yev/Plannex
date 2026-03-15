import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export type BadgeColor = 'indigo' | 'green' | 'red' | 'yellow' | 'gray' | 'blue'

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
}

const colors = {
  indigo: 'bg-primary/10 text-primary',
  green: 'bg-green-500/15 text-green-600 dark:text-green-400',
  red: 'bg-destructive/10 text-destructive',
  yellow: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  gray: 'bg-muted text-muted-foreground',
  blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors[color])}>
      {children}
    </span>
  )
}
