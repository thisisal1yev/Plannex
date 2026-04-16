import { apiClient } from '@shared/api/client'
import type { PaginatedResponse } from '@shared/types'
import type { Venue, VenueBooking } from '../model/types'

export interface CreateVenueDto {
  categoryId: string  // UUID of SquareCategory (required by backend)
  name: string
  description?: string
  address: string
  city: string
  latitude?: number
  longitude?: number
  capacity: number
  pricePerDay: number
  isIndoor?: boolean
  hasWifi?: boolean
  hasParking?: boolean
  hasSound?: boolean
  hasStage?: boolean
  imageUrls?: string[]
}

export type UpdateVenueDto = Partial<CreateVenueDto>

export interface QueryVenuesDto {
  page?: number
  limit?: number
  city?: string
  minCapacity?: number
  maxPrice?: number
  isIndoor?: boolean
  hasParking?: boolean
  hasWifi?: boolean
}

export const venuesApi = {
  list: async (params?: QueryVenuesDto): Promise<PaginatedResponse<Venue>> => {
    const { data } = await apiClient.get('/venues', { params })
    return { data: data.data, meta: data.meta }
  },
  get: async (id: string): Promise<Venue> => {
    const { data } = await apiClient.get(`/venues/${id}`)
    return data.data
  },
  create: async (dto: CreateVenueDto): Promise<Venue> => {
    const { data } = await apiClient.post('/venues', dto)
    return data.data
  },
  update: async (id: string, dto: UpdateVenueDto): Promise<Venue> => {
    const { data } = await apiClient.patch(`/venues/${id}`, dto)
    return data.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/venues/${id}`)
  },
  book: async (id: string, dto: { eventId: string; startDate: string; endDate: string }): Promise<VenueBooking> => {
    const { data } = await apiClient.post(`/venues/${id}/book`, dto)
    return data.data
  },
  checkAvailability: async (
    id: string,
    startDate: string,
    endDate: string,
  ): Promise<{ available: boolean; conflicts: VenueBooking[] }> => {
    const { data } = await apiClient.get(`/venues/${id}/availability`, { params: { startDate, endDate } })
    return data.data
  },
}
