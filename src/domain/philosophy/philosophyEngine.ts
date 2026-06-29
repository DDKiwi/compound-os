import type { Goal, Holding } from '../types'
import {
  getActiveHoldings,
  getAverageDividendGrowthPct,
  getAverageMoatScore,
  getCashValue,
  getExpectedMonthlyDividend,
  getPortfolioValue,
} from '../engine/portfolioEngine'
import { getPhilosophyPreset, type PhilosophyPresetName } from './presets'
import type {
  AllocationDimension,
  InvestmentPhilosophy,
  PhilosophyEvaluationResult,
  PhilosophyPreset,
  PhilosophyProfileInput,
  PhilosophyRule,
  RuleEvaluation,
  RuleStatus,
} from './types'

function getRuleExpectedValue(rule: PhilosophyRule) {
  return (
    rule.condition.targetPercent ??
    rule.condition.minPercent ??
    rule.condition.maxPercent ??
    rule.condition.maxCount ??
    rule.condition.minAmount ??
    rule.condition.minMonthlyDividend ??
    rule.condition.minAverageMoatScore ??
    rule.condition.minAverageDividendGrowthPercent ??
    rule.condition.requireEnabled
  )
}

function getStatus(isPassed: boolean, severity: PhilosophyRule['severity']): RuleStatus {
  if (isPassed) {
    return 'pass'
  }

  return severity === 'critical' ? 'fail' : 'warning'
}

function percent(value: number) {
  return `${value.toFixed(1)} %`
}

function isCashHolding(holding: Holding) {
  return holding.accountType === 'Cash' || holding.assetType === 'Cash' || holding.portfolioRole === 'CashReserve'
}

function getInvestedHoldings(holdings: Holding[]) {
  return getActiveHoldings(holdings).filter((holding) => !isCashHolding(holding))
}

function getAllocationPercent(holdings: Holding[], dimension?: AllocationDimension, target?: string) {
  const activeHoldings = getActiveHoldings(holdings)
  const totalValue = getPortfolioValue(activeHoldings)

  if (totalValue <= 0) {
    return 0
  }

  if (!dimension || !target) {
    const largestHolding = getInvestedHoldings(activeHoldings).sort((a, b) => b.marketValue - a.marketValue)[0]
    return largestHolding ? (largestHolding.marketValue / totalValue) * 100 : 0
  }

  const targetValue = activeHoldings
    .filter((holding) => String(holding[dimension]) === target)
    .reduce((sum, holding) => sum + holding.marketValue, 0)

  return (targetValue / totalValue) * 100
}

function getActiveHoldingCount(holdings: Holding[], dimension?: AllocationDimension, target?: string) {
  const activeHoldings = getInvestedHoldings(holdings)

  if (!dimension || !target) {
    return activeHoldings.length
  }

  return activeHoldings.filter((holding) => String(holding[dimension]) === target).length
}

function getMonthlyDividend(holdings: Holding[]) {
  return getActiveHoldings(holdings).reduce((sum, holding) => sum + getExpectedMonthlyDividend(holding), 0)
}

function createEvaluation(
  rule: PhilosophyRule,
  status: RuleStatus,
  message: string,
  actualValue?: number | boolean,
): RuleEvaluation {
  return {
    ruleId: rule.id,
    ruleType: rule.type,
    title: rule.title,
    severity: rule.severity,
    status,
    message,
    actualValue,
    expectedValue: getRuleExpectedValue(rule),
  }
}

function evaluateMinAllocation(rule: PhilosophyRule, holdings: Holding[]) {
  const actual = getAllocationPercent(holdings, rule.condition.dimension, String(rule.condition.target ?? ''))
  const expected = rule.condition.minPercent ?? 0
  const status = getStatus(actual >= expected, rule.severity)

  return createEvaluation(
    rule,
    status,
    `${rule.title}: ${percent(actual)} allocated; minimum is ${percent(expected)}.`,
    actual,
  )
}

function evaluateMaxAllocation(rule: PhilosophyRule, holdings: Holding[]) {
  const actual = getAllocationPercent(holdings, rule.condition.dimension, rule.condition.target ? String(rule.condition.target) : undefined)
  const expected = rule.condition.maxPercent ?? 100
  const status = getStatus(actual <= expected, rule.severity)

  return createEvaluation(
    rule,
    status,
    `${rule.title}: ${percent(actual)} allocated; maximum is ${percent(expected)}.`,
    actual,
  )
}

function evaluateTargetAllocationRange(rule: PhilosophyRule, holdings: Holding[]) {
  const actual = getAllocationPercent(holdings, rule.condition.dimension, String(rule.condition.target ?? ''))
  const minPercent = rule.condition.minPercent ?? 0
  const maxPercent = rule.condition.maxPercent ?? 100
  const status = getStatus(actual >= minPercent && actual <= maxPercent, rule.severity)

  return createEvaluation(
    rule,
    status,
    `${rule.title}: ${percent(actual)} allocated; target range is ${percent(minPercent)} to ${percent(maxPercent)}.`,
    actual,
  )
}

function evaluateMaxCount(rule: PhilosophyRule, holdings: Holding[]) {
  const actual = getActiveHoldingCount(holdings, rule.condition.dimension, rule.condition.target ? String(rule.condition.target) : undefined)
  const expected = rule.condition.maxCount ?? Number.POSITIVE_INFINITY
  const status = getStatus(actual <= expected, rule.severity)

  return createEvaluation(
    rule,
    status,
    `${rule.title}: ${actual} matching holdings; maximum is ${expected}.`,
    actual,
  )
}

