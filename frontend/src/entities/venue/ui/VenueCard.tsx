import { Link } from "react-router";
import { ArrowRight, Building2, MapPin, Star } from "lucide-react";
import { formatUZS } from "@shared/lib/dateUtils";
import { cn } from "@/shared/lib/utils";
import type { Venue } from "../model/types";

interface VenueCardProps {
  venue: Venue;
  index: number;
  className?: string;
}

const AMENITY_ICON: Record<string, string> = {
  wifi: "⌘",
  parking: "⊕",
  sound: "♪",
  stage: "◈",
  indoor: "⬡",
};

export function VenueCard({ venue, className, index = 0 }: VenueCardProps) {
  const amenities = [
    venue.hasWifi && { key: "wifi", label: "WiFi" },
    venue.hasParking && { key: "parking", label: "Parkovka" },
    venue.hasSound && { key: "sound", label: "Ovoz" },
    venue.hasStage && { key: "stage", label: "Sahna" },
    venue.isIndoor && { key: "indoor", label: "Yopiq" },
  ].filter(Boolean) as { key: string; label: string }[];

  const fadeDelay = `svc-d${(index % 12) + 1}`;

  return (
    <Link
      to={`/venues/${venue.id}`}
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
        {venue.imageUrls[0] ? (
          <img
            src={venue.imageUrls[0]}
            alt={venue.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-navy-2 to-navy-dark flex items-center justify-center">
            <Building2 className="w-16 h-16 text-gold/8" strokeWidth={1} />
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

        <div className="absolute top-3 px-4 flex items-center justify-between w-full">
          {/* Capacity — top left stat */}
          <div
            className="flex items-baseline gap-1 backdrop-blur-sm
          bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2.5 py-1.5"
          >
            <span
              className="text-lg font-bold text-cream/90 leading-none"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {venue.capacity.toLocaleString()}
            </span>
            <span className="text-[10px] text-cream/45">o'rin</span>
          </div>

          {/* Rating — top right */}
          <div
            className="flex items-center gap-1 backdrop-blur-sm
          bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2 py-1.5"
          >
            <Star className="w-3 h-3 text-gold fill-current" />
            <span className="text-xs font-medium text-cream/80">
              {venue.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Name bleeds over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5">
          <h3
            className="lp-serif text-[20px] font-bold leading-[1.22] line-clamp-1 text-cream/95
              transition-colors duration-200 group-hover:text-gold-light"
          >
            {venue.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-cream/40">
          <MapPin className="w-3 h-3 shrink-0 text-gold/40 group-hover:text-gold duration-200 transition-colors" />

          <span className="truncate group-hover:text-gold duration-200 transition-colors">
            {venue.city}, {venue.address}
          </span>
        </div>

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {amenities.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 text-[10px] py-[3px] px-2 rounded-full
                  bg-white/4 border border-white/8 text-cream/45 tracking-wide"
              >
                <span className="text-gold/50 text-[9px]">
                  {AMENITY_ICON[key]}
                </span>
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-cream/25 mb-0.5">
              Kunlik narx
            </p>
            <span className="text-[14px] text-gold font-semibold leading-none">
              {formatUZS(venue.pricePerDay)}
              <span className="text-[11px] font-normal text-gold/55">/kun</span>
            </span>
          </div>
          <span className="text-[12px] text-gold/70 font-medium flex items-center gap-1 group-hover:text-gold transition-colors duration-200">
            Batafsil
            <ArrowRight className="w-3 h-3 transition-all duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
