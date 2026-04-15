import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { authApi, usersApi } from "@entities/user";
import { useAuthStore } from "@shared/model/auth.store";
import type { LoginDto, RegisterDto } from "@entities/user";

// ─── Decorative elements ──────────────────────────────────────────────────────

function OrnamentStar({
  size = 200,
  op = 0.12,
}: {
  size?: number;
  op?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      style={{ opacity: op }}
    >
      <polygon
        points="100,6 116,60 172,60 127,94 144,148 100,115 56,148 73,94 28,60 84,60"
        stroke="#4c8ca7"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="100,22 112,58 150,58 120,80 132,116 100,95 68,116 80,80 50,58 88,58"
        stroke="#4c8ca7"
        strokeWidth="0.7"
        fill="none"
      />
      <polygon
        points="100,40 108,65 134,65 114,80 122,106 100,91 78,106 86,80 66,65 92,65"
        stroke="#4c8ca7"
        strokeWidth="0.5"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="6"
        stroke="#4c8ca7"
        strokeWidth="0.7"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="12"
        stroke="#4c8ca7"
        strokeWidth="0.4"
        fill="none"
      />
      <circle
        cx="100"
        cy="100"
        r="20"
        stroke="#4c8ca7"
        strokeWidth="0.3"
        fill="none"
      />
    </svg>
  );
}

function TilePattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="auth-tile"
          x="0"
          y="0"
          width="88"
          height="88"
          patternUnits="userSpaceOnUse"
        >
          <polygon
            points="44,5 53,32 80,32 59,49 67,76 44,59 21,76 29,49 8,32 35,32"
            fill="none"
            stroke="rgba(76,140,167,0.07)"
            strokeWidth="0.7"
          />
          <circle
            cx="44"
            cy="44"
            r="5"
            fill="none"
            stroke="rgba(76,140,167,0.05)"
            strokeWidth="0.5"
          />
          <line
            x1="44"
            y1="0"
            x2="44"
            y2="88"
            stroke="rgba(76,140,167,0.02)"
            strokeWidth="0.4"
          />
          <line
            x1="0"
            y1="44"
            x2="88"
            y2="44"
            stroke="rgba(76,140,167,0.02)"
            strokeWidth="0.4"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#auth-tile)" />
    </svg>
  );
}

// ─── Shared input style ────────────────────────────────────────────────────────

const inputCls = [
  "w-full h-11 rounded-[8px]",
  "bg-[rgba(15,25,37,0.6)] border border-white/8",
  "text-[14px] text-cream placeholder:text-cream/22",
  "transition-[border-color,box-shadow] duration-200",
  "focus:outline-none focus:border-gold/40 focus:shadow-[0_0_0_3px_rgba(76,140,167,0.07)]",
].join(" ");

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-cream/45 tracking-widest uppercase">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-[11px] text-red-400/90 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400/90 shrink-0" />

          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

// ─── Sign In form ─────────────────────────────────────────────────────────────

