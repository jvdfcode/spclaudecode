import { describe, it, expect } from 'vitest'
import { calculateProfitabilityMetrics } from '@/lib/calculations/profitability'
import { calculateCostBreakdown } from '@/lib/calculations/costs'
import type { ViabilityInput } from '@/types'

const base: ViabilityInput = {
  productCost: 45,
  shippingCost: 0,
  shippingMode: 'none',
  packagingCost: 2.5,
  taxRate: 0.06,
  overheadRate: 0.05,
  targetMargin: 0.20,
  salePrice: 99.90,
  listingType: 'classic',
  installments: 1,
  categoryId: null,
  commissionOverride: null,
}

describe('calculateProfitabilityMetrics', () => {
  it('lucro = salePrice - totalCost', () => {
    const costs = calculateCostBreakdown(base)
    const metrics = calculateProfitabilityMetrics(base, costs)
    expect(metrics.profit).toBeCloseTo(base.salePrice - costs.total, 1)
  })

  it('margem % correta', () => {
    const costs = calculateCostBreakdown(base)
    const metrics = calculateProfitabilityMetrics(base, costs)
    const expected = ((base.salePrice - costs.total) / base.salePrice) * 100
    expect(metrics.marginPercent).toBeCloseTo(expected, 1)
  })

  it('produto em prejuízo → margem negativa', () => {
    const input = { ...base, salePrice: 50, productCost: 80 }
    const costs = calculateCostBreakdown(input)
    const metrics = calculateProfitabilityMetrics(input, costs)
    expect(metrics.marginPercent).toBeLessThan(0)
    expect(metrics.profit).toBeLessThan(0)
  })

  it('recommendedPrice atinge targetMargin (20%)', () => {
    const costs = calculateCostBreakdown(base)
    const metrics = calculateProfitabilityMetrics(base, costs)
    const testInput = { ...base, salePrice: metrics.recommendedPrice }
    const testCosts = calculateCostBreakdown(testInput)
    const actualMargin = ((metrics.recommendedPrice - testCosts.total) / metrics.recommendedPrice) * 100
    expect(actualMargin).toBeCloseTo(20, 0)
  })

  it('minimumViablePrice → margem ≈ 0%', () => {
    const costs = calculateCostBreakdown(base)
    const metrics = calculateProfitabilityMetrics(base, costs)
    const testInput = { ...base, salePrice: metrics.minimumViablePrice }
    const testCosts = calculateCostBreakdown(testInput)
    const actualMargin = ((metrics.minimumViablePrice - testCosts.total) / metrics.minimumViablePrice) * 100
    expect(Math.abs(actualMargin)).toBeLessThan(1)
  })
})
