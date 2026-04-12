import { Link } from "react-router";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { formatUZS } from "@shared/lib/dateUtils";
import { cn } from "@/shared/lib/utils";
import type { Service } from "../model/types";

interface ServiceCardProps {
  service: Service;
  index: number;
  className?: string;
}

const CATEGORY_LABEL: Record<string, string> = {
  CATERING: "Katering",
  DECORATION: "Bezak",
  SOUND: "Ovoz",
  PHOTO: "Foto",
  SECURITY: "Xavfsizlik",
};

const CATEGORY_GLYPH: Record<string, string> = {
  CATERING: "🍽",
  DECORATION: "✦",
  SOUND: "♪",
  PHOTO: "◉",
  SECURITY: "◈",
};

// Subtle per-category accent hue for the image placeholder bg
const CATEGORY_BG: Record<string, string> = {
  CATERING: "from-[#1a1208] to-[#080f19]",
  DECORATION: "from-[#0e1520] to-[#080f19]",
  SOUND: "from-[#0a1418] to-[#080f19]",
  PHOTO: "from-[#12120a] to-[#080f19]",
  SECURITY: "from-[#0f1010] to-[#080f19]",
};

export function ServiceCard({
  service,
  className,
  index = 0,
}: ServiceCardProps) {
  const fadeDelay = `svc-d${(index % 12) + 1}`;
  const glyph = CATEGORY_GLYPH[service.category] ?? "✦";
  const catBg = CATEGORY_BG[service.category] ?? "from-[#0f1925] to-[#080f19]";
  const label = CATEGORY_LABEL[service.category] ?? service.category;

  return (
    <Link
      to={`/services/${service.id}`}
      className={cn(`svc-card svc-fade ${fadeDelay} group relative flex flex-col rounded-2xl overflow-hidden
        border border-white/8 bg-card ${className}`)}
    >
      {/* Animated gold shimmer rule */}
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
        {service.imageUrls[0] ? (
          <img
            src={service.imageUrls[0]}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div
            className={`w-full h-full bg-linear-to-br ${catBg} flex items-center justify-center`}
          >
            {/* Large watermark glyph in empty state */}
            <span className="text-[80px] leading-none select-none opacity-[0.07]">
              {glyph}
            </span>
          </div>
        )}

        {/* Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(8,15,25,0.92) 0%, rgba(8,15,25,0.4) 45%, transparent 75%)",
          }}
        />

        {/* Category pill — top left */}
        <div
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[11px] font-medium
          py-[4px] px-[10px] rounded-full backdrop-blur-sm
          bg-[rgba(8,15,25,0.6)] border border-gold/20 text-gold/80"
        >
          <span className="text-[12px] leading-none">{glyph}</span>
          {label}
        </div>

        {/* Rating — top right */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1 backdrop-blur-sm
          bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2 py-1.5"
        >
          <Star className="w-3 h-3 text-gold fill-current" />
          <span className="text-[12px] font-medium text-cream/80">
            {(service.ratingStats?.avg ?? 0).toFixed(1)}
          </span>
        </div>

        {/* Name bleeds over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5">
          <h3
            className="lp-serif text-[20px] font-bold leading-[1.22] line-clamp-2 text-cream/95
              transition-colors duration-200 group-hover:text-gold-light"
          >
            {service.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-[12px] text-cream/40">
          <MapPin className="w-3 h-3 shrink-0 text-gold/40" />
          {service.city}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-cream/25 mb-0.5">
              Narxdan boshlab
            </p>
            <span className="text-[14px] text-gold font-semibold leading-none">
              {formatUZS(service.priceFrom)}
            </span>
          </div>
          <span className="text-[12px] text-gold/70 font-medium flex items-center gap-1 group-hover:text-gold transition-colors duration-200">
            Batafsil
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
