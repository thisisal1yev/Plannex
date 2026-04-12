import { Star } from 'lucide-react'

interface StarRatingProps {
  rating?: number
  max?: number
}

export function StarRating({ rating, max = 5 }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.round(rating ?? 0) ? 'text-yellow-400' : 'text-border'}`}
          fill="currentColor"
        />
      ))}
    </div>
  )
}
