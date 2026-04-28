import { useInfiniteQuery } from '@tanstack/react-query'
import { servicesApi, type QueryServicesDto } from '../api/servicesApi'
import { serviceKeys } from '@shared/api/queryKeys'

export function useInfiniteServices(filters: Omit<QueryServicesDto, 'page' | 'limit'> = {}) {
  return useInfiniteQuery({
    queryKey: serviceKeys.list(filters),
    queryFn: ({ pageParam }) =>
      servicesApi.list({ ...filters, page: pageParam as number, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  })
}
