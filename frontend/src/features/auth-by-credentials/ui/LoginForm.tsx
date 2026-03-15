import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { authApi, usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import type { LoginDto } from '@entities/user'

export function LoginForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginDto>()

  const mutation = useMutation({
    mutationFn: async (dto: LoginDto) => {
      const tokens = await authApi.login(dto)
      setTokens(tokens) // сначала сохраняем токен, чтобы /users/me прошёл с авторизацией
      const user = await usersApi.me()
      setUser(user)
      return user
    },
    onSuccess: (user) => {
      if (user.role === 'ADMIN') navigate('/admin/dashboard')
      else if (user.role === 'ORGANIZER') navigate('/dashboard')
      else if (user.role === 'VENDOR') navigate('/my-venues')
      else navigate('/events')
    },
    onError: () => {
      setError('password', { message: 'Неверный email или пароль' })
    },
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', { required: 'Обязательное поле' })}
      />
      <Input
        label="Пароль"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', { required: 'Обязательное поле', minLength: { value: 8, message: 'Мин. 8 символов' } })}
      />
      <Button type="submit" loading={mutation.isPending} className="w-full">
        Войти
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-primary hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  )
}
