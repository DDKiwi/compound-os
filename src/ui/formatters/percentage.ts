import { normalizeNumberSpacing } from './number'

const swedishLocale = 'sv-SE'

export function formatPercentage(value: number): string {
  return normalizeNumberSpacing(
    new Intl.NumberFormat(swedishLocale, {
      style: 'percent',
      maximumFractionDigits: 1,
      minimumFractionDigits: 0,
    }).format(value),
  )
}

export function formatOptionalPercentage(value: number | undefined): string {
  return value === undefined ? 'Saknas' : formatPercentage(value)
}
