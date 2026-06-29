import { Badge } from '../components/ui/Badge'
import { SectionCard as Card } from '../components/ui/Card'
import { formatCurrency } from '../lib/helpers'
import type { JournalEntry } from '../types/investment'

export function JournalPage({ entries }: { entries: JournalEntry[] }) {
  return (
    <div className="space-y-5">
      <Card title="Investeringsjournal" action={`${entries.length} anteckningar`}>
        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-lg border border-border-muted bg-surface p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="neutral">{entry.ticker}</Badge>
                <time className="text-xs text-muted-foreground">{entry.date}</time>
                {entry.amount > 0 && <span className="text-xs text-muted-foreground">{formatCurrency(entry.amount)}</span>}
              </div>
              <h2 className="mt-3 text-base font-semibold">{entry.reason}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.risk}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Exitregel: {entry.exitRule}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}
