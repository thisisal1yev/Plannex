import { apiClient } from '@shared/api/client'
import type { Role } from '@shared/types'
import type { PaginatedResponse, TokenPair } from '@shared/types'
import type { User } from '../model/types'

export interface RegisterDto {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: 'ORGANIZER' | 'PARTICIPANT'
}

export interface LoginDto {
  email: string
  password: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  phone?: string
  role?: Role
}

export type SwitchRoleDto = Pick<UpdateUserDto, 'role'>

export interface QueryUsersDto {
  page?: number
  limit?: number
  search?: string
}

export const authApi = {
  register: async (dto: RegisterDto): Promise<TokenPair> => {
    const { data } = await apiClient.post('/auth/register', dto)
    return data.data
  },
  login: async (dto: LoginDto): Promise<TokenPair> => {
    const { data } = await apiClient.post('/auth/login', dto)
    return data.data
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },
}

export const usersApi = {
  me: async (): Promise<User> => {
    const { data } = await apiClient.get('/users/me')
    return data.data
  },
  updateMe: async (dto: UpdateUserDto): Promise<User> => {
    const { data } = await apiClient.patch('/users/me', dto)
    return data.data
  },
  switchRole: async (role: Role): Promise<User> => {
    const { data } = await apiClient.patch('/users/me', { activeRole: role })
    return data.data
  },
  list: async (params?: QueryUsersDto): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get('/users', { params })
    return { data: data.data, meta: data.meta }
  },
  get: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`/users/${id}`)
    return data.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },
}
