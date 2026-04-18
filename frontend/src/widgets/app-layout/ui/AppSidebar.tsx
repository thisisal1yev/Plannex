import type { ElementType } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useMutation } from "@tanstack/react-query";
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
} from "lucide-react";
import { useAuthStore } from "@shared/model/auth.store";
import { useThemeStore } from "@shared/model/theme.store";
import { authApi } from "@entities/user";
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
} from "@/shared/ui/primitives/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/primitives/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/ui/primitives/avatar";

const commonLinks = [
  { to: "/events", label: "Tadbirlar", icon: CalendarDays },
  { to: "/venues", label: "Maydonlar", icon: Building2 },
  { to: "/services", label: "Xizmatlar", icon: Wrench },
];

const roleLinks: Record<
  string,
  Array<{ to: string; label: string; icon: ElementType }>
> = {
  PARTICIPANT: [{ to: "/tickets", label: "Mening chiptalаrim", icon: Ticket }],
  ORGANIZER: [
    { to: "/dashboard", label: "Boshqaruv paneli", icon: LayoutDashboard },
    { to: "/my-events", label: "Mening tadbirlarim", icon: ListChecks },
  ],
  VENDOR: [
    { to: "/my-venues", label: "Mening maydonlarim", icon: MapPin },
    { to: "/my-services", label: "Mening xizmatlarim", icon: Settings2 },
  ],
  ADMIN: [
    {
      to: "/admin/dashboard",
      label: "Boshqaruv paneli",
      icon: LayoutDashboard,
    },
    { to: "/admin/users", label: "Foydalanuvchilar", icon: Users },
    { to: "/admin/events", label: "Tadbirlar", icon: CalendarRange },
    { to: "/admin/venues", label: "Maydonlar", icon: Landmark },
  ],
  VOLUNTEER: [],
};

const roleLabels: Record<string, string> = {
  PARTICIPANT: "Ishtirokchi",
  ORGANIZER: "Tashkilotchi",
  VENDOR: "Ta'minotchi",
  ADMIN: "Administrator",
  VOLUNTEER: "Ko'ngilli",
};

function getInitials(
  firstName?: string,
  lastName?: string,
  email?: string,
): string {
  if (firstName && lastName)
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return "?";
}

function NavLink({
  to,
  label,
  icon: Icon,
  exact = false,
}: {
  to: string;
  label: string;
  icon: ElementType;
  exact?: boolean;
}) {
  const location = useLocation();
  const active = exact
    ? location.pathname === to
    : location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        className="group/item relative rounded-lg h-9 transition-all duration-150 hover:bg-gold/6 data-[active=true]:bg-gold/10 data-[active=true]:text-gold data-[active=true]:font-medium"
      >
        <Link to={to} className="flex items-center gap-2.5 px-2.5">
          {active && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r-full shadow-[0_0_6px_rgba(76,140,167,0.6)]" />
          )}
          <Icon
            className={`size-[15px] shrink-0 transition-colors ${
              active
                ? "text-gold"
                : "text-muted-foreground group-hover/item:text-foreground"
            }`}
          />
          <span
            className={`text-[13px] transition-colors ${active ? "text-gold" : "text-foreground/80"}`}
          >
            {label}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      navigate("/login");
    },
  });

  const extraLinks = user ? (roleLinks[user.role] ?? []) : [];
  const initials = getInitials(user?.firstName, user?.lastName, user?.email);
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : "";
  const isAdmin = user?.role === "ADMIN";

  return (
    <Sidebar className="border-r border-gold/8">
      {/* ── Header ── */}
      <SidebarHeader className="px-4 py-[14px] border-b border-gold/8">
        <Link to="/events" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
            <ShieldCheck className="size-3.5 text-gold" />
          </div>
          <span className="font-bold text-[15px] tracking-tight">
            <span className="text-foreground">Planner</span>
            <span className="text-gold">&nbsp;AI</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 gap-0">
        {/* ── Common ── */}
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-[10px] tracking-[0.14em] uppercase px-2.5 mb-1 h-auto py-1 flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-gold/80">Ummiy</span>
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
          <SidebarGroup className="p-0 mt-4">
            <SidebarGroupLabel className="text-[10px] tracking-[0.14em] uppercase px-2.5 mb-1 h-auto py-1 flex items-center gap-1.5">
              {isAdmin ? (
                <>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="text-gold/80">Admin panel</span>
                </>
              ) : (
                <span className="text-muted-foreground/50">
                  {user ? roleLabels[user.role] : ""}
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
      <SidebarFooter className="border-t border-gold/8 px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="rounded-lg h-auto py-2 px-2.5 hover:bg-gold/5 data-[state=open]:bg-gold/8 transition-colors"
                >
                  <Avatar className="h-7 w-7 rounded-md shrink-0">
                    <AvatarImage
                      src={user?.avatarUrl}
                      alt={displayName}
                      className="rounded-md object-cover"
                    />
                    <AvatarFallback className="rounded-md text-[10px] font-bold bg-gold/10 text-gold border border-gold/20">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight min-w-0">
                    <span className="truncate font-medium text-[12px] text-foreground">
                      {displayName}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground/70">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-3 text-muted-foreground/50 shrink-0" />
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
                      <AvatarFallback className="rounded-lg text-[11px] font-bold bg-gold/10 text-gold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate font-medium text-[13px]">
                        {displayName}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {user?.email}
                      </span>
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
                    {theme === "dark" ? (
                      <Sun className="size-4" />
                    ) : (
                      <Moon className="size-4" />
                    )}
                    {theme === "dark" ? "Yorug' mavzu" : "Qorong'u mavzu"}
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
  );
}
