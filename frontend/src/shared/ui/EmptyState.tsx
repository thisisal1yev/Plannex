import type { ElementType } from 'react'
import { SlidersHorizontal } from 'lucide-react'

interface EmptyStateProps {
  icon?: ElementType
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon: Icon = SlidersHorizontal, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-gold/8 border border-gold/15 flex items-center justify-center">
        <Icon className="size-5 text-gold/50" />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-[12px] text-muted-foreground/50 mt-1">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="h-8 px-4 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-gold/30 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
