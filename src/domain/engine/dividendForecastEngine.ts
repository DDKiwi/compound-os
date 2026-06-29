import type { DividendForecast, DividendPayment, MonthlyDividendForecast } from '../types'

export type DividendForecastInput = {
  readonly payments: readonly DividendPayment[]
  readonly currency: string
}

export function buildDividendForecast(input: DividendForecastInput): DividendForecast {
  validateCurrency(input.currency)

  const payments = input.payments.map((payment) => {
    validatePayment(payment, input.currency)

    return { ...payment }
  })

  payments.sort((firstPayment, secondPayment) => firstPayment.paymentDate.localeCompare(secondPayment.paymentDate))

  const monthsById = new Map<string, MonthlyDividendForecast>()

  payments.forEach((payment) => {
    const month = payment.paymentDate.slice(0, 7)
    const existingMonth = monthsById.get(month)

    if (existingMonth) {
      monthsById.set(month, {
        ...existingMonth,
        totalAmount: existingMonth.totalAmount + payment.amount,
        payments: [...existingMonth.payments, payment],
      })

      return
    }

    monthsById.set(month, {
      month,
      totalAmount: payment.amount,
      currency: input.currency,
      payments: [payment],
    })
  })

  return {
    totalAmount: payments.reduce((sum, payment) => sum + payment.amount, 0),
    currency: input.currency,
    months: [...monthsById.values()].sort((firstMonth, secondMonth) =>
      firstMonth.month.localeCompare(secondMonth.month),
    ),
  }
}

function validatePayment(payment: DividendPayment, forecastCurrency: string) {
  if (payment.amount < 0) {
    throw new Error('Dividend payment amount cannot be negative.')
  }

  if (!payment.paymentDate) {
    throw new Error('Dividend payment date is required.')
  }

  validateCurrency(payment.currency)

  if (payment.currency !== forecastCurrency) {
    throw new Error('Dividend payment currency must match forecast currency.')
  }
}

function validateCurrency(currency: string) {
  if (!currency) {
    throw new Error('Dividend currency is required.')
  }
}
