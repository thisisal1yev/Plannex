import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { servicesApi } from '@entities/service'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { serviceKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

const categoryLabel: Record<string, string> = {
  CATERING: 'Katering', DECORATION: 'Bezak', SOUND: 'Ovoz', PHOTO: 'Foto', SECURITY: 'Xavfsizlik',
}
const categoryColor: Record<string, 'green' | 'indigo' | 'blue' | 'yellow' | 'gray'> = {
  CATERING: 'green', DECORATION: 'indigo', SOUND: 'blue', PHOTO: 'yellow', SECURITY: 'gray',
}

export function MyServicesPage() {
  const { data, isLoading } = useQuery({
    queryKey: serviceKeys.myList(),
    queryFn: () => servicesApi.list({ limit: 50 }),
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mening xizmatlarim</h1>
        <Link to="/my-services/create"><Button>+ Qo'shish</Button></Link>
      </div>

      {data?.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">Sizda hozircha xizmatlar yo'q</p>
          <Link to="/my-services/create"><Button>Xizmat qo'shish</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.data.map((service) => (
          <div key={service.id} className="bg-card rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.city}</p>
              </div>
              <Badge color={categoryColor[service.category?.name ?? '']}>{categoryLabel[service.category?.name ?? '']}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-primary">{formatUZS(service.priceFrom)} dan</span>
              <Link to={`/my-services/${service.id}/edit`}>
                <Button variant="secondary" size="sm">Tahrirlash</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
