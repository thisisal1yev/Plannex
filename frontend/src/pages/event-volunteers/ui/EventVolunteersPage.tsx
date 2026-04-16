import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import { VOLUNTEER_STATUS_COLOR } from '@entities/volunteer'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { eventKeys } from '@shared/api/queryKeys'

export function EventVolunteersPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: applications, isLoading } = useQuery({
    queryKey: eventKeys.volunteers(id!),
    queryFn: () => eventsApi.volunteers(id!),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      eventsApi.updateVolunteer(id!, appId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventKeys.volunteers(id!) }),
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Ko'ngilli arizalari</h1>

      <div className="flex flex-col gap-3">
        {applications?.map((app) => (
          <div key={app.id} className="bg-card rounded-xl border border-border p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-foreground">{app.user?.firstName} {app.user?.lastName}</p>
              <p className="text-sm text-muted-foreground">{app.user?.email}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {app.skill?.name ?? app.skillId}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge color={VOLUNTEER_STATUS_COLOR[app.status]}>{app.status}</Badge>
              {app.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    loading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ appId: app.id, status: 'ACCEPTED' })}
                  >
                    Qabul qilish
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    loading={updateMutation.isPending}
                    onClick={() => updateMutation.mutate({ appId: app.id, status: 'REJECTED' })}
                  >
                    Rad etish
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        {applications?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Arizalar yo'q</p>
        )}
      </div>
    </div>
  )
}
