import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { InvestmentScenarioCardViewModel } from '../../ui'
import { ScenarioCard } from './ScenarioCard'

const scenario: InvestmentScenarioCardViewModel = {
  title: 'Increase dividend compounders',
  expectedValue: '1 234 567 kr',
  investedCapital: '1 000 000 kr',
  expectedProfit: '234 567 kr',
  expectedDividendIncome: '45 000 kr',
  simulationCount: '2',
}

describe('ScenarioCard', () => {
  it('renders values from the scenario card view model', () => {
    const markup = renderToStaticMarkup(createElement(ScenarioCard, { scenario }))

    expect(markup).toContain('Increase dividend compounders')
    expect(markup).toContain('1 234 567 kr')
    expect(markup).toContain('1 000 000 kr')
    expect(markup).toContain('234 567 kr')
    expect(markup).toContain('45 000 kr')
    expect(markup).toContain('2 simuleringar')
  })

  it('renders top recommendation when provided', () => {
    const markup = renderToStaticMarkup(
      createElement(ScenarioCard, {
        scenario: {
          ...scenario,
          topRecommendation: 'Increase monthly deposits',
        },
      }),
    )

    expect(markup).toContain('Prioriterad rekommendation')
    expect(markup).toContain('Increase monthly deposits')
  })

  it('omits top recommendation when it is not provided', () => {
    const markup = renderToStaticMarkup(createElement(ScenarioCard, { scenario }))

    expect(markup).not.toContain('Prioriterad rekommendation')
  })
})
