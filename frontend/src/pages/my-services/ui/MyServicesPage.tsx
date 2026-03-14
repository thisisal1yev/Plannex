import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { servicesApi } from '@entities/service'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { serviceKeys } from '@shared/api/queryKeys'

const categoryLabel: Record<string, string> = {
  CATERING: 'Кейтеринг', DECORATION: 'Декор', SOUND: 'Звук', PHOTO: 'Фото', SECURITY: 'Охрана',
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
        <h1 className="text-2xl font-bold text-gray-900">Мои услуги</h1>
        <Link to="/my-services/create"><Button>+ Добавить</Button></Link>
      </div>

      {data?.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">У вас пока нет услуг</p>
          <Link to="/my-services/create"><Button>Добавить услугу</Button></Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data?.data.map((service) => (
          <div key={service.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.city}</p>
              </div>
              <Badge color={categoryColor[service.category]}>{categoryLabel[service.category]}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-indigo-600">от ${service.priceFrom}</span>
              <Link to={`/my-services/${service.id}/edit`}>
                <Button variant="secondary" size="sm">Редактировать</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
