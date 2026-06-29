export type {
  AllocationDimension,
  AllocationTarget,
  InvestmentPhilosophy,
  PhilosophyEvaluationResult,
  PhilosophyGoalsInput,
  PhilosophyHoldingsInput,
  PhilosophyPreset,
  PhilosophyProfileInput,
  PhilosophyRule,
  PhilosophyRuleType,
  RuleCondition,
  RuleEvaluation,
  RuleSeverity,
  RuleStatus,
} from './types'
export {
  DividendGrowth,
  FIRE,
  IndexCore,
  LongTermCompounder,
  QualityIncome,
  getPhilosophyPreset,
  philosophyPresets,
} from './presets'
export type { PhilosophyPresetName } from './presets'
export { createPhilosophyFromPreset, evaluatePhilosophy } from './philosophyEngine'
