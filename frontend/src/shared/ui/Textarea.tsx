import { forwardRef } from 'react'
import { Textarea as TextareaPrimitive } from '@/shared/ui/primitives/textarea'
import { cn } from '@/shared/lib/utils'

interface TextareaProps extends React.ComponentProps<typeof TextareaPrimitive> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <TextareaPrimitive ref={ref} className={cn('resize-none', className)} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
