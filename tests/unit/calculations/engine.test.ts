import { describe, it, expect } from 'vitest'
import { calculateViability } from '@/lib/calculations/engine'
import type { ViabilityInput } from '@/types'

const viableInput: ViabilityInput = {
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

describe('calculateViability (engine)', () => {
  it('retorna ViabilityResult completo', () => {
    const result = calculateViability(viableInput)
    expect(result).toHaveProperty('input')
    expect(result).toHaveProperty('costBreakdown')
    expect(result).toHaveProperty('metrics')
    expect(result).toHaveProperty('classification')
    expect(result).toHaveProperty('calculatedAt')
  })

  it('produto viável com margem > 20%', () => {
    const result = calculateViability(viableInput)
    expect(result.metrics.marginPercent).toBeGreaterThan(20)
    expect(result.classification).toBe('viable')
  })

  it('produto em atenção (10-19%)', () => {
    const input: ViabilityInput = { ...viableInput, salePrice: 75.40 }
    const result = calculateViability(input)
    expect(result.classification).toBe('attention')
  })

  it('produto não viável (< 10%)', () => {
    const input: ViabilityInput = { ...viableInput, salePrice: 55, productCost: 50 }
    const result = calculateViability(input)
    expect(result.classification).toBe('not_viable')
  })

  it('calculatedAt é ISO 8601 válido', () => {
    const result = calculateViability(viableInput)
    expect(() => new Date(result.calculatedAt)).not.toThrow()
    expect(result.calculatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('input preservado no resultado (imutabilidade)', () => {
    const result = calculateViability(viableInput)
    expect(result.input).toEqual(viableInput)
  })

  it('premium 6x → custo maior → margem menor que classic 1x', () => {
    const premium6x: ViabilityInput = {
      ...viableInput, listingType: 'premium', installments: 6,
    }
    const classic1x = calculateViability(viableInput)
    const premiumResult = calculateViability(premium6x)
    expect(premiumResult.metrics.marginPercent).toBeLessThan(classic1x.metrics.marginPercent)
  })
})
