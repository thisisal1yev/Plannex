import { useState, useRef, useEffect, type ElementType } from "react";
import { Link, useLocation, useNavigate } from "react-router";
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
  UserRound,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import { useAuthStore } from "@shared/model/auth.store";
import { useThemeStore } from "@shared/model/theme.store";
import type { Role } from "@shared/types";
import { authApi, usersApi } from "@entities/user";
import { cn } from "@shared/lib/utils";
interface NavItem {
  to: string;
  label: string;
  icon: ElementType;
  exact?: boolean;
}

const BROWSE_LINKS: NavItem[] = [
  { to: "/events", label: "Tadbirlar", icon: CalendarDays },
  { to: "/venues", label: "Maydonlar", icon: Building2 },
  { to: "/services", label: "Xizmatlar", icon: Wrench },
];

const ROLES: Role[] = ["ORGANIZER", "PARTICIPANT", "VENDOR"];

const ROLE_LINKS: Record<string, NavItem[]> = {
  PARTICIPANT: [{ to: "/tickets", label: "Chiptalarim", icon: Ticket }],
  ORGANIZER: [
    {
      to: "/dashboard",
      label: "Boshqaruv",
      icon: LayoutDashboard,
      exact: true,
    },
    { to: "/my-events", label: "Tadbirlarim", icon: ListChecks },
  ],
  VENDOR: [
    { to: "/my-venues", label: "Maydonlarim", icon: MapPin },
    { to: "/my-services", label: "Xizmatlarim", icon: Settings2 },
  ],
  VOLUNTEER: [],
};

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
`;

function DesktopNavLink({ to, label, exact }: NavItem) {
  const { pathname } = useLocation();
  const active = exact
    ? pathname === to
    : pathname === to || pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={cn(
        "relative flex items-center h-full px-1 text-[13.5px] font-medium transition-colors duration-150 whitespace-nowrap group",
        active ? "text-gold" : "text-foreground/60 hover:text-foreground/90",
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  to,
  label,
  icon: Icon,
  exact,
  onClick,
}: NavItem & { onClick: () => void }) {
  const { pathname } = useLocation();
  const active = exact
    ? pathname === to
    : pathname === to || pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all",
        active
          ? "text-gold bg-gold/10"
          : "text-foreground/70 hover:text-foreground hover:bg-muted/40",
      )}
    >
      <Icon
        className={cn(
          "size-[15px]",
          active ? "text-gold" : "text-muted-foreground/60",
        )}
      />
      {label}
    </Link>
  );
}

function UserMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, setUser, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      navigate("/login");
    },
  });

  const switchRoleMutation = useMutation({
    mutationFn: (role: Role) => usersApi.switchRole(role),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      const newRoleLinks = ROLE_LINKS[updatedUser.activeRole] ?? [];
      const currentPageAllowed = newRoleLinks.some((l) =>
        pathname === l.to || pathname.startsWith(l.to + "/")
      );
      if (!currentPageAllowed) {
        navigate(newRoleLinks.length > 0 ? newRoleLinks[0].to : "/events");
      }
    },
  });

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return null;

  const initials =
    `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();

  return (
    <div ref={ref} className={cn(`relative ${className}`)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1.5 h-8 pl-1 pr-2 rounded-full border transition-all duration-150",
          open
            ? "border-gold/40 bg-gold/8 shadow-[0_0_0_3px_rgba(201,150,58,0.08)]"
            : "border-border hover:border-gold/30 hover:bg-muted/20",
        )}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="w-6 h-6 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-linear-to-br from-gold to-gold-dark flex items-center justify-center text-[9px] font-bold text-navy shrink-0">
            {initials}
          </div>
        )}
        <span className="text-[12.5px] font-medium text-foreground/80 max-w-[88px] truncate hidden sm:block">
          {user.firstName}
        </span>

        <ChevronDown
          className={cn(
            "size-3 text-muted-foreground/40 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="nav-dd absolute right-0 top-[calc(100%+8px)] z-50 bg-card border border-border rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.3)] overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60">
            <p className="text-[13px] font-semibold text-foreground truncate">
              {user.firstName} {user.lastName}
            </p>

            <p className="text-[11px] text-muted-foreground/50 truncate">
              {user.email}
            </p>
          </div>

          <nav className="space-y-1 py-1">
            <div>
              <div className="flex items-center justify-between text-xs gap-x-1">
                {ROLES.map((role) => {
                  const isActive = user?.activeRole === role;

                  return (
                    <button
                      key={role}
                      disabled={switchRoleMutation.isPending}
                      onClick={() => switchRoleMutation.mutate(role)}
                      className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-150",
                        isActive
                          ? "bg-gold/15 text-gold border border-gold/30"
                          : "text-muted-foreground/60 hover:text-foreground/80 hover:bg-muted/30 border border-transparent",
                      )}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                <UserRound className="size-3.5 text-muted-foreground/50" />
                Profil
              </Link>

              <button
                onClick={toggle}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-foreground/70 hover:text-foreground hover:bg-muted/30 transition-colors text-left"
              >
                {theme === "dark" ? (
                  <Sun className="size-3.5 text-muted-foreground/50" />
                ) : (
                  <Moon className="size-3.5 text-muted-foreground/50" />
                )}
                {theme === "dark" ? "Yorug' mavzu" : "Qorong'u mavzu"}
              </button>
            </div>

            <div className="border-t border-border/60">
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-500/8 transition-colors disabled:opacity-50"
              >
                <LogOut className="size-3.5" />
                Chiqish
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, setUser } = useAuthStore();
  const roleLinks = user ? (ROLE_LINKS[user.activeRole] ?? []) : [];

  const closeMobile = () => setMobileOpen(false);

  const switchRoleMutation = useMutation({
    mutationFn: (role: Role) => usersApi.switchRole(role),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ANIM_CSS }} />
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="h-0.5 bg-linear-to-r from-transparent via-gold/50 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-15 flex gap-4 items-center justify-between">
          <Link to="/" className="no-underline flex items-center">
            <span className="font-bold text-[18px] text-cream tracking-[-0.01em]">
              Planner
            </span>

            <span className="font-bold text-[18px] text-gold tracking-[-0.01em]">
              {" "}
              AI
            </span>
          </Link>

          <nav className="hidden md:flex h-full gap-5 ml-auto">
            {BROWSE_LINKS.map((link) => (
              <DesktopNavLink key={link.to} {...link} />
            ))}

            {roleLinks.length > 0 && (
              <div className="w-px bg-border/50 mx-1 my-5" />
            )}

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
                  className="hidden sm:inline-flex h-8 px-4 items-center text-[13px] font-medium text-foreground/70 hover:text-foreground border border-border hover:border-gold/30 rounded-lg transition-colors"
                >
                  Kirish
                </Link>

                <Link
                  to="/register"
                  className="inline-flex h-8 px-4 items-center text-[13px] font-semibold text-navy bg-gold hover:bg-gold-light rounded-lg shadow-[0_2px_10px_rgba(201,150,58,0.2)] hover:shadow-[0_2px_14px_rgba(201,150,58,0.3)] transition-all"
                >
                  Boshlash
                </Link>
              </>
            )}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:border-gold/30 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mob-menu md:hidden border-t border-border/60 bg-background px-4 py-3 flex flex-col gap-0.5">
            {BROWSE_LINKS.map((link) => (
              <MobileNavLink key={link.to} {...link} onClick={closeMobile} />
            ))}

            {roleLinks.length > 0 && (
              <>
                <div className="h-px bg-border/40 my-1.5" />
                {roleLinks.map((link) => (
                  <MobileNavLink
                    key={link.to}
                    {...link}
                    onClick={closeMobile}
                  />
                ))}
              </>
            )}

            {user && (
              <>
                <div className="h-px bg-border/40 my-1.5" />
                <div className="flex items-center gap-x-1 px-3 py-2">
                  {ROLES.map((role) => {
                    const isActive = user.activeRole === role;
                    return (
                      <button
                        key={role}
                        disabled={switchRoleMutation.isPending}
                        onClick={() => switchRoleMutation.mutate(role)}
                        className={cn(
                          "flex-1 px-2 py-2 rounded-md text-[11px] font-medium transition-all duration-150",
                          isActive
                            ? "bg-gold/15 text-gold border border-gold/30"
                            : "text-muted-foreground/60 hover:text-foreground/80 hover:bg-muted/30 border border-transparent",
                        )}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {!user && (
              <>
                <div className="h-px bg-border/40 my-1.5" />
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="flex items-center px-3 py-2.5 rounded-lg text-[14px] font-medium text-foreground/70 hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  Kirish
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobile}
                  className="flex items-center justify-center h-10 rounded-lg text-[14px] font-semibold text-navy bg-gold hover:bg-gold-light transition-colors mt-1"
                >
                  Boshlash
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
