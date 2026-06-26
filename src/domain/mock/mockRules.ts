import type { InvestmentRule } from '../types'

export const mockRules: InvestmentRule[] = [
  {
    id: 'global-index-base',
    title: 'Global index är basen',
    description: 'Portföljen ska ha global indexexponering som stabil kärna innan satelliter byggs ut.',
    severity: 'info',
  },
  {
    id: 'kf-international-compounders',
    title: 'KF för internationella compounders och utdelare',
    description: 'KF används främst för internationella bolag med kvalitet, utdelning eller långsiktig compounding.',
    severity: 'warning',
  },
  {
    id: 'high-risk-limit',
    title: 'Max ett high-risk-case',
    description: 'Spekulativ exponering ska begränsas till ett case, 50 000-75 000 kr eller max 2 % av kapitalet.',
    severity: 'critical',
  },
  {
    id: 'dividend-goal',
    title: '10 000 kr/mån i utdelningar',
    description: 'Målet är uthålligt kassaflöde utan att offra bolagskvalitet.',
    severity: 'info',
  },
]
