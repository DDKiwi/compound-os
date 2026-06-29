import { describe, expect, it } from 'vitest'
import type { InvestmentPolicy } from '../types'
import * as rules from './index'

describe('CurrencyAllocationRule', () => {
  it('is not implemented while InvestmentPolicy has no currency limits', () => {
    type HasCurrencyLimits = 'currencyLimits' extends keyof InvestmentPolicy ? true : false
    const hasCurrencyLimits: HasCurrencyLimits = false

    expect(hasCurrencyLimits).toBe(false)
    expect('CurrencyAllocationRule' in rules).toBe(false)
  })
})
