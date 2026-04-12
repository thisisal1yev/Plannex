import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { ChevronRight, ChevronLeft, CalendarDays, LayoutDashboard } from 'lucide-react'
import { authApi, usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import type { RegisterDto } from '@entities/user'
import { cn } from '@shared/lib/utils'

type Role = 'PARTICIPANT' | 'ORGANIZER'

interface FormData extends RegisterDto {
  role: Role
}

const STRINGS = {
  step1: 'Shaxsiy ma\'lumotlar',
  step2: 'Xavfsizlik va rol',
  firstName: 'Ism',
  firstNamePlaceholder: 'Ali',
  lastName: 'Familiya',
  lastNamePlaceholder: 'Aliyev',
  email: 'Email',
  emailPlaceholder: 'you@example.com',
  phone: 'Telefon (ixtiyoriy)',
  phonePlaceholder: '+998901234567',
  password: 'Parol',
  passwordPlaceholder: '••••••••',
  next: 'Davom etish',
  back: 'Orqaga',
  submit: 'Akkaunt yaratish',
  hasAccount: 'Akkaunt bormi?',
  login: 'Kirish',
  required: 'Majburiy maydon',
  minPass: 'Min. 8 belgi',
  participantLabel: 'Ishtirokchi',
  participantDesc: 'Tadbirlarga chipta sotib oling va qatnashing',
  organizerLabel: 'Tashkilotchi',
  organizerDesc: 'O\'z tadbirlaringizni yarating va boshqaring',
  weak: 'Zaif',
  medium: 'O\'rtacha',
  strong: 'Kuchli',
  creating: 'Yaratilmoqda...',
}

function passwordStrength(pwd: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!pwd) return { level: 0, label: '' }
  let score = 0
  if (pwd.length >= 8)  score++
  if (pwd.length >= 12) score++
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++
  if (score === 1) return { level: 1, label: STRINGS.weak }
  if (score === 2) return { level: 2, label: STRINGS.medium }
  return { level: 3, label: STRINGS.strong }
}

