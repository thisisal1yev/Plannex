import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { reviewsApi } from '@entities/review'
import { Button } from '@shared/ui/Button'
import { Textarea } from '@shared/ui/Textarea'

interface CreateReviewFormProps {
  eventId?: string
  squareId?: string   // was venueId
  serviceId?: string
  queryKey: readonly string[]
  onSuccess?: () => void
}

export function CreateReviewForm({ eventId, squareId, serviceId, queryKey, onSuccess }: CreateReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => reviewsApi.create({ eventId, squareId, serviceId, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      setComment('')
      onSuccess?.()
    },
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            className="cursor-pointer"
          >
            <Star className={`h-6 w-6 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} fill="currentColor" />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Sizning sharhingiz (ixtiyoriy)"
        rows={3}
      />
      {mutation.isError && <p className="text-sm text-destructive">Sharh yuborishda xatolik</p>}
      <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
        Sharh qoldirish
      </Button>
    </div>
  )
}
