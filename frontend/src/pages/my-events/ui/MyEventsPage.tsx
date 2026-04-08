import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { eventsApi, MyEventCard } from '@entities/event'
import { Spinner } from '@shared/ui/Spinner'
import { Button } from '@shared/ui/Button'
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((event, index) => (
          <MyEventCard
            key={event.id}
            event={event}
            index={index}
            onDelete={(id) => {
              if (confirm('Tadbirni bekor qilasizmi?')) deleteMutation.mutate(id)
            }}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>
    </div>
  )
}