export function RegisterForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [step, setStep]       = useState<1 | 2>(1)
  const [password, setPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
    watch,
  } = useForm<FormData>({ defaultValues: { role: 'PARTICIPANT' } })

  const role = watch('role')
  const strength = passwordStrength(password)

  const mutation = useMutation({
    mutationFn: async (dto: FormData) => {
      const tokens = await authApi.register(dto)
      setTokens(tokens)
      const user = await usersApi.me()
      setUser(user)
      return user
    },
    onSuccess: (user) => {
      if (user.activeRole === 'ORGANIZER') navigate('/dashboard')
      else navigate('/')
    },
    onError: () => {
      setError('email', { message: 'Email allaqachon ishlatilmoqda yoki server xatoligi' })
      setStep(1)
    },
  })

  const goNext = async () => {
    const valid = await trigger(['firstName', 'lastName', 'email'])
    if (valid) setStep(2)
  }

  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400']
  const strengthTextColors = ['', 'text-red-400', 'text-amber-400', 'text-emerald-400']

  return (
    <div className="flex flex-col gap-5">

      {/* ── Step indicator ── */}
      <div className="flex items-center gap-2">
        {([1, 2] as const).map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border transition-all duration-300',
              step >= s
                ? 'bg-gold border-gold text-navy'
                : 'bg-transparent border-border text-muted-foreground/40',
            )}>
              {s}
            </div>
            <span className={cn(
              'text-[12px] font-medium transition-colors',
              step === s ? 'text-foreground' : 'text-muted-foreground/40',
            )}>
              {s === 1 ? STRINGS.step1 : STRINGS.step2}
            </span>
            {s === 1 && (
              <div className={cn(
                'flex-1 h-[1px] mx-1 transition-colors duration-300',
                step === 2 ? 'bg-gold/40' : 'bg-border',
              )} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">

        {/* ── Step 1: Personal info ── */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={STRINGS.firstName}
                placeholder={STRINGS.firstNamePlaceholder}
                error={errors.firstName?.message}
                {...register('firstName', { required: STRINGS.required })}
              />
              <Input
                label={STRINGS.lastName}
                placeholder={STRINGS.lastNamePlaceholder}
                error={errors.lastName?.message}
                {...register('lastName', { required: STRINGS.required })}
              />
            </div>
            <Input
              label={STRINGS.email}
              type="email"
              placeholder={STRINGS.emailPlaceholder}
              error={errors.email?.message}
              {...register('email', { required: STRINGS.required })}
            />
            <Input
              label={STRINGS.phone}
              type="tel"
              placeholder={STRINGS.phonePlaceholder}
              {...register('phone')}
            />
            <button
              type="button"
              onClick={goNext}
              className="w-full h-10 rounded-xl text-[13px] font-semibold bg-gold text-navy hover:bg-gold-light shadow-[0_4px_12px_rgba(201,150,58,0.2)] hover:shadow-[0_4px_16px_rgba(201,150,58,0.3)] transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              {STRINGS.next}
              <ChevronRight className="size-4" />
            </button>
          </>
        )}

        {/* ── Step 2: Password + role ── */}
        {step === 2 && (
          <>
            <div className="flex flex-col gap-1.5">
              <Input
                label={STRINGS.password}
                type="password"
                placeholder={STRINGS.passwordPlaceholder}
                error={errors.password?.message}
                {...register('password', {
                  required: STRINGS.required,
                  minLength: { value: 8, message: STRINGS.minPass },
                  onChange: (e) => setPassword(e.target.value),
                })}
              />
              {password && (
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-all duration-300',
                          strength.level >= i ? strengthColors[strength.level] : 'bg-border',
                        )}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span className={cn('text-[11px] font-medium', strengthTextColors[strength.level])}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Role selection */}
            <div className="flex flex-col gap-2">
              <p className="text-[12px] font-medium text-muted-foreground/60">Rol tanlang</p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'PARTICIPANT', label: STRINGS.participantLabel, desc: STRINGS.participantDesc, icon: CalendarDays },
                  { value: 'ORGANIZER',  label: STRINGS.organizerLabel,  desc: STRINGS.organizerDesc,  icon: LayoutDashboard },
                ] as const).map(({ value, label, desc, icon: Icon }) => (
                  <label
                    key={value}
                    className={cn(
                      'relative flex flex-col gap-1.5 p-3 rounded-xl border cursor-pointer transition-all duration-200',
                      role === value
                        ? 'border-gold/40 bg-gold/6 shadow-[0_0_0_1px_rgba(201,150,58,0.15)]'
                        : 'border-border/60 bg-card/40 hover:border-gold/20',
                    )}
                  >
                    <input
                      type="radio"
                      value={value}
                      className="absolute opacity-0 pointer-events-none"
                      {...register('role')}
                    />
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center transition-all',
                        role === value ? 'border-gold bg-gold/20' : 'border-border/60',
                      )}>
                        {role === value && <div className="w-2 h-2 rounded-full bg-gold" />}
                      </div>
                      <Icon className={cn('size-3.5', role === value ? 'text-gold' : 'text-muted-foreground/50')} />
                      <span className={cn('text-[12px] font-semibold', role === value ? 'text-foreground' : 'text-foreground/60')}>
                        {label}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground/40 leading-tight pl-7">{desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-10 px-4 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="size-4" />
                {STRINGS.back}
              </button>
              <Button type="submit" loading={mutation.isPending} className="flex-1">
                {mutation.isPending ? STRINGS.creating : STRINGS.submit}
              </Button>
            </div>
          </>
        )}

      </form>

      <p className="text-[13px] text-center text-muted-foreground">
        {STRINGS.hasAccount}{' '}
        <Link to="/login" className="text-gold hover:text-gold-light font-medium transition-colors">
          {STRINGS.login}
        </Link>
      </p>
    </div>
  )
}
