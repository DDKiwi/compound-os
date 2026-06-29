import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { AlertTriangle, Banknote, CheckCircle2, ChevronRight, Gauge, ShieldCheck, Target, WalletCards } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { SectionCard as Card } from '../components/ui/Card'
import { ChartTooltip } from '../components/charts/ChartTooltip'
import { MetricCard } from '../components/ui/MetricCard'
import { ProgressRow } from '../components/ui/ProgressRow'
import { navItems } from '../app/routes'
import { createDashboardSummary, mockGoals, mockPhilosophy, mockPortfolioHoldings, mockRules } from '../domain'
import { formatCurrencySEK, formatPercent } from '../lib/formatters'
import { accountTypeLabel, chartColors, classificationLabel } from '../lib/helpers'
import type { AccountType, HoldingClassification } from '../domain'
import type { MockData, PageId } from '../types/investment'

export function DashboardPage({
  navigate,
}: {
  data: MockData
  navigate: (page: PageId) => void
}) {
  const summary = createDashboardSummary(mockPortfolioHoldings, mockGoals, mockRules, mockPhilosophy)
  const strategyTone = summary.philosophyScore >= 80 ? 'good' : summary.philosophyScore >= 60 ? 'neutral' : 'bad'

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon={WalletCards} label="Marknadsvärde" value={formatCurrencySEK(summary.totalMarketValue)} helper="Aktiva innehav och mockdata" />
        <MetricCard icon={Target} label="Utdelning/mån" value={formatCurrencySEK(summary.expectedMonthlyDividend)} helper={`${formatPercent(summary.dividendGoalProgress * 100)}% av 10 000 kr/mån`} />
        <MetricCard icon={Banknote} label="Kassabuffert" value={`${formatPercent(summary.cashBufferProgress * 100)}%`} helper={`${formatCurrencySEK(summary.cashValue)} av mål`} />
        <MetricCard icon={Gauge} label="Spekulativt" value={`${formatPercent(summary.speculativeExposurePercent * 100)}%`} helper="Max 2 % av investerat kapital" tone={summary.speculativeExposurePercent <= 0.02 ? 'good' : 'bad'} />
        <MetricCard icon={ShieldCheck} label="StrategipoÃ¤ng" value={`${summary.philosophyScore}/100`} helper={`${summary.philosophyRuleEvaluations.length} filosofiregler`} tone={strategyTone} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Strategivarningar" action="Topp 3">
          <div className="space-y-3">
            {summary.topPhilosophyWarnings.length === 0 ? (
              <div className="flex items-start gap-3 rounded-lg border border-success/20 bg-success/10 p-4 text-sm text-success">
                <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                <span>Inga aktiva strategivarningar.</span>
              </div>
            ) : (
              summary.topPhilosophyWarnings.map((rule) => (
                <div key={rule.ruleId} className="flex items-start gap-3 rounded-lg border border-border-muted bg-surface p-4">
                  <AlertTriangle className={rule.status === 'fail' ? 'mt-0.5 shrink-0 text-destructive' : 'mt-0.5 shrink-0 text-warning'} size={16} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{rule.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{rule.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Uppfyllda strategiregler" action="Topp 3">
          <div className="space-y-3">
            {summary.topPhilosophyPassedRules.map((rule) => (
              <div key={rule.id} className="flex items-start gap-3 rounded-lg border border-border-muted bg-surface p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-success" size={16} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{rule.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Allokering per konto" action="Vikt">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.allocationByAccountType} dataKey="value" nameKey="name" innerRadius={56} outerRadius={88} paddingAngle={2}>
                  {summary.allocationByAccountType.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {summary.allocationByAccountType.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: chartColors[index % chartColors.length] }} />
                <span className="truncate">{accountTypeLabel(item.name as AccountType)}</span>
                <span className="ml-auto">{formatPercent(item.weight * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Allokering per klassificering" action="Vikt">
          <div className="space-y-4">
            {summary.allocationByClassification.map((item) => (
              <ProgressRow
                key={item.name}
                label={classificationLabel(item.name as HoldingClassification)}
                value={item.value}
                total={summary.totalMarketValue}
                suffix={`${formatPercent(item.weight * 100)}%`}
              />
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card title="Största innehav" action="Topp 5">
          <div className="space-y-3">
            {summary.largestHoldings.map((holding) => (
              <ProgressRow
                key={holding.id}
                label={holding.name}
                value={holding.marketValue}
                total={summary.totalMarketValue}
                suffix={formatCurrencySEK(holding.marketValue)}
              />
            ))}
          </div>
        </Card>

        <Card title="Regelstatus" action={`${summary.ruleResults.length} regler`}>
          <div className="space-y-3">
            {summary.ruleResults.map((rule) => (
              <div key={rule.ruleId} className="rounded-lg border border-border-muted bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{rule.title}</p>
                  <span className={`rounded-md border px-2 py-1 text-xs ${
                    rule.status === 'pass'
                      ? 'border-success/25 bg-success/10 text-success'
                      : rule.status === 'warning'
                        ? 'border-warning/25 bg-warning/10 text-warning'
                        : 'border-destructive/25 bg-destructive/10 text-destructive'
                  }`}>
                    {rule.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{rule.message}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Bevakningslista" action={`${summary.watchlistHoldings.length} innehav`}>
          <div className="space-y-3">
            {summary.watchlistHoldings.length === 0 ? (
              <p className="text-sm text-muted-foreground">Inga watchlist-innehav räknas som investerade innehav.</p>
            ) : (
              summary.watchlistHoldings.map((holding) => (
                <div key={holding.id} className="rounded-lg border border-border-muted bg-surface p-4">
                  <p className="text-sm font-medium">{holding.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{holding.notes}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card title="Snabbåtkomst" action="Navigera">
          <div className="grid gap-2">
            {navItems.slice(1, 5).map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(item.id)}
                  className="h-auto justify-start px-4 py-3 text-left"
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto text-muted-foreground" size={16} />
                </Button>
              )
            })}
          </div>
        </Card>
      </section>
    </div>
  )
}
