import { BriefcaseBusiness, CircleDollarSign, LineChart } from 'lucide-react'
import {
  getActiveHoldings,
  getExpectedYearlyDividend,
  getHoldingsByAccountType,
  getPortfolioWeight,
  mockHoldings,
} from '../domain'
import type { AccountType, Holding } from '../domain'
import { Badge } from '../components/ui/Badge'
import { SectionCard as Card } from '../components/ui/Card'
import { MetricCard } from '../components/ui/MetricCard'
import { formatCurrencySEK, formatNumber, formatPercent } from '../lib/formatters'
import { accountTypeLabel, classificationLabel } from '../lib/helpers'

type PortfolioHoldingRow = {
  holding: Holding
  weight: number
  expectedYearlyDividend: number
}

type PortfolioAccountGroup = {
  accountType: AccountType
  holdings: PortfolioHoldingRow[]
  marketValue: number
}

function createPortfolioViewModel(holdings: Holding[]) {
  const activeHoldings = getActiveHoldings(holdings)
  const holdingsByAccountType = getHoldingsByAccountType(activeHoldings)
  const accountGroups = Object.entries(holdingsByAccountType)
    .map(([accountType, accountHoldings]) => {
      const rows = accountHoldings.map((holding) => ({
        holding,
        weight: getPortfolioWeight(holding, activeHoldings),
        expectedYearlyDividend: getExpectedYearlyDividend(holding),
      }))

      return {
        accountType: accountType as AccountType,
        holdings: rows.sort((a, b) => b.holding.marketValue - a.holding.marketValue),
        marketValue: accountHoldings.reduce((sum, holding) => sum + holding.marketValue, 0),
      }
    })
    .sort((a, b) => b.marketValue - a.marketValue)

  return {
    activeHoldingCount: activeHoldings.length,
    totalMarketValue: activeHoldings.reduce((sum, holding) => sum + holding.marketValue, 0),
    expectedYearlyDividend: activeHoldings.reduce(
      (sum, holding) => sum + getExpectedYearlyDividend(holding),
      0,
    ),
    accountGroups,
  }
}

const portfolioViewModel = createPortfolioViewModel(mockHoldings)

function ClassificationBadge({ holding }: { holding: Holding }) {
  const tone = holding.isSpeculative
    ? 'bad'
    : holding.classification === 'GlobalIndex'
      ? 'neutral'
      : 'good'

  return <Badge tone={tone}>{classificationLabel(holding.classification)}</Badge>
}

function PortfolioTable({ group }: { group: PortfolioAccountGroup }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="border-b border-border-muted text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <tr>
            <th className="py-3 pr-4 font-medium">Namn</th>
            <th className="py-3 pr-4 font-medium">Klassificering</th>
            <th className="py-3 pr-4 text-right font-medium">Värde</th>
            <th className="py-3 pr-4 text-right font-medium">Vikt</th>
            <th className="py-3 pr-4 text-right font-medium">Moat</th>
            <th className="py-3 pr-4 text-right font-medium">Direktavk.</th>
            <th className="py-3 text-right font-medium">Årsutdelning</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-muted">
          {group.holdings.map(({ holding, weight, expectedYearlyDividend }) => (
            <tr key={holding.id} className="text-foreground">
              <td className="py-4 pr-4">
                <div className="font-medium text-foreground">{holding.name}</div>
                <div className="text-xs text-muted-foreground">{holding.ticker}</div>
              </td>
              <td className="py-4 pr-4">
                <ClassificationBadge holding={holding} />
              </td>
              <td className="py-4 pr-4 text-right">{formatCurrencySEK(holding.marketValue)}</td>
              <td className="py-4 pr-4 text-right">{formatPercent(weight * 100)}%</td>
              <td className="py-4 pr-4 text-right">{formatNumber(holding.moatScore)}/5</td>
              <td className="py-4 pr-4 text-right">{formatPercent(holding.expectedDividendYield)}%</td>
              <td className="py-4 text-right">{formatCurrencySEK(expectedYearlyDividend)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function PortfolioPage() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={BriefcaseBusiness}
          label="Aktiva innehav"
          value={String(portfolioViewModel.activeHoldingCount)}
          helper="Exklusive bevakning"
        />
        <MetricCard
          icon={LineChart}
          label="Marknadsvärde"
          value={formatCurrencySEK(portfolioViewModel.totalMarketValue)}
          helper="Aktiv portfölj"
        />
        <MetricCard
          icon={CircleDollarSign}
          label="Årsutdelning"
          value={formatCurrencySEK(portfolioViewModel.expectedYearlyDividend)}
          helper="Förväntad brutto"
        />
      </section>

      <section className="space-y-5">
        {portfolioViewModel.accountGroups.map((group) => (
          <Card
            key={group.accountType}
            title={accountTypeLabel(group.accountType)}
            action={formatCurrencySEK(group.marketValue)}
          >
            <PortfolioTable group={group} />
          </Card>
        ))}
      </section>
    </div>
  )
}
