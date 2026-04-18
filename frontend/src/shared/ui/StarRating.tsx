import { Star } from 'lucide-react'

interface StarRatingProps {
  rating?: number
  max?: number
}

export function StarRating({ rating = 0, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const isFullStar = rating >= i + 1
        const isHalfStar = !isFullStar && rating > i

        return (
          <Star
            key={i}
            className={`size-4 ${
              isFullStar
                ? 'fill-amber-400 text-amber-400'
                : isHalfStar
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-muted-foreground/15'
            }`}
          />
        )
      })}
    </div>
  )
}
