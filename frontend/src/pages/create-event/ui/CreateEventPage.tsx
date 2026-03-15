import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { eventsApi } from '@entities/event'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import type { CreateEventDto } from '@entities/event'
import { eventKeys } from '@shared/api/queryKeys'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/primitives/card'

const EVENT_TYPES = ['Konsert', 'Konferensiya', 'Ko\'rgazma', 'Sport', 'Festival', 'Boshqa']

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Tadbir yaratish</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Asosiy ma'lumot</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 pt-0">
            <Input
              label="Nomi"
              placeholder="Yozgi festival"
              error={errors.title?.message}
              {...register('title', { required: 'Majburiy maydon', minLength: { value: 3, message: 'Min. 3 belgi' } })}
            />
            <Textarea
              label="Tavsif"
              rows={4}
              placeholder="Tadbir tavsifi..."
              {...register('description')}
            />
            <Select
              label="Tadbir turi"
              options={EVENT_TYPES.map((t) => ({ value: t, label: t }))}
              {...register('eventType', { required: true })}
            />
            <Input
              label="Sig'imi"
              type="number"
              min={1}
              error={errors.capacity?.message}
              {...register('capacity', { required: true, valueAsNumber: true, min: 1 })}
            />
            <Input label="Banner URL (ixtiyoriy)" {...register('bannerUrl')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Sanalar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Boshlanish"
                type="datetime-local"
                error={errors.startDate?.message}
                {...register('startDate', { required: 'Majburiy maydon' })}
              />
              <Input
                label="Tugash"
                type="datetime-local"
                error={errors.endDate?.message}
                {...register('endDate', { required: 'Majburiy maydon' })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Chipta turlari</CardTitle>
              <Button type="button" variant="secondary" size="sm" onClick={addTier}>+ Qo'shish</Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {tiers.map((tier, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <Input
                  label="Nomi"
                  value={tier.name}
                  onChange={(e) => updateTier(i, 'name', e.target.value)}
                  placeholder="VIP / Standard"
                />
                <Input
                  label="Narx (so'm)"
                  type="number"
                  min={0}
                  value={tier.price}
                  onChange={(e) => updateTier(i, 'price', parseFloat(e.target.value) || 0)}
                />
                <div className="flex gap-2 items-end">
                  <Input
                    label="Miqdor"
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
          </CardContent>
        </Card>

        {mutation.isError && <p className="text-sm text-destructive">Tadbir yaratishda xatolik</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Tadbir yaratish</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-events')}>Bekor qilish</Button>
        </div>
      </form>
    </div>
  )
}
