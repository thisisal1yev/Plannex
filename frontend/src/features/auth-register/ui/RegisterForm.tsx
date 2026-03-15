import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi, usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Select } from '@shared/ui/Select'
import { Button } from '@shared/ui/Button'
import type { RegisterDto } from '@entities/user'

export function RegisterForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterDto>({ defaultValues: { role: 'PARTICIPANT' } })

  const mutation = useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const tokens = await authApi.register(dto)
      setTokens(tokens)
      const user = await usersApi.me()
      setUser(user)
      return user
    },
    onSuccess: (user) => {
      if (user.role === 'ORGANIZER') navigate('/dashboard')
      else navigate('/')
    },
    onError: () => {
      setError('email', { message: 'Email allaqachon ishlatilmoqda yoki server xatoligi' })
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Ism"
          placeholder="Ali"
          error={errors.firstName?.message}
          {...register('firstName', { required: 'Majburiy maydon' })}
        />
        <Input
          label="Familiya"
          placeholder="Aliyev"
          error={errors.lastName?.message}
          {...register('lastName', { required: 'Majburiy maydon' })}
        />
      </div>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', { required: 'Majburiy maydon' })}
      />
      <Input
        label="Telefon (ixtiyoriy)"
        type="tel"
        placeholder="+998901234567"
        {...register('phone')}
      />
      <Input
        label="Parol"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', { required: 'Majburiy maydon', minLength: { value: 8, message: 'Min. 8 belgi' } })}
      />
      <Select
        label="Rol"
        options={[
          { value: 'PARTICIPANT', label: 'Ishtirokchi' },
          { value: 'ORGANIZER', label: 'Tashkilotchi' },
        ]}
        {...register('role')}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Akkaunt yaratish
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Akkaunt bormi?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Kirish
        </Link>
      </p>
    </form>
  )
}
