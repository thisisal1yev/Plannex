import { apiClient } from '@shared/api/client'
import type { VolunteerApplication } from '../model/types'

export const volunteersApi = {
  apply: async (eventId: string, skillId: string): Promise<VolunteerApplication> => {
    const { data } = await apiClient.post(`/events/${eventId}/volunteers/apply`, { skillId })
    return data.data
  },
  myApplications: async (): Promise<VolunteerApplication[]> => {
    const { data } = await apiClient.get('/volunteers/my')
    return data.data
  },
}
