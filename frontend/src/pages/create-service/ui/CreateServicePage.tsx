import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { servicesApi } from '@entities/service'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import type { CreateServiceDto } from '@entities/service'
import { serviceKeys } from '@shared/api/queryKeys'

export function CreateServicePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<CreateServiceDto>()

  const mutation = useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.myList() })
      navigate('/my-services')
    },
  })

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Добавить услугу</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <Input label="Название" error={errors.name?.message} {...register('name', { required: 'Обязательное поле' })} />
          <Select
            label="Категория"
            options={[
              { value: 'CATERING', label: 'Кейтеринг' }, { value: 'DECORATION', label: 'Декор' },
              { value: 'SOUND', label: 'Звук' }, { value: 'PHOTO', label: 'Фото' }, { value: 'SECURITY', label: 'Охрана' },
            ]}
            {...register('category', { required: true })}
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Описание</label>
            <textarea className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none" rows={3} {...register('description')} />
          </div>
          <Input label="Город" error={errors.city?.message} {...register('city', { required: 'Обязательное поле' })} />
          <Input label="Цена от ($)" type="number" min={0} {...register('priceFrom', { required: true, valueAsNumber: true })} />
        </div>

        {mutation.isError && <p className="text-sm text-red-500">Ошибка при создании услуги</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Создать услугу</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-services')}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
