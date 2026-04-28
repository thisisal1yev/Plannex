import { apiClient } from './client'

export interface Category {
  id: string
  name: string
}

export const categoriesApi = {
  listEventCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/event-categories')
    return data.data
  },
  listServiceCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/service-categories')
    return data.data
  },
}
