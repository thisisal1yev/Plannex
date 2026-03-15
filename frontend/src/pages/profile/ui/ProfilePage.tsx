import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import type { UpdateUserDto } from '@entities/user'
import { userKeys } from '@shared/api/queryKeys'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: userKeys.me(),
    queryFn: usersApi.me,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserDto>({
    values: data ? { firstName: data.firstName, lastName: data.lastName, phone: data.phone } : undefined,
  })

  const mutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updated) => {
      queryClient.setQueryData(userKeys.me(), updated)
      if (user) setUser({ ...user, ...updated })
    },
  })

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-foreground mb-6">Profil</h1>

      <div className="bg-card rounded-xl border border-border p-6 mb-4">
        <p className="text-sm text-muted-foreground mb-1">Email</p>
        <p className="font-medium text-foreground">{data?.email}</p>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="bg-card rounded-xl border border-border p-6 flex flex-col gap-4">
        <h2 className="font-semibold text-foreground">Ma'lumotlarni tahrirlash</h2>
        <Input
          label="Ism"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'Majburiy maydon' })}
        />
        <Input
          label="Familiya"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Majburiy maydon' })}
        />
        <Input label="Telefon" {...register('phone')} />
        {mutation.isSuccess && <p className="text-sm text-green-600">Ma'lumotlar saqlandi</p>}
        {mutation.isError && <p className="text-sm text-destructive">Saqlashda xatolik</p>}
        <Button type="submit" loading={mutation.isPending}>Saqlash</Button>
      </form>
    </div>
  )
}
