import { VIABILITY_THRESHOLDS } from '@/lib/mercadolivre.config'
import type { ViabilityClassification } from '@/types'

export function classifyViability(marginPercent: number): ViabilityClassification {
  if (marginPercent >= VIABILITY_THRESHOLDS.VIABLE_MIN) return 'viable'
  if (marginPercent >= VIABILITY_THRESHOLDS.ATTENTION_MIN) return 'attention'
  return 'not_viable'
}
