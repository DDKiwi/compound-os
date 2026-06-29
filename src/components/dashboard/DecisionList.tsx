export function DecisionList() {
  const decisions = [
    ['Bas först', 'Nytt kapital går först mot global index om basvikten faller.'],
    ['KF-filter', 'Internationella aktier ska vara utdelare eller compounders.'],
    ['Risktak', 'T1 Energy är enda high-risk-case och får inte byggas ut över regeln.'],
  ]

  return (
    <div className="grid gap-3">
      {decisions.map(([title, text]) => (
        <div key={title} className="rounded-lg border border-border-muted bg-surface p-4">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
        </div>
      ))}
    </div>
  )
}