function SignInForm() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginDto>();

  const mutation = useMutation({
    mutationFn: async (dto: LoginDto) => {
      const tokens = await authApi.login(dto);
      setTokens(tokens);
      const user = await usersApi.me();
      setUser(user);
      return user;
    },
    onSuccess: (user) => {
      if (user.activeRole === "ORGANIZER") navigate("/dashboard");
      else if (user.activeRole === "ADMIN") navigate("/admin/users");
      else if (user.activeRole === "VENDOR") navigate("/my-venues");
      else navigate("/");
    },
    onError: () =>
      setError("password", { message: "Noto'g'ri email yoki parol" }),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex flex-col gap-4"
    >
      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-cream/25 pointer-events-none" />

          <input
            type="email"
            placeholder="name@example.com"
            className={`${inputCls} pl-9 pr-3`}
            {...register("email", { required: "Majburiy maydon" })}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-cream/45 tracking-widest uppercase">
            Parol
          </label>

          <button
            type="button"
            className="text-[12px] text-gold/60 hover:text-gold transition-colors duration-150"
          >
            Unutdingizmi?
          </button>
        </div>

        <label className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-cream/25 pointer-events-none" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`${inputCls} pl-9 pr-10`}
            {...register("password", {
              required: "Majburiy maydon",
              minLength: { value: 8, message: "Min. 8 belgi" },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/25 hover:text-cream/55 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </label>

        {errors.password && (
          <p className="text-[11px] text-red-400/90 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-400/90 shrink-0" />
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-11 bg-linear-to-r from-gold to-gold-dark text-navy font-semibold text-sm rounded-md -tracking-tight transition-all duration-200 hover:opacity-90 disabled:opacity-50 shadow-[0_4px_20px_rgba(76,140,167,0.25)] mt-1"
      >
        {mutation.isPending ? "Kirish…" : "Kirish"}
      </button>
    </form>
  );
}

// ─── Register form ─────────────────────────────────────────────────────────────

function CreateAccountForm() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<RegisterDto>({
    defaultValues: { role: "PARTICIPANT" },
  });

  const roleValue = watch("role");

  const mutation = useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const tokens = await authApi.register(dto);
      setTokens(tokens);
      const user = await usersApi.me();
      setUser(user);
      return user;
    },
    onSuccess: (user) => {
      if (user.activeRole === "ORGANIZER") navigate("/dashboard");
      else navigate("/");
    },
    onError: () =>
      setError("email", { message: "Email allaqachon ishlatilmoqda" }),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex flex-col gap-3.5"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ism" error={errors.firstName?.message}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-cream/25 pointer-events-none" />

            <input
              placeholder="Ali"
              className={`${inputCls} pl-9 pr-3`}
              {...register("firstName", { required: "Majburiy" })}
            />
          </div>
        </Field>

        <Field label="Familiya" error={errors.lastName?.message}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-cream/25 pointer-events-none" />

            <input
              placeholder="Aliyev"
              className={`${inputCls} pl-9 pr-3`}
              {...register("lastName", { required: "Majburiy" })}
            />
          </div>
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-cream/25 pointer-events-none" />

          <input
            type="email"
            placeholder="name@example.com"
            className={`${inputCls} pl-9 pr-3`}
            {...register("email", { required: "Majburiy maydon" })}
          />
        </div>
      </Field>

      <Field label="Telefon (ixtiyoriy)">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-cream/25 pointer-events-none" />

          <input
            type="tel"
            placeholder="+998901234567"
            className={`${inputCls} pl-9 pr-3`}
            {...register("phone")}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-cream/45 tracking-widest uppercase">
          Parol
        </label>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-cream/25 pointer-events-none" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={`${inputCls} pl-9 pr-10`}
            {...register("password", {
              required: "Majburiy maydon",
              minLength: { value: 8, message: "Min. 8 belgi" },
            })}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/25 hover:text-cream/55 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {errors.password && (
          <p className="text-[11px] text-red-400/90 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-400/90 shrink-0" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Role selector — card style */}
      <input type="hidden" {...register("role")} />
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-cream/45 tracking-widest uppercase">
          Ro'l
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            {
              value: "PARTICIPANT" as const,
              label: "Ishtirokchi",
              desc: "Tadbirlarga qatnashish",
            },
            {
              value: "ORGANIZER" as const,
              label: "Tashkilotchi",
              desc: "Tadbirlar yaratish",
            },
          ].map(({ value, label, desc }) => {
            const active = roleValue === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setValue("role", value)}
                className={`text-left p-3 rounded-[8px] border transition-[border-color,background,box-shadow] duration-200 ${
                  active
                    ? "border-gold/45 bg-gold/5 shadow-[inset_0_0_0_1px_rgba(76,140,167,0.12)]"
                    : "border-white/8 bg-transparent hover:border-white/16 hover:bg-white/2"
                }`}
              >
                <p
                  className={`text-[13px] font-semibold leading-none mb-1 ${active ? "text-gold" : "text-cream/70"}`}
                >
                  {label}
                </p>

                <p className="text-[11px] text-cream/30 leading-tight">
                  {desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full h-11 bg-linear-to-r from-gold to-gold-dark text-navy font-semibold text-sm rounded-md -tracking-tight transition-all duration-200 hover:opacity-90 disabled:opacity-50 shadow-[0_4px_20px_rgba(76,140,167,0.25)] mt-1"
      >
        {mutation.isPending ? "Yaratilmoqda…" : "Akkaunt yaratish"}
      </button>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "signin" | "register";

export function AuthPage() {
  const location = useLocation();
  const [tab, setTab] = useState<Tab>(
    location.pathname === "/register" ? "register" : "signin",
  );

  return (
    <div className="min-h-screen flex bg-navy">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden bg-navy-dark">
        <TilePattern />

        {/* Radial gold glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 55% at 35% 55%, rgba(76,140,167,0.055) 0%, transparent 65%)",
          }}
        />

        {/* Corner ornaments */}
        <div className="absolute -top-16 -right-16 pointer-events-none">
          <OrnamentStar size={300} op={0.08} />
        </div>

        <div className="absolute -bottom-10 -left-10 pointer-events-none">
          <OrnamentStar size={200} op={0.055} />
        </div>

        {/* Top gold line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(76,140,167,0.38), transparent)",
          }}
        />

        {/* Logo */}
        <Link to={"/"} className="relative z-10 flex items-center">
          <span className="font-bold text-xl text-cream tracking-[-0.01em]">
            Planner
          </span>

          <span className="font-bold text-xl text-gold tracking-[-0.01em]">
            &nbsp;AI
          </span>
        </Link>

        {/* Center content */}
        <div className="relative z-10 flex flex-col gap-6">
          <div>
            <div
              className="lp-a lp-d1 inline-flex items-center gap-2 mb-8 rounded-full text-[12px] text-gold-light tracking-widest uppercase border border-gold/15 bg-gold/6"
              style={{ padding: "6px 18px" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              O'zbekistondagi №1 tadbirlar marketi
            </div>

            <h1
              className="lp-serif"
              style={{
                fontSize: "clamp(88px, 4.5vw, 56px)",
                fontWeight: 700,
                color: "#F0E8D4",
                lineHeight: 1.0,
                letterSpacing: "-0.015em",
                marginBottom: "20px",
              }}
            >
              Tadbirlarni&nbsp;
              <br className="block 2xl:hidden" />
              <em
                className="lp-serif"
                style={{ color: "#4c8ca7", fontStyle: "italic" }}
              >
                muammosiz
              </em>
              <br />
              tashkil eting.
            </h1>

            <p className="text-[14px] text-cream/42 leading-[1.8] max-w-[320px]">
              Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Minglab
              tashkilotchilarga qo'shiling.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { v: "2,000+", l: "Tashkilotchi" },
              { v: "500+", l: "Maydon" },
              { v: "98%", l: "Qoniqish" },
            ].map((s) => (
              <div
                key={s.l}
                className="border border-gold/10 rounded-xl p-3.5 bg-gold/3"
              >
                <div
                  className="lp-serif leading-none mb-1.5"
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: "#4c8ca7",
                  }}
                >
                  {s.v}
                </div>

                <div className="text-[11px] text-cream/38 tracking-wide">
                  {s.l}
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3.5">
            <div className="flex -space-x-2">
              {["#4c8ca7", "#9E7220", "#E8C06A", "#7A6D59"].map((bg, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-navy-dark flex items-center justify-center text-navy text-[11px] font-bold shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>

            <div>
              <div className="text-gold text-[12px] tracking-widest">★★★★★</div>
              <p className="text-[11px] text-cream/38 mt-0.5">
                Yetakchi agentliklar ishonadi
              </p>
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div
          className="relative z-10 h-px"
          style={{
            background:
              "linear-gradient(90deg, rgba(76,140,167,0.22), transparent)",
          }}
        />
      </div>

      {/* ── Right auth panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <h1 className="flex items-center mb-8 lg:hidden">
            <span className="font-bold text-[18px] text-cream tracking-[-0.01em]">
              Planner
            </span>

            <span className="font-bold text-[18px] text-gold tracking-[-0.01em]">
              &nbsp;AI
            </span>
          </h1>

          {/* Heading — re-animates on tab change via key */}
          <div key={`heading-${tab}`} className="mb-7 auth-a auth-d1">
            <p className="text-[10px] text-gold/60 tracking-[0.14em] uppercase mb-2">
              {tab === "signin" ? "Xush kelibsiz" : "Yangi akkaunt"}
            </p>

            <h2
              className="lp-serif leading-[1.08]"
              style={{
                fontSize: "clamp(28px, 5vw, 34px)",
                fontWeight: 700,
                color: "#F0E8D4",
              }}
            >
              {tab === "signin" ? "Akkauntingizga kirish" : "Ro'yxatdan o'tish"}
            </h2>
          </div>

          {/* Tab switcher */}
          <div className="relative flex border-b border-white/7 mb-7 auth-a auth-d1">
            <button
              onClick={() => setTab("signin")}
              className={`flex-1 pb-3 text-[13px] font-medium transition-colors duration-200 ${
                tab === "signin"
                  ? "text-cream"
                  : "text-cream/32 hover:text-cream/60"
              }`}
            >
              Kirish
            </button>

            <button
              onClick={() => setTab("register")}
              className={`flex-1 pb-3 text-[13px] font-medium transition-colors duration-200 ${
                tab === "register"
                  ? "text-cream"
                  : "text-cream/32 hover:text-cream/60"
              }`}
            >
              Ro'yxatdan o'tish
            </button>

            {/* Sliding gold indicator */}
            <div
              className="absolute bottom-0 h-[2px] bg-linear-to-r from-gold to-gold-light rounded-full transition-all duration-300 ease-in-out"
              style={{ left: tab === "signin" ? "0" : "50%", width: "50%" }}
            />
          </div>

          {/* Form — re-animates on tab change */}
          <div key={`form-${tab}`} className="auth-a auth-d2">
            {tab === "signin" ? <SignInForm /> : <CreateAccountForm />}
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 my-5 auth-a auth-d3">
            <div className="flex-1 h-px bg-white/6" />

            <span className="text-[10px] text-cream/25 tracking-[0.12em] uppercase font-medium">
              yoki
            </span>

            <div className="flex-1 h-px bg-white/6" />
          </div>

          {/* Google button */}
          <button
            type="button"
            className="auth-a auth-d3 w-full flex items-center justify-center gap-2.5 h-11 border border-white/8 rounded-[8px] text-[13px] font-medium text-cream/65 hover:text-cream hover:border-gold hover:bg-gold/10 transition-[color,border-color,background] duration-300 group"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>

            <span className="group-hover:text-gold transition-colors duration-300">
              Google orqali davom etish
            </span>
          </button>

          {/* Terms */}
          <p className="auth-a auth-d4 text-[11px] text-center text-cream/24 mt-5 leading-[1.7]">
            Davom etish orqali{" "}
            <Link
              to="/terms"
              className="text-cream/40 hover:text-gold transition-colors underline underline-offset-2 decoration-cream/20 hover:decoration-gold/50"
            >
              Foydalanish shartlari
            </Link>{" "}
            va{" "}
            <Link
              to="/privacy"
              className="text-cream/40 hover:text-gold transition-colors underline underline-offset-2 decoration-cream/20 hover:decoration-gold/50"
            >
              Maxfiylik siyosati
            </Link>{" "}
            bilan rozisiz
          </p>
        </div>
      </div>
    </div>
  );
}
