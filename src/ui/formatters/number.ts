const swedishLocale = 'sv-SE'

export function normalizeNumberSpacing(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, ' ')
}

export function formatNumber(value: number): string {
  return normalizeNumberSpacing(new Intl.NumberFormat(swedishLocale).format(value))
}
