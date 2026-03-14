import { StarRating } from '@shared/ui/StarRating'
import { formatDateLong } from '@shared/lib/dateUtils'
import type { Review } from '../model/types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const date = formatDateLong(review.createdAt)

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
            {review.author ? `${review.author.firstName[0]}${review.author.lastName[0]}` : '?'}
          </div>
          <span className="text-sm font-medium text-foreground">
            {review.author ? `${review.author.firstName} ${review.author.lastName}` : 'Аноним'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <StarRating rating={review.rating} />
      {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
    </div>
  )
}
