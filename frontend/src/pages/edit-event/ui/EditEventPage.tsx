import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { eventsApi } from '@entities/event'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import type { UpdateEventDto } from '@entities/event'
import { eventKeys } from '@shared/api/queryKeys'

const EVENT_TYPES = ['Концерт', 'Конференция', 'Выставка', 'Спорт', 'Фестиваль', 'Другое']

export function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: event, isLoading } = useQuery({
    queryKey: eventKeys.detail(id!),
    queryFn: () => eventsApi.get(id!),
    enabled: !!id,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateEventDto>({
    values: event ? {
      title: event.title,
      description: event.description,
      bannerUrl: event.bannerUrl,
      startDate: event.startDate.slice(0, 16),
      endDate: event.endDate.slice(0, 16),
      eventType: event.eventType,
      capacity: event.capacity,
    } : undefined,
  })

  const mutation = useMutation({
    mutationFn: (dto: UpdateEventDto) => eventsApi.update(id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id!) })
      queryClient.invalidateQueries({ queryKey: eventKeys.myList() })
      navigate('/my-events')
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать событие</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <Input
            label="Название"
            error={errors.title?.message}
            {...register('title', { minLength: { value: 3, message: 'Мин. 3 символа' } })}
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Описание</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              rows={4}
              {...register('description')}
            />
          </div>
          <Select
            label="Тип события"
            options={EVENT_TYPES.map((t) => ({ value: t, label: t }))}
            {...register('eventType')}
          />
          <Input label="Вместимость" type="number" min={1} {...register('capacity', { valueAsNumber: true })} />
          <Input label="URL баннера" {...register('bannerUrl')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Начало" type="datetime-local" {...register('startDate')} />
            <Input label="Окончание" type="datetime-local" {...register('endDate')} />
          </div>
        </div>

        {mutation.isError && <p className="text-sm text-red-500">Ошибка при сохранении</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Сохранить</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-events')}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
