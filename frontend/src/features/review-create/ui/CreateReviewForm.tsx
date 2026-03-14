import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewsApi } from '@entities/review'
import { Button } from '@shared/ui/Button'

interface CreateReviewFormProps {
  eventId?: string
  venueId?: string
  serviceId?: string
  queryKey: readonly string[]
  onSuccess?: () => void
}

export function CreateReviewForm({ eventId, venueId, serviceId, queryKey, onSuccess }: CreateReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => reviewsApi.create({ eventId, venueId, serviceId, rating, comment }),
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
            <svg className={`h-6 w-6 ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ваш отзыв (необязательно)"
        rows={3}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
      />
      {mutation.isError && <p className="text-sm text-red-500">Ошибка при отправке отзыва</p>}
      <Button onClick={() => mutation.mutate()} loading={mutation.isPending}>
        Оставить отзыв
      </Button>
    </div>
  )
}
