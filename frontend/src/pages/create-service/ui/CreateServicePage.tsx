import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { servicesApi } from '@entities/service'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'
import type { CreateServiceDto } from '@entities/service'
import { serviceKeys } from '@shared/api/queryKeys'
import { Card, CardContent } from '@/shared/ui/primitives/card'

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
      <h1 className="text-2xl font-bold text-foreground mb-6">Xizmat qo'shish</h1>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-6">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <Input label="Nomi" error={errors.name?.message} {...register('name', { required: 'Majburiy maydon' })} />
            <Select
              label="Turkum"
              options={[
                { value: 'CATERING', label: 'Katering' }, { value: 'DECORATION', label: 'Bezak' },
                { value: 'SOUND', label: 'Ovoz' }, { value: 'PHOTO', label: 'Foto' }, { value: 'SECURITY', label: 'Xavfsizlik' },
              ]}
              {...register('category', { required: true })}
            />
            <Textarea label="Tavsif" rows={3} {...register('description')} />
            <Input label="Shahar" error={errors.city?.message} {...register('city', { required: 'Majburiy maydon' })} />
            <Input label="Narx dan (so'm)" type="number" min={0} {...register('priceFrom', { required: true, valueAsNumber: true })} />
          </CardContent>
        </Card>

        {mutation.isError && <p className="text-sm text-destructive">Xizmat yaratishda xatolik</p>}

        <div className="flex gap-3">
          <Button type="submit" loading={mutation.isPending}>Xizmat yaratish</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/my-services')}>Bekor qilish</Button>
        </div>
      </form>
    </div>
  )
}
