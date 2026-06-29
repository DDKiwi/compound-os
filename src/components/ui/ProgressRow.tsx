export function ProgressRow({
  label,
  value,
  total,
  suffix,
}: {
  label: string
  value: number
  total: number
  suffix?: string
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center gap-3 text-sm">
        <span className="truncate text-foreground">{label}</span>
        <span className="ml-auto text-muted-foreground">{suffix ?? `${percentage}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  )
}
