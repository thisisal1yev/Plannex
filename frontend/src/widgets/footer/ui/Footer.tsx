import { Link } from "react-router";

// ─── Social icons ─────────────────────────────────────────────────────────────

function IconTelegram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLS = [
  {
    title: "Platforma",
    links: [
      { label: "Tadbirlar", to: "/events" },
      { label: "Maydonlar", to: "/venues" },
      { label: "Ta'minotchilar", to: "/services" },
      { label: "Tariflar", to: "/#pricing" },
    ],
  },
  {
    title: "Tashkilotchilarga",
    links: [
      { label: "Bu qanday ishlaydi", to: "/#how-it-works" },
      { label: "Tadbir yaratish", to: "/register" },
      { label: "Imkoniyatlar", to: "/#features" },
      { label: "Aloqa", to: "/#contact" },
    ],
  },
  {
    title: "Kompaniya",
    links: [
      { label: "Biz haqimizda", to: "/about" },
      { label: "Blog", to: "/blog" },
      { label: "Maxfiylik siyosati", to: "/privacy" },
      { label: "Foydalanish shartlari", to: "/terms" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Telegram",
    icon: <IconTelegram />,
    href: "https://t.me/plannerai_uz",
  },
  {
    label: "Instagram",
    icon: <IconInstagram />,
    href: "https://instagram.com/plannerai.uz",
  },
  {
    label: "YouTube",
    icon: <IconYoutube />,
    href: "https://youtube.com/@plannerai",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-navy-dark border-t border-t-gold/13">
      <div className="h-px bg-linear-to-r from-transparent via-gold/35 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 pt-14 pb-9">
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 mb-12 sm:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3.5">
            <Link to="/" className="no-underline inline-flex items-center">
              <span className="font-bold text-[17px] text-cream tracking-[-0.01em]">
                Planner
              </span>
              <span className="font-bold text-[17px] text-gold tracking-[-0.01em]">
                {" "}
                AI
              </span>
            </Link>

            <p className="text-[13px] text-cream/38 leading-[1.7] max-w-[220px]">
              O'zbekistondagi №&nbsp;1 tadbirlar marketi. Maydonlar, xizmatlar
              va chiptalar — hammasi bir joyda.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2 mt-1">
              {SOCIALS.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-[34px] h-[34px] border border-gold/18 rounded-[8px] text-cream/45 no-underline transition-[color,border-color,background] duration-200 hover:text-gold hover:border-gold/45 hover:bg-gold/6"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-3.5">
              <p className="text-xs font-semibold text-gold tracking-widest uppercase">
                {title}
              </p>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-[13px] text-cream/42 no-underline leading-none transition-colors duration-200 hover:text-gold"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-t-gold/10 pt-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-cream/28 tracking-[0.02em]">
            © {new Date().getFullYear()} Planner AI. Barcha huquqlar
            himoyalangan.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Maxfiylik", to: "/privacy" },
              { label: "Shartlar", to: "/terms" },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-[13px] text-cream/42 no-underline leading-none transition-colors duration-200 hover:text-gold"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