function evaluateMinCashBuffer(rule: PhilosophyRule, holdings: Holding[], goals: Goal) {
  const actual = getCashValue(holdings)
  const expected = rule.condition.minAmount ?? goals.targetBuffer
  const status = getStatus(expected <= 0 || actual >= expected, rule.severity)

  return createEvaluation(
    rule,
    status,
    `${rule.title}: ${actual.toFixed(0)} cash reserve; minimum is ${expected.toFixed(0)}.`,
    actual,
  )
}

function evaluateDividendGoal(rule: PhilosophyRule, holdings: Holding[], goals: Goal) {
  const actual = getMonthlyDividend(holdings)
  const expected = rule.condition.minMonthlyDividend ?? goals.monthlyDividendGoal
  const status = getStatus(expected <= 0 || actual >= expected, rule.severity)

  return createEvaluation(
    rule,
    status,
    `${rule.title}: ${actual.toFixed(0)} expected monthly dividend; goal is ${expected.toFixed(0)}.`,
    actual,
  )
}

function evaluateReinvestDividends(rule: PhilosophyRule) {
  const actual = rule.condition.requireEnabled ?? false
  const status = getStatus(actual, rule.severity)

  return createEvaluation(
    rule,
    status,
    actual ? `${rule.title}: reinvestment is part of the philosophy.` : `${rule.title}: reinvestment is not enabled.`,
    actual,
  )
}

function evaluateQualityPriority(rule: PhilosophyRule, holdings: Holding[]) {
  const averageMoatScore = getAverageMoatScore(holdings)
  const averageDividendGrowth = getAverageDividendGrowthPct(holdings)
  const moatTarget = rule.condition.minAverageMoatScore
  const dividendGrowthTarget = rule.condition.minAverageDividendGrowthPercent
  const moatPassed = moatTarget === undefined || averageMoatScore >= moatTarget
  const dividendGrowthPassed = dividendGrowthTarget === undefined || averageDividendGrowth >= dividendGrowthTarget
  const status = getStatus(moatPassed && dividendGrowthPassed, rule.severity)
  const actual = dividendGrowthTarget !== undefined ? averageDividendGrowth : averageMoatScore
  const targetMessage = dividendGrowthTarget !== undefined
    ? `average dividend growth is ${percent(averageDividendGrowth)}; minimum is ${percent(dividendGrowthTarget)}`
    : `average moat score is ${averageMoatScore.toFixed(1)}; minimum is ${(moatTarget ?? 0).toFixed(1)}`

  return createEvaluation(rule, status, `${rule.title}: ${targetMessage}.`, actual)
}

function evaluateRule(rule: PhilosophyRule, holdings: Holding[], goals: Goal): RuleEvaluation {
  switch (rule.type) {
    case 'min_allocation':
      return evaluateMinAllocation(rule, holdings)
    case 'max_allocation':
      return evaluateMaxAllocation(rule, holdings)
    case 'target_allocation_range':
      return evaluateTargetAllocationRange(rule, holdings)
    case 'max_count':
      return evaluateMaxCount(rule, holdings)
    case 'min_cash_buffer':
      return evaluateMinCashBuffer(rule, holdings, goals)
    case 'dividend_goal':
      return evaluateDividendGoal(rule, holdings, goals)
    case 'reinvest_dividends':
      return evaluateReinvestDividends(rule)
    case 'quality_priority':
      return evaluateQualityPriority(rule, holdings)
  }
}

function getScore(evaluations: RuleEvaluation[]) {
  if (evaluations.length === 0) {
    return 100
  }

  const totalWeight = evaluations.reduce((sum, evaluation) => {
    return sum + (evaluation.severity === 'critical' ? 2 : 1)
  }, 0)
  const passedWeight = evaluations.reduce((sum, evaluation) => {
    if (evaluation.status !== 'pass') {
      return sum
    }

    return sum + (evaluation.severity === 'critical' ? 2 : 1)
  }, 0)

  return Math.round((passedWeight / totalWeight) * 100)
}

export function createPhilosophyFromPreset(
  preset: PhilosophyPreset | PhilosophyPresetName,
  input: PhilosophyProfileInput = {},
): InvestmentPhilosophy {
  const selectedPreset = getPhilosophyPreset(preset)

  return {
    id: input.id ?? selectedPreset.id,
    presetId: selectedPreset.id,
    name: input.name ?? selectedPreset.name,
    description: input.description ?? selectedPreset.description,
    createdAt: input.createdAt ?? new Date().toISOString(),
    rules: selectedPreset.createRules(input),
    metadata: {
      targetNetWorth: input.targetNetWorth ?? 0,
      reinvestDividends: input.reinvestDividends ?? false,
    },
  }
}

export function evaluatePhilosophy(
  philosophy: InvestmentPhilosophy,
  holdings: Holding[],
  goals: Goal,
): PhilosophyEvaluationResult {
  const evaluations = philosophy.rules.map((rule) => evaluateRule(rule, holdings, goals))
  const rulesById = new Map(philosophy.rules.map((rule) => [rule.id, rule]))
  const passedRules = evaluations
    .filter((evaluation) => evaluation.status === 'pass')
    .map((evaluation) => rulesById.get(evaluation.ruleId))
    .filter((rule): rule is PhilosophyRule => Boolean(rule))
  const warningRules = evaluations
    .filter((evaluation) => evaluation.status === 'warning')
    .map((evaluation) => rulesById.get(evaluation.ruleId))
    .filter((rule): rule is PhilosophyRule => Boolean(rule))
  const failedRules = evaluations
    .filter((evaluation) => evaluation.status === 'fail')
    .map((evaluation) => rulesById.get(evaluation.ruleId))
    .filter((rule): rule is PhilosophyRule => Boolean(rule))

  return {
    score: getScore(evaluations),
    passedRules,
    warningRules,
    failedRules,
    evaluations,
  }
}
