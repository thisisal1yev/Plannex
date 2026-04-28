import { useState, useRef, useEffect, type ElementType } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import {
  CalendarDays,
  Building2,
  Wrench,
  Ticket,
  LayoutDashboard,
  ListChecks,
  MapPin,
  Settings2,
  UserRound,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'

import { useAuthStore } from '@shared/model/auth.store'
import { useThemeStore } from '@shared/model/theme.store'
import type { Role } from '@shared/types'
import { authApi, usersApi } from '@entities/user'
import { cn } from '@shared/lib/utils'
interface NavItem {
  to: string
  label: string
  icon: ElementType
  exact?: boolean
}

const ROLES: Role[] = ['ORGANIZER', 'PARTICIPANT', 'VENDOR']

const BROWSE_LINKS: NavItem[] = [
  { to: '/events', label: 'Tadbirlar', icon: CalendarDays },
  { to: '/venues', label: 'Maydonlar', icon: Building2 },
  { to: '/services', label: 'Xizmatlar', icon: Wrench },
]


const ROLE_LINKS: Record<string, NavItem[]> = {
  PARTICIPANT: [{ to: '/tickets', label: 'Chiptalarim', icon: Ticket }],
  ORGANIZER: [
    {
      to: '/dashboard',
      label: 'Boshqaruv',
      icon: LayoutDashboard,
      exact: true,
    },
    { to: '/my-events', label: 'Tadbirlarim', icon: ListChecks },
  ],
  VENDOR: [
    { to: '/my-venues', label: 'Maydonlarim', icon: MapPin },
    { to: '/my-services', label: 'Xizmatlarim', icon: Settings2 },
  ],
  VOLUNTEER: [],
}

const ANIM_CSS = `
@keyframes nav-dd-in {
  from { opacity:0; transform:translateY(-6px) scale(0.97) }
  to   { opacity:1; transform:translateY(0)    scale(1)    }
}
@keyframes mob-menu-in {
  from { opacity:0; transform:translateY(-4px) }
  to   { opacity:1; transform:translateY(0)    }
}
.nav-dd   { animation: nav-dd-in   0.16s ease-out forwards }
.mob-menu { animation: mob-menu-in 0.18s ease-out forwards }
`

function DesktopNavLink({ to, label, exact }: NavItem) {
  const { pathname } = useLocation()
  const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      className={cn(
        'group relative flex h-full items-center px-1 text-sm font-medium whitespace-nowrap transition-colors duration-150',
        active ? 'text-primary' : 'text-foreground/60 hover:text-foreground/90'
      )}
    >
      {label}
    </Link>
  )
}

function MobileNavLink({
  to,
  label,
  icon: Icon,
  exact,
  onClick,
}: NavItem & { onClick: () => void }) {
  const { pathname } = useLocation()
  const active = exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium transition-all',
        active
          ? 'text-primary bg-primary/10'
          : 'text-foreground/70 hover:text-foreground hover:bg-muted/40'
      )}
    >
      <Icon className={cn('size-[15px]', active ? 'text-primary' : 'text-muted-foreground/60')} />
      {label}
    </Link>
  )
}

function UserMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { user, setUser, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      navigate('/login')
    },
  })

  const switchRoleMutation = useMutation({
    mutationFn: (role: Role) => usersApi.switchRole(role),
    onSuccess: (updatedUser) => {
      const newRoleLinks = ROLE_LINKS[updatedUser.role] ?? []
      const currentPageAllowed = newRoleLinks.some(
        (l) => pathname === l.to || pathname.startsWith(l.to + '/')
      )
      if (!currentPageAllowed) {
        navigate(newRoleLinks.length > 0 ? newRoleLinks[0].to : '/events')
      }
      setUser(updatedUser)
    },
  })

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

  return (
    <div ref={ref} className={cn(`relative ${className}`)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex h-8 items-center gap-1.5 rounded-full border pr-2 pl-1 transition-all duration-150',
          open
            ? 'border-primary/40 bg-primary/8 shadow-[0_0_0_3px_rgba(76,140,167,0.08)]'
            : 'border-border hover:border-primary/30 hover:bg-muted/20'
        )}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="" className="h-6 w-6 shrink-0 rounded-full object-cover" />
        ) : (
          <div className="from-primary to-primary-dark text-navy flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[9px] font-bold">
            {initials}
          </div>
        )}
        <span className="text-foreground/80 hidden max-w-[88px] truncate text-[12.5px] font-medium sm:block">
          {user.firstName}
        </span>

        <ChevronDown
          className={cn(
            'text-muted-foreground/40 size-3 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div className="nav-dd bg-card border-border absolute top-[calc(100%+8px)] right-0 z-50 overflow-hidden rounded-xl border shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
          <div className="border-border/60 border-b px-4 py-3">
            <p className="text-foreground truncate text-[13px] font-semibold">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-muted-foreground/50 truncate text-[11px]">{user.email}</p>
          </div>

          <nav className="space-y-1">
            <div className="px-0.5 pt-0.5">
              <div className="flex items-center gap-1 rounded-lg bg-muted/40 p-1">
                {ROLES.map((role) => {
                  const isActive = user?.role === role
                  const label =
                    role === 'ORGANIZER'
                      ? 'Tashkilotchi'
                      : role === 'PARTICIPANT'
                        ? 'Ishtirokchi'
                        : 'Vendor'

                  return (
                    <button
                      key={role}
                      disabled={switchRoleMutation.isPending}
                      onClick={() => switchRoleMutation.mutate(role)}
                      className={cn(
                        'flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-all duration-150',
                        isActive
                          ? 'bg-primary text-navy shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="text-foreground/70 hover:text-foreground hover:bg-muted/30 flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors"
              >
                <UserRound className="text-muted-foreground/50 size-3.5" />
                Profil
              </Link>

              <button
                onClick={toggle}
                className="text-foreground/70 hover:text-foreground hover:bg-muted/30 flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="text-muted-foreground/50 size-3.5" />
                ) : (
                  <Moon className="text-muted-foreground/50 size-3.5" />
                )}
                {theme === 'dark' ? "Yorug' mavzu" : "Qorong'u mavzu"}
              </button>
            </div>

            <div className="border-border/60 border-t">
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-[13px] text-red-400/80 transition-colors hover:bg-red-500/8 hover:text-red-400 disabled:opacity-50"
              >
                <LogOut className="size-3.5" />
                Chiqish
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, setUser } = useAuthStore()
  const roleLinks = user ? (ROLE_LINKS[user.role] ?? []) : []

  const closeMobile = () => setMobileOpen(false)

  const switchRoleMutation = useMutation({
    mutationFn: (role: Role) => usersApi.switchRole(role),
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
    },
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
      <header className="border-border/60 bg-background/95 sticky top-0 z-40 w-full border-b backdrop-blur-md">
        <div className="via-primary/50 h-0.5 bg-linear-to-r from-transparent to-transparent" />

        <div className="mx-auto flex h-15 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link to={'/'} className="relative z-10 flex items-center">
            <span className="text-cream text-[20px] font-bold tracking-[-0.01em]">Planner</span>

            <span className="text-primary text-[20px] font-bold tracking-[-0.01em]">&nbsp;AI</span>
          </Link>

          <nav className="ml-auto hidden h-full gap-5 md:flex">
            {BROWSE_LINKS.map((link) => (
              <DesktopNavLink key={link.to} {...link} />
            ))}

            {roleLinks.length > 0 && <div className="bg-border/50 mx-1 my-5 w-px" />}

            {roleLinks.map((link) => (
              <DesktopNavLink key={link.to} {...link} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <UserMenu className="hidden md:flex" />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-foreground/70 hover:text-foreground border-border hover:border-primary/30 hidden h-8 items-center rounded-md border px-4 text-[13px] font-medium transition-colors sm:inline-flex"
                >
                  Kirish
                </Link>

                <Link
                  to="/register"
                  className="text-navy bg-primary hover:bg-primary-light inline-flex h-8 items-center rounded-md px-4 text-[13px] font-semibold shadow-[0_2px_10px_rgba(76,140,167,0.2)] transition-all hover:shadow-[0_2px_14px_rgba(76,140,167,0.3)]"
                >
                  Boshlash
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="border-border hover:border-primary/30 text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg border transition-colors md:hidden"
            >
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mob-menu border-border/60 bg-background flex flex-col gap-0.5 border-t px-4 py-3 md:hidden">
            {BROWSE_LINKS.map((link) => (
              <MobileNavLink key={link.to} {...link} onClick={closeMobile} />
            ))}

            {roleLinks.length > 0 && (
              <>
                <div className="bg-border/40 my-1.5 h-px" />
                {roleLinks.map((link) => (
                  <MobileNavLink key={link.to} {...link} onClick={closeMobile} />
                ))}
              </>
            )}

            {user && (
              <>
                <div className="bg-border/40 my-1.5 h-px" />
                <div className="flex items-center gap-1 rounded-lg bg-muted/40 p-1">
                  {ROLES.map((role) => {
                    const isActive = user.role === role
                    const label =
                      role === 'ORGANIZER'
                        ? 'Tashkilotchi'
                        : role === 'PARTICIPANT'
                          ? 'Ishtirokchi'
                          : 'Vendor'
                    return (
                      <button
                        key={role}
                        disabled={switchRoleMutation.isPending}
                        onClick={() => switchRoleMutation.mutate(role)}
                        className={cn(
                          'flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-all duration-150',
                          isActive
                            ? 'bg-primary text-navy shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {!user && (
              <>
                <div className="bg-border/40 my-1.5 h-px" />
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="text-foreground/70 hover:text-foreground hover:bg-muted/40 flex items-center rounded-lg px-3 py-2.5 text-[14px] font-medium transition-colors"
                >
                  Kirish
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="text-navy bg-primary hover:bg-primary-light mt-1 flex h-10 items-center justify-center rounded-lg text-[14px] font-semibold transition-colors"
                >
                  Boshlash
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}
