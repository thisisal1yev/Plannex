import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { venuesApi } from '@entities/venue'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Textarea } from '@shared/ui/Textarea'
import type { UpdateVenueDto } from '@entities/venue'
import { venueKeys } from '@shared/api/queryKeys'
import { Card, CardContent } from '@/shared/ui/primitives/card'

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Maydonni tahrirlash</h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <Input label="Nomi" {...register('name')} />
            <Textarea label="Tavsif" rows={3} {...register('description')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Shahar" {...register('city')} />
              <Input label="Manzil" {...register('address')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Sig'imi" type="number" {...register('capacity', { valueAsNumber: true })} />
              <Input label="Narx/kun (so'm)" type="number" {...register('pricePerDay', { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>
        {mutation.isError && <p className="text-sm text-destructive">Saqlashda xatolik</p>}
        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Saqlash</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-venues')}>Bekor qilish</Button>
        </div>
      </form>
    </div>
  )
}
