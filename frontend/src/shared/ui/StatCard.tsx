import type { ElementType } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: ElementType
  accent?: 'gold' | 'emerald' | 'blue' | 'amber' | 'violet' | 'rose'
  sub?: string
  trend?: string
  trendUp?: boolean
}

const ACCENT_MAP: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  gold:    { bg: 'bg-gold/8',        border: 'border-gold/15',        icon: 'text-gold',        glow: 'hover:shadow-[0_0_12px_rgba(76,140,167,0.15)]'   },
  emerald: { bg: 'bg-emerald-500/8', border: 'border-emerald-500/15', icon: 'text-emerald-500', glow: 'hover:shadow-[0_0_12px_rgba(16,185,129,0.12)]'   },
  blue:    { bg: 'bg-blue-500/8',    border: 'border-blue-500/15',    icon: 'text-blue-400',    glow: 'hover:shadow-[0_0_12px_rgba(59,130,246,0.12)]'   },
  amber:   { bg: 'bg-amber-500/8',   border: 'border-amber-500/15',   icon: 'text-amber-400',   glow: 'hover:shadow-[0_0_12px_rgba(245,158,11,0.12)]'   },
  violet:  { bg: 'bg-violet-500/8',  border: 'border-violet-500/15',  icon: 'text-violet-400',  glow: 'hover:shadow-[0_0_12px_rgba(139,92,246,0.12)]'   },
  rose:    { bg: 'bg-rose-500/8',    border: 'border-rose-500/15',    icon: 'text-rose-400',    glow: 'hover:shadow-[0_0_12px_rgba(244,63,94,0.12)]'    },
}

export function StatCard({ label, value, icon: Icon, accent = 'gold', sub, trend, trendUp }: StatCardProps) {
  const a = ACCENT_MAP[accent] ?? ACCENT_MAP.gold

  return (
    <div className={`relative rounded-xl border border-border bg-card p-5 overflow-hidden group hover:border-gold/20 transition-all duration-200 ${a.glow}`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg ${a.bg} border ${a.border} flex items-center justify-center shrink-0`}>
          <Icon className={`size-3.5 ${a.icon}`} />
        </div>
        {trend && (
          <span className={`text-[11px] font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
            trendUp
              ? 'text-emerald-500 bg-emerald-500/8 border border-emerald-500/15'
              : 'text-red-400 bg-red-500/8 border border-red-500/15'
          }`}>
            {trendUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {trend}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[26px] font-bold text-foreground leading-none tracking-tight tabular-nums">{value}</span>
        <span className="text-[11px] text-muted-foreground/70 mt-1 font-medium uppercase tracking-[0.06em]">{label}</span>
        {sub && <span className="text-[11px] text-muted-foreground/50 mt-0.5">{sub}</span>}
      </div>
    </div>
  )
}
