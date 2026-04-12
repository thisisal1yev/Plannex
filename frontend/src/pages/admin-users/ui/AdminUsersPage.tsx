import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Trash2, UserCheck } from 'lucide-react'
import { usersApi, ROLE_COLOR } from '@entities/user'
import type { User } from '@entities/user'
import { Badge } from '@shared/ui/Badge'
import { Pagination } from '@shared/ui/Pagination'
import { Spinner } from '@shared/ui/Spinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/primitives/avatar'
import { formatDateDefault } from '@shared/lib/dateUtils'
import { userKeys } from '@shared/api/queryKeys'

const ROLE_LABELS: Record<string, string> = {
  ADMIN:       'Admin',
  ORGANIZER:   'Tashkilotchi',
  PARTICIPANT: 'Ishtirokchi',
  VENDOR:      "Ta'minotchi",
  VOLUNTEER:   "Ko'ngilli",
}

function getInitials(u: User) {
  if (u.firstName && u.lastName) return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()
  if (u.firstName) return u.firstName[0].toUpperCase()
  return u.email[0].toUpperCase()
}

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

  const users = data?.data ?? []

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[18px] font-bold text-foreground tracking-tight">Foydalanuvchilar</h1>
          {data?.meta && (
            <span className="text-[11px] font-medium text-muted-foreground/60 border border-border rounded-full px-2.5 py-0.5 bg-muted/30">
              {data.meta.total} ta
            </span>
          )}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50 pointer-events-none" />
        <input
          type="text"
          placeholder="Ism yoki email bo'yicha qidirish..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full h-9 pl-8 pr-3 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:border-gold/40 transition-colors placeholder:text-muted-foreground/40"
        />
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {users.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-muted-foreground/50">
                Foydalanuvchilar topilmadi
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/10">
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-5 py-2.5">Foydalanuvchi</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden sm:table-cell">Email</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5">Rol</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden md:table-cell">Sana</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden lg:table-cell">Holat</th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: User) => (
                    <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-muted/15 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-lg shrink-0">
                            <AvatarImage src={u.avatarUrl} alt={u.firstName} className="rounded-lg object-cover" />
                            <AvatarFallback className="rounded-lg text-[10px] font-bold bg-gold/10 text-gold border border-gold/15">
                              {getInitials(u)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[13px] font-medium text-foreground leading-none">
                              {u.firstName} {u.lastName}
                            </p>
                            <p className="text-[11px] text-muted-foreground/50 mt-0.5 sm:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground hidden sm:table-cell">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge color={ROLE_COLOR[u.activeRole]}>{ROLE_LABELS[u.activeRole] ?? u.activeRole}</Badge>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground hidden md:table-cell">
                        {formatDateDefault(u.createdAt)}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {u.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                            <UserCheck className="size-3" />
                            Tasdiqlangan
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            if (window.confirm("Foydalanuvchini o'chirasizmi?")) {
                              deleteMutation.mutate(u.id)
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 h-7 px-2.5 rounded-md text-[11px] font-medium text-red-500 bg-red-500/8 border border-red-500/20 hover:bg-red-500/15 disabled:opacity-50 transition-all"
                        >
                          <Trash2 className="size-3" />
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {data?.meta && <Pagination meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  )
}
