const swedishLocale = 'sv-SE'

export function formatCurrencySEK(value: number) {
  return new Intl.NumberFormat(swedishLocale, {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat(swedishLocale, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat(swedishLocale).format(value)
}

export function formatCompactCurrencySEK(value: number) {
  return new Intl.NumberFormat(swedishLocale, {
    style: 'currency',
    currency: 'SEK',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
