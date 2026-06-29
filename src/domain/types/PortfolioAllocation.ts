export type AllocationWeight = {
  readonly id: string
  readonly name: string
  readonly value: number
  readonly weight: number
}

export type PortfolioAllocation = {
  readonly holdings: readonly AllocationWeight[]
  readonly sectors: readonly AllocationWeight[]
  readonly countries: readonly AllocationWeight[]
  readonly currencies: readonly AllocationWeight[]
  readonly assetClasses: readonly AllocationWeight[]
}
