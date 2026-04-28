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

export function VenueCard({ venue, className, index = 0 }: VenueCardProps) {
  const amenities = (venue.characteristics ?? []).map((c) => ({ key: c.id, label: c.name }));

  return (
    <Link
      to={`/venues/${venue.id}`}
      className={cn(
        "animate-[svc-in_0.45s_ease-out_both] group relative flex flex-col rounded-2xl overflow-hidden",
        "border border-white/8 bg-card",
        "transition-[transform,box-shadow,border-color] duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "hover:-translate-y-[5px] hover:shadow-[0_14px_40px_rgba(0,0,0,0.14),0_0_0_1px_rgba(76,140,167,0.28)] hover:!border-primary/30",
        className
      )}
      style={{ animationDelay: `${(index % 12) * 0.04}s` }}
    >
      {/* Animated primary shimmer rule */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] z-10 pointer-events-none
          origin-center scale-x-0 group-hover:scale-x-100
          transition-transform duration-500 ease-out"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #4c8ca7 40%, #7ab8cc 60%, transparent 100%)",
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
            <Building2 className="w-16 h-16 text-primary/8" strokeWidth={1} />
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
          {venue.ratingStats && venue.ratingStats.count > 0 ? (
            <div className="flex items-center gap-1 backdrop-blur-sm bg-[rgba(8,15,25,0.55)] border border-white/10 rounded-lg px-2 py-1.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />

              <span className="text-xs font-medium text-cream/80">
                {venue.ratingStats.avg.toFixed(1)}
              </span>

              <span className="text-[10px] text-cream/40">
                ({venue.ratingStats.count})
              </span>
            </div>
          ) : null}
        </div>

        {/* Name bleeds over image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3.5">
          <h3
            className="font-serif text-[20px] font-bold leading-[1.22] line-clamp-1 text-cream/95
              transition-colors duration-200 group-hover:text-primary-light"
          >
            {venue.name}
          </h3>
        </div>
      </div>

      {/* ── Metadata strip ── */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-cream/40">
          <MapPin className="w-3 h-3 shrink-0 text-primary/40 group-hover:text-primary duration-200 transition-colors" />

          <span className="truncate group-hover:text-primary duration-200 transition-colors">
            {venue.city}, {venue.address}
          </span>
        </div>

        {/* Amenity chips */}
        {amenities.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {amenities.map(({ key, label }) => (
              <span
                key={key}
                className="inline-flex items-center text-[10px] py-[3px] px-2 rounded-full
                  bg-white/4 border border-white/8 text-cream/45 tracking-wide"
              >
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
            <span className="text-[14px] text-primary font-semibold leading-none">
              {formatUZS(venue.pricePerDay)}
              <span className="text-[11px] font-normal text-primary/55">/kun</span>
            </span>
          </div>
          <span className="text-[12px] text-primary/70 font-medium flex items-center gap-1 group-hover:text-primary transition-colors duration-200">
            Batafsil
            <ArrowRight className="w-3 h-3 transition-all duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
