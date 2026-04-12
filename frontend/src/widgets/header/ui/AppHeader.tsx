import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Home, LogOut, User } from "lucide-react";
import { useAuthStore } from "@shared/model/auth.store";

const NAV = [
  { label: "Bu qanday ishlaydi", href: "/#how-it-works" },
  { label: "Imkoniyatlar",       href: "/#features" },
  { label: "Tariflar",           href: "/#pricing" },
  { label: "Aloqa",              href: "/#contact" },
];

const HEADER_ANIM_CSS = `
@keyframes hdr-menu-in {
  from { opacity:0; transform:translateY(-6px) scale(0.97) }
  to   { opacity:1; transform:translateY(0)   scale(1)    }
}
.hdr-menu { animation: hdr-menu-in 0.18s ease-out forwards; }
`;

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  if (!user) return null;

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const dashboardHref =
    user.activeRole === "ADMIN"      ? "/admin/dashboard" :
    user.activeRole === "ORGANIZER"  ? "/dashboard" :
    user.activeRole === "VENDOR"     ? "/my-venues" : "/events";

  function handleLogout() {
    logout();
    setOpen(false);
    navigate("/");
  }

  return (
    <div ref={ref} className="relative">
      <button
        className="rounded-full outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(201,150,58,0.4)]"
        onClick={() => setOpen((v) => !v)}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl} alt={user.firstName}
            className="w-8 h-8 rounded-full object-cover border-2 border-gold/35"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-gold to-gold-dark flex items-center justify-center text-xs font-bold text-navy">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div className="hdr-menu absolute right-0 z-50 mt-2.5 w-[228px] bg-[rgba(15,25,37,0.97)] border border-gold/18 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-b-gold/12">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.firstName} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-gold to-gold-dark flex items-center justify-center text-xs font-bold text-navy shrink-0">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-cream whitespace-nowrap overflow-hidden text-ellipsis">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-cream/45 whitespace-nowrap overflow-hidden text-ellipsis">
                {user.email}
              </p>
            </div>
          </div>

          <div className="py-1.5">
            {[
              { to: dashboardHref, label: "Boshqaruv paneli", Icon: Home },
              { to: "/profile", label: "Profil", Icon: User },
            ].map(({ to, label, Icon }) => (
              <Link
                key={to} to={to} onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-[9px] text-sm text-cream/70 no-underline transition-[color,background] duration-150 hover:text-gold-light hover:bg-gold/7"
              >
                <Icon className="w-[15px] h-[15px] opacity-50 shrink-0" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-t-gold/12 py-1.5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-4 py-[9px] text-sm text-red-400/80 bg-transparent border-none cursor-pointer transition-[color,background] duration-150 hover:text-red-500 hover:bg-red-500/7"
            >
              <LogOut className="w-[15px] h-[15px] opacity-70 shrink-0" strokeWidth={1.5} />
              Chiqish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AppHeader() {
  const user = useAuthStore((s) => s.user);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HEADER_ANIM_CSS }} />
      <header className="sticky top-0 z-40 w-full bg-navy-header/94 backdrop-blur-[14px] border-b border-b-gold/13">
        <div className="h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between gap-8">
          <Link to="/" className="no-underline shrink-0 flex items-center">
            <span className="font-bold text-[18px] text-cream tracking-[-0.01em]">Planner</span>
            <span className="font-bold text-[18px] text-gold tracking-[-0.01em]"> AI</span>
          </Link>

          <div className="flex items-center justify-between gap-5">
            <nav className="hidden md:flex gap-8">
              {NAV.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="group relative text-[14px] text-cream/55 no-underline transition-colors duration-200 pb-0.5 hover:text-gold-light"
                >
                  {label}
                  <span className="absolute bottom-[-2px] left-0 h-px w-0 bg-gold transition-[width] duration-250 ease-in-out group-hover:w-full" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2.5 shrink-0">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[14px] font-medium text-cream/80 no-underline py-[7px] px-4 border border-gold/22 rounded-[6px] transition-[border-color,color] duration-200 hover:border-gold/55 hover:text-gold-light"
                  >
                    Kirish
                  </Link>
                  <Link
                    to="/register"
                    className="text-[14px] font-semibold text-navy no-underline py-[7px] px-[18px] bg-linear-to-br from-gold to-gold-dark rounded-[6px] tracking-[0.01em] transition-[opacity,transform] duration-150 shadow-[0_2px_12px_rgba(201,150,58,0.25)] hover:opacity-90 hover:-translate-y-px"
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
  );
}
