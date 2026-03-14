import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { servicesApi } from '@entities/service'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import type { UpdateServiceDto } from '@entities/service'
import { serviceKeys } from '@shared/api/queryKeys'

export function EditServicePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: service, isLoading } = useQuery({
    queryKey: serviceKeys.detail(id!),
    queryFn: () => servicesApi.get(id!),
    enabled: !!id,
  })

  const { register, handleSubmit } = useForm<UpdateServiceDto>({
    values: service ? { name: service.name, category: service.category, description: service.description, city: service.city, priceFrom: service.priceFrom } : undefined,
  })

  const mutation = useMutation({
    mutationFn: (dto: UpdateServiceDto) => servicesApi.update(id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(id!) })
      queryClient.invalidateQueries({ queryKey: serviceKeys.myList() })
      navigate('/my-services')
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать услугу</h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <Input label="Название" {...register('name')} />
          <Select
            label="Категория"
            options={[
              { value: 'CATERING', label: 'Кейтеринг' }, { value: 'DECORATION', label: 'Декор' },
              { value: 'SOUND', label: 'Звук' }, { value: 'PHOTO', label: 'Фото' }, { value: 'SECURITY', label: 'Охрана' },
            ]}
            {...register('category')}
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Описание</label>
            <textarea className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none" rows={3} {...register('description')} />
          </div>
          <Input label="Город" {...register('city')} />
          <Input label="Цена от ($)" type="number" min={0} {...register('priceFrom', { valueAsNumber: true })} />
        </div>
        {mutation.isError && <p className="text-sm text-red-500">Ошибка при сохранении</p>}
        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Сохранить</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-services')}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
