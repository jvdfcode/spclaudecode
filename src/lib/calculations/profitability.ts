import type { ViabilityInput, CostBreakdown, ProfitabilityMetrics } from '@/types'
import { calculateCostBreakdown } from './costs'

export function calculateProfitabilityMetrics(
  input: ViabilityInput,
  costs: CostBreakdown
): ProfitabilityMetrics {
  const { salePrice, targetMargin, monthlyFixedCost } = input
  const { total: totalCost } = costs

  const profit = salePrice - totalCost
  const marginPercent = salePrice > 0 ? (profit / salePrice) * 100 : 0
  const roiPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0

  const breakEvenUnits =
    monthlyFixedCost > 0 && profit > 0
      ? Math.ceil(monthlyFixedCost / profit)
      : null

  const minimumViablePrice = findPriceForMargin(input, 0)
  const recommendedPrice = findPriceForMargin(input, targetMargin)

  return {
    totalCost,
    profit,
    marginPercent,
    roiPercent,
    minimumViablePrice,
    recommendedPrice,
    breakEvenUnits,
  }
}

// Busca binária: encontra o salePrice onde margem = targetMarginRate (0-1)
function findPriceForMargin(
  baseInput: ViabilityInput,
  targetMarginRate: number,
  tolerance = 0.01,
  maxIterations = 50
): number {
  let low = baseInput.productCost
  let high = baseInput.productCost * 20

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2
    const testInput = { ...baseInput, salePrice: mid }
    const costs = calculateCostBreakdown(testInput)
    const margin = mid > 0 ? (mid - costs.total) / mid : -1

    if (Math.abs(margin - targetMarginRate) < tolerance / 100) return mid
    if (margin < targetMarginRate) low = mid
    else high = mid
  }

  return (low + high) / 2
}
