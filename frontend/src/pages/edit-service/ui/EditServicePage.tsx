import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router'
import { servicesApi } from '@entities/service'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Textarea } from '@shared/ui/Textarea'
import type { UpdateServiceDto } from '@entities/service'
import { serviceKeys } from '@shared/api/queryKeys'
import { Card, CardContent } from '@/shared/ui/primitives/card'

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Xizmatni tahrirlash</h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <Input label="Nomi" {...register('name')} />
            <Select
              label="Turkum"
              options={[
                { value: 'CATERING', label: 'Katering' }, { value: 'DECORATION', label: 'Bezak' },
                { value: 'SOUND', label: 'Ovoz' }, { value: 'PHOTO', label: 'Foto' }, { value: 'SECURITY', label: 'Xavfsizlik' },
              ]}
              {...register('category')}
            />
            <Textarea label="Tavsif" rows={3} {...register('description')} />
            <Input label="Shahar" {...register('city')} />
            <Input label="Narx dan (so'm)" type="number" min={0} {...register('priceFrom', { valueAsNumber: true })} />
          </CardContent>
        </Card>
        {mutation.isError && <p className="text-sm text-destructive">Saqlashda xatolik</p>}
        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Saqlash</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-services')}>Bekor qilish</Button>
        </div>
      </form>
    </div>
  )
}
