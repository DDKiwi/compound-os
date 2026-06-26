import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CircleDollarSign, Target, WalletCards } from 'lucide-react'
import { SectionCard as Card } from '../components/ui/Card'
import { ChartTooltip } from '../components/charts/ChartTooltip'
import { MetricCard } from '../components/ui/MetricCard'
import { ProgressRow } from '../components/ui/ProgressRow'
import { getDividendHoldings, getExpectedMonthlyDividend } from '../domain'
import { calculatePortfolioStats } from '../lib/calculations'
import { formatCurrency } from '../lib/helpers'
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

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Target} label="Mål" value="10 000 kr/mån" helper="Utdelningskassaflöde" />
        <MetricCard icon={CircleDollarSign} label="Nuvarande" value={formatCurrency(stats.monthlyDividend)} helper={`${stats.dividendProgress}% klart`} />
        <MetricCard icon={WalletCards} label="Kvar" value={formatCurrency(remaining)} helper="Innan målet är nått" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Prognos" action="Månadsvis">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projection} margin={{ left: -24, right: 8, top: 16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#22c55e" />
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
