import { describe, it, expect } from 'vitest'
import {
  pricingTableFor,
  variantFromCookie,
  deterministicVariantFromUserId,
  TRIAL_VARIANT,
  TRIAL_DURATION_DAYS,
} from '@/lib/pricing-experiment'

describe('pricingTableFor', () => {
  it('variante A retorna proPrice 39', () => {
    expect(pricingTableFor('A').proPrice).toBe(39)
  })

  it('variante B retorna proPrice 49', () => {
    expect(pricingTableFor('B').proPrice).toBe(49)
  })

  it('variante D (Trial) retorna proPrice 49 e plano free vira "Trial 14d"', () => {
    const table = pricingTableFor('D')
    expect(table.proPrice).toBe(49)
    expect(table.plans[0].name).toBe('Trial 14d')
    expect(table.plans[0].cta).toContain('14d')
    expect(table.plans[0].href).toBe('/cadastro?trial=14')
  })

  it('variante não-D mantém plano "Free" tradicional', () => {
    expect(pricingTableFor('A').plans[0].name).toBe('Free')
    expect(pricingTableFor('B').plans[0].name).toBe('Free')
  })
})

describe('variantFromCookie', () => {
  it('cookie A/B/C/D retorna a variante exata', () => {
    expect(variantFromCookie('A')).toBe('A')
    expect(variantFromCookie('B')).toBe('B')
    expect(variantFromCookie('C')).toBe('C')
    expect(variantFromCookie('D')).toBe('D')
  })

  it('cookie inválido cai em distribuição uniforme entre 4 variantes', () => {
    const variant = variantFromCookie('Z')
    expect(['A', 'B', 'C', 'D']).toContain(variant)
  })

  it('cookie undefined cai em distribuição uniforme', () => {
    const variant = variantFromCookie(undefined)
    expect(['A', 'B', 'C', 'D']).toContain(variant)
  })
})

describe('deterministicVariantFromUserId', () => {
  it('retorna B ou D (apenas 2 variantes no A/B test)', () => {
    const v = deterministicVariantFromUserId('user-123')
    expect(['B', 'D']).toContain(v)
  })

  it('mesmo userId retorna sempre a mesma variante (estabilidade)', () => {
    const userId = 'user-abc-def-ghi'
    const v1 = deterministicVariantFromUserId(userId)
    const v2 = deterministicVariantFromUserId(userId)
    const v3 = deterministicVariantFromUserId(userId)
    expect(v1).toBe(v2)
    expect(v2).toBe(v3)
  })

  it('userIds diferentes resultam em distribuição mista', () => {
    const variants = new Set<string>()
    for (let i = 0; i < 50; i++) {
      variants.add(deterministicVariantFromUserId(`user-${i}-${Math.random()}`))
    }
    // Em 50 amostras com hash FNV-1a, esperamos ambas variantes presentes
    expect(variants.size).toBe(2)
    expect(variants.has('B')).toBe(true)
    expect(variants.has('D')).toBe(true)
  })

  it('userId vazio retorna variante determinística (não crash)', () => {
    expect(['B', 'D']).toContain(deterministicVariantFromUserId(''))
  })
})

describe('constants', () => {
  it('TRIAL_VARIANT é D', () => {
    expect(TRIAL_VARIANT).toBe('D')
  })

  it('TRIAL_DURATION_DAYS é 14', () => {
    expect(TRIAL_DURATION_DAYS).toBe(14)
  })
})
