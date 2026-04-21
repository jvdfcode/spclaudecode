import { describe, it, expect } from 'vitest'
import { analyzeListings, getPositionBadge, fullCount } from '@/lib/mercadolivre/analyzer'
import type { MlListing, MarketSummary } from '@/types'

function makeListing(overrides: Partial<MlListing> = {}): MlListing {
  return {
    id: 'MLB1',
    title: 'Produto',
    price: 100,
    currencyId: 'BRL',
    condition: 'new',
    freeShipping: false,
    isFulfillment: false,
    sellerReputation: null,
    soldQuantity: 0,
    thumbnail: '',
    permalink: '',
    ...overrides,
  }
}

describe('analyzeListings — array vazio', () => {
  it('retorna zeros para array vazio', () => {
    const result = analyzeListings([])
    expect(result.totalListings).toBe(0)
    expect(result.minPrice).toBe(0)
    expect(result.maxPrice).toBe(0)
    expect(result.medianPrice).toBe(0)
    expect(result.avgPrice).toBe(0)
    expect(result.confidencePercent).toBe(0)
  })
})

describe('analyzeListings — cálculos estatísticos', () => {
  const listings = [
    makeListing({ id: '1', price: 10 }),
    makeListing({ id: '2', price: 20 }),
    makeListing({ id: '3', price: 30 }),
    makeListing({ id: '4', price: 40 }),
    makeListing({ id: '5', price: 50 }),
  ]

  let result: MarketSummary

  it('totalListings = quantidade de listings', () => {
    result = analyzeListings(listings)
    expect(result.totalListings).toBe(5)
  })

  it('minPrice = menor preço', () => {
    expect(analyzeListings(listings).minPrice).toBe(10)
  })

  it('maxPrice = maior preço', () => {
    expect(analyzeListings(listings).maxPrice).toBe(50)
  })

  it('medianPrice = percentil 50', () => {
    expect(analyzeListings(listings).medianPrice).toBe(30)
  })

  it('avgPrice = média aritmética', () => {
    expect(analyzeListings(listings).avgPrice).toBe(30)
  })

  it('p25Price < medianPrice < p75Price', () => {
    const r = analyzeListings(listings)
    expect(r.p25Price).toBeLessThan(r.medianPrice)
    expect(r.p75Price).toBeGreaterThan(r.medianPrice)
  })
})

describe('analyzeListings — listing único', () => {
  it('min = max = median = avg para um único preço', () => {
    const result = analyzeListings([makeListing({ price: 99.9 })])
    expect(result.minPrice).toBe(99.9)
    expect(result.maxPrice).toBe(99.9)
    expect(result.medianPrice).toBe(99.9)
    expect(result.avgPrice).toBe(99.9)
  })
})

describe('getPositionBadge', () => {
  const summary: MarketSummary = {
    totalListings: 10,
    cleanListings: 10,
    confidencePercent: 100,
    minPrice: 10,
    maxPrice: 100,
    medianPrice: 50,
    avgPrice: 50,
    p25Price: 25,
    p75Price: 75,
  }

  it('preço < p25 → "below"', () => {
    expect(getPositionBadge(20, summary)).toBe('below')
  })

  it('preço entre p25 e p75 → "aligned"', () => {
    expect(getPositionBadge(50, summary)).toBe('aligned')
    expect(getPositionBadge(25, summary)).toBe('aligned')
    expect(getPositionBadge(75, summary)).toBe('aligned')
  })

  it('preço > p75 → "above"', () => {
    expect(getPositionBadge(80, summary)).toBe('above')
  })

  it('salePrice = 0 → null', () => {
    expect(getPositionBadge(0, summary)).toBeNull()
  })

  it('cleanListings = 0 → null', () => {
    expect(getPositionBadge(50, { ...summary, cleanListings: 0 })).toBeNull()
  })
})

describe('fullCount', () => {
  it('conta apenas listings com isFulfillment = true', () => {
    const listings = [
      makeListing({ id: '1', isFulfillment: true }),
      makeListing({ id: '2', isFulfillment: false }),
      makeListing({ id: '3', isFulfillment: true }),
    ]
    expect(fullCount(listings)).toBe(2)
  })

  it('retorna 0 para array vazio', () => {
    expect(fullCount([])).toBe(0)
  })

  it('retorna 0 se nenhum tem fulfillment', () => {
    expect(fullCount([makeListing({ isFulfillment: false })])).toBe(0)
  })
})
