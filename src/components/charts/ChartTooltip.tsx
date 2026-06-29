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
    <div className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm shadow-[var(--shadow-subtle)]">
      <p className="font-medium text-foreground">{label ?? payload[0].name}</p>
      <p className="text-muted-foreground">{formatCurrency(Number(payload[0].value))}</p>
    </div>
  )
}
