import { describe, expect, it, vi } from 'vitest'
import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'
import { evaluateRules } from './ruleEngine'

const context: InvestmentContext = {
  policy: {
    id: 'long-term-policy',
    name: 'Long-term policy',
    philosophy: {
      text: 'Own durable compounders and rebalance with discipline.',
    },
    riskTolerance: 'balanced',
    allocationRules: [],
    positionRule: {
      id: 'max-position-size',
      maxWeight: 0.6,
    },
    exposureRule: {
      id: 'max-sector-exposure',
      exposureType: 'sector',
      maxWeight: 0.6,
    },
    dividendPolicy: {
      preference: 'growth',
    },
    rebalancingRule: {
      id: 'rebalancing-threshold',
      driftThreshold: 0.1,
    },
  },
  snapshot: {
    totalValue: 100_000,
    cashValue: 10_000,
    cashWeight: 0.1,
  },
  allocation: {
    holdings: [],
    sectors: [],
    countries: [],
    currencies: [],
    assetClasses: [],
  },
  metrics: {
    cashWeight: 0.1,
  },
}

function createRuleResult(ruleId: string, status: RuleResult['status'] = 'pass'): RuleResult {
  return {
    ruleId,
    title: `Rule ${ruleId}`,
    status,
    message: `Result for ${ruleId}`,
  }
}

function createRule(ruleId: string, result: RuleResult = createRuleResult(ruleId)): InvestmentRule {
  return {
    id: ruleId,
    title: `Rule ${ruleId}`,
    description: '',
    severity: 'warning',
    category: 'policy',
    evaluate: vi.fn(() => result),
  }
}

describe('ruleEngine', () => {
  it('returns an empty result list when no rules are provided', () => {
    expect(evaluateRules(context, [])).toEqual([])
  })

  it('evaluates one rule', () => {
    const result = createRuleResult('one-rule')
    const rule = createRule('one-rule', result)

    expect(evaluateRules(context, [rule])).toEqual([result])
  })

  it('evaluates multiple rules', () => {
    const firstResult = createRuleResult('first-rule', 'pass')
    const secondResult = createRuleResult('second-rule', 'warning')
    const thirdResult = createRuleResult('third-rule', 'fail')

    const results = evaluateRules(context, [
      createRule('first-rule', firstResult),
      createRule('second-rule', secondResult),
      createRule('third-rule', thirdResult),
    ])

    expect(results).toEqual([firstResult, secondResult, thirdResult])
  })

  it('preserves rule order', () => {
    const rules = [createRule('first'), createRule('second'), createRule('third')]

    const results = evaluateRules(context, rules)

    expect(results.map((result) => result.ruleId)).toEqual(['first', 'second', 'third'])
  })

  it('calls evaluate exactly once per rule with the provided context', () => {
    const rules = [createRule('first'), createRule('second'), createRule('third')]

    evaluateRules(context, rules)

    for (const rule of rules) {
      expect(rule.evaluate).toHaveBeenCalledTimes(1)
      expect(rule.evaluate).toHaveBeenCalledWith(context)
    }
  })
})
