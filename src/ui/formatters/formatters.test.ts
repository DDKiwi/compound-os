import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatNumber, formatPercentage, formatScore } from '.'

describe('ui formatters', () => {
  it('formats SEK currency for Swedish presentation', () => {
    expect(formatCurrency(1234567)).toBe('1 234 567 kr')
  })

  it('formats percentage values from ratios', () => {
    expect(formatPercentage(0.1234)).toBe('12,3 %')
    expect(formatPercentage(0.5)).toBe('50 %')
  })

  it('formats scores as whole points out of 100', () => {
    expect(formatScore(66.7)).toBe('67/100')
  })

  it('formats plain numbers with Swedish grouping', () => {
    expect(formatNumber(1234567)).toBe('1 234 567')
  })

  it('formats dates with Swedish numeric order', () => {
    expect(formatDate(new Date('2026-06-30T12:00:00Z'))).toBe('2026-06-30')
  })
})
