import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@shared/model/auth.store";

const NAV = [
  { label: "Imkoniyatlar",       href: "/#features" },
  { label: "Bu qanday ishlaydi", href: "/#how-it-works" },
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
    user.role === "ADMIN"      ? "/admin/dashboard" :
    user.role === "ORGANIZER"  ? "/dashboard" :
    user.role === "VENDOR"     ? "/my-venues" : "/events";

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
              { to: dashboardHref, label: "Boshqaruv paneli", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { to: "/profile",    label: "Profil",           icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
            ].map(({ to, label, icon }) => (
              <Link
                key={to} to={to} onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-[9px] text-sm text-cream/70 no-underline transition-[color,background] duration-150 hover:text-gold-light hover:bg-gold/7"
              >
                <svg className="w-[15px] h-[15px] opacity-50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-t-gold/12 py-1.5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-4 py-[9px] text-sm text-red-400/80 bg-transparent border-none cursor-pointer transition-[color,background] duration-150 hover:text-red-500 hover:bg-red-500/7"
            >
              <svg className="w-[15px] h-[15px] opacity-70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
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
