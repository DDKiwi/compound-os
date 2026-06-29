import { Badge } from '../ui/Badge'
import { SectionCard as Card } from '../ui/Card'
import type { WatchItem } from '../../types/investment'

export function WatchlistCard({ item }: { item: WatchItem }) {
  return (
    <Card title={item.name} action={item.ticker}>
      <div className="space-y-4">
        <Badge tone={item.priority === 'Hög' ? 'good' : 'neutral'}>{item.priority} prioritet</Badge>
        <p className="text-sm leading-6 text-muted-foreground">{item.note}</p>
        <div className="rounded-lg border border-border-muted bg-surface p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Köptrigger</p>
          <p className="mt-1 text-sm text-foreground">{item.target}</p>
        </div>
      </div>
    </Card>
  )
}
