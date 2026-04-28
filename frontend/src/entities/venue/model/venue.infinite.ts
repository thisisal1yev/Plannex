import { useInfiniteQuery } from '@tanstack/react-query'
import { venuesApi, type QueryVenuesDto } from '../api/venuesApi'
import { venueKeys } from '@shared/api/queryKeys'

export function useInfiniteVenues(filters: Omit<QueryVenuesDto, 'page' | 'limit'> = {}) {
  return useInfiniteQuery({
    queryKey: venueKeys.list(filters),
    queryFn: ({ pageParam }) =>
      venuesApi.list({ ...filters, page: pageParam as number, limit: 12 }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  })
}
