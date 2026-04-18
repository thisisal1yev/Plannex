import type { ReactNode } from 'react'
import type { Role } from '@shared/types'
import { Navigate } from 'react-router'
import { useAuthStore } from '@shared/model/auth.store'

interface Props {
  children: ReactNode
}

export function RequireAuth({ children }: Props) {
  const isAuth = !!useAuthStore((s) => s.accessToken)
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />
}

export function RequireRole({ role, children }: Props & { role: Role | Role[] }) {
  const user = useAuthStore((s) => s.user)
  const roles = Array.isArray(role) ? role : [role]
  return user && roles.includes(user.role) ? <>{children}</> : <Navigate to="/" replace />
}

export function GuestOnly({ children }: Props) {
  const isAuth = !!useAuthStore((s) => s.accessToken)
  return isAuth ? <Navigate to="/events" replace /> : <>{children}</>
}
