import type { Goal, Holding, InvestmentRule, RuleResult } from '../types'
import { investmentGoal, investmentRules } from '../config/investmentRules'
import { getActiveHoldings, getCashValue, getPortfolioWeight, getTotalInvestedCapital } from './portfolioEngine'

type ConcentrationRisk = {
  holding: Holding
  weight: number
  isBreached: boolean
}

function percentToWeight(percent: number) {
  return percent / 100
}

function findRule(rules: InvestmentRule[], id: string, fallback: InvestmentRule) {
  return rules.find((rule) => rule.id === id) ?? fallback
}

function createRuleResult(rule: InvestmentRule, status: RuleResult['status'], message: string): RuleResult {
  return {
    ruleId: rule.id,
    title: rule.title,
    status,
    message,
  }
}

export function getSpeculativeExposure(holdings: Holding[]) {
  return getActiveHoldings(holdings)
    .filter((holding) => holding.isSpeculative || holding.classification === 'SpeculativeGrowth')
    .reduce((sum, holding) => sum + holding.marketValue, 0)
}

export function getSpeculativeExposurePercent(holdings: Holding[]) {
  const activeHoldings = getActiveHoldings(holdings)
  const totalInvestedCapital = getTotalInvestedCapital(activeHoldings)

  return totalInvestedCapital > 0 ? getSpeculativeExposure(activeHoldings) / totalInvestedCapital : 0
}

export function isSpeculativeExposureWithinLimit(holdings: Holding[], maxPercent: number) {
  return getSpeculativeExposurePercent(holdings) <= percentToWeight(maxPercent)
}

export function getSingleHoldingConcentrationRisk(holdings: Holding[], maxPercent: number): ConcentrationRisk[] {
  const activeHoldings = getActiveHoldings(holdings).filter(
    (holding) => holding.accountType !== 'Cash' && holding.assetType !== 'Cash' && holding.portfolioRole !== 'CashReserve',
  )
  const maxWeight = percentToWeight(maxPercent)

  return activeHoldings
    .filter((holding) => holding.classification !== 'GlobalIndex')
    .map((holding) => {
      const weight = getPortfolioWeight(holding, activeHoldings)

      return {
        holding,
        weight,
        isBreached: weight > maxWeight,
      }
    })
    .filter((risk) => risk.isBreached)
    .sort((a, b) => b.weight - a.weight)
}

export function getCashBufferProgress(holdings: Holding[], targetBuffer: number) {
  if (targetBuffer <= 0) {
    return 0
  }

  return getCashValue(getActiveHoldings(holdings)) / targetBuffer
}

export function evaluateInvestmentRules(
  holdings: Holding[],
  goals: Goal,
  rules: InvestmentRule[],
): RuleResult[] {
  const activeHoldings = getActiveHoldings(holdings)
  const highRiskRule = findRule(rules, 'high-risk-limit', investmentRules.highRiskLimit)
  const cashRule = findRule(rules, 'cash-buffer-target', {
    id: 'cash-buffer-target',
    title: 'Kassabuffert',
    description: 'Kassabufferten ska byggas mot mål.',
    severity: 'warning',
  })
  const concentrationRule = findRule(rules, 'single-holding-concentration', {
    id: 'single-holding-concentration',
    title: 'Max 25 % i enskilt innehav',
    description: 'Inget enskilt innehav ska överstiga 25 %, förutom global indexbas.',
    severity: 'warning',
  })
  const speculativeHoldings = activeHoldings.filter(
    (holding) => holding.isSpeculative || holding.classification === 'SpeculativeGrowth',
  )
  const speculativeExposurePercent = getSpeculativeExposurePercent(activeHoldings)
  const concentrationRisks = getSingleHoldingConcentrationRisk(activeHoldings, 25)
  const cashBufferProgress = getCashBufferProgress(activeHoldings, goals.targetBuffer)

  return [
    createRuleResult(
      highRiskRule,
      speculativeHoldings.length <= 1 ? 'pass' : 'fail',
      speculativeHoldings.length <= 1
        ? 'Max ett spekulativt innehav är uppfyllt.'
        : `${speculativeHoldings.length} spekulativa innehav finns i portföljen.`,
    ),
    createRuleResult(
      highRiskRule,
      speculativeExposurePercent <= 0.02 ? 'pass' : 'fail',
      speculativeExposurePercent <= 0.02
        ? 'Spekulativ exponering är inom 2 %.'
        : `Spekulativ exponering är ${(speculativeExposurePercent * 100).toFixed(1)} %.`,
    ),
    createRuleResult(
      cashRule,
      cashBufferProgress >= 1 ? 'pass' : 'warning',
      cashBufferProgress >= 1
        ? 'Kassabufferten är fullfinansierad.'
        : `Kassabufferten är ${(cashBufferProgress * 100).toFixed(0)} % av mål.`,
    ),
    createRuleResult(
      concentrationRule,
      concentrationRisks.length === 0 ? 'pass' : 'warning',
      concentrationRisks.length === 0
        ? 'Ingen enskild position överstiger 25 %, exklusive global index.'
        : `${concentrationRisks[0].holding.name} väger ${(concentrationRisks[0].weight * 100).toFixed(1)} %.`,
    ),
  ]
}

export function getHighRiskHoldings(holdings: Holding[]) {
  return getActiveHoldings(holdings).filter(
    (holding) => holding.isSpeculative || holding.classification === 'SpeculativeGrowth',
  )
}

export function getHighRiskExposure(holdings: Holding[]) {
  const activeHoldings = getActiveHoldings(holdings)

  return {
    count: getHighRiskHoldings(activeHoldings).length,
    value: getSpeculativeExposure(activeHoldings),
    weightPct: getSpeculativeExposurePercent(activeHoldings) * 100,
  }
}

export function evaluateHighRiskRule(holdings: Holding[]): RuleResult {
  return evaluateInvestmentRules(holdings, investmentGoal, [investmentRules.highRiskLimit])[0]
}

export function evaluatePortfolioRules(holdings: Holding[]): RuleResult[] {
  return evaluateInvestmentRules(holdings, investmentGoal, Object.values(investmentRules))
}
