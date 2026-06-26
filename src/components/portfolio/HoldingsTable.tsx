import { Badge } from '../ui/Badge'
import {
  accountTypeLabel,
  classificationLabel,
  formatCurrency,
  formatPercent,
  portfolioRoleLabel,
} from '../../lib/helpers'
import type { Holding } from '../../types/investment'

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-zinc-500">
          <tr>
            <th className="py-3 pr-4 font-medium">Namn</th>
            <th className="py-3 pr-4 font-medium">Konto</th>
            <th className="py-3 pr-4 font-medium">Klassificering</th>
            <th className="py-3 pr-4 text-right font-medium">Värde</th>
            <th className="py-3 pr-4 text-right font-medium">Direktavk.</th>
            <th className="py-3 text-right font-medium">Roll</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {holdings.map((holding) => (
            <tr key={holding.id} className="text-zinc-300">
              <td className="py-4 pr-4">
                <div className="font-medium text-zinc-100">{holding.name}</div>
                <div className="text-xs text-zinc-500">{holding.ticker}</div>
              </td>
              <td className="py-4 pr-4">{accountTypeLabel(holding.accountType)}</td>
              <td className="py-4 pr-4">{classificationLabel(holding.classification)}</td>
              <td className="py-4 pr-4 text-right">{formatCurrency(holding.marketValue)}</td>
              <td className="py-4 pr-4 text-right">{formatPercent(holding.expectedDividendYield)}%</td>
              <td className="py-4 text-right">
                <Badge tone={holding.isSpeculative ? 'bad' : holding.portfolioRole === 'Core' ? 'neutral' : 'good'}>
                  {portfolioRoleLabel(holding.portfolioRole)}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
