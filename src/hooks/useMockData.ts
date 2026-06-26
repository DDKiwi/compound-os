import { useQuery } from '@tanstack/react-query'
import { getMockData } from '../services/mockDataService'

export function useMockData() {
  return useQuery({
    queryKey: ['compound-os-mock-data'],
    queryFn: getMockData,
    staleTime: Number.POSITIVE_INFINITY,
  })
}
