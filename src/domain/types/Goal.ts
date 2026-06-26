export type Goal = {
  monthlyDividendGoal: number
  targetBuffer: number
  targetNetWorth: number
}

export type GoalStatus = 'on-track' | 'at-risk' | 'behind'

export type GoalProgress = {
  label: string
  currentAmount: number
  targetAmount: number
  remainingAmount: number
  progressPct: number
  status: GoalStatus
}
