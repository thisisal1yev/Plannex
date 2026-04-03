import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { eventsApi } from "@entities/event";
import { venuesApi } from "@entities/venue";
import { EventCard } from "@entities/event";
import { VenueCard } from "@entities/venue";
import { Spinner } from "@shared/ui/Spinner";
import { eventKeys, venueKeys } from "@shared/api/queryKeys";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { v: "500+", l: "Tadbirlar" },
  { v: "120+", l: "Maydonlar" },
  { v: "80+", l: "Ta'minotchilar" },
  { v: "10K+", l: "Ishtirokchilar" },
];

const CATS = [
  { l: "Konsertlar", e: "🎵", to: "/events?type=Konsert" },
  { l: "Konferensiyalar", e: "🎤", to: "/events?type=Konferensiya" },
  { l: "Ko'rgazmalar", e: "🖼️", to: "/events?type=Ko'rgazma" },
  { l: "Treninglar", e: "📚", to: "/events?type=Trening" },
  { l: "Festivallar", e: "🎪", to: "/events?type=Festival" },
  { l: "Ziyofatlar", e: "🎉", to: "/events?type=Ziyofat" },
];

const STEPS = [
  {
    n: "01",
    t: "Maydon tanlang",
    d: "Butun O'zbekiston bo'ylab yuzlab tekshirilgan maydonlardan tadbiringiz uchun ideal joyni toping.",
  },
  {
    n: "02",
    t: "Xizmatlar qo'shing",
    d: "Katering, bezak, ovoz, foto — tekshirilgan ta'minotchilardan hamma zarur narsalarni bir joyda buyurtma qiling.",
  },
  {
    n: "03",
    t: "Chiptalar soting",
    d: "Chipta sotuvini ishga tushiring, ishtirokchilarni boshqaring va real vaqtda analitikani kuzating.",
  },
];

const FEATS = [
  {
    e: "📅",
    t: "Tadbirlarni boshqarish",
    d: "Bir necha bosish bilan tadbirlarni yarating, tahrirlang va nashr eting.",
  },
  {
    e: "🏛️",
    t: "Maydonlar bazasi",
    d: "O'zbekistonning yirik shaharlarida 120 dan ortiq tekshirilgan maydonlar.",
  },
  {
    e: "🎫",
    t: "Chipta sotish",
    d: "Click va Payme qo'llab-quvvatlaydigan o'rnatilgan sotuv tizimi.",
  },
  {
    e: "⭐",
    t: "Reytinglar va sharhlar",
    d: "Ishtirokchilarning haqiqiy sharhlari eng yaxshi ta'minotchilarni tanlashga yordam beradi.",
  },
];

const PLANS = [
  {
    n: "Bepul",
    p: "0",
    per: "",
    desc: "Boshlang'ichlar uchun",
    fs: [
      "Tadbirlarni ko'rish",
      "Chipta sotib olish",
      "Shaxsiy kabinet",
      "Sharhlar",
    ],
    cta: "Bepul boshlash",
    hot: false,
  },
  {
    n: "Pro",
    p: "99 000",
    per: " so'm/oy",
    desc: "Tashkilotchilar uchun",
    fs: [
      "Oyiga 10 tadbir",
      "Chipta sotish",
      "Analitika",
      "Volontyorlar",
      "Ustuvor yordam",
    ],
    cta: "14 kun sinab ko'ring",
    hot: true,
  },
  {
    n: "Biznes",
    p: "299 000",
    per: " so'm/oy",
    desc: "Kompaniyalar uchun",
    fs: [
      "Cheksiz tadbirlar",
      "Multi-akkaunt",
      "API kirish",
      "Brending",
      "Menejer",
    ],
    cta: "Biz bilan bog'laning",
    hot: false,
  },
];

const MQ = [
  "Konsertlar",
  "Konferensiyalar",
  "Ko'rgazmalar",
  "Treninglar",
  "Festivallar",
  "Ziyofatlar",
  "Mitaplar",
  "Namoyishlar",
];

// ─── Ornament SVG ─────────────────────────────────────────────────────────────

