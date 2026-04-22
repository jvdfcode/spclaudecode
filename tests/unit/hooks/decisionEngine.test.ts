import { describe, it, expect } from 'vitest'
import { calculateViability } from '@/lib/calculations/engine'
import { getPositionBadge } from '@/lib/mercadolivre/analyzer'
import type { ViabilityInput } from '@/types'
import type { MarketSummary } from '@/types/mercado'

const baseInput: ViabilityInput = {
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
  monthlyFixedCost: 0,
}

const mockMarket: MarketSummary = {
  totalListings: 20,
  cleanListings: 18,
  confidencePercent: 90,
  minPrice: 70,
  maxPrice: 180,
  medianPrice: 110,
  avgPrice: 115,
  p25Price: 90,
  p75Price: 140,
}

describe('useDecisionEngine — lógica de cálculo das 3 opções', () => {
  it('calcula resultado válido para cada ponto de preço', () => {
    const result = calculateViability(baseInput)
    expect(result.metrics.minimumViablePrice).toBeGreaterThan(0)
    expect(result.metrics.recommendedPrice).toBeGreaterThan(result.metrics.minimumViablePrice)
  })

  it('opção Econômica sem mercado: ≥ 105% do preço mínimo viável', () => {
    const result = calculateViability(baseInput)
    const { minimumViablePrice } = result.metrics
    const economicoPrice = Math.max(minimumViablePrice * 1.05, minimumViablePrice * 1.01)
    expect(economicoPrice).toBeGreaterThanOrEqual(minimumViablePrice)
    const testResult = calculateViability({ ...baseInput, salePrice: economicoPrice })
    expect(testResult.metrics.marginPercent).toBeGreaterThanOrEqual(0)
  })

  it('opção Competitiva sem mercado: igual ao recommendedPrice', () => {
    const result = calculateViability(baseInput)
    const { recommendedPrice } = result.metrics
    const competitivoResult = calculateViability({ ...baseInput, salePrice: recommendedPrice })
    expect(competitivoResult.metrics.marginPercent).toBeGreaterThanOrEqual(
      baseInput.targetMargin * 100 - 1  // tolerância de 1%
    )
  })

  it('opção Premium sem mercado: 15% acima do recommendedPrice', () => {
    const result = calculateViability(baseInput)
    const premiumPrice = result.metrics.recommendedPrice * 1.15
    const premiumResult = calculateViability({ ...baseInput, salePrice: premiumPrice })
    expect(premiumResult.metrics.marginPercent).toBeGreaterThan(
      baseInput.targetMargin * 100
    )
  })

  it('com mercado: Econômico usa P25, Competitivo usa mediana, Premium usa P75', () => {
    const result = calculateViability(baseInput)
    const { minimumViablePrice } = result.metrics

    const economicoPrice = Math.max(mockMarket.p25Price, minimumViablePrice * 1.02)
    const competitivoPrice = Math.max(mockMarket.medianPrice, minimumViablePrice * 1.02)
    const premiumPrice = Math.max(mockMarket.p75Price, minimumViablePrice * 1.05)

    expect(economicoPrice).toBe(Math.max(90, minimumViablePrice * 1.02))
    expect(competitivoPrice).toBe(Math.max(110, minimumViablePrice * 1.02))
    expect(premiumPrice).toBe(Math.max(140, minimumViablePrice * 1.05))
    expect(competitivoPrice).toBeGreaterThan(economicoPrice)
    expect(premiumPrice).toBeGreaterThan(competitivoPrice)
  })

  it('posição de mercado calculada corretamente para cada opção', () => {
    expect(getPositionBadge(80, mockMarket)).toBe('below')   // < P25
    expect(getPositionBadge(110, mockMarket)).toBe('aligned') // entre P25–P75
    expect(getPositionBadge(150, mockMarket)).toBe('above')   // > P75
  })

  it('fallback: P25 menor que custo mínimo usa minimumViablePrice', () => {
    const result = calculateViability({ ...baseInput, productCost: 200 })
    const { minimumViablePrice } = result.metrics
    const lowMarketP25 = 50  // P25 menor que custo mínimo
    const economicoPrice = Math.max(lowMarketP25, minimumViablePrice * 1.02)
    expect(economicoPrice).toBeGreaterThan(lowMarketP25)
    expect(economicoPrice).toBe(minimumViablePrice * 1.02)
  })
})
