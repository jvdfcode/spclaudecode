import { describe, it, expect } from 'vitest'
import { generateScenarios } from '@/lib/calculations/simulator'
import type { ViabilityInput } from '@/types'

const base: ViabilityInput = {
  productCost: 45,
  shippingCost: 0,
  shippingMode: 'none',
  packagingCost: 2.5,
  taxRate: 0.06,
  overheadRate: 0.05,
  targetMargin: 0.20,
  salePrice: 100,
  listingType: 'classic',
  installments: 1,
}

describe('generateScenarios', () => {
  it('retorna 15 cenários por padrão', () => {
    const scenarios = generateScenarios(base)
    expect(scenarios).toHaveLength(15)
  })

  it('cenários ordenados por salePrice crescente', () => {
    const scenarios = generateScenarios(base)
    for (let i = 1; i < scenarios.length; i++) {
      expect(scenarios[i].salePrice).toBeGreaterThan(scenarios[i - 1].salePrice)
    }
  })

  it('cada cenário tem classification válida', () => {
    const scenarios = generateScenarios(base)
    const valid = ['viable', 'attention', 'not_viable']
    scenarios.forEach(s => expect(valid).toContain(s.classification))
  })

  it('preços mais altos têm margem maior', () => {
    const scenarios = generateScenarios(base)
    const first = scenarios[0]
    const last = scenarios[scenarios.length - 1]
    expect(last.marginPercent).toBeGreaterThan(first.marginPercent)
  })

  it('respeita steps e stepPercent customizados', () => {
    const scenarios = generateScenarios(base, 5, 0.10)
    expect(scenarios.length).toBeLessThanOrEqual(5)
  })
})
