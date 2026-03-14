import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { venuesApi } from '@entities/venue'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import type { CreateVenueDto } from '@entities/venue'
import { venueKeys } from '@shared/api/queryKeys'

export function CreateVenuePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<CreateVenueDto>()

  const mutation = useMutation({
    mutationFn: venuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: venueKeys.myList() })
      navigate('/my-venues')
    },
  })

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Добавить площадку</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">Основная информация</h2>
          <Input label="Название" error={errors.name?.message} {...register('name', { required: 'Обязательное поле' })} />
          <div>
            <label className="text-sm font-medium text-gray-700">Описание</label>
            <textarea className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none" rows={3} {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Город" error={errors.city?.message} {...register('city', { required: 'Обязательное поле' })} />
            <Input label="Адрес" error={errors.address?.message} {...register('address', { required: 'Обязательное поле' })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Вместимость" type="number" min={1} {...register('capacity', { required: true, valueAsNumber: true })} />
            <Input label="Цена за день ($)" type="number" min={0} {...register('pricePerDay', { required: true, valueAsNumber: true })} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Удобства</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'isIndoor', label: 'Крытый' },
              { name: 'hasWifi', label: 'WiFi' },
              { name: 'hasParking', label: 'Паркинг' },
              { name: 'hasSound', label: 'Звуковое оборудование' },
              { name: 'hasStage', label: 'Сцена' },
            ].map((item) => (
              <label key={item.name} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-indigo-600" {...register(item.name as keyof CreateVenueDto)} />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {mutation.isError && <p className="text-sm text-red-500">Ошибка при создании площадки</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Создать площадку</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-venues')}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
