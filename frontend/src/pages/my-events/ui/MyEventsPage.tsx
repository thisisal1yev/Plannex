import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { eventsApi, EVENT_STATUS_COLOR } from '@entities/event'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { PublishEventButton } from '@features/event-publish'
import { formatDateDefault } from '@shared/lib/dateUtils'
import { eventKeys } from '@shared/api/queryKeys'

export function MyEventsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: eventKeys.myList(),
    queryFn: () => eventsApi.list({ limit: 50 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.myList() }),
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Mening tadbirlarim</h1>
        <Link to="/my-events/create">
          <Button>+ Yaratish</Button>
        </Link>
      </div>

      {data?.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Sizda hozircha tadbirlar yo'q</p>
          <Link to="/my-events/create"><Button>Birinchi tadbir yaratish</Button></Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {data?.data.map((event) => (
          <div key={event.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground truncate">{event.title}</h3>
                <Badge color={EVENT_STATUS_COLOR[event.status]}>{event.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDateDefault(event.startDate)} • {event.capacity} o'rin
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {event.status === 'DRAFT' && <PublishEventButton eventId={event.id} />}
              <Link to={`/my-events/${event.id}/edit`}>
                <Button variant="secondary" size="sm">Tahr.</Button>
              </Link>
              <Link to={`/my-events/${event.id}/participants`}>
                <Button variant="ghost" size="sm">Ishtirokchilar</Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                loading={deleteMutation.isPending}
                onClick={() => {
                  if (confirm('Tadbirni bekor qilasizmi?')) deleteMutation.mutate(event.id)
                }}
              >
                Bekor qilish
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
