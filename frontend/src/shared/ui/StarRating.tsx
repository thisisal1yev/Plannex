import { Star } from 'lucide-react'

interface StarRatingProps {
  rating?: number
  max?: number
}

export function StarRating({ rating = 0, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        return (
          <Star
            key={i}
            className={`size-4 ${
              rating >= i
                ? 'fill-amber-400 text-amber-400'
                : rating >= i - 0.5
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-muted-foreground/15'
            }`}
          />
        )
      })}
    </div>
  )
}
