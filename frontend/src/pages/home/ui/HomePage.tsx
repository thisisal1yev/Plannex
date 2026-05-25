import { memo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { eventsApi, EventCard } from '@entities/event'
import { venuesApi, VenueCard } from '@entities/venue'
import { Spinner } from '@shared/ui/Spinner'
import { eventKeys, venueKeys } from '@shared/api/queryKeys'
import { cn } from '@shared/lib/utils'

// ─── Telegram contact ─────────────────────────────────────────────────────────

type ContactForm = { name: string; email: string; subject: string; message: string }

const TG_TOKEN = import.meta.env.VITE_TG_BOT_TOKEN
const TG_CHAT  = import.meta.env.VITE_TG_CHAT_ID

async function sendToTelegram(data: ContactForm) {
  const text =
    `📬 <b>Yangi xabar</b>\n\n` +
    `👤 <b>Ism:</b> ${data.name}\n` +
    `✉️ <b>Email:</b> ${data.email}\n` +
    `📌 <b>Mavzu:</b> ${data.subject}\n\n` +
    `💬 ${data.message}`
  const ids = String(TG_CHAT).split(',').map((s) => s.trim())
  const results = await Promise.all(
    ids.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text, parse_mode: 'HTML' }),
      }),
    ),
  )
  if (results.some((r) => !r.ok)) throw new Error('Telegram error')
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { v: '500+', l: 'Tadbirlar' },
  { v: '120+', l: 'Maydonlar' },
  { v: '80+', l: 'Xizmatlar' },
  { v: '10K+', l: 'Ishtirokchilar' },
]

const CATS = [
  { l: 'Konsertlar', e: '🎵', to: '/events?type=Konsert' },
  { l: 'Konferensiyalar', e: '🎤', to: '/events?type=Konferensiya' },
  { l: "Ko'rgazmalar", e: '🖼️', to: "/events?type=Ko'rgazma" },
  { l: 'Treninglar', e: '📚', to: '/events?type=Trening' },
  { l: 'Festivallar', e: '🎪', to: '/events?type=Festival' },
  { l: 'Ziyofatlar', e: '🎉', to: '/events?type=Ziyofat' },
]

const MQ = [
  'Konsertlar',
  'Konferensiyalar',
  "Ko'rgazmalar",
  'Treninglar',
  'Festivallar',
  'Ziyofatlar',
  'Mitaplar',
  'Namoyishlar',
]

const MQ_EXPANDED = [...MQ, ...MQ, ...MQ, ...MQ]

const STEPS = [
  {
    n: '01',
    t: 'Maydon tanlang',
    d: "Butun O'zbekiston bo'ylab yuzlab tekshirilgan maydonlardan tadbiringiz uchun ideal joyni toping.",
  },
  {
    n: '02',
    t: "Xizmatlar qo'shing",
    d: "Katering, bezak, ovoz, foto — tekshirilgan ta'minotchilardan hamma zarur narsalarni bir joyda buyurtma qiling.",
  },
  {
    n: '03',
    t: 'Chiptalar soting',
    d: 'Chipta sotuvini ishga tushiring, ishtirokchilarni boshqaring va real vaqtda analitikani kuzating.',
  },
]

const FEATS = [
  {
    e: '📅',
    t: 'Tadbirlarni boshqarish',
    d: 'Bir necha bosish bilan tadbirlarni yarating, tahrirlang va nashr eting.',
  },
  {
    e: '🏛️',
    t: 'Maydonlar bazasi',
    d: "O'zbekistonning yirik shaharlarida 120 dan ortiq tekshirilgan maydonlar.",
  },
  {
    e: '🎫',
    t: 'Chipta sotish',
    d: "Click va Payme qo'llab-quvvatlaydigan o'rnatilgan sotuv tizimi.",
  },
  {
    e: '⭐',
    t: 'Reytinglar va sharhlar',
    d: "Ishtirokchilarning haqiqiy sharhlari eng yaxshi ta'minotchilarni tanlashga yordam beradi.",
  },
]

