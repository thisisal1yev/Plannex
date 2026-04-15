import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { venuesApi } from '@entities/venue'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { StarRating } from '@shared/ui/StarRating'
import { venueKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

export function MyVenuesPage() {
  const { data, isLoading } = useQuery({
    queryKey: venueKeys.myList(),
    queryFn: () => venuesApi.list({ limit: 50 }),
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mening maydonlarim</h1>
        <Link to="/my-venues/create"><Button>+ Qo'shish</Button></Link>
      </div>

      {data?.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">Sizda hozircha maydonlar yo'q</p>
          <Link to="/my-venues/create"><Button>Maydon qo'shish</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.data.map((venue) => (
          <div key={venue.id} className="bg-card rounded-xl p-4 flex flex-col gap-3">
            <div>
              <h3 className="font-semibold">{venue.name}</h3>
              <p className="text-sm text-gray-500">{venue.city}, {venue.address}</p>
              <div className="flex items-center gap-1 mt-1">
                <StarRating rating={venue.ratingStats?.avg ?? 0} />
                <span className="text-xs text-gray-400">{parseFloat((venue.ratingStats?.avg ?? 0).toFixed(1))}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">{formatUZS(venue.pricePerDay)}/kun</span>
              <Link to={`/my-venues/${venue.id}/edit`}>
                <Button variant="secondary" size="sm">Tahrirlash</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
