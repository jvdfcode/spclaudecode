import type { ViabilityInput, SimulationScenario } from '@/types'
import { calculateCostBreakdown } from './costs'
import { calculateProfitabilityMetrics } from './profitability'
import { classifyViability } from './classifier'

export function generateScenarios(
  baseInput: ViabilityInput,
  steps = 15,
  stepPercent = 0.05
): SimulationScenario[] {
  const halfSteps = Math.floor(steps / 2)
  const scenarios: SimulationScenario[] = []

  for (let i = -halfSteps; i <= halfSteps; i++) {
    const salePrice = baseInput.salePrice * (1 + i * stepPercent)
    if (salePrice <= 0) continue

    const input = { ...baseInput, salePrice }
    const costs = calculateCostBreakdown(input)
    const metrics = calculateProfitabilityMetrics(input, costs)

    scenarios.push({
      salePrice,
      profit: metrics.profit,
      marginPercent: metrics.marginPercent,
      roiPercent: metrics.roiPercent,
      classification: classifyViability(metrics.marginPercent),
    })
  }

  return scenarios.sort((a, b) => a.salePrice - b.salePrice)
}
