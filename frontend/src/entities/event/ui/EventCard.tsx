import { Link } from "react-router";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { formatDateShort } from "@shared/lib/dateUtils";
import type { Event } from "../model/types";

interface EventCardProps {
  event: Event;
  index: number;
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Qoralama",
  PUBLISHED: "E'lonlangan",
  CANCELLED: "Bekor qilingan",
  COMPLETED: "Yakunlangan",
};

const STATUS_DOT: Record<string, string> = {
  DRAFT: "#9CA3AF",
  PUBLISHED: "#34D399",
  CANCELLED: "#F87171",
  COMPLETED: "#818CF8",
};

export function EventCard({ event, index }: EventCardProps) {
  const start = formatDateShort(event.startDate);
  const dot = STATUS_DOT[event.status] ?? "#9CA3AF";
  const label = STATUS_LABEL[event.status] ?? event.status;
  const banner = event.bannerUrl?.[0];

  const fadeDelay = `svc-d${(index % 12) + 1}`;

  return (
    <Link
      to={`/events/${event.id}`}
      className={`svc-card svc-fade ${fadeDelay} group relative flex flex-col rounded-2xl overflow-hidden border border-white/8 bg-card no-underline
        transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] hover:border-gold/30 hover:shadow-[0_28px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(201,150,58,0.14)]`}
    >
      {/* Animated gold shimmer rule at card bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-10 pointer-events-none
          origin-center scale-x-0 group-hover:scale-x-100
          transition-transform duration-500 ease-out"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #c9963a 40%, #e8c06a 60%, transparent 100%)",
        }}
      />

      {/* ── Image ── */}
      <div className="relative overflow-hidden h-52 shrink-0">
        {banner ? (
          <img
            src={banner}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-navy-2 to-navy-dark flex items-center justify-center">
            <span className="lp-serif text-[90px] font-bold leading-none select-none text-gold/8">
              {event.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Cinematic gradient — stronger at bottom for title legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.45) 45%, transparent 75%)",
          }}
        />

        <div className="absolute top-3 px-4 flex items-center justify-between w-full">
          {/* Capacity — top left stat */}
          <div
            className=" flex items-baseline gap-1 backdrop-blur-sm
          bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2.5 py-1.5"
          >
            <span
              className="text-[18px] font-bold text-cream/90 leading-none"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {event.capacity.toLocaleString()}
            </span>
            <span className="text-[10px] text-cream/45">o'rin</span>
          </div>

          {/* Status badge — top right */}
          <div
            className="inline-flex items-center gap-[5px] text-[10px] font-medium
            py-[3px] px-[9px] rounded-full border backdrop-blur-sm"
            style={{
              color: dot,
              borderColor: `${dot}33`,
              background: "rgba(8,15,25,0.55)",
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full shrink-0 inline-block"
              style={{ background: dot }}
            />
            {label}
          </div>
        </div>

        <div className="absolute bottom-0 px-4">
          {/* Event type — small eyebrow above title */}
          {event.eventType && (
            <div className="text-xs uppercase tracking-widest text-gold/60 font-medium">
              {event.eventType}
            </div>
          )}

          {/* Title bleeds over image bottom */}
          <div className="pb-3.5">
            <h3
              className="lp-serif text-[20px] font-bold leading- line-clamp-2 text-cream/95
              transition-colors duration-200 group-hover:text-gold-light"
            >
              {event.title}
            </h3>
          </div>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-[12px] text-cream/40">
          {/* Date */}
          <Calendar className="w-3 h-3 shrink-0 text-gold/40" />

          <span className="group-hover:text-gold transition-colors duration-200">
            {start}
          </span>

          {event.venue && (
            <>
              <span className="text-cream/15 mx-0.5 group-hover:text-gold transition-colors duration-200">
                •
              </span>

              <MapPin className="w-3 h-3 shrink-0 text-gold/40 group-hover:text-gold transition-colors duration-200" />

              <span className="truncate group-hover:text-gold transition-colors duration-200">
                {event.venue.city}
              </span>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 group-hover:border-t-gold-dark/30 transition-colors duration-200">
          <span className="text-[12px] text-gold/70 font-medium flex items-center gap-1 group-hover:text-gold transition-colors duration-200 ml-auto">
            Batafsil
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
