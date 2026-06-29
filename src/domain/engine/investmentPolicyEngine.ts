import type {
  AllocationRule,
  AllocationType,
  Holding,
  InvestmentPolicy,
  PolicyEvaluation,
  PolicyRulePass,
  PolicyViolation,
  PolicyWarning,
  Portfolio,
  SuggestedAction,
} from '../types'
import { getActiveHoldings, getPortfolioWeight, getPortfolioValue } from './portfolioEngine'

function createPass(ruleId: string, message: string): PolicyRulePass {
  return { ruleId, message }
}

function groupWeightByName(holdings: Holding[], getName: (holding: Holding) => string | undefined) {
  const totalValue = getPortfolioValue(holdings)

  return holdings.reduce<Record<string, number>>((weights, holding) => {
    const name = getName(holding)

    if (!name) {
      return weights
    }

    weights[name] = (weights[name] ?? 0) + (totalValue > 0 ? holding.marketValue / totalValue : 0)
    return weights
  }, {})
}

function getAllocationWeights(holdings: Holding[], allocationRule: AllocationRule) {
  return groupWeightByName(holdings, (holding) => getAllocationName(holding, allocationRule.allocationType))
}

function getAllocationName(holding: Holding, allocationType: AllocationType) {
  if (allocationType === 'asset') {
    return holding.assetType
  }

  if (allocationType === 'sector') {
    return holding.sector
  }

  if (allocationType === 'country') {
    return holding.countryExposure
  }

  return holding.currency
}

function createSuggestedAction(
  ruleId: string,
  actionNumber: number,
  type: SuggestedAction['type'],
  priority: SuggestedAction['priority'],
  message: string,
): SuggestedAction {
  return {
    id: `${ruleId}-${actionNumber}`,
    ruleId,
    type,
    priority,
    message,
  }
}

function evaluatePositionRule(
  holdings: Holding[],
  policy: InvestmentPolicy,
  violations: PolicyViolation[],
  suggestedActions: SuggestedAction[],
) {
  const rule = policy.positionRule
  const oversizedHoldings = holdings
    .map((holding) => ({ holding, weight: getPortfolioWeight(holding, holdings) }))
    .filter(({ weight }) => weight > rule.maxWeight)
    .sort((a, b) => b.weight - a.weight)

  oversizedHoldings.forEach(({ holding, weight }, index) => {
    violations.push({
      ruleId: rule.id,
      message: `${holding.name} exceeds the maximum position size.`,
      actualWeight: weight,
      limitWeight: rule.maxWeight,
    })
    suggestedActions.push(
      createSuggestedAction(
        rule.id,
        index + 1,
        'sell',
        'high',
        `Reduce ${holding.name} to ${Math.round(rule.maxWeight * 100)}% or less of the portfolio.`,
      ),
    )
  })

  return oversizedHoldings.length === 0
    ? createPass(rule.id, 'All holdings are within the maximum position size.')
    : undefined
}

function evaluateExposureRule(
  holdings: Holding[],
  policy: InvestmentPolicy,
  violations: PolicyViolation[],
  suggestedActions: SuggestedAction[],
) {
  const rule = policy.exposureRule
  const exposureWeights = groupWeightByName(holdings, (holding) =>
    getAllocationName(holding, rule.exposureType),
  )

  const breachedExposures = Object.entries(exposureWeights)
    .filter(([, weight]) => weight > rule.maxWeight)
    .sort(([, a], [, b]) => b - a)

  breachedExposures.forEach(([exposure, weight], index) => {
    violations.push({
      ruleId: rule.id,
      message: `${exposure} exceeds the maximum ${rule.exposureType} exposure.`,
      actualWeight: weight,
      limitWeight: rule.maxWeight,
    })

    suggestedActions.push(
      createSuggestedAction(
        rule.id,
        index + 1,
        'sell',
        'high',
        `Reduce ${exposure} ${rule.exposureType} exposure to ${Math.round(rule.maxWeight * 100)}% or less of the portfolio.`,
      ),
    )
  })

  return breachedExposures.length === 0
    ? createPass(rule.id, `All ${rule.exposureType} exposures are within policy limits.`)
    : undefined
}

function evaluateRebalancingRule(
  holdings: Holding[],
  policy: InvestmentPolicy,
  warnings: PolicyWarning[],
  suggestedActions: SuggestedAction[],
) {
  const rule = policy.rebalancingRule
  const driftWarnings: PolicyWarning[] = []

  for (const allocationRule of policy.allocationRules) {
    const currentWeights = getAllocationWeights(holdings, allocationRule)

    for (const target of allocationRule.targets) {
      const actualWeight = currentWeights[target.name] ?? 0
      const driftWeight = Math.abs(actualWeight - target.targetWeight)

      if (driftWeight > rule.driftThreshold) {
        driftWarnings.push({
          ruleId: rule.id,
          message: `${target.name} allocation drift exceeds the rebalancing threshold.`,
          actualWeight,
          targetWeight: target.targetWeight,
          driftWeight,
        })
        suggestedActions.push(
          createSuggestedAction(
            rule.id,
            suggestedActions.filter((action) => action.ruleId === rule.id).length + 1,
            'rebalance',
            'medium',
            `Rebalance ${target.name} toward ${Math.round(target.targetWeight * 100)}%.`,
          ),
        )
      }
    }
  }

  warnings.push(...driftWarnings)

  return driftWarnings.length === 0
    ? createPass(rule.id, 'Allocation drift is within the rebalancing threshold.')
    : undefined
}

export function evaluateInvestmentPolicy(
  portfolio: Portfolio,
  investmentPolicy: InvestmentPolicy,
): PolicyEvaluation {
  const holdings = getActiveHoldings(portfolio.holdings)
  const passedRules: PolicyRulePass[] = []
  const warnings: PolicyWarning[] = []
  const violations: PolicyViolation[] = []
  const suggestedActions: SuggestedAction[] = []

  const positionPass = evaluatePositionRule(holdings, investmentPolicy, violations, suggestedActions)
  const sectorPass = evaluateExposureRule(holdings, investmentPolicy, violations, suggestedActions)
  const rebalancingPass = evaluateRebalancingRule(holdings, investmentPolicy, warnings, suggestedActions)

  if (positionPass) {
    passedRules.push(positionPass)
  }

  if (sectorPass) {
    passedRules.push(sectorPass)
  }

  if (rebalancingPass) {
    passedRules.push(rebalancingPass)
  }

  return {
    portfolioId: portfolio.id,
    policyId: investmentPolicy.id,
    passedRules,
    warnings,
    violations,
    suggestedActions,
  }
}