function Ornament({ size = 380, op = 0.13 }: { size?: number; op?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      fill="none"
      style={{ opacity: op }}
    >
      <circle
        cx="120"
        cy="120"
        r="115"
        stroke="#C9963A"
        strokeWidth="0.6"
        strokeDasharray="5 5"
      />
      <polygon
        points="120,8 136,48 172,26 158,64 198,64 174,96 210,120 174,144 198,176 158,176 172,214 136,192 120,232 104,192 68,214 82,176 42,176 66,144 30,120 66,96 42,64 82,64 68,26 104,48"
        stroke="#C9963A"
        strokeWidth="0.9"
        fill="rgba(201,150,58,0.04)"
      />
      <polygon
        points="120,58 148,74 148,106 120,122 92,106 92,74"
        stroke="#C9963A"
        strokeWidth="0.7"
        fill="rgba(201,150,58,0.03)"
      />
      <polygon
        points="120,70 130,95 157,95 135,111 143,136 120,121 97,136 105,111 83,95 110,95"
        stroke="#C9963A"
        strokeWidth="0.6"
        fill="rgba(201,150,58,0.05)"
      />
      <circle cx="120" cy="120" r="5" fill="#C9963A" opacity="0.5" />
      <line
        x1="5"
        y1="120"
        x2="235"
        y2="120"
        stroke="#C9963A"
        strokeWidth="0.35"
        opacity="0.4"
      />
      <line
        x1="120"
        y1="5"
        x2="120"
        y2="235"
        stroke="#C9963A"
        strokeWidth="0.35"
        opacity="0.4"
      />
      <line
        x1="37"
        y1="37"
        x2="203"
        y2="203"
        stroke="#C9963A"
        strokeWidth="0.3"
        opacity="0.25"
      />
      <line
        x1="203"
        y1="37"
        x2="37"
        y2="203"
        stroke="#C9963A"
        strokeWidth="0.3"
        opacity="0.25"
      />
    </svg>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────

function Label({ text }: { text: string }) {
  return (
    <p className="text-[11px] text-gold tracking-[0.18em] uppercase mb-[10px] font-medium">
      {text}
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function HomePage() {
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: eventKeys.list({ status: "PUBLISHED", limit: 3 }),
    queryFn: () => eventsApi.list({ status: "PUBLISHED", limit: 3 }),
  });
  const { data: venuesData, isLoading: venuesLoading } = useQuery({
    queryKey: venueKeys.list({ limit: 3 }),
    queryFn: () => venuesApi.list({ limit: 3 }),
  });

  return (
    <div className="bg-navy text-cream">
      {/* ════════════════════════════════ HERO ════════════════════════════════ */}
      <section
        className="lp-noise relative overflow-hidden flex items-center"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% -5%, rgba(201,150,58,0.09) 0%, transparent 68%), #0C1520",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-35"
          style={{
            background:
              "linear-gradient(90deg, transparent, #C9963A, transparent)",
          }}
        />

        <div
          className="lp-spin absolute pointer-events-none"
          style={{ top: -90, right: -90, zIndex: 0 }}
        >
          <Ornament size={480} op={0.1} />
        </div>
        <div
          className="lp-float absolute pointer-events-none"
          style={{ bottom: -70, left: -110, zIndex: 0 }}
        >
          <Ornament size={300} op={0.06} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 text-center w-full">
          {/* Badge */}
          <div
            className="lp-a lp-d1 inline-flex items-center gap-2 mb-8 rounded-full text-[12px] text-gold-light tracking-widest uppercase border border-gold/15 bg-gold/6"
            style={{ padding: "6px 18px" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
            O'zbekistondagi №1 tadbirlar marketi
          </div>

          {/* Headline */}
          <h1
            className="lp-serif lp-a lp-d2 text-cream"
            style={{
              fontSize: "clamp(52px, 9vw, 96px)",
              fontWeight: 700,
              lineHeight: 1.03,
              letterSpacing: "-0.02em",
              marginBottom: "24px",
            }}
          >
            Tadbirlarni <em className="lp-serif lp-gold-text">muommosiz</em>
            <br />
            tashkil eting
          </h1>

          {/* Sub */}
          <p
            className="lp-a lp-d3 text-clay"
            style={{
              fontSize: "18px",
              lineHeight: 1.75,
              maxWidth: "520px",
              margin: "0 auto 44px",
            }}
          >
            Maydonlar, xizmatlar, chiptalar — hammasi bir joyda. Planner AI
            tashkilotchilarga tadbirlarni tez va samarali ishga tushirishga
            yordam beradi.
          </p>

          {/* CTAs */}
          <div className="lp-a lp-d4 flex flex-col sm:flex-row gap-3 justify-center mb-[68px]">
            <Link to="/events" className="lp-btn-gold">
              Tadbirlarni ko'rish →
            </Link>
            <Link to="/register" className="lp-btn-outline">
              Tadbir yaratish
            </Link>
          </div>

          {/* Stats */}
          <div className="lp-a lp-d5 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[580px] mx-auto">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="rounded-xl bg-gold/4 border border-gold/15"
                style={{ padding: "18px 12px" }}
              >
                <div
                  className="lp-serif text-gold-light font-bold leading-none"
                  style={{ fontSize: "30px" }}
                >
                  {s.v}
                </div>
                <div className="text-clay text-[12px] mt-[5px] tracking-[0.04em]">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none h-[100px]"
          style={{
            background: "linear-gradient(to bottom, transparent, #0C1520)",
          }}
        />
      </section>

      {/* ════════════════════════════════ MARQUEE ════════════════════════════ */}
      <div className="border-y border-gold/15 py-[13px] overflow-hidden bg-gold/2.5">
        <div className="lp-mq">
          {[...MQ, ...MQ, ...MQ, ...MQ].map((item, i) => (
            <span
              key={i}
              className="text-clay text-[12px] tracking-[0.14em] uppercase whitespace-nowrap flex items-center gap-[44px] mr-[44px]"
            >
              {item}
              <span className="text-gold text-[7px]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════ CATEGORIES ════════════════════════ */}
      <section className="py-[88px] px-6 bg-navy-2">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <Label text="Kategoriyalar" />
              <h2
                className="lp-serif text-cream"
                style={{
                  fontSize: "clamp(32px,5vw,46px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Tadbir turini tanlang
              </h2>
            </div>
            <Link
              to="/events"
              className="text-gold text-sm no-underline hover:opacity-70 transition-opacity"
            >
              Barcha tadbirlar →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATS.map((c) => (
              <Link
                key={c.l}
                to={c.to}
                className="lp-cat flex flex-col items-center gap-[10px] rounded-xl no-underline bg-white/[0.018] border border-gold/15"
                style={{ padding: "22px 10px" }}
              >
                <span className="text-[26px]">{c.e}</span>
                <span className="text-[12px] font-medium text-cream text-center leading-[1.3]">
                  {c.l}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ EVENTS ════════════════════════════ */}
      <section className="py-[88px] px-6 bg-navy">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <Label text="Tadbirlar" />
              <h2
                className="lp-serif text-cream"
                style={{
                  fontSize: "clamp(32px,5vw,46px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Yaqinlashayotgan tadbirlar
              </h2>
              <p className="text-clay text-[15px] mt-2">
                O'zbekistonning dolzarb tadbirlari
              </p>
            </div>
            <Link to="/events" className="text-gold text-sm no-underline">
              Barcha tadbirlar →
            </Link>
          </div>
          {eventsLoading ? (
            <Spinner />
          ) : eventsData?.data.length === 0 ? (
            <p className="text-center text-clay py-12">Mavjud tadbirlar yo'q</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {eventsData?.data.map((e, i) => (
                <EventCard
                  key={e.id}
                  event={e}
                  index={i}
                  className="hover:shadow-[0_28px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,150,58,0.14)]"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════ HOW IT WORKS ══════════════════════ */}
      <section
        id="how-it-works"
        className="py-[88px] px-6 bg-navy-3 border-y border-gold/15"
      >
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-[72px]">
            <Label text="Jarayon" />
            <h2
              className="lp-serif text-cream"
              style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700 }}
            >
              Bu qanday ishlaydi
            </h2>
            <p className="text-clay text-[15px] mt-3 max-w-[380px] mx-auto leading-relaxed">
              Uch oddiy qadam — va tadbiringiz ishga tushishga tayyor
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                <div
                  className="lp-serif select-none mb-3"
                  style={{
                    fontSize: "88px",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(201,150,58,0.18)",
                  }}
                >
                  {s.n}
                </div>

                {i < 2 && (
                  <div
                    className="hidden md:block absolute text-[22px] z-10"
                    style={{
                      top: "32px",
                      right: "-28px",
                      color: "rgba(201,150,58,0.15)",
                    }}
                  >
                    →
                  </div>
                )}

                <div className="w-9 h-0.5 bg-gold opacity-55 mb-4" />

                <h3 className="text-[19px] font-semibold text-cream mb-[10px]">
                  {s.t}
                </h3>

                <p className="text-sm text-clay leading-[1.75]">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ VENUES ════════════════════════════ */}
      <section className="py-[88px] px-6 bg-navy-2">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <Label text="Maydonlar" />

              <h2
                className="lp-serif text-cream"
                style={{
                  fontSize: "clamp(32px,5vw,46px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                Mashhur maydonlar
              </h2>

              <p className="text-clay text-[15px] mt-2">
                Tadbirlaringiz uchun eng yaxshi joylar
              </p>
            </div>

            <Link to="/venues" className="text-gold text-sm no-underline">
              Barcha maydonlar →
            </Link>
          </div>

          {venuesLoading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {venuesData?.data.map((v, i) => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  index={i}
                  className="hover:shadow-[0_28px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,150,58,0.14)]"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════════════ FEATURES ══════════════════════════ */}
      <section id="features" className="py-[88px] px-6 bg-navy">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <Label text="Imkoniyatlar" />
            <h2
              className="lp-serif text-cream"
              style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700 }}
            >
              Tashkilotchi uchun hamma narsa
            </h2>
            <p className="text-clay text-[15px] mt-3">
              Professional tadbirlarni tashkil etish uchun to'liq vositalar
              to'plami
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATS.map((f) => (
              <div
                key={f.t}
                className="lp-card rounded-2xl bg-gold/2.5 border border-gold/15"
                style={{ padding: "28px 22px" }}
              >
                <div className="text-[26px] mb-[18px] inline-flex items-center justify-center w-[52px] h-[52px] rounded-xl bg-gold/6 border border-gold/15">
                  {f.e}
                </div>
                <h3 className="text-[16px] font-semibold text-cream mb-2">
                  {f.t}
                </h3>
                <p className="text-sm text-clay leading-[1.65]">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ PRICING ═══════════════════════════ */}
      <section
        id="pricing"
        className="py-[88px] px-6 bg-navy-3 border-t border-gold/15"
      >
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-16">
            <Label text="Narxlar" />
            <h2
              className="lp-serif text-cream"
              style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700 }}
            >
              Tariflar
            </h2>
            <p className="text-clay text-[15px] mt-3">
              Bepul boshlang va o'sishingiz bilan kengaytiring
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((p) => (
              <div
                key={p.n}
                className="lp-card rounded-2xl relative flex flex-col"
                style={{
                  padding: "32px 24px",
                  border: p.hot
                    ? "1px solid #C9963A"
                    : "1px solid rgba(201,150,58,0.15)",
                  background: p.hot
                    ? "linear-gradient(160deg, rgba(201,150,58,0.12), rgba(201,150,58,0.04))"
                    : "rgba(255,255,255,0.018)",
                }}
              >
                {p.hot && (
                  <div
                    className="absolute text-[11px] font-bold tracking-[0.09em] uppercase whitespace-nowrap"
                    style={{
                      top: -13,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #C9963A, #9E7220)",
                      color: "#0C1520",
                      padding: "4px 16px",
                      borderRadius: "100px",
                    }}
                  >
                    Eng mashhur
                  </div>
                )}
                <p className="text-[11px] text-clay tracking-[0.12em] uppercase mb-[10px]">
                  {p.n}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="lp-serif font-bold leading-none"
                    style={{
                      fontSize: "38px",
                      color: p.hot ? "#E8C06A" : "#F0E8D4",
                    }}
                  >
                    {p.p}
                  </span>
                  {p.per && (
                    <span className="text-[13px] text-clay">{p.per}</span>
                  )}
                </div>
                <p className="text-[13px] text-clay mb-6">{p.desc}</p>
                <ul className="list-none p-0 m-0 mb-7 flex flex-col gap-[10px] flex-1">
                  {p.fs.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-[10px] text-sm text-cream"
                    >
                      <span className="text-gold font-bold text-[12px] mt-[2px] shrink-0">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block text-center rounded-lg text-sm font-semibold no-underline tracking-wide hover:opacity-80 transition-opacity"
                  style={{
                    padding: "12px",
                    background: p.hot
                      ? "linear-gradient(135deg, #C9963A, #9E7220)"
                      : "transparent",
                    border: p.hot ? "none" : "1px solid rgba(201,150,58,0.15)",
                    color: p.hot ? "#0C1520" : "#F0E8D4",
                  }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════ CONTACT ═══════════════════════════ */}
      <section id="contact" className="py-[88px] px-6 bg-navy-2">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-14">
            <Label text="Aloqa" />
            <h2
              className="lp-serif text-cream"
              style={{ fontSize: "clamp(32px,5vw,48px)", fontWeight: 700 }}
            >
              Biz bilan bog'laning
            </h2>
            <p className="text-clay text-[15px] mt-3">
              Savollaringiz bormi? Ish kuni davomida javob beramiz
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info cards */}
            <div className="flex flex-col gap-[14px]">
              {[
                {
                  ic: "📍",
                  t: "Manzil",
                  v: "Toshkent, Amir Temur ko'chasi, 107B",
                },
                { ic: "📞", t: "Telefon", v: "+998 71 200 00 00" },
                { ic: "✉️", t: "Email", v: "hello@plannerai.uz" },
                { ic: "🕐", t: "Ish vaqti", v: "Du–Ju, 9:00–18:00" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="flex items-start gap-4 rounded-xl bg-gold/2.5 border border-gold/15"
                  style={{ padding: "16px 20px" }}
                >
                  <span className="text-[22px] shrink-0">{x.ic}</span>
                  <div>
                    <p className="text-[12px] font-semibold text-gold-light tracking-[0.06em] uppercase mb-[3px]">
                      {x.t}
                    </p>
                    <p className="text-sm text-clay">{x.v}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Form */}
            <form
              className="flex flex-col gap-4 rounded-2xl bg-gold/2.5 border border-gold/15"
              style={{ padding: "28px 24px" }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gold tracking-widest uppercase mb-[7px]">
                    Ism
                  </label>
                  <input
                    className="lp-input"
                    type="text"
                    placeholder="Ismingiz"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gold tracking-widest uppercase mb-[7px]">
                    Email
                  </label>
                  <input
                    className="lp-input"
                    type="email"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gold tracking-widest uppercase mb-[7px]">
                  Mavzu
                </label>
                <input
                  className="lp-input"
                  type="text"
                  placeholder="Qanday yordam bera olamiz?"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gold tracking-widest uppercase mb-[7px]">
                  Xabar
                </label>
                <textarea
                  className="lp-input"
                  rows={4}
                  placeholder="Savolingizni tasvirlab bering..."
                  style={{ resize: "none" }}
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
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-[1100px] mx-auto">
          <div
            className="lp-noise relative overflow-hidden rounded-3xl text-center border border-gold/[0.28]"
            style={{
              padding: "clamp(48px, 8vw, 88px) clamp(24px, 5vw, 80px)",
              background:
                "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(201,150,58,0.07), transparent 70%)",
            }}
          >
            <div className="absolute -top-[30px] -right-[30px] opacity-[0.06] pointer-events-none">
              <Ornament size={200} op={1} />
            </div>
            <div className="absolute -bottom-[30px] -left-[30px] opacity-[0.05] pointer-events-none">
              <Ornament size={160} op={1} />
            </div>

            <div className="relative z-10">
              <Label text="Hoziroq boshlang" />
              <h2
                className="lp-serif text-cream mb-4"
                style={{
                  fontSize: "clamp(34px, 6vw, 62px)",
                  fontWeight: 700,
                  lineHeight: 1.08,
                }}
              >
                Tadbir boshlashga{" "}
                <em className="lp-serif lp-gold-text">tayyormisiz?</em>
              </h2>
              <p className="text-clay text-[17px] max-w-[480px] mx-auto mb-11 leading-[1.75]">
                Planner AI orqali muvaffaqiyatli tadbirlarni allaqachon
                o'tkazayotgan yuzlab tashkilotchilarga qo'shiling
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
  );
}
