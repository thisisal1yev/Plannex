import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { eventsApi } from '@entities/event'
import type { User } from '@entities/user'
import { Spinner } from '@shared/ui/Spinner'
import { Table } from '@shared/ui/Table'
import type { TableColumn } from '@shared/ui/Table'
import { eventKeys } from '@shared/api/queryKeys'

export function EventParticipantsPage() {
  const { id } = useParams<{ id: string }>()

  const { data: participants, isLoading } = useQuery({
    queryKey: eventKeys.participants(id!),
    queryFn: () => eventsApi.participants(id!),
    enabled: !!id,
  })

  const columns: TableColumn<User>[] = [
    {
      header: 'Имя',
      className: 'px-4 py-3 font-medium text-foreground',
      render: (u) => `${u.firstName} ${u.lastName}`,
    },
    {
      header: 'Email',
      render: (u) => u.email,
    },
    {
      header: 'Телефон',
      render: (u) => u.phone ?? '—',
    },
  ]

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Участники события</h1>
      <p className="text-sm text-muted-foreground">Всего: {participants?.length ?? 0}</p>
      <Table<User>
        columns={columns}
        data={participants ?? []}
        keyExtractor={(u) => u.id}
        emptyMessage="Нет участников"
      />
    </div>
  )
}
