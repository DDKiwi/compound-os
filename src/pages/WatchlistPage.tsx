import { Plus } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { WatchlistCard } from '../components/watchlist/WatchlistCard'
import type { WatchItem } from '../types/investment'

export function WatchlistPage({ items }: { items: WatchItem[] }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">
          Bevakningslistan är avsedd för framtida köp, inte impulsaffärer. Varje rad kräver en tydlig trigger.
        </p>
        <Button type="button">
          <Plus size={16} />
          Ny kandidat
        </Button>
      </div>
      <section className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <WatchlistCard key={item.ticker} item={item} />
        ))}
      </section>
    </div>
  )
}
