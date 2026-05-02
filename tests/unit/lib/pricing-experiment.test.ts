import { describe, it, expect } from 'vitest'
import { pricingTableFor, variantFromCookie, PRICING_COOKIE } from '@/lib/pricing-experiment'

describe('pricingTableFor', () => {
  it('variante A usa preço Pro de R$ 39', () => {
    const t = pricingTableFor('A')
    expect(t.variantId).toBe('A')
    expect(t.proPrice).toBe(39)
    expect(t.plans.find((p) => p.id === 'pro')?.monthlyPrice).toBe(39)
  })

  it('variante B usa preço Pro de R$ 49', () => {
    expect(pricingTableFor('B').proPrice).toBe(49)
  })

  it('variante C usa preço Pro de R$ 59', () => {
    expect(pricingTableFor('C').proPrice).toBe(59)
  })

  it('plano Pro é destacado em todas as variantes', () => {
    for (const v of ['A', 'B', 'C', 'D'] as const) {
      const pro = pricingTableFor(v).plans.find((p) => p.id === 'pro')
      expect(pro?.highlight).toBe(true)
    }
  })

  it('cookie name está exportado para uso no client', () => {
    expect(PRICING_COOKIE).toBe('sp_exp_pricing')
  })
})

describe('variantFromCookie', () => {
  it('usa cookie quando válido (incl. D — Trial 14d)', () => {
    expect(variantFromCookie('A')).toBe('A')
    expect(variantFromCookie('B')).toBe('B')
    expect(variantFromCookie('C')).toBe('C')
    expect(variantFromCookie('D')).toBe('D')
  })

  it('cai para distribuição quando cookie ausente ou inválido', () => {
    const samples = Array.from({ length: 30 }, () => variantFromCookie(undefined))
    for (const s of samples) {
      expect(['A', 'B', 'C', 'D']).toContain(s)
    }
  })

  it('cookie inválido vira distribuição', () => {
    const v = variantFromCookie('Z' as unknown as string)
    expect(['A', 'B', 'C', 'D']).toContain(v)
  })
})
