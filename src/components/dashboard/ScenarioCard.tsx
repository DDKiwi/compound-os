import type { InvestmentScenarioCardViewModel } from '../../ui'
import { SectionCard } from '../ui/Card'

export function ScenarioCard({
  scenario,
}: {
  scenario: InvestmentScenarioCardViewModel
}) {
  return (
    <SectionCard title={scenario.title} action={`${scenario.simulationCount} simuleringar`}>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border-muted bg-surface p-4">
          <dt className="text-xs text-muted-foreground">FÃ¶rvÃ¤ntat vÃ¤rde</dt>
          <dd className="mt-2 text-lg font-semibold text-foreground">
            {scenario.expectedValue}
          </dd>
        </div>
        <div className="rounded-lg border border-border-muted bg-surface p-4">
          <dt className="text-xs text-muted-foreground">Investerat kapital</dt>
          <dd className="mt-2 text-lg font-semibold text-foreground">
            {scenario.investedCapital}
          </dd>
        </div>
        <div className="rounded-lg border border-border-muted bg-surface p-4">
          <dt className="text-xs text-muted-foreground">FÃ¶rvÃ¤ntad vinst</dt>
          <dd className="mt-2 text-lg font-semibold text-foreground">
            {scenario.expectedProfit}
          </dd>
        </div>
        <div className="rounded-lg border border-border-muted bg-surface p-4">
          <dt className="text-xs text-muted-foreground">FÃ¶rvÃ¤ntad utdelning</dt>
          <dd className="mt-2 text-lg font-semibold text-foreground">
            {scenario.expectedDividendIncome}
          </dd>
        </div>
      </dl>

      {scenario.topRecommendation && (
        <div className="mt-3 rounded-lg border border-border-muted bg-surface p-4">
          <p className="text-xs text-muted-foreground">Prioriterad rekommendation</p>
          <p className="mt-2 text-sm font-medium text-foreground">
            {scenario.topRecommendation}
          </p>
        </div>
      )}
    </SectionCard>
  )
}
