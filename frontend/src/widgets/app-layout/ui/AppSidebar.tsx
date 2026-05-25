import { memo } from 'react'
import type { ElementType } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
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
  Users,
  LogOut,
  Sun,
  Moon,
  ChevronsUpDown,
  UserRound,
  ShieldCheck,
  CalendarRange,
  Landmark,
} from 'lucide-react'
import { useAuthStore } from '@shared/model/auth.store'
import { useThemeStore } from '@shared/model/theme.store'
import { authApi } from '@entities/user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/primitives/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/primitives/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'

const commonLinks = [
  { to: '/events', label: 'Tadbirlar', icon: CalendarDays },
  { to: '/venues', label: 'Maydonlar', icon: Building2 },
  { to: '/services', label: 'Xizmatlar', icon: Wrench },
]

const roleLinks: Record<string, Array<{ to: string; label: string; icon: ElementType }>> = {
  PARTICIPANT: [{ to: '/tickets', label: 'Mening chiptalаrim', icon: Ticket }],
  ORGANIZER: [
    { to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
    { to: '/my-events', label: 'Mening tadbirlarim', icon: ListChecks },
  ],
  VENDOR: [
    { to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
    { to: '/my-venues', label: 'Mening maydonlarim', icon: MapPin },
    { to: '/my-services', label: 'Mening xizmatlarim', icon: Settings2 },
  ],
  ADMIN: [
    { to: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
    { to: '/admin/events', label: 'Tadbirlar', icon: CalendarRange },
    { to: '/admin/venues', label: 'Maydonlar', icon: Landmark },
  ],
  VOLUNTEER: [],
}

const roleLabels: Record<string, string> = {
  PARTICIPANT: 'Ishtirokchi',
  ORGANIZER: 'Tashkilotchi',
  VENDOR: "Ta'minotchi",
  ADMIN: 'Administrator',
  VOLUNTEER: "Ko'ngilli",
}

function getInitials(firstName?: string, lastName?: string, email?: string): string {
  if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase()
  if (firstName) return firstName[0].toUpperCase()
  if (email) return email[0].toUpperCase()
  return '?'
}

const NavLink = memo(function NavLink({
  to,
  label,
  icon: Icon,
  exact = false,
}: {
  to: string
  label: string
  icon: ElementType
  exact?: boolean
}) {
  const location = useLocation()
  const active = exact
    ? location.pathname === to
    : location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        className="group/item hover:bg-primary/6 data-[active=true]:bg-primary/10 data-[active=true]:text-primary relative h-9 rounded-lg transition-all duration-150 data-[active=true]:font-medium"
      >
        <Link to={to} className="flex items-center gap-2.5 px-2.5">
          {active && (
            <span className="bg-primary absolute top-1/2 left-0 h-5 w-0.75 -translate-y-1/2 rounded-r-full shadow-[0_0_6px_rgba(76,140,167,0.6)]" />
          )}
          <Icon
            className={`size-3.75 shrink-0 transition-colors ${
              active ? 'text-primary' : 'text-muted-foreground group-hover/item:text-foreground'
            }`}
          />
          <span
            className={`text-[13px] transition-colors ${active ? 'text-primary' : 'text-foreground/80'}`}
          >
            {label}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
})

export function AppSidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const theme = useThemeStore((s) => s.theme)
  const toggle = useThemeStore((s) => s.toggle)
  const navigate = useNavigate()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      navigate('/login')
    },
  })

  const extraLinks = user ? (roleLinks[user.role] ?? []) : []
  const initials = getInitials(user?.firstName, user?.lastName, user?.email)
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.email : ''
  const isAdmin = user?.role === 'ADMIN'

  return (
    <Sidebar className="border-primary/8 z-50 border-r">
      {/* ── Header ── */}
      <SidebarHeader className="border-primary/8 border-b px-4 py-3.5">
        <Link to="/events" className="group flex items-center gap-2.5">
          <div className="bg-primary/10 border-primary/20 group-hover:bg-primary/15 relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors">
            <ShieldCheck className="text-primary size-3.5" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">
            <span className="text-foreground">Planner</span>
            <span className="text-primary">&nbsp;AI</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-3">
        {/* ── Common ── */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-1 flex h-auto items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase">
            <span className="bg-primary flex h-1.5 w-1.5 animate-pulse rounded-full" />
            <span className="text-primary/80">Ummiy</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {commonLinks.map(({ to, label, icon }) => (
                <NavLink key={to} to={to} label={label} icon={icon} exact />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Role-specific ── */}
        {extraLinks.length > 0 && (
          <SidebarGroup className="mt-4 p-0">
            <SidebarGroupLabel className="mb-1 flex h-auto items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase">
              {isAdmin ? (
                <>
                  <span className="bg-primary flex h-1.5 w-1.5 animate-pulse rounded-full" />
                  <span className="text-primary/80">Admin panel</span>
                </>
              ) : (
                <span className="text-muted-foreground/50">
                  {user ? roleLabels[user.role] : ''}
                </span>
              )}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {extraLinks.map(({ to, label, icon }) => (
                  <NavLink key={to} to={to} label={label} icon={icon} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="border-primary/8 border-t px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="hover:bg-primary/5 data-[state=open]:bg-primary/8 h-auto rounded-lg px-2.5 py-2 transition-colors"
                >
                  <Avatar className="h-7 w-7 shrink-0 rounded-md">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={displayName}
                      className="rounded-md object-cover"
                    />

                    <AvatarFallback className="bg-primary/10 text-primary border-primary/20 rounded-md border text-[10px] font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid min-w-0 flex-1 text-left leading-tight">
                    <span className="text-foreground truncate text-xs font-medium">
                      {displayName}
                    </span>

                    <span className="text-muted-foreground/70 truncate text-xs">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="text-muted-foreground/50 ml-auto size-3 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-52 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.avatarUrl}
                        alt={displayName}
                        className="rounded-lg object-cover"
                      />

                      <AvatarFallback className="bg-primary/10 text-primary rounded-lg text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-sm font-medium">{displayName}</span>
                      <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserRound className="size-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggle}>
                    {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                    {theme === 'dark' ? "Yorug' mavzu" : "Qorong'u mavzu"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
