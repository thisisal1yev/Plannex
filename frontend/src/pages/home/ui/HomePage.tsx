import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { eventsApi } from '@entities/event'
import { venuesApi } from '@entities/venue'
import { EventCard } from '@entities/event'
import { VenueCard } from '@entities/venue'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { eventKeys, venueKeys } from '@shared/api/queryKeys'

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconCalendar() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
    </svg>
  )
}
function IconTicket() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  )
}
function IconStar() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}
function IconArrow() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
  {
    num: '01',
    title: 'Maydon tanlang',
    desc: "Butun O'zbekiston bo'ylab yuzlab tekshirilgan maydonlardan tadbiringiz uchun ideal joyni toping.",
  },
  {
    num: '02',
    title: 'Xizmatlar qo\'shing',
    desc: "Katering, bezak, ovoz, foto — tekshirilgan ta'minotchilardan hamma zarur narsalarni bir joyda buyurtma qiling.",
  },
  {
    num: '03',
    title: 'Chiptalar soting',
    desc: "Chipta sotuvini ishga tushiring, ishtirokchilarni boshqaring va real vaqtda analitikani kuzating.",
  },
]

// ─── Categories ───────────────────────────────────────────────────────────────

const categories = [
  { label: 'Konsertlar', emoji: '🎵', to: '/events?type=Konsert', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { label: 'Konferensiyalar', emoji: '🎤', to: '/events?type=Konferensiya', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { label: "Ko'rgazmalar", emoji: '🖼️', to: "/events?type=Ko'rgazma", color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { label: 'Treninglar', emoji: '📚', to: '/events?type=Trening', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  { label: 'Festivallar', emoji: '🎪', to: '/events?type=Festival', color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
  { label: 'Ziyofatlar', emoji: '🎉', to: '/events?type=Ziyofat', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
]

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: '500+', label: 'Tadbirlar' },
  { value: '120+', label: 'Maydonlar' },
  { value: '80+', label: "Ta'minotchilar" },
  { value: '10K+', label: 'Ishtirokchilar' },
]

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
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Gradient blob */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            O'zbekistondagi №1 tadbirlar marketi
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
            Tadbirlarni{' '}
            <span className="text-primary">muammosiz</span>
            {' '}tashkil eting
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Planner AI tashkilotchilarga tadbirlarni tez va samarali ishga tushirishga yordam beradi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link to="/events">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <IconSearch />
                Tadbirlarni ko'rish
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Tadbir yaratish
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-xl py-3 px-4">
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-14 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Tadbir turlari</h2>
            <Link to="/events" className="text-sm text-primary hover:underline flex items-center gap-1">
              Barcha tadbirlar <IconArrow />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to={cat.to}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${cat.color} hover:opacity-80 transition-opacity cursor-pointer`}
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs font-medium text-center leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Events ── */}
      <section className="py-14 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Yaqinlashayotgan tadbirlar</h2>
              <p className="text-muted-foreground text-sm mt-1">O'zbekistonning dolzarb tadbirlari</p>
            </div>
            <Link to="/events" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
              Barcha tadbirlar <IconArrow />
            </Link>
          </div>
          {eventsLoading ? (
            <Spinner />
          ) : eventsData?.data.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Mavjud tadbirlar yo'q</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsData?.data.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
          <div className="mt-6 text-center sm:hidden">
            <Link to="/events">
              <Button variant="secondary">Barcha tadbirlar</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-14 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">Bu qanday ishlaydi</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Uch oddiy qadam — va tadbiringiz ishga tushishga tayyor
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative bg-card border border-border rounded-2xl p-6">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-3 z-10 text-muted-foreground/30">
                    <IconArrow />
                  </div>
                )}
                <div className="text-4xl font-black text-primary/15 mb-4 leading-none">{step.num}</div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Venues ── */}
      <section className="py-14 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Mashhur maydonlar</h2>
              <p className="text-muted-foreground text-sm mt-1">Tadbirlaringiz uchun eng yaxshi joylar</p>
            </div>
            <Link to="/venues" className="text-sm text-primary hover:underline hidden sm:flex items-center gap-1">
              Barcha maydonlar <IconArrow />
            </Link>
          </div>
          {venuesLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {venuesData?.data.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-14 border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">Tashkilotchi uchun hamma narsa</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Professional tadbirlarni tashkil etish uchun to'liq vositalar to'plami
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <IconCalendar />, title: 'Tadbirlarni boshqarish', desc: 'Bir necha bosish bilan tadbirlarni yarating, tahrirlang va nashr eting', color: 'text-primary bg-primary/10' },
              { icon: <IconBuilding />, title: 'Maydonlar bazasi', desc: "O'zbekistonning yirik shaharlarida 120 dan ortiq tekshirilgan maydonlar", color: 'text-emerald-600 bg-emerald-500/10' },
              { icon: <IconTicket />, title: 'Chipta sotish', desc: "Click va Payme qo'llab-quvvatlaydigan o'rnatilgan sotuv tizimi", color: 'text-amber-600 bg-amber-500/10' },
              { icon: <IconStar />, title: 'Reytinglar va sharhlar', desc: "Ishtirokchilarning haqiqiy sharhlari eng yaxshi ta'minotchilarni tanlashga yordam beradi", color: 'text-purple-600 bg-purple-500/10' },
            ].map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-2xl p-5">
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-14 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">Tariflar</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Bepul boshlang va o'sishingiz bilan kengaytiring
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: 'Bepul',
                price: '0',
                desc: 'Ishtirokchilar va boshlang\'ichlar uchun',
                features: ['Tadbirlarni ko\'rish', 'Chipta sotib olish', 'Shaxsiy kabinet', 'Sharhlar va reytinglar'],
                cta: 'Bepul boshlash',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '99 000',
                desc: 'Tadbir tashkilotchilari uchun',
                features: ['Oyiga 10 tagacha tadbir', 'Chipta sotish', 'Analitika va hisobotlar', 'Volontyorlarni boshqarish', 'Ustuvor qo\'llab-quvvatlash'],
                cta: '14 kun sinab ko\'ring',
                highlight: true,
              },
              {
                name: 'Biznes',
                price: '299 000',
                desc: 'Agentliklar va kompaniyalar uchun',
                features: ['Cheksiz tadbirlar', 'Multi-akkaunt', 'API kirish', 'Maxsus brending', 'Ajratilgan menejer'],
                cta: 'Biz bilan bog\'laning',
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 flex flex-col gap-5 ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card border-border'
                }`}
              >
                <div>
                  <p className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className={`text-sm ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {plan.price === '0' ? '' : " so'm/oy"}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${plan.highlight ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {plan.desc}
                  </p>
                </div>
                <ul className="flex flex-col gap-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <span className={`text-xs ${plan.highlight ? 'text-primary-foreground/80' : 'text-primary'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button
                    variant={plan.highlight ? 'secondary' : 'primary'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-14 border-t border-border bg-muted/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">Aloqa</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Savollaringiz bormi? Bizga yozing — ish kuni davomida javob beramiz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="flex flex-col gap-5">
              {[
                { emoji: '📍', title: 'Manzil', text: 'Toshkent sh., Amir Temur ko\'chasi, 107B' },
                { emoji: '📞', title: 'Telefon', text: '+998 71 200 00 00' },
                { emoji: '✉️', title: 'Email', text: 'hello@plannerai.uz' },
                { emoji: '🕐', title: 'Ish vaqti', text: 'Du–Ju, 9:00–18:00' },
              ].map(({ emoji, title, text }) => (
                <div key={title} className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
                  <span className="text-2xl">{emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Contact form */}
            <form className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Ism</label>
                  <input className="px-3 py-2.5 border border-border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" placeholder="Ismingiz" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input type="email" className="px-3 py-2.5 border border-border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" placeholder="email@example.com" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Mavzu</label>
                <input className="px-3 py-2.5 border border-border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground" placeholder="Qanday yordam bera olamiz?" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Xabar</label>
                <textarea rows={4} className="px-3 py-2.5 border border-border bg-background text-foreground rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground resize-none" placeholder="Savolingizni tasvirlab bering..." />
              </div>
              <Button className="w-full">Xabar yuborish</Button>
            </form>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-primary rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Tadbir boshlashga tayyormisiz?
              </h2>
              <p className="text-primary-foreground/70 text-lg mb-8 max-w-lg mx-auto">
                Planner AI orqali muvaffaqiyatli tadbirlarni allaqachon o'tkazayotgan yuzlab tashkilotchilarga qo'shiling
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/register">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Bepul boshlash
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto text-primary-foreground hover:bg-white/10">
                    Tadbirlarni ko'rish
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
