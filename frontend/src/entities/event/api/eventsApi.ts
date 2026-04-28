import { apiClient } from '@shared/api/client'
import type { PaginatedResponse } from '@shared/types'
import type { Event } from '../model/types'
import type { User } from '../../user/model/types'
import type { EventService } from '../../service/model/types'
import type { VolunteerApplication } from '../../volunteer/model/types'

export interface CreateEventDto {
  title: string
  description?: string
  bannerUrls?: string[]
  startDate: string
  endDate: string
  eventType: string
  capacity: number
  squareId?: string   // was venueId — backend field is squareId
  ticketTiers?: { name: string; price: number; quantity: number }[]
}

export type UpdateEventDto = Partial<Omit<CreateEventDto, 'ticketTiers'>>

export interface QueryEventsDto {
  page?: number
  limit?: number
  city?: string
  categoryId?: string
  eventType?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  title?: string
}

export const eventsApi = {
  list: async (params?: QueryEventsDto): Promise<PaginatedResponse<Event>> => {
    const { data } = await apiClient.get('/events', { params })
    return { data: data.data, meta: data.meta }
  },
  myList: async (params?: Omit<QueryEventsDto, 'organizerId'>): Promise<PaginatedResponse<Event>> => {
    const { data } = await apiClient.get('/events/my', { params })
    return { data: data.data, meta: data.meta }
  },
  get: async (id: string): Promise<Event> => {
    const { data } = await apiClient.get(`/events/${id}`)
    return data.data
  },
  create: async (dto: CreateEventDto): Promise<Event> => {
    const { data } = await apiClient.post('/events', dto)
    return data.data
  },
  update: async (id: string, dto: UpdateEventDto): Promise<Event> => {
    const { data } = await apiClient.patch(`/events/${id}`, dto)
    return data.data
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`)
  },
  publish: async (id: string): Promise<Event> => {
    const { data } = await apiClient.patch(`/events/${id}/publish`)
    return data.data
  },
  participants: async (id: string): Promise<User[]> => {
    const { data } = await apiClient.get(`/events/${id}/participants`)
    return data.data.map((t: { user: User; createdAt: string }) => ({
      ...t.user,
      createdAt: t.createdAt,
    }))
  },
  services: async (id: string): Promise<EventService[]> => {
    const { data } = await apiClient.get(`/events/${id}/services`)
    return data.data
  },
  attachService: async (eventId: string, dto: { serviceId: string; agreedPrice: number }): Promise<EventService> => {
    const { data } = await apiClient.post(`/events/${eventId}/services`, dto)
    return data.data
  },
  updateEventService: async (eventId: string, eventServiceId: string, status: string): Promise<EventService> => {
    const { data } = await apiClient.patch(`/events/${eventId}/services/${eventServiceId}`, { status })
    return data.data
  },
  removeEventService: async (eventId: string, eventServiceId: string): Promise<void> => {
    await apiClient.delete(`/events/${eventId}/services/${eventServiceId}`)
  },
  volunteers: async (id: string): Promise<VolunteerApplication[]> => {
    const { data } = await apiClient.get(`/events/${id}/volunteers`)
    return data.data
  },
  updateVolunteer: async (
    eventId: string,
    applicationId: string,
    status: 'ACCEPTED' | 'REJECTED',
  ): Promise<VolunteerApplication> => {
    const { data } = await apiClient.patch(`/events/${eventId}/volunteers/${applicationId}`, { status })
    return data.data
  },
}
