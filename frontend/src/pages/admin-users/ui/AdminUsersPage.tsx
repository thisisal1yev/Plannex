import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi, ROLE_COLOR } from '@entities/user'
import type { User } from '@entities/user'
import { Badge } from '@shared/ui/Badge'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Pagination } from '@shared/ui/Pagination'
import { Spinner } from '@shared/ui/Spinner'
import { Table } from '@shared/ui/Table'
import type { TableColumn } from '@shared/ui/Table'
import { formatDateDefault } from '@shared/lib/dateUtils'
import { userKeys } from '@shared/api/queryKeys'

export function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: userKeys.list({ page, search }),
    queryFn: () => usersApi.list({ page, limit: 20, search: search || undefined }),
  })

  const deleteMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.all() }),
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
      header: 'Роль',
      render: (u) => <Badge color={ROLE_COLOR[u.role]}>{u.role}</Badge>,
    },
    {
      header: 'Дата',
      render: (u) => formatDateDefault(u.createdAt),
    },
    {
      header: '',
      render: (u) => (
        <Button
          variant="danger"
          size="sm"
          loading={deleteMutation.isPending}
          onClick={() => { if (confirm('Удалить пользователя?')) deleteMutation.mutate(u.id) }}
        >
          Удалить
        </Button>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-foreground">Пользователи</h1>

      <Input
        placeholder="Поиск по имени или email..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        className="max-w-sm"
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Table<User>
            columns={columns}
            data={data?.data ?? []}
            keyExtractor={(u) => u.id}
            emptyMessage="Пользователи не найдены"
          />
          {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  )
}
