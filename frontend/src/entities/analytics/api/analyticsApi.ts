import { apiClient } from '@shared/api/client'
import type { AdminStats, DashboardStats, EventStats, VendorDashboardStats } from '../model/types'

export const analyticsApi = {
  dashboard: async (): Promise<DashboardStats> => {
    const { data } = await apiClient.get('/analytics/dashboard')
    return data.data
  },
  eventStats: async (eventId: string): Promise<EventStats> => {
    const { data } = await apiClient.get(`/analytics/events/${eventId}`)
    return data.data
  },
  adminDashboard: async (): Promise<AdminStats> => {
    const { data } = await apiClient.get('/analytics/admin')
    return data.data
  },
  vendorDashboard: async (): Promise<VendorDashboardStats> => {
    const { data } = await apiClient.get('/analytics/vendor')
    return data.data
  },
}
