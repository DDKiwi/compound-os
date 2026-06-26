import type { LucideIcon } from 'lucide-react'
import { toneClass } from '../../lib/helpers'

export function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone = 'neutral',
}: {
  icon: LucideIcon
  label: string
  value: string
  helper: string
  tone?: 'neutral' | 'good' | 'bad'
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-4 shadow-sm shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-zinc-500">{label}</span>
        <span className={`rounded-md border p-1.5 ${toneClass(tone)}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-normal text-zinc-50">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </div>
  )
}
