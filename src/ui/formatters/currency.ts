import { normalizeNumberSpacing } from './number'

const swedishLocale = 'sv-SE'

export function formatCurrency(value: number): string {
  return normalizeNumberSpacing(
    new Intl.NumberFormat(swedishLocale, {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0,
    }).format(value),
  )
}

export function formatOptionalCurrency(value: number | undefined): string {
  return value === undefined ? 'Saknas' : formatCurrency(value)
}
