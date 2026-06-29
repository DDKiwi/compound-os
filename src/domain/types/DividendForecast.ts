export type DividendPayment = {
  readonly holdingId: string
  readonly holdingName: string
  readonly exDate?: string
  readonly paymentDate: string
  readonly amount: number
  readonly currency: string
}

export type MonthlyDividendForecast = {
  readonly month: string
  readonly totalAmount: number
  readonly currency: string
  readonly payments: readonly DividendPayment[]
}

export type DividendForecast = {
  readonly totalAmount: number
  readonly currency: string
  readonly months: readonly MonthlyDividendForecast[]
}
