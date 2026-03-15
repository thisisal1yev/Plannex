import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { Button } from '@shared/ui/Button'
import { eventKeys } from '@shared/api/queryKeys'

interface PublishEventButtonProps {
  eventId: string
}

export function PublishEventButton({ eventId }: PublishEventButtonProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => eventsApi.publish(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all() })
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) })
    },
  })

  return (
    <Button onClick={() => mutation.mutate()} loading={mutation.isPending} size="sm">
      Nashr etish
    </Button>
  )
}
