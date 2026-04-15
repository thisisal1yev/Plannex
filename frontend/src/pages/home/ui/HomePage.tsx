import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { eventsApi } from '@entities/event'
import { venuesApi } from '@entities/venue'
import { EventCard } from '@entities/event'
import { VenueCard } from '@entities/venue'
import { Spinner } from '@shared/ui/Spinner'
import { eventKeys, venueKeys } from '@shared/api/queryKeys'
import { cn } from '@shared/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { v: '500+', l: 'Tadbirlar' },
  { v: '120+', l: 'Maydonlar' },
  { v: '80+', l: "Ta'minotchilar" },
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

// ─── Ornament SVG ─────────────────────────────────────────────────────────────

function Ornament({ size = 380, op = 0.13 }: { size?: number; op?: number }) {
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
}

// ─── Section label ─────────────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <p className="text-gold mb-[10px] text-[11px] font-medium tracking-[0.18em] uppercase">
      {text}
    </p>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: eventKeys.list({ status: 'PUBLISHED', limit: 3 }),
    queryFn: () => eventsApi.list({ status: 'PUBLISHED', limit: 3 }),
  })
  const { data: venuesData, isLoading: venuesLoading } = useQuery({
    queryKey: venueKeys.list({ limit: 3 }),
    queryFn: () => venuesApi.list({ limit: 3 }),
  })

  return (
    <div className="bg-navy text-cream">
      {/* ════════════════════════════════ HERO ════════════════════════════════ */}
      <section className="lp-noise relative flex min-h-[calc(100vh-64px)] items-center overflow-hidden bg-[radial-gradient(ellipse_90%_55%_at_50%_-5%,rgba(76,140,167,0.09)_0%,transparent_68%),#0C1520]">
        {/* top line */}
        <div className="absolute top-0 right-0 left-0 h-px bg-[linear-gradient(90deg,transparent,#4c8ca7,transparent)] opacity-35" />

        <div className="lp-spin pointer-events-none absolute -top-[90px] -right-[90px] z-0">
          <Ornament size={480} op={0.1} />
        </div>

        <div className="lp-float pointer-events-none absolute -bottom-[70px] -left-[110px] z-0">
          <Ornament size={300} op={0.06} />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-28 text-center">
          {/* Badge */}
          <div className="lp-a lp-d1 text-gold-light border-gold/15 bg-gold/6 mb-8 inline-flex items-center gap-2 rounded-full border px-[18px] py-[6px] text-[12px] tracking-widest uppercase">
            <span className="bg-gold h-1.5 w-1.5 shrink-0 rounded-full" />
            O'zbekistondagi №1 tadbirlar marketi
          </div>

          {/* Headline */}
          <h1 className="lp-serif lp-a lp-d2 text-cream mb-6 text-[clamp(52px,9vw,96px)] leading-[1.03] font-bold tracking-[-0.02em]">
            Tadbirlarni <em className="lp-serif lp-gold-text">muommosiz</em>
            <br />
            tashkil eting
          </h1>

          {/* Sub */}
          <p className="lp-a lp-d3 text-clay mx-auto mb-[44px] max-w-[520px] text-lg leading-[1.75]">
            Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Planner AI tashkilotchilarga
            tadbirlarni tez va samarali ishga tushirishga yordam beradi.
          </p>

          {/* CTAs */}
          <div className="lp-a lp-d4 mb-[68px] flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/events" className="lp-btn-gold">
              Tadbirlarni ko'rish →
            </Link>
            <Link to="/register" className="lp-btn-outline">
              Tadbir yaratish
            </Link>
          </div>

          {/* Stats */}
          <div className="lp-a lp-d5 mx-auto grid max-w-[580px] grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="bg-gold/4 border-gold/15 rounded-xl border px-3 py-[18px]">
                <div className="lp-serif text-gold-light text-[30px] leading-none font-bold">
                  {s.v}
                </div>
                <div className="text-clay mt-[5px] text-[12px] tracking-[0.04em]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom fade */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[100px] bg-[linear-gradient(to_bottom,transparent,#0C1520)]" />
      </section>

      {/* ════════════════════════════════ MARQUEE ════════════════════════════ */}
      <div className="border-gold/15 bg-gold/2.5 overflow-hidden border-y py-[13px]">
        <div className="lp-mq">
          {[...MQ, ...MQ, ...MQ, ...MQ].map((item, i) => (
            <span
              key={i}
              className="text-clay mr-[44px] flex items-center gap-[44px] text-[12px] tracking-[0.14em] whitespace-nowrap uppercase"
            >
              {item}
              <span className="text-gold text-[7px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════ CATEGORIES ════════════════════════ */}
      <section className="bg-navy-2 px-6 py-[88px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label text="Kategoriyalar" />
              <h2 className="lp-serif text-cream text-[clamp(32px,5vw,46px)] leading-[1.1] font-bold">
                Tadbir turini tanlang
              </h2>
            </div>
            <Link
              to="/events"
              className="text-gold text-sm no-underline transition-opacity hover:opacity-70"
            >
              Barcha tadbirlar →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {CATS.map((c) => (
              <Link
                key={c.l}
                to={c.to}
                className="lp-cat border-gold/15 flex flex-col items-center gap-[10px] rounded-xl border bg-white/[0.018] px-[10px] py-[22px] no-underline"
              >
                <span className="text-[26px]">{c.e}</span>
                <span className="text-cream text-center text-[12px] leading-[1.3] font-medium">
                  {c.l}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ EVENTS ════════════════════════════ */}
      <section className="bg-navy px-6 py-[88px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label text="Tadbirlar" />
              <h2 className="lp-serif text-cream text-[clamp(32px,5vw,46px)] leading-[1.1] font-bold">
                Yaqinlashayotgan tadbirlar
              </h2>
              <p className="text-clay mt-2 text-[15px]">O'zbekistonning dolzarb tadbirlari</p>
            </div>
            <Link to="/events" className="text-gold text-sm no-underline">
              Barcha tadbirlar →
            </Link>
          </div>
          {eventsLoading ? (
            <Spinner />
          ) : eventsData?.data.length === 0 ? (
            <p className="text-clay py-12 text-center">Mavjud tadbirlar yo'q</p>
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
      <section id="how-it-works" className="bg-navy-3 border-gold/15 border-y px-6 py-[88px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-[72px] text-center">
            <Label text="Jarayon" />
            <h2 className="lp-serif text-cream text-[clamp(32px,5vw,48px)] font-bold">
              Bu qanday ishlaydi
            </h2>
            <p className="text-clay mx-auto mt-3 max-w-[380px] text-[15px] leading-relaxed">
              Uch oddiy qadam — va tadbiringiz ishga tushishga tayyor
            </p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="lp-serif mb-3 text-[88px] leading-none font-bold text-transparent select-none [-webkit-text-stroke:1px_rgba(76,140,167,0.18)]">
                  {s.n}
                </div>

                {i < 2 && (
                  <div className="absolute top-8 -right-7 z-10 hidden text-[22px] text-[rgba(76,140,167,0.15)] md:block">
                    →
                  </div>
                )}

                <div className="bg-gold mb-4 h-0.5 w-9 opacity-55" />

                <h3 className="text-cream mb-[10px] text-[19px] font-semibold">{s.t}</h3>

                <p className="text-clay text-sm leading-[1.75]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ VENUES ════════════════════════════ */}
      <section className="bg-navy-2 px-6 py-[88px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Label text="Maydonlar" />

              <h2 className="lp-serif text-cream text-[clamp(32px,5vw,46px)] leading-[1.1] font-bold">
                Mashhur maydonlar
              </h2>

              <p className="text-clay mt-2 text-[15px]">Tadbirlaringiz uchun eng yaxshi joylar</p>
            </div>

            <Link to="/venues" className="text-gold text-sm no-underline">
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
      <section id="features" className="bg-navy px-6 py-[88px]">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-16 text-center">
            <Label text="Imkoniyatlar" />
            <h2 className="lp-serif text-cream text-[clamp(32px,5vw,48px)] font-bold">
              Tashkilotchi uchun hamma narsa
            </h2>
            <p className="text-clay mt-3 text-[15px]">
              Professional tadbirlarni tashkil etish uchun to'liq vositalar to'plami
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATS.map((f) => (
              <div
                key={f.t}
                className="lp-card bg-gold/2.5 border-gold/15 rounded-2xl border px-[22px] py-7"
              >
                <div className="bg-gold/6 border-gold/15 mb-[18px] inline-flex h-[52px] w-[52px] items-center justify-center rounded-xl border text-[26px]">
                  {f.e}
                </div>
                <h3 className="text-cream mb-2 text-[16px] font-semibold">{f.t}</h3>
                <p className="text-clay text-sm leading-[1.65]">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ PRICING ═══════════════════════════ */}
      <section id="pricing" className="bg-navy-3 border-gold/15 border-t px-6 py-[88px]">
        <div className="mx-auto max-w-[960px]">
          <div className="mb-16 text-center">
            <Label text="Narxlar" />

            <h2 className="lp-serif text-cream text-[clamp(32px,5vw,48px)] font-bold">Tariflar</h2>

            <p className="text-clay mt-3 text-[15px]">
              Bepul boshlang va o'sishingiz bilan kengaytiring
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.n}
                className={cn(
                  'lp-card relative flex flex-col rounded-2xl px-6 py-8',
                  p.hot
                    ? 'border-gold border bg-[linear-gradient(160deg,rgba(76,140,167,0.12),rgba(76,140,167,0.04))]'
                    : 'border-gold/15 border bg-[rgba(255,255,255,0.018)]'
                )}
              >
                {p.hot && (
                  <div className="bg-primary absolute top-[-13px] left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[11px] font-bold tracking-[0.09em] whitespace-nowrap text-[#0C1520] uppercase">
                    Eng mashhur
                  </div>
                )}

                <p className="text-clay mb-[10px] text-[11px] tracking-[0.12em] uppercase">{p.n}</p>
                <div className="mb-1 flex items-baseline gap-1">
                  <span className={cn('lp-serif text-primary text-[38px] leading-none font-bold')}>
                    {p.p}
                  </span>

                  {p.per && <span className="text-clay text-[13px]">{p.per}</span>}
                </div>

                <p className="text-clay mb-6 text-[13px]">{p.desc}</p>

                <ul className="m-0 mb-7 flex flex-1 list-none flex-col gap-[10px] p-0">
                  {p.fs.map((f) => (
                    <li key={f} className="text-cream flex items-start gap-[10px] text-sm">
                      <span className="text-gold mt-[2px] shrink-0 text-[12px] font-bold">✓</span>
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
                      : 'border-gold/15 text-cream border bg-transparent'
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
      <section id="contact" className="bg-navy-2 px-6 py-[88px]">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-14 text-center">
            <Label text="Aloqa" />
            <h2 className="lp-serif text-cream text-[clamp(32px,5vw,48px)] font-bold">
              Biz bilan bog'laning
            </h2>
            <p className="text-clay mt-3 text-[15px]">
              Savollaringiz bormi? Ish kuni davomida javob beramiz
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Info cards */}
            <div className="flex flex-col gap-[14px]">
              {[
                {
                  ic: '📍',
                  t: 'Manzil',
                  v: "Toshkent, Amir Temur ko'chasi, 107B",
                },
                { ic: '📞', t: 'Telefon', v: '+998 71 200 00 00' },
                { ic: '✉️', t: 'Email', v: 'hello@plannerai.uz' },
                { ic: '🕐', t: 'Ish vaqti', v: 'Du–Ju, 9:00–18:00' },
              ].map((x) => (
                <div
                  key={x.t}
                  className="bg-gold/2.5 border-gold/15 flex items-start gap-4 rounded-xl border px-5 py-4"
                >
                  <span className="shrink-0 text-[22px]">{x.ic}</span>
                  <div>
                    <p className="text-gold-light mb-[3px] text-[12px] font-semibold tracking-[0.06em] uppercase">
                      {x.t}
                    </p>
                    <p className="text-clay text-sm">{x.v}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Form */}
            <form className="bg-gold/2.5 border-gold/15 flex flex-col gap-4 rounded-2xl border px-6 py-7">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gold mb-[7px] block text-[11px] tracking-widest uppercase">
                    Ism
                  </label>
                  <input className="lp-input" type="text" placeholder="Ismingiz" />
                </div>
                <div>
                  <label className="text-gold mb-[7px] block text-[11px] tracking-widest uppercase">
                    Email
                  </label>
                  <input className="lp-input" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <label className="text-gold mb-[7px] block text-[11px] tracking-widest uppercase">
                  Mavzu
                </label>
                <input className="lp-input" type="text" placeholder="Qanday yordam bera olamiz?" />
              </div>
              <div>
                <label className="text-gold mb-[7px] block text-[11px] tracking-widest uppercase">
                  Xabar
                </label>
                <textarea
                  className="lp-input resize-none"
                  rows={4}
                  placeholder="Savolingizni tasvirlab bering..."
                />
              </div>
              <button type="submit" className="lp-btn-gold w-full text-center">
                Xabar yuborish
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CTA ═══════════════════════════════ */}
      <section className="bg-navy px-6 py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="lp-noise border-gold/[0.28] relative overflow-hidden rounded-3xl border bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(76,140,167,0.07),transparent_70%)] px-[clamp(24px,5vw,80px)] py-[clamp(48px,8vw,88px)] text-center">
            <div className="pointer-events-none absolute -top-[30px] -right-[30px] opacity-[0.06]">
              <Ornament size={200} op={1} />
            </div>
            <div className="pointer-events-none absolute -bottom-[30px] -left-[30px] opacity-[0.05]">
              <Ornament size={160} op={1} />
            </div>

            <div className="relative z-10">
              <Label text="Hoziroq boshlang" />

              <h2 className="lp-serif text-cream mb-4 text-[clamp(34px,6vw,62px)] leading-[1.08] font-bold">
                Tadbir boshlashga <em className="lp-serif lp-gold-text">tayyormisiz?</em>
              </h2>

              <p className="text-clay mx-auto mb-11 max-w-[480px] text-[17px] leading-[1.75]">
                Planner AI orqali muvaffaqiyatli tadbirlarni allaqachon o'tkazayotgan yuzlab
                tashkilotchilarga qo'shiling
              </p>

              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/register" className="lp-btn-gold">
                  Bepul boshlash →
                </Link>

                <Link to="/events" className="lp-btn-outline">
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
