import { apiClient } from '@shared/api/client'
import type { PaginatedResponse } from '@shared/types'
import type { Service } from '../model/types'

export interface CreateServiceDto {
  name: string
  categoryId: string   // UUID of ServiceCategory (was: category: ServiceCategory enum)
  description?: string
  priceFrom: number
  city: string
  imageUrls?: string[]
}

export interface UpdateServiceDto {
  name?: string
  categoryId?: string
  description?: string
  priceFrom?: number
  city?: string
}

export interface QueryServicesDto {
  page?: number
  limit?: number
  vendorId?: string    // filter by vendor
  category?: string    // text search on category name (e.g. 'Katering')
  city?: string
  maxPrice?: number
}

export const servicesApi = {
  list: async (params?: QueryServicesDto): Promise<PaginatedResponse<Service>> => {
    const { data } = await apiClient.get('/services', { params })
    return { data: data.data, meta: data.meta }
  },
  get: async (id: string): Promise<Service> => {
    const { data } = await apiClient.get(`/services/${id}`)
    return data.data
  },
  create: async (dto: CreateServiceDto): Promise<Service> => {
    const { data } = await apiClient.post('/services', dto)
    return data.data
  },
  update: async (id: string, dto: UpdateServiceDto): Promise<Service> => {
    const { data } = await apiClient.patch(`/services/${id}`, dto)
    return data.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`)
  },
}
