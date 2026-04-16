import { apiClient } from '@shared/api/client'
import type { PaginatedResponse } from '@shared/types'
import type { Review } from '../model/types'

export interface CreateReviewDto {
  eventId?: string
  squareId?: string   // was venueId — backend field is squareId
  serviceId?: string
  rating: number
  comment?: string
}

export interface QueryReviewsDto {
  page?: number
  limit?: number
  minRating?: number
}

export const reviewsApi = {
  create: async (dto: CreateReviewDto): Promise<Review> => {
    const { data } = await apiClient.post('/reviews', dto)
    return data.data
  },
  forVenue: async (squareId: string, params?: QueryReviewsDto): Promise<PaginatedResponse<Review>> => {
    const { data } = await apiClient.get(`/squares/${squareId}/reviews`, { params })
    return { data: data.data, meta: data.meta }
  },
  forService: async (serviceId: string, params?: QueryReviewsDto): Promise<PaginatedResponse<Review>> => {
    const { data } = await apiClient.get(`/services/${serviceId}/reviews`, { params })
    return { data: data.data, meta: data.meta }
  },
  forEvent: async (eventId: string, params?: QueryReviewsDto): Promise<PaginatedResponse<Review>> => {
    const { data } = await apiClient.get(`/events/${eventId}/reviews`, { params })
    return { data: data.data, meta: data.meta }
  },
}
