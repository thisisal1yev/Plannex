import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { eventsApi } from '@entities/event'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import type { CreateEventDto } from '@entities/event'
import { eventKeys } from '@shared/api/queryKeys'

const EVENT_TYPES = ['Концерт', 'Конференция', 'Выставка', 'Спорт', 'Фестиваль', 'Другое']

interface TierInput { name: string; price: number; quantity: number }

export function CreateEventPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [tiers, setTiers] = useState<TierInput[]>([{ name: 'Standard', price: 0, quantity: 100 }])

  const { register, handleSubmit, formState: { errors } } = useForm<CreateEventDto>()

  const mutation = useMutation({
    mutationFn: (dto: CreateEventDto) => eventsApi.create({ ...dto, ticketTiers: tiers }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.myList() })
      navigate('/my-events')
    },
  })

  const addTier = () => setTiers([...tiers, { name: '', price: 0, quantity: 50 }])
  const removeTier = (i: number) => setTiers(tiers.filter((_, idx) => idx !== i))
  const updateTier = (i: number, field: keyof TierInput, value: string | number) =>
    setTiers(tiers.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Создать событие</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">Основная информация</h2>
          <Input
            label="Название"
            placeholder="Летний фестиваль"
            error={errors.title?.message}
            {...register('title', { required: 'Обязательное поле', minLength: { value: 3, message: 'Мин. 3 символа' } })}
          />
          <div>
            <label className="text-sm font-medium text-gray-700">Описание</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              rows={4}
              placeholder="Описание события..."
              {...register('description')}
            />
          </div>
          <Select
            label="Тип события"
            options={EVENT_TYPES.map((t) => ({ value: t, label: t }))}
            {...register('eventType', { required: true })}
          />
          <Input
            label="Вместимость"
            type="number"
            min={1}
            error={errors.capacity?.message}
            {...register('capacity', { required: true, valueAsNumber: true, min: 1 })}
          />
          <Input label="URL баннера (необязательно)" {...register('bannerUrl')} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900">Даты</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Начало"
              type="datetime-local"
              error={errors.startDate?.message}
              {...register('startDate', { required: 'Обязательное поле' })}
            />
            <Input
              label="Окончание"
              type="datetime-local"
              error={errors.endDate?.message}
              {...register('endDate', { required: 'Обязательное поле' })}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Типы билетов</h2>
            <Button type="button" variant="secondary" size="sm" onClick={addTier}>+ Добавить</Button>
          </div>
          {tiers.map((tier, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-end">
              <Input
                label="Название"
                value={tier.name}
                onChange={(e) => updateTier(i, 'name', e.target.value)}
                placeholder="VIP / Standard"
              />
              <Input
                label="Цена ($)"
                type="number"
                min={0}
                value={tier.price}
                onChange={(e) => updateTier(i, 'price', parseFloat(e.target.value) || 0)}
              />
              <div className="flex gap-2 items-end">
                <Input
                  label="Кол-во"
                  type="number"
                  min={1}
                  value={tier.quantity}
                  onChange={(e) => updateTier(i, 'quantity', parseInt(e.target.value) || 1)}
                />
                {tiers.length > 1 && (
                  <Button type="button" variant="danger" size="sm" onClick={() => removeTier(i)}>✕</Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {mutation.isError && <p className="text-sm text-red-500">Ошибка при создании события</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Создать событие</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-events')}>Отмена</Button>
        </div>
      </form>
    </div>
  )
}
