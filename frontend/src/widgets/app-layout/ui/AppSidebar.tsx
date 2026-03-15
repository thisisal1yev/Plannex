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
    { to: '/my-venues', label: 'Mening maydonlarim', icon: MapPin },
    { to: '/my-services', label: 'Mening xizmatlarim', icon: Settings2 },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
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

export function AppSidebar() {
  const { user, logout } = useAuthStore()
  const { theme, toggle } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()

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

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <Link to="/events" className="font-bold text-primary text-lg tracking-tight">
          Planner AI
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Umumiy ko'rinish</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {commonLinks.map(({ to, label, icon: Icon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton asChild isActive={location.pathname === to}>
                    <Link to={to}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {extraLinks.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{user ? roleLabels[user.role] : ''}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {extraLinks.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={location.pathname.startsWith(to)}>
                      <Link to={to}>
                        <Icon />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg after:border-none">
                    <AvatarImage src={user?.avatarUrl} alt={displayName} className="rounded-lg object-cover" />
                    <AvatarFallback className="rounded-lg text-xs bg-transparent">{initials}</AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{displayName}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg after:border-none">
                      <AvatarImage src={user?.avatarUrl} alt={displayName} className="rounded-lg object-cover" />
                      <AvatarFallback className="rounded-lg text-xs bg-transparent">{initials}</AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{displayName}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <UserRound />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggle}>
                    {theme === 'dark' ? <Sun /> : <Moon />}
                    {theme === 'dark' ? 'Yorug\' mavzu' : 'Qorong\'u mavzu'}
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut />
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
