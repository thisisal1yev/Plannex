import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Button as ShadcnButton } from '@/shared/ui/primitives/button'
import { cn } from '@/shared/lib/utils'

const variantMap = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive',
  ghost: 'ghost',
  outline: 'outline',
} as const

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantMap
  size?: keyof typeof sizeMap
  loading?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      variant={variantMap[variant]}
      size={sizeMap[size]}
      disabled={disabled ?? loading}
      className={cn(className)}
      {...props}
    >
      {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  )
}
