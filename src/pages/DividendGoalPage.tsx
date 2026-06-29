import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CircleDollarSign, Target, WalletCards } from 'lucide-react'
import { SectionCard as Card } from '../components/ui/Card'
import { ChartTooltip } from '../components/charts/ChartTooltip'
import { MetricCard } from '../components/ui/MetricCard'
import { ProgressRow } from '../components/ui/ProgressRow'
import { getDividendHoldings, getExpectedMonthlyDividend, getPortfolioDividendCalendar } from '../domain'
import { calculatePortfolioStats } from '../lib/calculations'
import { classificationLabel, formatCurrency } from '../lib/helpers'
import type { DividendPoint, Holding } from '../types/investment'

export function DividendGoalPage({
  holdings,
  projection,
}: {
  holdings: Holding[]
  projection: DividendPoint[]
}) {
  const stats = calculatePortfolioStats(holdings)
  const remaining = 10000 - stats.monthlyDividend
  const dividendHoldings = getDividendHoldings(holdings)
  const dividendCalendar = getPortfolioDividendCalendar(holdings)
  const bestDividendMonth = [...dividendCalendar].sort((a, b) => b.expectedDividend - a.expectedDividend)[0]
  const weakestDividendMonth = [...dividendCalendar].sort((a, b) => a.expectedDividend - b.expectedDividend)[0]

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Target} label="Mål" value="10 000 kr/mån" helper="Utdelningskassaflöde" />
        <MetricCard icon={CircleDollarSign} label="Nuvarande" value={formatCurrency(stats.monthlyDividend)} helper={`${stats.dividendProgress}% klart`} />
        <MetricCard icon={WalletCards} label="Kvar" value={formatCurrency(remaining)} helper="Innan målet är nått" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title="Utdelningskalender" action="12 månader">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dividendCalendar} margin={{ left: -24, right: 8, top: 16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-muted)" vertical={false} />
                <XAxis dataKey="monthName" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="expectedDividend" name="Utdelning" radius={[6, 6, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Kalenderbalans" action="SEK">
          <div className="grid gap-3">
            <div className="rounded-lg border border-border-muted bg-surface p-4">
              <p className="text-xs text-muted-foreground">Starkaste månad</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{bestDividendMonth.monthName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(bestDividendMonth.expectedDividend)}</p>
            </div>
            <div className="rounded-lg border border-border-muted bg-surface p-4">
              <p className="text-xs text-muted-foreground">Svagaste månad</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{weakestDividendMonth.monthName}</p>
              <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(weakestDividendMonth.expectedDividend)}</p>
            </div>
          </div>
        </Card>
      </section>

      <Card title="Månadsvisa betalningar" action="Innehav">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dividendCalendar.map((month) => (
            <div key={month.month} className="rounded-lg border border-border-muted bg-surface p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{month.monthName}</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(month.expectedDividend)}</p>
              </div>
              {month.holdings.length === 0 ? (
                <p className="text-sm text-muted-foreground">Inga förväntade betalningar.</p>
              ) : (
                <div className="space-y-2">
                  {month.holdings.map((holding) => (
                    <div key={`${month.month}-${holding.ticker}`} className="flex items-start justify-between gap-3 text-sm">
                      <div className="min-w-0">
                        <p className="truncate text-foreground">{holding.name}</p>
                        <p className="text-xs text-muted-foreground">{holding.ticker} | {holding.accountType} | {classificationLabel(holding.classification)}</p>
                      </div>
                      <p className="shrink-0 text-muted-foreground">{formatCurrency(holding.expectedDividend)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Prognos" action="Månadsvis">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projection} margin={{ left: -24, right: 8, top: 16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border-muted)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Största bidrag" action="Per månad">
          <div className="space-y-3">
            {dividendHoldings.slice(0, 7).map((holding) => {
              const monthlyDividend = getExpectedMonthlyDividend(holding)

              return (
                <ProgressRow
                  key={holding.id}
                  label={holding.name}
                  value={monthlyDividend}
                  total={stats.monthlyDividend}
                  suffix={formatCurrency(monthlyDividend)}
                />
              )
            })}
          </div>
        </Card>
      </section>
    </div>
  )
}
