import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { eventsApi, EVENT_TYPES } from '@entities/event'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Textarea } from '@shared/ui/Textarea'
import type { UpdateEventDto } from '@entities/event'
import { eventKeys } from '@shared/api/queryKeys'
import { Card, CardContent } from '@/shared/ui/primitives/card'

function parseBannerUrls(raw?: string): string[] {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

type EditEventFormValues = Omit<UpdateEventDto, 'bannerUrls'> & {
  bannerUrlRaw?: string
}


export function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: event, isLoading } = useQuery({
    queryKey: eventKeys.detail(id!),
    queryFn: () => eventsApi.get(id!),
    enabled: !!id,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<EditEventFormValues>({
    values: event ? {
      title: event.title,
      description: event.description,
      bannerUrlRaw: event.bannerUrls?.join(', ') ?? '',
      startDate: event.startDate.slice(0, 16),
      endDate: event.endDate.slice(0, 16),
      eventType: event.eventType,
      capacity: event.capacity,
    } : undefined,
  })

  const mutation = useMutation({
    mutationFn: (values: EditEventFormValues) => {
      const { bannerUrlRaw, ...rest } = values
      const bannerUrl = parseBannerUrls(bannerUrlRaw)
      const payload: UpdateEventDto = { ...rest, bannerUrls: bannerUrl }
      return eventsApi.update(id!, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(id!) })
      queryClient.invalidateQueries({ queryKey: eventKeys.myList() })
      navigate('/my-events')
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">Tadbirni tahrirlash</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <Input
              label="Nomi"
              error={errors.title?.message}
              {...register('title', { minLength: { value: 3, message: 'Min. 3 belgi' } })}
            />
            <Textarea
              label="Tavsif"
              rows={4}
              {...register('description')}
            />
            <Select
              label="Tadbir turi"
              options={EVENT_TYPES.map((t) => ({ value: t, label: t }))}
              {...register('eventType')}
            />
            <Input label="Sig'imi" type="number" min={1} {...register('capacity', { valueAsNumber: true })} />
            <Input label="Banner URLs (vergul bilan)" {...register('bannerUrlRaw')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Boshlanish" type="datetime-local" {...register('startDate')} />
              <Input label="Tugash" type="datetime-local" {...register('endDate')} />
            </div>
          </CardContent>
        </Card>

        {mutation.isError && <p className="text-sm text-destructive">Saqlashda xatolik</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Saqlash</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-events')}>Bekor qilish</Button>
        </div>
      </form>
    </div>
  )
}
