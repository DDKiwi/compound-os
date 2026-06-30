import { Banknote, Gauge, Lightbulb, ListChecks, Percent, TrendingUp, WalletCards } from 'lucide-react'
import type { InvestmentAnalysisSummary } from '../../domain'
import {
  formatCurrency,
  formatNumber,
  formatOptionalCurrency,
  formatOptionalPercentage,
  formatRuleStatus,
  formatScore,
} from '../../ui/formatters'
import { MetricCard } from '../ui/MetricCard'
import { SectionCard } from '../ui/Card'

export function InvestmentDashboard({ summary }: { summary: InvestmentAnalysisSummary }) {
  const ruleTone = summary.ruleScore >= 80 ? 'good' : summary.ruleScore >= 60 ? 'neutral' : 'bad'

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={WalletCards}
          label="Totalt värde"
          value={formatCurrency(summary.totalValue)}
          helper="Portföljvärde inklusive kassa"
        />
        <MetricCard
          icon={Banknote}
          label="Kassa"
          value={formatCurrency(summary.cash)}
          helper={`${formatOptionalPercentage(summary.cashReserveRatio)} av portfoljen`}
        />
        <MetricCard
          icon={TrendingUp}
          label="Investerat värde"
          value={formatCurrency(summary.investedValue)}
          helper="Totalt värde minus kassa"
        />
        <MetricCard
          icon={Gauge}
          label="Regelpoäng"
          value={formatScore(summary.ruleScore)}
          helper={formatRuleStatus(summary.passedRules, summary.warningRules, summary.failedRules)}
          tone={ruleTone}
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
        <SectionCard title="Utdelningsöversikt" action="Summary">
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border-muted bg-surface p-4">
              <dt className="text-xs text-muted-foreground">Årlig utdelning</dt>
              <dd className="mt-2 text-lg font-semibold text-foreground">
                {formatOptionalCurrency(summary.expectedAnnualDividend)}
              </dd>
            </div>
            <div className="rounded-lg border border-border-muted bg-surface p-4">
              <dt className="text-xs text-muted-foreground">Månad</dt>
              <dd className="mt-2 text-lg font-semibold text-foreground">
                {formatOptionalCurrency(summary.expectedMonthlyDividend)}
              </dd>
            </div>
            <div className="rounded-lg border border-border-muted bg-surface p-4">
              <dt className="text-xs text-muted-foreground">Direktavkastning</dt>
              <dd className="mt-2 text-lg font-semibold text-foreground">
                {formatOptionalPercentage(summary.dividendYield)}
              </dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Beslutssignaler" action={summary.sessionId}>
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg border border-border-muted bg-surface p-4">
              <div className="flex items-center gap-3">
                <ListChecks size={17} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Rekommendationer</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatNumber(summary.recommendationCount)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border-muted bg-surface p-4">
              <div className="flex items-center gap-3">
                <Lightbulb size={17} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Insikter</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatNumber(summary.insightCount)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border-muted bg-surface p-4">
              <div className="flex items-center gap-3">
                <Percent size={17} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Regelstatus</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {summary.passedRules}/{summary.passedRules + summary.warningRules + summary.failedRules}
              </span>
            </div>
          </div>
        </SectionCard>
      </section>
    </div>
  )
}
