import { describe, it, expect } from 'vitest'
import { cleanListings, DEFAULT_CLEAN_OPTIONS } from '@/lib/mercadolivre/cleaner'
import type { MlListing } from '@/types'

function makeListing(overrides: Partial<MlListing> = {}): MlListing {
  return {
    id: 'MLB1',
    title: 'Produto Normal',
    price: 99.9,
    currencyId: 'BRL',
    condition: 'new',
    freeShipping: false,
    isFulfillment: false,
    sellerReputation: 'gold_special',
    soldQuantity: 10,
    thumbnail: '',
    permalink: '',
    ...overrides,
  }
}

describe('cleanListings — filtro de kits', () => {
  it('remove listings com "kit" no título', () => {
    const listings = [
      makeListing({ id: '1', title: 'Kit Chaves Torx' }),
      makeListing({ id: '2', title: 'Chave de Fenda' }),
    ]
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, removeKits: true })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
  })

  it('remove listings com "combo" no título', () => {
    const listings = [makeListing({ id: '1', title: 'Combo Mouse + Teclado' })]
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, removeKits: true })
    expect(result).toHaveLength(0)
  })

  it('remove listings com "2x" no título', () => {
    const listings = [makeListing({ id: '1', title: 'Caneta 2x Pack' })]
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, removeKits: true })
    expect(result).toHaveLength(0)
  })

  it('mantém listings normais quando removeKits = true', () => {
    const listings = [makeListing({ id: '1', title: 'Caneta Esferográfica Azul' })]
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, removeKits: true })
    expect(result).toHaveLength(1)
  })

  it('não remove kits quando removeKits = false', () => {
    const listings = [makeListing({ id: '1', title: 'Kit de Ferramentas' })]
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, removeKits: false })
    expect(result).toHaveLength(1)
  })
})

describe('cleanListings — filtro de condição', () => {
  const listings = [
    makeListing({ id: '1', condition: 'new',           price: 10 }),
    makeListing({ id: '2', condition: 'used',          price: 20 }),
    makeListing({ id: '3', condition: 'not_specified', price: 30 }),
  ]

  it('condition = all → mantém todos', () => {
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, condition: 'all' })
    expect(result).toHaveLength(3)
  })

  it('condition = new → mantém apenas novos', () => {
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, condition: 'new' })
    expect(result).toHaveLength(1)
    expect(result[0].condition).toBe('new')
  })

  it('condition = used → mantém apenas usados', () => {
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, condition: 'used' })
    expect(result).toHaveLength(1)
    expect(result[0].condition).toBe('used')
  })
})

describe('cleanListings — filtro de frete grátis', () => {
  it('freeShippingOnly = true → remove sem frete grátis', () => {
    const listings = [
      makeListing({ id: '1', freeShipping: true }),
      makeListing({ id: '2', freeShipping: false }),
    ]
    const { listings: result } = cleanListings(listings, { ...DEFAULT_CLEAN_OPTIONS, freeShippingOnly: true })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })
})

describe('cleanListings — exclusões manuais', () => {
  it('excluí IDs informados', () => {
    const listings = [
      makeListing({ id: 'MLB1' }),
      makeListing({ id: 'MLB2' }),
      makeListing({ id: 'MLB3' }),
    ]
    const { listings: result } = cleanListings(listings, {
      ...DEFAULT_CLEAN_OPTIONS,
      excludedIds: new Set(['MLB1', 'MLB3']),
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('MLB2')
  })
})

describe('cleanListings — deduplicação', () => {
  it('remove duplicatas com mesmo preço e título normalizado', () => {
    const listings = [
      makeListing({ id: '1', title: 'Produto Teste', price: 50 }),
      makeListing({ id: '2', title: 'Produto Teste', price: 50 }),
      makeListing({ id: '3', title: 'Produto Teste', price: 60 }),
    ]
    const { listings: result, duplicatesRemoved } = cleanListings(listings, DEFAULT_CLEAN_OPTIONS)
    expect(result).toHaveLength(2)
    expect(duplicatesRemoved).toBe(1)
  })

  it('não remove listings com preços diferentes', () => {
    const listings = [
      makeListing({ id: '1', title: 'Produto', price: 10 }),
      makeListing({ id: '2', title: 'Produto', price: 20 }),
    ]
    const { listings: result } = cleanListings(listings, DEFAULT_CLEAN_OPTIONS)
    expect(result).toHaveLength(2)
  })

  it('normaliza título ignorando acentos na deduplicação', () => {
    const listings = [
      makeListing({ id: '1', title: 'Câmera Digital', price: 100 }),
      makeListing({ id: '2', title: 'Camera Digital', price: 100 }),
    ]
    const { listings: result, duplicatesRemoved } = cleanListings(listings, DEFAULT_CLEAN_OPTIONS)
    expect(result).toHaveLength(1)
    expect(duplicatesRemoved).toBe(1)
  })
})

describe('cleanListings — removedCount', () => {
  it('contabiliza total de removidos (kits + duplicatas)', () => {
    const listings = [
      makeListing({ id: '1', title: 'Kit Ferramenta' }),
      makeListing({ id: '2', title: 'Produto', price: 50 }),
      makeListing({ id: '3', title: 'Produto', price: 50 }),
    ]
    const { removedCount } = cleanListings(listings, DEFAULT_CLEAN_OPTIONS)
    expect(removedCount).toBe(2) // 1 kit + 1 duplicata
  })
})
