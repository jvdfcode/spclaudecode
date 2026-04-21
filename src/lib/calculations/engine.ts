import type { ViabilityInput, ViabilityResult } from '@/types'
import { calculateCostBreakdown } from './costs'
import { calculateProfitabilityMetrics } from './profitability'
import { classifyViability } from './classifier'

export function calculateViability(input: ViabilityInput): ViabilityResult {
  const costBreakdown = calculateCostBreakdown(input)
  const metrics = calculateProfitabilityMetrics(input, costBreakdown)
  const classification = classifyViability(metrics.marginPercent)

  return {
    input,
    costBreakdown,
    metrics,
    classification,
    calculatedAt: new Date().toISOString(),
  }
}
