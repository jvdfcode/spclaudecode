import { describe, it, expect } from 'vitest'
import { getCategoryFee, getFixedCost, getFixedCostLabel, ML_CATEGORY_FEES } from '@/lib/mercadolivre.config'

describe('getCategoryFee', () => {
  it('sem categoria → taxa geral classic = 11', () => {
    expect(getCategoryFee(null, 'classic')).toBe(11)
  })

  it('sem categoria → taxa geral premium = 17', () => {
    expect(getCategoryFee(null, 'premium')).toBe(17)
  })

  it('categoria inexistente → fallback para taxa geral', () => {
    expect(getCategoryFee('categoria-nao-existe', 'classic')).toBe(11)
  })

  it('categoria válida retorna taxa correta', () => {
    const cat = ML_CATEGORY_FEES[0]
    expect(getCategoryFee(cat.id, 'classic')).toBe(cat.classic)
    expect(getCategoryFee(cat.id, 'premium')).toBe(cat.premium)
  })

  it('free → sempre 0', () => {
    expect(getCategoryFee(null, 'free')).toBe(0)
    expect(getCategoryFee(ML_CATEGORY_FEES[0].id, 'free')).toBe(0)
  })
})

describe('getFixedCost', () => {
  it('≥ R$79 → custo fixo = 0', () => {
    expect(getFixedCost(79)).toBe(0)
    expect(getFixedCost(100)).toBe(0)
    expect(getFixedCost(200)).toBe(0)
  })

  it('< R$12.50 → 50% do valor', () => {
    expect(getFixedCost(10)).toBe(5)
    expect(getFixedCost(12)).toBeCloseTo(6, 1)
  })

  it('R$12.50–29 → R$6,25', () => {
    expect(getFixedCost(12.50)).toBe(6.25)
    expect(getFixedCost(20)).toBe(6.25)
    expect(getFixedCost(28.99)).toBe(6.25)
  })

  it('R$29–50 → R$6,50', () => {
    expect(getFixedCost(29)).toBe(6.50)
    expect(getFixedCost(40)).toBe(6.50)
  })

  it('R$50–79 → R$6,75', () => {
    expect(getFixedCost(50)).toBe(6.75)
    expect(getFixedCost(70)).toBe(6.75)
    expect(getFixedCost(78.99)).toBe(6.75)
  })
})

describe('getFixedCostLabel', () => {
  it('≥ R$79 → null (sem label)', () => {
    expect(getFixedCostLabel(79)).toBeNull()
    expect(getFixedCostLabel(100)).toBeNull()
  })

  it('< R$79 → retorna string descritiva', () => {
    const label = getFixedCostLabel(50)
    expect(label).not.toBeNull()
    expect(typeof label).toBe('string')
    expect(label!.length).toBeGreaterThan(0)
  })
})
