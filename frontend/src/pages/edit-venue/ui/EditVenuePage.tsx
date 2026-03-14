import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { venuesApi } from '@entities/venue'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import type { UpdateVenueDto } from '@entities/venue'
import { venueKeys } from '@shared/api/queryKeys'

export function EditVenuePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: venue, isLoading } = useQuery({
    queryKey: venueKeys.detail(id!),
    queryFn: () => venuesApi.get(id!),
    enabled: !!id,
  })

  const { register, handleSubmit } = useForm<UpdateVenueDto>({
    values: venue ? {
      name: venue.name, description: venue.description, address: venue.address,
      city: venue.city, capacity: venue.capacity, pricePerDay: venue.pricePerDay,
      isIndoor: venue.isIndoor, hasWifi: venue.hasWifi, hasParking: venue.hasParking,
      hasSound: venue.hasSound, hasStage: venue.hasStage,
    } : undefined,
  })

  const mutation = useMutation({
    mutationFn: (dto: UpdateVenueDto) => venuesApi.update(id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.detail(id!) })
      queryClient.invalidateQueries({ queryKey: venueKeys.myList() })
      navigate('/my-venues')
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать площадку</h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <Input label="Название" {...register('name')} />
          <div>
            <label className="text-sm font-medium text-gray-700">Описание</label>
            <textarea className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none" rows={3} {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Город" {...register('city')} />
            <Input label="Адрес" {...register('address')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Вместимость" type="number" {...register('capacity', { valueAsNumber: true })} />
            <Input label="Цена/день ($)" type="number" {...register('pricePerDay', { valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'isIndoor', label: 'Крытый' }, { name: 'hasWifi', label: 'WiFi' },
              { name: 'hasParking', label: 'Паркинг' }, { name: 'hasSound', label: 'Звук' }, { name: 'hasStage', label: 'Сцена' },
            ].map((item) => (
              <label key={item.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-indigo-600" {...register(item.name as keyof UpdateVenueDto)} />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
        {mutation.isError && <p className="text-sm text-red-500">Ошибка при сохранении</p>}
        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Сохранить</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-venues')}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
