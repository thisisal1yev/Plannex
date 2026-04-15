import { StarRating } from "@shared/ui/StarRating";
import type { Review } from "../model/types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.author
    ? `${review.author.firstName[0]}${review.author.lastName[0]}`
    : "?";

  const fullName = review.author
    ? `${review.author.firstName} ${review.author.lastName}`
    : "Anonim";

  return (
    <div className="bg-card/60 border border-border/40 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {review.author?.avatarUrl ? (
          <img
            src={review.author.avatarUrl}
            alt={fullName}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-gold/20 shrink-0"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gold/10 border border-gold/15 flex items-center justify-center text-gold/70 font-semibold text-sm shrink-0">
            {initials}
          </div>
        )}
        <span className="text-[14px] font-semibold text-foreground/85">
          {fullName}
        </span>
      </div>

      <StarRating rating={review.rating} />

      {review.comment && (
        <p className="text-[13px] text-muted-foreground/65 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}
