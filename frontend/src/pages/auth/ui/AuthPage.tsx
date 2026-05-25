import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useLocation, Link } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'
import { authApi, usersApi } from '@entities/user'
import { useAuthStore } from '@shared/model/auth.store'
import type { LoginDto, RegisterDto } from '@entities/user'

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/auth/google`

// ─── Decorative elements ──────────────────────────────────────────────────────

function OrnamentStar({ size = 200, op = 0.12 }: { size?: number; op?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ opacity: op }}>
      <polygon
        points="100,6 116,60 172,60 127,94 144,148 100,115 56,148 73,94 28,60 84,60"
        stroke="#4c8ca7"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="100,22 112,58 150,58 120,80 132,116 100,95 68,116 80,80 50,58 88,58"
        stroke="#4c8ca7"
        strokeWidth="0.7"
        fill="none"
      />
      <polygon
        points="100,40 108,65 134,65 114,80 122,106 100,91 78,106 86,80 66,65 92,65"
        stroke="#4c8ca7"
        strokeWidth="0.5"
        fill="none"
      />
      <circle cx="100" cy="100" r="6" stroke="#4c8ca7" strokeWidth="0.7" fill="none" />
      <circle cx="100" cy="100" r="12" stroke="#4c8ca7" strokeWidth="0.4" fill="none" />
      <circle cx="100" cy="100" r="20" stroke="#4c8ca7" strokeWidth="0.3" fill="none" />
    </svg>
  )
}

function TilePattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="auth-tile"
          fill="none"
          x="0"
          y="0"
          width="88"
          height="88"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="44,5 53,32 80,32 59,49 67,76 44,59 21,76 29,49 8,32 35,32"
            fill="none"
            stroke="rgba(76,140,167,0.07)"
            strokeWidth="0.7"
          />
          <circle
            cx="44"
            cy="44"
            r="5"
            fill="none"
            stroke="rgba(76,140,167,0.05)"
            strokeWidth="0.5"
          />
          <line x1="44" y1="0" x2="44" y2="88" stroke="rgba(76,140,167,0.02)" strokeWidth="0.4" />
          <line x1="0" y1="44" x2="88" y2="44" stroke="rgba(76,140,167,0.02)" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#auth-tile)" />
    </svg>
  )
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-500 dark:text-slate text-xs font-semibold tracking-widest uppercase">
        {label}
      </label>

      {children}

      {error && (
        <p className="flex items-center gap-1 text-xs text-red-400/90">
          <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-red-400/90" />

          <span>{error}</span>
        </p>
      )}
    </div>
  )
}

// ─── Sign In form ─────────────────────────────────────────────────────────────

function SignInForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginDto>()

  const mutation = useMutation({
    mutationFn: async (dto: LoginDto) => {
      const tokens = await authApi.login(dto)
      setTokens(tokens)
      const user = await usersApi.me()
      setUser(user)
      return user
    },
    onSuccess: () => {
      navigate('/dashboard')
    },
    onError: () => setError('password', { message: "Noto'g'ri email yoki parol" }),
  })

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <Mail className="text-gray-400 dark:text-slate/25 pointer-events-none absolute top-1/2 left-3 h-[15px] w-[15px] -translate-y-1/2" />

          <input
            type="email"
            placeholder="name@example.com"
            className="w-full h-11 rounded-lg bg-white dark:bg-[rgba(15,25,37,0.6)] border border-gray-200 dark:border-white/8 text-sm text-gray-900 dark:text-cream placeholder:text-gray-400 dark:placeholder:text-slate/22 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/50 dark:focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)] pr-3 pl-9"
            {...register('email', { required: 'Majburiy maydon' })}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-slate/25 text-xs font-semibold tracking-widest uppercase">
            Parol
          </label>

          <button
            type="button"
            className="text-primary/60 hover:text-primary text-xs transition-colors duration-150"
          >
            Unutdingizmi?
          </button>
        </div>

        <label className="relative">
          <Lock className="text-gray-400 dark:text-slate/25 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-11 rounded-lg bg-white dark:bg-[rgba(15,25,37,0.6)] border border-gray-200 dark:border-white/8 text-sm text-gray-900 dark:text-cream placeholder:text-gray-400 dark:placeholder:text-slate/22 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/50 dark:focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)] pr-10 pl-9"
            {...register('password', {
              required: 'Majburiy maydon',
              minLength: { value: 8, message: 'Min. 8 belgi' },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-gray-400 hover:text-gray-500 dark:text-slate/25 dark:hover:text-slate/55 absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </label>

        {errors.password && (
          <p className="flex items-center gap-1 text-[11px] text-red-400/90">
            <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-red-400/90" />
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-primary text-navy hover:bg-primary-light mt-1 h-11 w-full rounded-md text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-50"
      >
        {mutation.isPending ? 'Kirish…' : 'Kirish'}
      </button>
    </form>
  )
}

// ─── Register form ─────────────────────────────────────────────────────────────

function CreateAccountForm() {
  const navigate = useNavigate()
  const { setTokens, setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<RegisterDto>({
    defaultValues: { role: 'PARTICIPANT' },
  })

  const roleValue = watch('role')

  const mutation = useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const tokens = await authApi.register(dto)
      setTokens(tokens)
      const user = await usersApi.me()
      setUser(user)
      return user
    },
    onSuccess: () => {
      navigate('/dashboard')
    },
    onError: () => setError('email', { message: 'Email allaqachon ishlatilmoqda' }),
  })

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex flex-col gap-3.5"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ism" error={errors.firstName?.message}>
          <div className="relative">
            <User className="text-gray-400 dark:text-slate/25 pointer-events-none absolute top-1/2 left-3 h-[15px] w-[15px] -translate-y-1/2" />

            <input
              placeholder="Ali"
              className="w-full h-11 rounded-lg bg-white dark:bg-[rgba(15,25,37,0.6)] border border-gray-200 dark:border-white/8 text-sm text-gray-900 dark:text-cream placeholder:text-gray-400 dark:placeholder:text-slate/22 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/50 dark:focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)] pr-3 pl-9"
              {...register('firstName', { required: 'Majburiy' })}
            />
          </div>
        </Field>

        <Field label="Familiya" error={errors.lastName?.message}>
          <div className="relative">
            <User className="text-gray-400 dark:text-slate/25 pointer-events-none absolute top-1/2 left-3 h-[15px] w-[15px] -translate-y-1/2" />

            <input
              placeholder="Aliyev"
              className="w-full h-11 rounded-lg bg-white dark:bg-[rgba(15,25,37,0.6)] border border-gray-200 dark:border-white/8 text-sm text-gray-900 dark:text-cream placeholder:text-gray-400 dark:placeholder:text-slate/22 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/50 dark:focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)] pr-3 pl-9"
              {...register('lastName', { required: 'Majburiy' })}
            />
          </div>
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <Mail className="text-gray-400 dark:text-slate/25 pointer-events-none absolute top-1/2 left-3 h-[15px] w-[15px] -translate-y-1/2" />

          <input
            type="email"
            placeholder="name@example.com"
            className="w-full h-11 rounded-lg bg-white dark:bg-[rgba(15,25,37,0.6)] border border-gray-200 dark:border-white/8 text-sm text-gray-900 dark:text-cream placeholder:text-gray-400 dark:placeholder:text-slate/22 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/50 dark:focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)] pr-3 pl-9"
            {...register('email', { required: 'Majburiy maydon' })}
          />
        </div>
      </Field>

      <Field label="Telefon" error={errors.phone?.message}>
        <div className="relative">
          <Phone className="text-gray-400 dark:text-slate/25 pointer-events-none absolute top-1/2 left-3 h-[15px] w-[15px] -translate-y-1/2" />

          <input
            type="tel"
            placeholder="+998901234567"
            className="w-full h-11 rounded-lg bg-white dark:bg-[rgba(15,25,37,0.6)] border border-gray-200 dark:border-white/8 text-sm text-gray-900 dark:text-cream placeholder:text-gray-400 dark:placeholder:text-slate/22 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/50 dark:focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)] pr-3 pl-9"
            {...register('phone', {
              required: 'Majburiy maydon',
              pattern: { value: /^\+998\d{9}$/, message: 'Format: +998901234567' },
            })}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-1.5">
        <label className="text-gray-500 dark:text-slate text-[11px] font-semibold tracking-widest uppercase">
          Parol
        </label>

        <div className="relative">
          <Lock className="text-gray-400 dark:text-slate/25 pointer-events-none absolute top-1/2 left-3 h-[15px] w-[15px] -translate-y-1/2" />
          
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className="w-full h-11 rounded-lg bg-white dark:bg-[rgba(15,25,37,0.6)] border border-gray-200 dark:border-white/8 text-sm text-gray-900 dark:text-cream placeholder:text-gray-400 dark:placeholder:text-slate/22 transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-primary/50 dark:focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)] pr-10 pl-9"
            {...register('password', {
              required: 'Majburiy maydon',
              minLength: { value: 8, message: 'Min. 8 belgi' },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-gray-400 hover:text-gray-500 dark:text-slate/25 dark:hover:text-slate/55 absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {errors.password && (
          <p className="flex items-center gap-1 text-[11px] text-red-400/90">
            <span className="inline-block h-1 w-1 shrink-0 rounded-full bg-red-400/90" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Role selector — card style */}
      <input type="hidden" {...register('role')} />
      <div className="flex flex-col gap-1.5">
        <label className="text-gray-500 dark:text-slate text-[11px] font-semibold tracking-widest uppercase">
          Ro'l
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              value: 'PARTICIPANT' as const,
              label: 'Ishtirokchi',
              desc: 'Tadbirlarga qatnashish',
            },
            {
              value: 'ORGANIZER' as const,
              label: 'Tashkilotchi',
              desc: 'Tadbirlar yaratish',
            },
          ].map(({ value, label, desc }) => {
            const active = roleValue === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue('role', value)}
                className={`rounded-lg border p-3 text-left transition-[border-color,background,box-shadow] duration-200 ${
                  active
                    ? 'border-primary/45 bg-primary/5 shadow-[inset_0_0_0_1px_rgba(76,140,167,0.12)]'
                    : 'border-gray-200 bg-transparent hover:border-gray-300 hover:bg-gray-50 dark:border-white/8 dark:hover:border-white/16 dark:hover:bg-white/2'
                }`}
              >
                <p
                  className={`mb-1 text-xs leading-none font-semibold ${active ? 'text-primary' : 'text-gray-600 dark:text-cream/70'}`}
                >
                  {label}
                </p>

                <p className="text-slate text-[10px] leading-tight">{desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-primary text-navy hover:bg-primary-light mt-1 h-11 w-full rounded-md text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-50"
      >
        {mutation.isPending ? 'Yaratilmoqda…' : 'Akkaunt yaratish'}
      </button>
    </form>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['bg-primary', 'bg-[#9E7220]', 'bg-[#E8C06A]', 'bg-[#7A6D59]']

const AUTH_STATS = [
  { v: '2,000+', l: 'Tashkilotchi' },
  { v: '500+', l: 'Maydon' },
  { v: '98%', l: 'Qoniqish' },
]

type Tab = 'signin' | 'register'

export function AuthPage() {
  const location = useLocation()
  const [tab, setTab] = useState<Tab>(location.pathname === '/register' ? 'register' : 'signin')

  return (
    <div className="bg-gray-50 dark:bg-navy flex min-h-screen">
      {/* ── Left decorative panel ── */}
      <div className="bg-white dark:bg-navy-dark relative hidden flex-col justify-between overflow-hidden p-12 lg:flex lg:w-[46%]">
        <TilePattern />

        {/* Radial primary glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_35%_55%,rgba(76,140,167,0.055)_0%,transparent_65%)]" />

        {/* Corner ornaments */}
        <div className="pointer-events-none absolute -top-16 -right-16">
          <OrnamentStar size={300} op={0.32} />
        </div>

        <div className="pointer-events-none absolute -bottom-10 -left-10">
          <OrnamentStar size={200} op={0.32} />
        </div>

        {/* Top primary line */}
        <div className="absolute top-0 right-0 left-0 h-px bg-[linear-gradient(90deg,transparent,rgba(76,140,167,0.38),transparent)]" />

        {/* Logo */}
        <Link to={'/'} className="relative z-10 flex items-center">
          <span className="text-gray-900 dark:text-cream text-xl font-bold tracking-[-0.01em]">Planner</span>

          <span className="text-primary text-xl font-bold tracking-[-0.01em]">&nbsp;AI</span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <div className="text-primary-light border-primary/15 bg-primary/6 mb-8 inline-flex animate-[lp-up_0.75s_ease-out_forwards] items-center gap-2 rounded-full border px-[18px] py-1.5 text-xs tracking-widest uppercase opacity-0 [animation-delay:0.08s]">
              <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
              O'zbekistondagi №1 tadbirlar marketi
            </div>

            <h1 className="text-gray-900 dark:text-cream mb-5 font-serif text-[clamp(88px,4.5vw,56px)] font-bold leading-none tracking-[-0.015em]">
              Tadbirlarni&nbsp;
              <br className="block 2xl:hidden" />
              <em className="font-serif text-primary italic">
                muammosiz
              </em>
              <br />
              tashkil eting.
            </h1>

            <p className="text-slate max-w-80 text-sm leading-[1.8]">
              Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Minglab tashkilotchilarga
              qo'shiling.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            {AUTH_STATS.map((s) => (
              <div key={s.l} className="border-primary/10 bg-primary/3 rounded-xl border p-3.5">
                <div className="text-primary mb-1.5 font-serif text-[26px] font-bold leading-none">
                  {s.v}
                </div>

                <div className="text-slate text-[11px] tracking-wide">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3.5">
            <div className="flex -space-x-2">
              {AVATAR_COLORS.map((bgCls, i) => (
                <div
                  key={i}
                  className={`border-white dark:border-navy-dark text-navy flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${bgCls}`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>

            <div>
              <div className="text-primary text-xs tracking-widest">★★★★★</div>
              <p className="text-slate mt-0.5 text-[11px]">Yetakchi agentliklar ishonadi</p>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="relative z-10 h-px bg-[linear-gradient(90deg,rgba(76,140,167,0.22),transparent)]" />
      </div>

      {/* ── Right auth panel ── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10">
        <div className="w-full max-w-100">
          {/* Mobile logo */}
          <h1 className="mb-8 flex items-center lg:hidden">
            <span className="text-gray-900 dark:text-cream text-lg font-bold tracking-[-0.01em]">Planner</span>

            <span className="text-primary text-lg font-bold tracking-[-0.01em]">&nbsp;AI</span>
          </h1>

          {/* Heading — re-animates on tab change via key */}
          <div
            key={`heading-${tab}`}
            className="mb-7 animate-[auth-up_0.5s_ease-out_forwards] opacity-0 [animation-delay:0.05s]"
          >
            <p className="text-primary/60 mb-2 text-[10px] tracking-[0.14em] uppercase">
              {tab === 'signin' ? 'Xush kelibsiz' : 'Yangi akkaunt'}
            </p>

            <h2 className="text-gray-900 dark:text-cream font-serif text-[clamp(28px,5vw,34px)] font-bold leading-[1.08]">
              {tab === 'signin' ? 'Akkauntingizga kirish' : "Ro'yxatdan o'tish"}
            </h2>
          </div>

          {/* Tab switcher */}
          <div className="relative mb-7 flex animate-[auth-up_0.5s_ease-out_forwards] border-b border-gray-200 dark:border-white/7 opacity-0 [animation-delay:0.05s]">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 pb-3 text-[13px] font-medium transition-colors duration-200 ${
                tab === 'signin' ? 'text-gray-900 dark:text-cream' : 'text-gray-400 hover:text-gray-600 dark:text-cream/32 dark:hover:text-cream/60'
              }`}
            >
              Kirish
            </button>

            <button
              onClick={() => setTab('register')}
              className={`flex-1 pb-3 text-[13px] font-medium transition-colors duration-200 ${
                tab === 'register' ? 'text-gray-900 dark:text-cream' : 'text-gray-400 hover:text-gray-600 dark:text-cream/32 dark:hover:text-cream/60'
              }`}
            >
              Ro'yxatdan o'tish
            </button>

            {/* Sliding primary indicator */}
            <div
              className={`from-primary to-primary-light absolute bottom-0 h-0.5 w-1/2 rounded-full bg-linear-to-r transition-all duration-300 ease-in-out ${tab === 'signin' ? 'left-0' : 'left-1/2'}`}
            />
          </div>

          {/* Form — re-animates on tab change */}
          <div
            key={`form-${tab}`}
            className="animate-[auth-up_0.5s_ease-out_forwards] opacity-0 [animation-delay:0.18s]"
          >
            {tab === 'signin' ? <SignInForm /> : <CreateAccountForm />}
          </div>

          {/* Separator */}
          <div className="my-5 flex animate-[auth-up_0.5s_ease-out_forwards] items-center gap-3 opacity-0 [animation-delay:0.3s]">
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/6" />

            <span className="text-slate text-[10px] font-medium tracking-[0.12em] uppercase">
              yoki
            </span>

            <div className="h-px flex-1 bg-gray-200 dark:bg-white/6" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={() => {
              window.location.href = GOOGLE_AUTH_URL
            }}
            className="text-slate hover:border-primary hover:bg-primary/10 group flex h-11 w-full animate-[auth-up_0.5s_ease-out_forwards] items-center justify-center gap-2.5 rounded-lg border border-gray-200 dark:border-white/8 text-[13px] font-medium opacity-0 transition-[color,border-color,background] duration-300 [animation-delay:0.3s]"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>

            <span className="group-hover:text-primary transition-colors duration-300">
              Google orqali davom etish
            </span>
          </button>

          {/* Terms */}
          <p className="text-slate mt-5 animate-[auth-up_0.5s_ease-out_forwards] text-center text-[11px] leading-[1.7] opacity-0 [animation-delay:0.42s]">
            Davom etish orqali&nbsp;
            <Link
              to="/terms"
              className="hover:text-primary decoration-gray-300 dark:decoration-cream/20 hover:decoration-primary/50 underline underline-offset-2 transition-colors"
            >
              Foydalanish shartlari
            </Link>
            &nbsp; va&nbsp;
            <Link
              to="/privacy"
              className="hover:text-primary decoration-gray-300 dark:decoration-cream/20 hover:decoration-primary/50 underline underline-offset-2 transition-colors"
            >
              Maxfiylik siyosati
            </Link>
            &nbsp; bilan rozisiz
          </p>
        </div>
      </div>
    </div>
  )
}
