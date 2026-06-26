import { formatCurrency } from '../../lib/helpers'

export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/95 px-3 py-2 text-sm shadow-xl">
      <p className="font-medium text-zinc-100">{label ?? payload[0].name}</p>
      <p className="text-zinc-400">{formatCurrency(Number(payload[0].value))}</p>
    </div>
  )
}
