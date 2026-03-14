import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/utils'

export type BadgeColor = 'indigo' | 'green' | 'red' | 'yellow' | 'gray' | 'blue'

interface BadgeProps {
  children: ReactNode
  color?: BadgeColor
}

const colors = {
  indigo: 'bg-indigo-100 text-indigo-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  gray: 'bg-gray-100 text-gray-600',
  blue: 'bg-blue-100 text-blue-700',
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colors[color])}>
      {children}
    </span>
  )
}
