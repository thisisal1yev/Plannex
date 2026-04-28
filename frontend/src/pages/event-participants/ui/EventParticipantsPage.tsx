import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Search,
  Download,
  QrCode,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  X,
} from 'lucide-react'
import { eventsApi } from '@entities/event'
import { ticketsApi } from '@entities/ticket'
import type { User } from '@entities/user'
import { Spinner } from '@shared/ui/Spinner'
import { eventKeys } from '@shared/api/queryKeys'
import { formatDateDefault } from '@shared/lib/dateUtils'

const STRINGS = {
  title: 'Ishtirokchilar',
  search: 'Ism yoki email bo\'yicha qidirish...',
  export: 'CSV yuklab olish',
  validateQr: 'QR tekshirish',
  empty: 'Ishtirokchilar yo\'q',
  name: 'Ism',
  email: 'Email',
  phone: 'Telefon',
  registered: 'Ro\'yxatdan o\'tgan',
  qrModalTitle: 'Chipta QR-kodini tekshirish',
  qrPlaceholder: 'QR-kod matnini kiriting...',
  check: 'Tekshirish',
  checking: 'Tekshirilmoqda...',
  valid: 'Chipta haqiqiy',
  invalid: 'Chipta topilmadi yoki yaroqsiz',
  close: 'Yopish',
}

function exportCsv(users: User[], filename = 'ishtirokchilar.csv') {
  const header = ['Ism', 'Familiya', 'Email', 'Telefon', 'Ro\'yxatdan o\'tgan']
  const rows = users.map((u) => [
    u.firstName,
    u.lastName,
    u.email,
    u.phone ?? '',
    formatDateDefault(u.createdAt),
  ])
  const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function QrModal({ onClose }: { onClose: () => void }) {
  const [qrCode, setQrCode] = useState('')

  const mutation = useMutation({
    mutationFn: () => ticketsApi.validate(qrCode),
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <QrCode className="size-4 text-primary/70" />
            <p className="font-semibold text-[14px] text-foreground">{STRINGS.qrModalTitle}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground/50 hover:text-foreground transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder={STRINGS.qrPlaceholder}
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            className="w-full h-9 px-3 text-[13px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/40"
            onKeyDown={(e) => e.key === 'Enter' && qrCode && mutation.mutate()}
          />

          {mutation.isSuccess && (
            <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
              mutation.data.valid
                ? 'border-emerald-500/20 bg-emerald-500/8 text-emerald-400'
                : 'border-destructive/20 bg-destructive/8 text-destructive'
            }`}>
              {mutation.data.valid
                ? <CheckCircle2 className="size-4 shrink-0" />
                : <XCircle className="size-4 shrink-0" />}
              <span className="text-[12px] font-medium">
                {mutation.data.valid ? STRINGS.valid : STRINGS.invalid}
              </span>
              {mutation.data.valid && mutation.data.ticket && (
                <span className="text-[11px] text-emerald-400/60 ml-auto">
                  {mutation.data.ticket.tier?.name ?? ''}
                </span>
              )}
            </div>
          )}

          {mutation.isError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/8 px-3 py-2">
              <XCircle className="size-4 text-destructive shrink-0" />
              <span className="text-[12px] text-destructive">{STRINGS.invalid}</span>
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <button
              onClick={() => mutation.mutate()}
              disabled={!qrCode || mutation.isPending}
              className="flex-1 h-9 rounded-lg text-[13px] font-semibold bg-primary text-navy hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1.5"
            >
              {mutation.isPending
                ? <><Loader2 className="size-3.5 animate-spin" />{STRINGS.checking}</>
                : STRINGS.check}
            </button>
            <button
              onClick={onClose}
              className="px-4 h-9 rounded-lg text-[13px] text-muted-foreground hover:text-foreground border border-border hover:border-border/80 transition-colors"
            >
              {STRINGS.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EventParticipantsPage() {
  const { id } = useParams<{ id: string }>()
  const [search, setSearch] = useState('')
  const [qrOpen, setQrOpen] = useState(false)

  const { data: participants, isLoading } = useQuery({
    queryKey: eventKeys.participants(id!),
    queryFn: () => eventsApi.participants(id!),
    enabled: !!id,
  })

  const filtered = (participants ?? []).filter((u) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })

  if (isLoading) return <Spinner />

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Users className="size-5 text-primary/70 shrink-0" />
          <h1 className="text-[18px] font-bold text-foreground tracking-tight">{STRINGS.title}</h1>
          <span className="text-[11px] font-medium text-muted-foreground/50 border border-border rounded-full px-2.5 py-0.5 bg-muted/20">
            {participants?.length ?? 0} ta
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQrOpen(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
          >
            <QrCode className="size-3.5" />
            {STRINGS.validateQr}
          </button>
          <button
            onClick={() => exportCsv(filtered)}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="size-3.5" />
            {STRINGS.export}
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 pointer-events-none" />
        <input
          type="text"
          placeholder={STRINGS.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-9 pl-8 pr-3 text-[13px] bg-card border border-border rounded-lg focus:outline-none focus:border-primary/40 transition-colors placeholder:text-muted-foreground/30"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="size-8 text-muted-foreground/20 mx-auto mb-2" />
            <p className="text-[13px] text-muted-foreground/40">
              {search ? `"${search}" bo'yicha topilmadi` : STRINGS.empty}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/60 bg-muted/10">
                <th className="text-left text-[10px] font-semibold text-muted-foreground/40 tracking-[0.08em] uppercase px-5 py-2.5">{STRINGS.name}</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground/40 tracking-[0.08em] uppercase px-4 py-2.5 hidden sm:table-cell">{STRINGS.email}</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground/40 tracking-[0.08em] uppercase px-4 py-2.5 hidden md:table-cell">{STRINGS.phone}</th>
                <th className="text-left text-[10px] font-semibold text-muted-foreground/40 tracking-[0.08em] uppercase px-4 py-2.5 hidden lg:table-cell">{STRINGS.registered}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: User) => (
                <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-muted/10 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0 text-[11px] font-bold text-primary/80 overflow-hidden">
                        {u.avatarUrl
                          ? <img src={u.avatarUrl} alt={`${u.firstName} ${u.lastName}`} className="w-full h-full object-cover" />
                          : <>{u.firstName?.[0]?.toUpperCase()}{u.lastName?.[0]?.toUpperCase()}</>}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground leading-none">{u.firstName} {u.lastName}</p>
                        <p className="text-[11px] text-muted-foreground/40 mt-0.5 sm:hidden">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground/70 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground/60 hidden md:table-cell">{u.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-[12px] text-muted-foreground/50 hidden lg:table-cell">
                    {formatDateDefault(u.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {qrOpen && <QrModal onClose={() => setQrOpen(false)} />}
    </div>
  )
}
