import { describe, expect, it } from 'vitest'
import type { DividendForecastInput } from './dividendForecastEngine'
import { buildDividendForecast } from './dividendForecastEngine'

function createPayment(overrides: Partial<DividendForecastInput['payments'][number]> = {}) {
  return {
    holdingId: 'realty-income',
    holdingName: 'Realty Income',
    paymentDate: '2026-01-15',
    amount: 100,
    currency: 'USD',
    ...overrides,
  }
}

describe('buildDividendForecast', () => {
  it('supports an empty payments list', () => {
    expect(
      buildDividendForecast({
        payments: [],
        currency: 'USD',
      }),
    ).toEqual({
      totalAmount: 0,
      currency: 'USD',
      months: [],
    })
  })

  it('builds a forecast for one payment', () => {
    const payment = createPayment()

    expect(
      buildDividendForecast({
        payments: [payment],
        currency: 'USD',
      }),
    ).toEqual({
      totalAmount: 100,
      currency: 'USD',
      months: [
        {
          month: '2026-01',
          totalAmount: 100,
          currency: 'USD',
          payments: [payment],
        },
      ],
    })
  })

  it('groups several payments in the same month', () => {
    const firstPayment = createPayment({
      holdingId: 'realty-income',
      holdingName: 'Realty Income',
      paymentDate: '2026-01-15',
      amount: 100,
    })
    const secondPayment = createPayment({
      holdingId: 'main-street',
      holdingName: 'Main Street Capital',
      paymentDate: '2026-01-31',
      amount: 40,
    })

    expect(
      buildDividendForecast({
        payments: [firstPayment, secondPayment],
        currency: 'USD',
      }).months,
    ).toEqual([
      {
        month: '2026-01',
        totalAmount: 140,
        currency: 'USD',
        payments: [firstPayment, secondPayment],
      },
    ])
  })

  it('groups payments across several months', () => {
    const januaryPayment = createPayment({
      paymentDate: '2026-01-15',
      amount: 100,
    })
    const februaryPayment = createPayment({
      paymentDate: '2026-02-15',
      amount: 50,
    })

    expect(
      buildDividendForecast({
        payments: [januaryPayment, februaryPayment],
        currency: 'USD',
      }),
    ).toEqual({
      totalAmount: 150,
      currency: 'USD',
      months: [
        {
          month: '2026-01',
          totalAmount: 100,
          currency: 'USD',
          payments: [januaryPayment],
        },
        {
          month: '2026-02',
          totalAmount: 50,
          currency: 'USD',
          payments: [februaryPayment],
        },
      ],
    })
  })

  it('sorts payments by payment date and months by month', () => {
    const marchPayment = createPayment({
      holdingId: 'march',
      holdingName: 'March Holding',
      paymentDate: '2026-03-01',
      amount: 30,
    })
    const earlyJanuaryPayment = createPayment({
      holdingId: 'early-january',
      holdingName: 'Early January Holding',
      paymentDate: '2026-01-05',
      amount: 10,
    })
    const lateJanuaryPayment = createPayment({
      holdingId: 'late-january',
      holdingName: 'Late January Holding',
      paymentDate: '2026-01-25',
      amount: 20,
    })

    const forecast = buildDividendForecast({
      payments: [marchPayment, lateJanuaryPayment, earlyJanuaryPayment],
      currency: 'USD',
    })

    expect(forecast.months.map((month) => month.month)).toEqual(['2026-01', '2026-03'])
    expect(forecast.months[0]?.payments).toEqual([earlyJanuaryPayment, lateJanuaryPayment])
    expect(forecast.months[1]?.payments).toEqual([marchPayment])
  })

  it('throws for a negative amount', () => {
    expect(() =>
      buildDividendForecast({
        payments: [createPayment({ amount: -1 })],
        currency: 'USD',
      }),
    ).toThrow('Dividend payment amount cannot be negative.')
  })

  it('throws for a missing payment date', () => {
    expect(() =>
      buildDividendForecast({
        payments: [createPayment({ paymentDate: '' })],
        currency: 'USD',
      }),
    ).toThrow('Dividend payment date is required.')
  })

  it('throws for a missing payment currency', () => {
    expect(() =>
      buildDividendForecast({
        payments: [createPayment({ currency: '' })],
        currency: 'USD',
      }),
    ).toThrow('Dividend currency is required.')
  })

  it('throws for a missing forecast currency', () => {
    expect(() =>
      buildDividendForecast({
        payments: [createPayment()],
        currency: '',
      }),
    ).toThrow('Dividend currency is required.')
  })

  it('throws for a currency mismatch', () => {
    expect(() =>
      buildDividendForecast({
        payments: [createPayment({ currency: 'SEK' })],
        currency: 'USD',
      }),
    ).toThrow('Dividend payment currency must match forecast currency.')
  })

  it('does not mutate the input', () => {
    const input: DividendForecastInput = {
      payments: [
        createPayment({
          holdingId: 'second',
          holdingName: 'Second Holding',
          paymentDate: '2026-02-15',
          amount: 20,
        }),
        createPayment({
          holdingId: 'first',
          holdingName: 'First Holding',
          paymentDate: '2026-01-15',
          amount: 10,
        }),
      ],
      currency: 'USD',
    }
    const originalInput = {
      payments: input.payments.map((payment) => ({ ...payment })),
      currency: input.currency,
    }

    buildDividendForecast(input)

    expect(input).toEqual(originalInput)
  })
})
