import { describe, expect, it } from 'vitest'
import type { InvestmentPolicy } from '../types'
import * as rules from './index'

describe('AssetClassAllocationRule', () => {
  it('is not implemented while InvestmentPolicy has no asset class limits', () => {
    type HasAssetClassLimits = 'assetClassLimits' extends keyof InvestmentPolicy ? true : false
    const hasAssetClassLimits: HasAssetClassLimits = false

    expect(hasAssetClassLimits).toBe(false)
    expect('AssetClassAllocationRule' in rules).toBe(false)
  })
})