const PLANS = [
  {
    n: 'Bepul',
    p: '0',
    per: '',
    desc: "Boshlang'ichlar uchun",
    fs: ["Tadbirlarni ko'rish", 'Chipta sotib olish', 'Shaxsiy kabinet', 'Sharhlar'],
    cta: 'Bepul boshlash',
    hot: false,
  },
  {
    n: 'Pro',
    p: '99 000',
    per: " so'm/oy",
    desc: 'Tashkilotchilar uchun',
    fs: ['Oyiga 10 tadbir', 'Chipta sotish', 'Analitika', 'Volontyorlar', 'Ustuvor yordam'],
    cta: "14 kun sinab ko'ring",
    hot: true,
  },
  {
    n: 'Biznes',
    p: '299 000',
    per: " so'm/oy",
    desc: 'Kompaniyalar uchun',
    fs: ['Cheksiz tadbirlar', 'Multi-akkaunt', 'API kirish', 'Brending', 'Menejer'],
    cta: "Biz bilan bog'laning",
    hot: false,
  },
]

const CONTACT_INFO = [
  { ic: '📍', t: 'Manzil', v: "Farg'ona viloyati, Farg'ona ko'chasi 86 uy, Startup Markaz" },
  { ic: '📞', t: 'Telefon', v: '+998 94 991 96 69' },
  { ic: '✉️', t: 'Email', v: 'naymanbayevjavohir400@gmail.com' },
  { ic: '🕐', t: 'Ish vaqti', v: 'Du–Ju, 9:00–18:00' },
] as const

// ─── Ornament SVG ─────────────────────────────────────────────────────────────

const Ornament = memo(function Ornament({ size = 380, op = 0.13 }: { size?: number; op?: number }) {
  return (
    <svg
      className="text-primary"
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={{ opacity: op }}
    >
      <circle cx="120" cy="120" r="115" stroke="#4c8ca7" strokeWidth="0.6" strokeDasharray="5 5" />
      <polygon
        points="120,8 136,48 172,26 158,64 198,64 174,96 210,120 174,144 198,176 158,176 172,214 136,192 120,232 104,192 68,214 82,176 42,176 66,144 30,120 66,96 42,64 82,64 68,26 104,48"
        stroke="#4c8ca7"
        strokeWidth="0.9"
        fill="rgba(76,140,167,0.04)"
      />
      <polygon
        points="120,58 148,74 148,106 120,122 92,106 92,74"
        stroke="#4c8ca7"
        strokeWidth="0.7"
        fill="rgba(76,140,167,0.03)"
      />
      <polygon
        points="120,70 130,95 157,95 135,111 143,136 120,121 97,136 105,111 83,95 110,95"
        stroke="#4c8ca7"
        strokeWidth="0.6"
        fill="rgba(76,140,167,0.05)"
      />
      <circle cx="120" cy="120" r="5" fill="#4c8ca7" opacity="0.5" />
      <line x1="5" y1="120" x2="235" y2="120" stroke="#4c8ca7" strokeWidth="0.35" opacity="0.4" />
      <line x1="120" y1="5" x2="120" y2="235" stroke="#4c8ca7" strokeWidth="0.35" opacity="0.4" />
      <line x1="37" y1="37" x2="203" y2="203" stroke="#4c8ca7" strokeWidth="0.3" opacity="0.25" />
      <line x1="203" y1="37" x2="37" y2="203" stroke="#4c8ca7" strokeWidth="0.3" opacity="0.25" />
    </svg>
  )
})

// ─── Section label ─────────────────────────────────────────────────────────────

