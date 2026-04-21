import { describe, it, expect } from 'vitest'
import { calculateCostBreakdown } from '@/lib/calculations/costs'
import type { ViabilityInput } from '@/types'

const base: ViabilityInput = {
  productCost: 45,
  shippingCost: 0,
  packagingCost: 2.5,
  taxRate: 0.06,
  overheadRate: 0.05,
  targetMargin: 0.20,
  salePrice: 99.90,
  listingType: 'classic',
  installments: 1,
}

describe('calculateCostBreakdown', () => {
  it('calcula commission corretamente (11% classic)', () => {
    const result = calculateCostBreakdown(base)
    expect(result.commission).toBeCloseTo(99.90 * 0.11, 2)
  })

  it('installmentFee = 0 para 1 parcela', () => {
    const result = calculateCostBreakdown(base)
    expect(result.installmentFee).toBe(0)
  })

  it('calcula total corretamente', () => {
    const result = calculateCostBreakdown(base)
    const expected = 45 + (99.90 * 0.11) + 0 + 0 + 2.5 + (99.90 * 0.06) + (99.90 * 0.05)
    expect(result.total).toBeCloseTo(expected, 1)
  })

  it('inclui custo de parcelamento para 6x classic', () => {
    const input = { ...base, installments: 6 }
    const result = calculateCostBreakdown(input)
    expect(result.installmentFee).toBeCloseTo(99.90 * 0.0643, 2)
  })

  it('premium 17% de comissão', () => {
    const input = { ...base, listingType: 'premium' as const }
    const result = calculateCostBreakdown(input)
    expect(result.commission).toBeCloseTo(99.90 * 0.17, 2)
  })

  it('free = 0% de comissão', () => {
    const input = { ...base, listingType: 'free' as const }
    const result = calculateCostBreakdown(input)
    expect(result.commission).toBe(0)
  })

  it('lança erro para installments fora do range', () => {
    const input = { ...base, installments: 13 }
    expect(() => calculateCostBreakdown(input)).toThrow()
  })

  it('lança erro para salePrice negativo', () => {
    const input = { ...base, salePrice: -10 }
    expect(() => calculateCostBreakdown(input)).toThrow()
  })

  it('salePrice = 0 retorna custo = productCost + fixos', () => {
    const input = { ...base, salePrice: 0 }
    const result = calculateCostBreakdown(input)
    expect(result.commission).toBe(0)
    expect(result.total).toBeCloseTo(45 + 2.5, 1)
  })
})
