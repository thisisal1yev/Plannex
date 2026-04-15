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

const HEADER_ANIM_CSS = `
@keyframes hdr-menu-in {
  from { opacity:0; transform:translateY(-6px) scale(0.97) }
  to   { opacity:1; transform:translateY(0)   scale(1)    }
}
.hdr-menu { animation: hdr-menu-in 0.18s ease-out forwards; }
`

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
    user.activeRole === 'ADMIN'
      ? '/admin/dashboard'
      : user.activeRole === 'ORGANIZER'
        ? '/dashboard'
        : user.activeRole === 'VENDOR'
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
            className="border-gold/35 h-8 w-8 rounded-full border-2 object-cover"
          />
        ) : (
          <div className="from-gold to-gold-dark text-navy flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div className="hdr-menu border-gold/18 absolute right-0 z-50 mt-2.5 w-[228px] overflow-hidden rounded-xl border bg-[rgba(15,25,37,0.97)] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          <div className="border-b-gold/12 flex items-center gap-3 border-b px-4 py-3.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.firstName}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="from-gold to-gold-dark text-navy flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold">
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
                className="text-cream/70 hover:text-gold-light hover:bg-gold/7 flex items-center gap-2.5 px-4 py-[9px] text-sm no-underline transition-[color,background] duration-150"
              >
                <Icon className="h-[15px] w-[15px] shrink-0 opacity-50" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t-gold/12 border-t py-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-4 py-[9px] text-sm text-red-400/80 transition-[color,background] duration-150 hover:bg-red-500/7 hover:text-red-500"
            >
              <LogOut className="h-[15px] w-[15px] shrink-0 opacity-70" strokeWidth={1.5} />
              Chiqish
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
      <style dangerouslySetInnerHTML={{ __html: HEADER_ANIM_CSS }} />
      <header className="bg-navy-header/94 border-b-gold/13 sticky top-0 z-40 w-full border-b backdrop-blur-[14px]">
        <div className="via-gold/40 h-px bg-linear-to-r from-transparent to-transparent" />

        <div className="mx-auto flex h-15 max-w-7xl items-center justify-between gap-8 px-6">
          <Link to={'/'} className="relative z-10 flex items-center">
            <span className="text-cream text-[20px] font-bold tracking-[-0.01em]">Planner</span>

            <span className="text-gold text-[20px] font-bold tracking-[-0.01em]">&nbsp;AI</span>
          </Link>

          <div className="flex items-center justify-between gap-5">
            <nav className="hidden gap-8 md:flex">
              {NAV.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="group text-cream/55 hover:text-gold-light relative pb-0.5 text-[14px] no-underline transition-colors duration-200"
                >
                  {label}
                  <span className="bg-gold absolute bottom-[-2px] left-0 h-px w-0 transition-[width] duration-250 ease-in-out group-hover:w-full" />
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
                    className="text-cream/80 border-gold/22 hover:border-gold/55 hover:text-gold-light rounded-[6px] border px-4 py-[7px] text-[14px] font-medium no-underline transition-[border-color,color] duration-200"
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    className="text-navy from-gold to-gold-dark rounded-[6px] bg-linear-to-br px-[18px] py-[7px] text-[14px] font-semibold tracking-[0.01em] no-underline shadow-[0_2px_12px_rgba(76,140,167,0.25)] transition-[opacity,transform] duration-150 hover:-translate-y-px hover:opacity-90"
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
