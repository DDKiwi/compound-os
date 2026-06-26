import { Badge } from '../ui/Badge'
import { SectionCard as Card } from '../ui/Card'
import type { WatchItem } from '../../types/investment'

export function WatchlistCard({ item }: { item: WatchItem }) {
  return (
    <Card title={item.name} action={item.ticker}>
      <div className="space-y-4">
        <Badge tone={item.priority === 'Hög' ? 'good' : 'neutral'}>{item.priority} prioritet</Badge>
        <p className="text-sm leading-6 text-zinc-400">{item.note}</p>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Köptrigger</p>
          <p className="mt-1 text-sm text-zinc-200">{item.target}</p>
        </div>
      </div>
    </Card>
  )
}
