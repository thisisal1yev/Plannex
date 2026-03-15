import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { authApi, usersApi } from "@entities/user";
import { useAuthStore } from "@shared/model/auth.store";
import type { LoginDto, RegisterDto } from "@entities/user";

// shared input class — adapts to dark theme via CSS vars
const inputCls =
  "w-full py-2.5 border border-border rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";

// ─── Left panel ──────────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-center gap-5 p-10 overflow-hidden bg-[#6B21E8]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800')",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-purple-800/80 via-purple-900/70 to-purple-950/90" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2">
        <span className="font-bold text-white text-2xl">Planner AI</span>
      </div>

      {/* Headline */}
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">
          AI yordamida unutilmas tadbirlar yarating.
        </h1>
        <p className="text-purple-200 text-sm leading-relaxed">
          Tadbirlarni g'oyadan amalga oshirishgacha boshqaring. O'zbekistonning
          minglab tashkilotchilariga qo'shiling va sohaning kelajagini birga quramiz.
        </p>
      </div>

      {/* Social proof */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex -space-x-2">
          {["#e879f9", "#a855f7", "#7c3aed", "#4f46e5"].map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: color }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}

          <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
            +2k
          </div>
        </div>

        <div>
          <div className="flex text-yellow-400 text-sm">{"★★★★★"}</div>
          <p className="text-purple-200 text-sm">Yetakchi agentliklar ishonadi</p>
        </div>
      </div>
    </div>
  );
}

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
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
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
      if (user.role === "ORGANIZER") navigate("/dashboard");
      else if (user.role === "ADMIN") navigate("/admin/users");
      else if (user.role === "VENDOR") navigate("/my-venues");
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
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="name@company.com"
            className={`${inputCls} pl-9 pr-3`}
            {...register("email", { required: "Majburiy maydon" })}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Parol</label>
          <button
            type="button"
            className="text-xs text-primary hover:underline"
          >
            Parolni unutdingizmi?
          </button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-medium rounded-lg text-sm transition-colors"
      >
        {mutation.isPending ? "Kirish…" : "Kirish"}
      </button>
    </form>
  );
}

// ─── Create Account form ──────────────────────────────────────────────────────

function CreateAccountForm() {
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterDto>({
    defaultValues: { role: "PARTICIPANT" },
  });

  const mutation = useMutation({
    mutationFn: async (dto: RegisterDto) => {
      const tokens = await authApi.register(dto);
      setTokens(tokens);
      const user = await usersApi.me();
      setUser(user);
      return user;
    },
    onSuccess: (user) => {
      if (user.role === "ORGANIZER") navigate("/dashboard");
      else navigate("/");
    },
    onError: () =>
      setError("email", {
        message: "Email allaqachon ishlatilmoqda yoki server xatoligi",
      }),
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ism" error={errors.firstName?.message}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Ali"
              className={`${inputCls} pl-9 pr-3`}
              {...register("firstName", { required: "Majburiy maydon" })}
            />
          </div>
        </Field>
        <Field label="Familiya" error={errors.lastName?.message}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Aliyev"
              className={`${inputCls} pl-9 pr-3`}
              {...register("lastName", { required: "Majburiy maydon" })}
            />
          </div>
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="name@company.com"
            className={`${inputCls} pl-9 pr-3`}
            {...register("email", { required: "Majburiy maydon" })}
          />
        </div>
      </Field>

      <Field label="Telefon (ixtiyoriy)">
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="tel"
            placeholder="+998901234567"
            className={`${inputCls} pl-9 pr-3`}
            {...register("phone")}
          />
        </div>
      </Field>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground">Parol</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Field label="Rol">
        <select className={`${inputCls} px-3`} {...register("role")}>
          <option value="PARTICIPANT">Ishtirokchi</option>
          <option value="ORGANIZER">Tashkilotchi</option>
        </select>
      </Field>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-medium rounded-lg text-sm transition-colors"
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
    <div className="min-h-screen flex">
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {tab === "signin" ? "Xush kelibsiz" : "Akkaunt yarating"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "signin"
                ? "Tizimga kirish uchun ma'lumotlarni kiriting."
                : "Ishni boshlash uchun formani to'ldiring."}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab("signin")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                tab === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Kirish
            </button>
            <button
              onClick={() => setTab("register")}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                tab === "register"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          {/* Google button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors mb-4"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
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
            Google orqali kirish
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              YOKI EMAIL
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          {tab === "signin" ? <SignInForm /> : <CreateAccountForm />}

          {/* Terms */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            Davom etish orqali siz{" "}
            <a href="#" className="underline hover:text-foreground">
              Foydalanish shartlari
            </a>{" "}
            va{" "}
            <a href="#" className="underline hover:text-foreground">
              Maxfiylik siyosati
            </a>
            {" "}bilan rozisiz
          </p>
        </div>
      </div>
    </div>
  );
}
