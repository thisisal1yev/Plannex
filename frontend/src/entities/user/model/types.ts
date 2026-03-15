import type { Role } from '@shared/types'

export interface User {
  id: string
  email: string
  phone?: string
  firstName: string
  lastName: string
  role: Role
  avatarUrl?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}
