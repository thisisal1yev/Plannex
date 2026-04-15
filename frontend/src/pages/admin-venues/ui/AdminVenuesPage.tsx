import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Landmark, Trash2, Wifi, ParkingCircle, Volume2, Presentation, Star } from 'lucide-react'
import { venuesApi } from '@entities/venue'
import type { Venue } from '@entities/venue'
import { Pagination } from '@shared/ui/Pagination'
import { Spinner } from '@shared/ui/Spinner'
import { venueKeys } from '@shared/api/queryKeys'
import { formatUZS } from '@shared/lib/dateUtils'

function AmenityChip({ active, icon: Icon, label }: { active: boolean; icon: React.ElementType; label: string }) {
  if (!active) return null
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/60 bg-muted/40 border border-border/50 rounded px-1.5 py-0.5">
      <Icon className="size-2.5" />
      {label}
    </span>
  )
}

export function AdminVenuesPage() {
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: venueKeys.list({ page }),
    queryFn: () => venuesApi.list({ page, limit: 20 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => venuesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: venueKeys.all() }),
  })

  const venues = data?.data ?? []
  const filtered = search
    ? venues.filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.city.toLowerCase().includes(search.toLowerCase()),
      )
    : venues

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <h1 className="text-[18px] font-bold text-foreground tracking-tight">Maydonlar</h1>
        {data?.meta && (
          <span className="text-[11px] font-medium text-muted-foreground/60 border border-border rounded-full px-2.5 py-0.5 bg-muted/30">
            {data.meta.total} ta
          </span>
        )}
      </div>

      {/* ── Search ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50 pointer-events-none" />
        <input
          type="text"
          placeholder="Nom yoki shahar bo'yicha qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[13px] text-muted-foreground/50">
                Maydonlar topilmadi
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/10">
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-5 py-2.5">Maydon</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden sm:table-cell">Shahar</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden md:table-cell">Sig'im</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden lg:table-cell">Narx / kun</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden xl:table-cell">Imkoniyatlar</th>
                    <th className="text-left text-[10px] font-semibold text-muted-foreground/50 tracking-[0.08em] uppercase px-4 py-2.5 hidden md:table-cell">Reyting</th>
                    <th className="px-5 py-2.5" />
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((v: Venue) => (
                    <tr key={v.id} className="border-b border-border/40 last:border-0 hover:bg-muted/15 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {v.imageUrls?.[0] ? (
                            <img src={v.imageUrls[0]} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0 border border-border" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-gold/8 border border-gold/12 flex items-center justify-center shrink-0">
                              <Landmark className="size-3.5 text-gold/60" />
                            </div>
                          )}
                          <div>
                            <p className="text-[13px] font-medium text-foreground leading-none line-clamp-1">{v.name}</p>
                            <p className="text-[11px] text-muted-foreground/50 mt-0.5 line-clamp-1">{v.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground hidden sm:table-cell">{v.city}</td>
                      <td className="px-4 py-3 text-[12px] text-muted-foreground hidden md:table-cell">
                        {v.capacity.toLocaleString()} kishi
                      </td>
                      
                      <td className="px-4 py-3 text-[12px] text-muted-foreground hidden lg:table-cell">
                        {formatUZS(v.pricePerDay)}
                      </td>

                      <td className="px-4 py-3 hidden xl:table-cell">
                        <div className="flex items-center gap-1 flex-wrap">
                          <AmenityChip active={v.hasWifi}    icon={Wifi}         label="Wi-Fi" />
                          <AmenityChip active={v.hasParking} icon={ParkingCircle} label="Parking" />
                          <AmenityChip active={v.hasSound}   icon={Volume2}       label="Sound" />
                          <AmenityChip active={v.hasStage}   icon={Presentation}  label="Sahna" />
                          {!v.hasWifi && !v.hasParking && !v.hasSound && !v.hasStage && (
                            <span className="text-[11px] text-muted-foreground/30">—</span>
                          )}
                        </div>
                      </td>

                      <td className="mr-auto px-4 py-3 hidden md:table-cell">
                        {v.ratingStats?.avg ?? 0 > 0 ? (
                          <span className="inline-flex items-center gap-1 text-[12px] fill-amber-400 text-amber-400">
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            {parseFloat((v.ratingStats?.avg ?? 0).toFixed(1))}
                          </span>
                        ) : (
                          <span className="text-[12px] text-muted-foreground/30">—</span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <button
                          onClick={() => {
                            if (window.confirm("Maydonni o'chirasizmi?")) deleteMutation.mutate(v.id)
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
