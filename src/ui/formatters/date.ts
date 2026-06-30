const swedishLocale = 'sv-SE'

export function formatDate(value: Date): string {
  return new Intl.DateTimeFormat(swedishLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(value)
}
