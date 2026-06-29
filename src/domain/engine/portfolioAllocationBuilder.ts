import type { AllocationWeight, PortfolioAllocation } from '../types'

export type PortfolioAllocationInput = {
  readonly holdings?: readonly AllocationWeight[]
  readonly sectors?: readonly AllocationWeight[]
  readonly countries?: readonly AllocationWeight[]
  readonly currencies?: readonly AllocationWeight[]
  readonly assetClasses?: readonly AllocationWeight[]
}

export function buildPortfolioAllocation(input: PortfolioAllocationInput): PortfolioAllocation {
  return {
    holdings: buildAllocationWeights(input.holdings),
    sectors: buildAllocationWeights(input.sectors),
    countries: buildAllocationWeights(input.countries),
    currencies: buildAllocationWeights(input.currencies),
    assetClasses: buildAllocationWeights(input.assetClasses),
  }
}

function buildAllocationWeights(weights: readonly AllocationWeight[] = []): readonly AllocationWeight[] {
  return weights.map((weight) => {
    if (weight.value < 0) {
      throw new Error('Allocation value cannot be negative.')
    }

    if (weight.weight < 0) {
      throw new Error('Allocation weight cannot be negative.')
    }

    if (weight.weight > 1) {
      throw new Error('Allocation weight cannot exceed 1.')
    }

    return {
      id: weight.id,
      name: weight.name,
      value: weight.value,
      weight: weight.weight,
    }
  })
}
