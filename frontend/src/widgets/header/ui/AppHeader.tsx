import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { Home, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@shared/model/auth.store'

const NAV = [
  { label: 'Bu qanday ishlaydi', href: '/#how-it-works' },
  { label: 'Imkoniyatlar', href: '/#features' },
  { label: 'Tariflar', href: '/#pricing' },
  { label: 'Aloqa', href: '/#contact' },
]

function UserMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const dashboardHref =
    user.role === 'ADMIN'
      ? '/admin/dashboard'
      : user.role === 'ORGANIZER'
        ? '/dashboard'
        : user.role === 'VENDOR'
          ? '/my-venues'
          : '/events'

  function handleLogout() {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <div ref={ref} className="relative">
      <button
        className="rounded-full transition-shadow outline-none focus:shadow-[0_0_0_2px_rgba(76,140,167,0.4)]"
        onClick={() => setOpen((v) => !v)}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.firstName}
            className="border-primary/35 h-8 w-8 rounded-full border-2 object-cover"
          />
        ) : (
          <div className="from-primary to-primary-dark text-navy flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div className="hdr-menu border-primary/18 absolute right-0 z-50 mt-2.5 w-[228px] overflow-hidden rounded-xl border bg-[rgba(15,25,37,0.97)] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          <div className="border-b-primary/12 flex items-center gap-3 border-b px-4 py-3.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="from-primary to-primary-dark text-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-cream overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
                {user.firstName} {user.lastName}
              </p>

              <p className="text-cream/45 overflow-hidden text-xs text-ellipsis whitespace-nowrap">
                {user.email}
              </p>
            </div>
          </div>

          <div className="py-1.5">
            {[
              { to: dashboardHref, label: 'Boshqaruv paneli', Icon: Home },
              { to: '/profile', label: 'Profil', Icon: User },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="text-cream/70 hover:text-primary-light hover:bg-primary/7 flex items-center gap-2.5 px-4 py-[9px] text-sm transition-[color,background] duration-150"
              >
                <Icon className="h-[15px] w-[15px] shrink-0 opacity-50" strokeWidth={1.5} />
                
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="border-t-primary/12 border-t py-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-4 py-[9px] text-sm text-red-400/80 transition-[color,background] duration-150 hover:bg-red-500/7 hover:text-red-500"
            >
              <LogOut className="h-[15px] w-[15px] shrink-0 opacity-70" strokeWidth={1.5} />

              <span>Chiqish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function AppHeader() {
  const user = useAuthStore((s) => s.user)

  return (
    <>
      <header className="bg-navy-header sticky top-0 z-40 w-full backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-7xl items-center justify-between gap-8 px-6">
          <Link to={'/'} className="relative z-10 flex items-center">
            <span className="text-cream text-xl font-bold tracking-[-0.01em]">Planner</span>

            <span className="text-primary text-xl font-bold tracking-[-0.01em]">&nbsp;AI</span>
          </Link>

          <div className="flex items-center justify-between gap-5">
            <nav className="hidden gap-8 md:flex">
              {NAV.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="group text-cream hover:text-primary-light relative pb-0.5 text-sm transition-colors duration-200"
                >
                  {label}
                  <span className="bg-primary-light absolute -bottom-0.5 left-0 h-px w-0 transition-[width] duration-250 ease-in-out group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2.5">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-cream hover:border-primary/55 hover:text-primary-light rounded-xl border border-cream/20 px-4 py-2 text-sm font-medium transition-colors duration-300"
                  >
                    Kirish
                  </Link>

                  <Link
                    to="/register"
                    className="text-navy bg-primary hover:bg-primary-light rounded-xl bg-linear-to-br px-5 py-2 text-sm font-semibold transition-colors duration-300"
                  >
                    Boshlash
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