const Label = memo(function Label({ text }: { text: string }) {
  return (
    <p className="text-primary mb-2.5 text-[11px] font-medium tracking-[0.18em] uppercase">
      {text}
    </p>
  )
})

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { register, handleSubmit, reset } = useForm<ContactForm>()
  const contact = useMutation({ mutationFn: sendToTelegram, onSuccess: () => reset() })

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: eventKeys.list({ status: 'PUBLISHED', limit: 3 }),
    queryFn: () => eventsApi.list({ status: 'PUBLISHED', limit: 3 }),
  })
  const { data: venuesData, isLoading: venuesLoading } = useQuery({
    queryKey: venueKeys.list({ limit: 3 }),
    queryFn: () => venuesApi.list({ limit: 3 }),
  })

  return (
    <div className="dark:bg-navy dark:text-cream bg-white text-gray-900">
      {/* ════════════════════════════════ HERO ════════════════════════════════ */}
      <section className="lp-noise relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden bg-white bg-[radial-gradient(ellipse_90%_55%_at_50%_-5%,rgba(76,140,167,0.09)_0%,transparent_68%)] dark:bg-[radial-gradient(ellipse_0%_40%_at_50%_10%,rgba(76,140,167,0.07)_0%,rgba(12,21,32,1)_70%)]">
        {/* top line */}
        <div className="absolute top-0 right-0 left-0 h-px bg-[linear-gradient(90deg,transparent,#4c8ca7,transparent)] opacity-35" />

        <div className="lp-spin pointer-events-none absolute -top-22.5 -right-22.5 z-0">
          <Ornament size={480} op={0.1} />
        </div>

        <div className="lp-float pointer-events-none absolute -bottom-17.5 -left-27.5 z-0">
          <Ornament size={300} op={0.06} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 text-center">
          {/* Badge */}
          <div className="text-primary-light border-primary/15 bg-primary/6 mb-8 inline-flex animate-[lp-up_0.75s_ease-out_forwards] items-center gap-2 rounded-full border px-4.5 py-1.5 text-xs tracking-widest uppercase opacity-0 [animation-delay:0.08s]">
            <span className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full" />
            O'zbekistondagi №1 tadbirlar marketi
          </div>

          {/* Headline */}
          <h1 className="dark:text-cream mb-6 animate-[lp-up_0.75s_ease-out_forwards] font-serif text-[clamp(52px,9vw,96px)] leading-[1.03] font-bold tracking-[-0.02em] text-gray-900 opacity-0 [animation-delay:0.22s]">
            Tadbirlarni{' '}
            <em className="animate-[lp-shimmer_3s_linear_infinite] bg-[linear-gradient(90deg,#4c8ca7_0%,#7ab8cc_50%,#4c8ca7_100%)] bg-size-[200%_auto] bg-clip-text text-transparent not-italic">
              muommosiz
            </em>
            <br />
            tashkil eting
          </h1>

          {/* Sub */}
          <p className="text-slate mx-auto mb-11 max-w-130 animate-[lp-up_0.75s_ease-out_forwards] text-lg leading-[1.75] opacity-0 [animation-delay:0.36s]">
            Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Planner AI tashkilotchilarga
            tadbirlarni tez va samarali ishga tushirishga yordam beradi.
          </p>

          {/* CTAs */}
          <div className="mb-17 flex animate-[lp-up_0.75s_ease-out_forwards] flex-col justify-center gap-3 opacity-0 [animation-delay:0.5s] sm:flex-row">
            <Link to="/events" className="btn-primary">
              Tadbirlarni ko'rish →
            </Link>

            <Link to="/register" className="btn-outline">
              Tadbir yaratish
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-145 animate-[lp-up_0.75s_ease-out_forwards] grid-cols-2 gap-3 opacity-0 [animation-delay:0.64s] sm:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="bg-primary/4 border-primary/15 rounded-xl border px-3 py-4.5"
              >
                <div className="text-primary-light font-serif text-3xl leading-none font-bold">
                  {s.v}
                </div>
                <div className="text-slate mt-1.25 text-xs tracking-[0.04em]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom fade */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-25 bg-[linear-gradient(to_bottom,transparent,#ffffff)] dark:bg-[linear-gradient(to_bottom,transparent,#0C1520)]" />
      </section>

      {/* ════════════════════════════════ MARQUEE ════════════════════════════ */}
      <div className="border-primary/15 bg-primary/2.5 overflow-hidden border-y py-3.25">
        <div className="lp-mq">
          {MQ_EXPANDED.map((item, i) => (
            <span
              key={i}
              className="text-slate mr-11 flex items-center gap-11 text-xs tracking-[0.14em] whitespace-nowrap uppercase"
            >
              {item}
              <span className="text-primary text-[7px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════ CATEGORIES ════════════════════════ */}
      <section className="dark:bg-navy-2 bg-gray-50 px-6 py-22">
        <div className="mx-auto max-w-275">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label text="Kategoriyalar" />
              <h2 className="dark:text-cream font-serif text-[clamp(32px,5vw,46px)] leading-[1.1] font-bold text-gray-900">
                Tadbir turini tanlang
              </h2>
            </div>
            <Link
              to="/events"
              className="text-primary text-sm no-underline transition-opacity hover:opacity-70"
            >
              Barcha tadbirlar →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {CATS.map((c) => (
              <Link
                key={c.l}
                to={c.to}
                className="border-primary/15 hover:bg-primary/10 hover:border-primary/45 flex flex-col items-center gap-2.5 rounded-xl border bg-gray-50 px-2.5 py-5.5 no-underline transition-all duration-200 hover:-translate-y-0.75 dark:bg-white/[0.018]"
              >
                <span className="text-[26px]">{c.e}</span>
                <span className="dark:text-cream text-center text-xs leading-[1.3] font-medium text-gray-900">
                  {c.l}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ EVENTS ════════════════════════════ */}
      <section className="dark:bg-navy bg-white px-6 py-22">
        <div className="mx-auto max-w-275">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label text="Tadbirlar" />
              <h2 className="dark:text-cream font-serif text-[clamp(32px,5vw,46px)] leading-[1.1] font-bold text-gray-900">
                Yaqinlashayotgan tadbirlar
              </h2>
              <p className="text-slate mt-2 text-[15px]">O'zbekistonning dolzarb tadbirlari</p>
            </div>
            <Link to="/events" className="text-primary text-sm no-underline">
              Barcha tadbirlar →
            </Link>
          </div>
          {eventsLoading ? (
            <Spinner />
          ) : eventsData?.data.length === 0 ? (
            <p className="text-slate py-12 text-center">Mavjud tadbirlar yo'q</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {eventsData?.data.map((e, i) => (
                <EventCard
                  key={e.id}
                  event={e}
                  index={i}
                  className="hover:shadow-[0_28px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(76,140,167,0.14)]"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS ══════════════════════ */}
      <section
        id="how-it-works"
        className="dark:bg-navy-3 border-primary/15 border-y bg-slate-50 px-6 py-22"
      >
        <div className="mx-auto max-w-275">
          <div className="mb-18 text-center">
            <Label text="Jarayon" />
            <h2 className="dark:text-cream font-serif text-[clamp(32px,5vw,48px)] font-bold text-gray-900">
              Bu qanday ishlaydi
            </h2>
            <p className="text-slate mx-auto mt-3 max-w-95 text-[15px] leading-relaxed">
              Uch oddiy qadam — va tadbiringiz ishga tushishga tayyor
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="mb-3 font-serif text-[88px] leading-none font-bold text-transparent select-none [-webkit-text-stroke:1px_rgba(76,140,167,0.18)]">
                  {s.n}
                </div>

                {i < 2 && (
                  <div className="absolute top-8 -right-7 z-10 hidden text-[22px] text-[rgba(76,140,167,0.15)] md:block">
                    →
                  </div>
                )}

                <div className="bg-primary mb-4 h-0.5 w-9 opacity-55" />

                <h3 className="dark:text-cream mb-2.5 text-[19px] font-semibold text-gray-900">
                  {s.t}
                </h3>

                <p className="text-slate text-sm leading-[1.75]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ VENUES ════════════════════════════ */}
      <section className="dark:bg-navy-2 bg-gray-50 px-6 py-22">
        <div className="mx-auto max-w-275">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label text="Maydonlar" />

              <h2 className="dark:text-cream font-serif text-[clamp(32px,5vw,46px)] leading-[1.1] font-bold text-gray-900">
                Mashhur maydonlar
              </h2>

              <p className="text-slate mt-2 text-[15px]">Tadbirlaringiz uchun eng yaxshi joylar</p>
            </div>

            <Link to="/venues" className="text-primary text-sm no-underline">
              Barcha maydonlar →
            </Link>
          </div>

          {venuesLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {venuesData?.data.map((v, i) => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  index={i}
                  className="hover:shadow-[0_28px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(76,140,167,0.14)]"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════ FEATURES ══════════════════════════ */}
      <section id="features" className="dark:bg-navy bg-white px-6 py-22">
        <div className="mx-auto max-w-275">
          <div className="mb-16 text-center">
            <Label text="Imkoniyatlar" />
            <h2 className="dark:text-cream font-serif text-[clamp(32px,5vw,48px)] font-bold text-gray-900">
              Tashkilotchi uchun hamma narsa
            </h2>
            <p className="text-slate mt-3 text-[15px]">
              Professional tadbirlarni tashkil etish uchun to'liq vositalar to'plami
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATS.map((f) => (
              <div
                key={f.t}
                className="card-hover bg-primary/2.5 border-primary/15 rounded-2xl border px-5.5 py-7"
              >
                <div className="bg-primary/6 border-primary/15 mb-4.5 inline-flex h-13 w-13 items-center justify-center rounded-xl border text-[26px]">
                  {f.e}
                </div>
                <h3 className="dark:text-cream mb-2 text-base font-semibold text-gray-900">
                  {f.t}
                </h3>
                <p className="text-slate text-sm leading-[1.65]">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ PRICING ═══════════════════════════ */}
      <section
        id="pricing"
        className="dark:bg-navy-3 border-primary/15 border-t bg-slate-50 px-6 py-22"
      >
        <div className="mx-auto max-w-240">
          <div className="mb-16 text-center">
            <Label text="Narxlar" />
            <h2 className="dark:text-cream font-serif text-[clamp(32px,5vw,48px)] font-bold text-gray-900">
              Tariflar
            </h2>
            <p className="text-slate mt-3 text-[15px]">
              Bepul boshlang va o'sishingiz bilan kengaytiring
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.n}
                className={cn(
                  'card-hover',
                  'relative flex flex-col rounded-2xl px-6 py-8',
                  p.hot
                    ? 'border-primary border bg-[linear-gradient(160deg,rgba(76,140,167,0.07),rgba(76,140,167,0.03))] dark:bg-[linear-gradient(160deg,rgba(76,140,167,0.12),rgba(76,140,167,0.04))]'
                    : 'border-primary/15 border bg-gray-50 dark:bg-[rgba(255,255,255,0.018)]'
                )}
              >
                {p.hot && (
                  <div className="bg-primary absolute -top-3.25 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-bold tracking-[0.09em] whitespace-nowrap text-[#0C1520] uppercase">
                    Eng mashhur
                  </div>
                )}

                <p className="text-slate mb-2.5 text-[11px] tracking-[0.12em] uppercase">{p.n}</p>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className="text-primary font-serif text-[38px] leading-none font-bold">
                    {p.p}
                  </span>
                  {p.per && <span className="text-slate text-[13px]">{p.per}</span>}
                </div>

                <p className="text-slate mb-6 text-[13px]">{p.desc}</p>

                <ul className="m-0 mb-7 flex flex-1 list-none flex-col gap-2.5 p-0">
                  {p.fs.map((f) => (
                    <li
                      key={f}
                      className="dark:text-cream flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <span className="text-primary mt-0.5 shrink-0 text-xs font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={cn(
                    'block rounded-lg p-3 text-center text-sm font-semibold tracking-wide no-underline transition-opacity hover:opacity-80',
                    p.hot
                      ? 'bg-primary border-0 text-[#0C1520]'
                      : 'border-primary/15 dark:text-cream border bg-transparent text-gray-900'
                  )}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CONTACT ═══════════════════════════ */}
      <section id="contact" className="dark:bg-navy-2 bg-gray-50 px-6 py-22">
        <div className="mx-auto max-w-250">
          <div className="mb-14 text-center">
            <Label text="Aloqa" />
            <h2 className="dark:text-cream font-serif text-[clamp(32px,5vw,48px)] font-bold text-gray-900">
              Biz bilan bog'laning
            </h2>

            <p className="text-slate mt-3 text-[15px]">
              Savollaringiz bormi? Ish kuni davomida javob beramiz
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="flex flex-col gap-3.5">
              {CONTACT_INFO.map((x) => (
                <div
                  key={x.t}
                  className="bg-primary/2.5 border-primary/15 flex items-start gap-4 rounded-xl border px-5 py-4"
                >
                  <span className="shrink-0 text-[22px]">{x.ic}</span>

                  <div>
                    <p className="text-primary-light mb-0.75 text-xs font-semibold tracking-[0.06em] uppercase">
                      {x.t}
                    </p>

                    <p className="text-slate text-sm">{x.v}</p>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit((data) => contact.mutate(data))}
              className="bg-primary/2.5 border-primary/15 flex flex-col gap-4 rounded-2xl border px-6 py-7"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-primary mb-1.75 block text-[11px] tracking-widest uppercase">
                    Ism
                  </label>
                  <input
                    className="input-cls"
                    type="text"
                    placeholder="Ismingiz"
                    {...register('name', { required: true })}
                  />
                </div>

                <div>
                  <label className="text-primary mb-1.75 block text-[11px] tracking-widest uppercase">
                    Email
                  </label>
                  <input
                    className="input-cls"
                    type="email"
                    placeholder="email@example.com"
                    {...register('email', { required: true })}
                  />
                </div>
              </div>

              <div>
                <label className="text-primary mb-1.75 block text-[11px] tracking-widest uppercase">
                  Mavzu
                </label>
                <input
                  className="input-cls"
                  type="text"
                  placeholder="Qanday yordam bera olamiz?"
                  {...register('subject', { required: true })}
                />
              </div>

              <div>
                <label className="text-primary mb-1.75 block text-[11px] tracking-widest uppercase">
                  Xabar
                </label>
                <textarea
                  className="input-cls resize-none"
                  rows={4}
                  placeholder="Savolingizni tasvirlab bering..."
                  {...register('message', { required: true })}
                />
              </div>

              <button
                type="submit"
                disabled={contact.isPending}
                className="btn-primary w-full text-center disabled:opacity-60"
              >
                {contact.isPending ? 'Yuborilmoqda...' : 'Xabar yuborish'}
              </button>

              {contact.isSuccess && (
                <p className="text-center text-sm text-green-500">
                  Xabar yuborildi! Tez orada bog'lanamiz.
                </p>
              )}
              {contact.isError && (
                <p className="text-destructive text-center text-sm">
                  Xatolik yuz berdi. Keyinroq urinib ko'ring.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CTA ═══════════════════════════════ */}
      <section className="dark:bg-navy bg-white px-6 py-20">
        <div className="mx-auto max-w-275">
          <div className="lp-noise border-primary/[0.28] relative overflow-hidden rounded-3xl border bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(76,140,167,0.07),transparent_70%)] px-[clamp(24px,5vw,80px)] py-[clamp(48px,8vw,88px)] text-center">
            <div className="pointer-events-none absolute -top-7.5 -right-7.5">
              <Ornament size={200} op={1} />
            </div>

            <div className="pointer-events-none absolute -bottom-7.5 -left-7.5">
              <Ornament size={160} op={1} />
            </div>

            <div className="relative z-10">
              <Label text="Hoziroq boshlang" />

              <h2 className="dark:text-cream mb-4 font-serif text-[clamp(34px,6vw,62px)] leading-[1.08] font-bold text-gray-900">
                Tadbir boshlashga{' '}
                <em className="animate-[lp-shimmer_3s_linear_infinite] bg-[linear-gradient(90deg,#4c8ca7_0%,#7ab8cc_50%,#4c8ca7_100%)] bg-size-[200%_auto] bg-clip-text text-transparent not-italic">
                  tayyormisiz?
                </em>
              </h2>

              <p className="text-slate mx-auto mb-11 max-w-120 text-[17px] leading-[1.75]">
                Planner AI orqali muvaffaqiyatli tadbirlarni allaqachon o'tkazayotgan yuzlab
                tashkilotchilarga qo'shiling
              </p>

              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/register" className="btn-primary">
                  Bepul boshlash →
                </Link>

                <Link to="/events" className="btn-outline">
                  Tadbirlarni ko'rish
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
