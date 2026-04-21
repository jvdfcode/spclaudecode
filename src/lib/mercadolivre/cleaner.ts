import type { MlListing, CleanedSearchResult } from '@/types'

const KIT_REGEX = /\b(kit|combo|par|2x|3x|4x|5x|pacote|caixa\s+com|\d+\s*unid|\d+\s*pcs)\b/i

function normalizeTitle(title: string): string {
  return title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

export type ConditionFilter = 'all' | 'new' | 'used'

export interface CleanOptions {
  removeKits: boolean
  condition: ConditionFilter
  freeShippingOnly: boolean
  excludedIds: Set<string>
}

export const DEFAULT_CLEAN_OPTIONS: CleanOptions = {
  removeKits: true,
  condition: 'all',
  freeShippingOnly: false,
  excludedIds: new Set(),
}

export function cleanListings(
  listings: MlListing[],
  options: CleanOptions = DEFAULT_CLEAN_OPTIONS
): CleanedSearchResult {
  const total = listings.length
  let result = [...listings]

  // Filtro de kits
  if (options.removeKits) {
    result = result.filter(l => !KIT_REGEX.test(l.title))
  }

  // Filtro de condição — usa campo oficial da ML API
  if (options.condition === 'used') {
    result = result.filter(l => l.condition === 'used')
  } else if (options.condition === 'new') {
    result = result.filter(l => l.condition === 'new')
  }

  // Filtro de frete grátis
  if (options.freeShippingOnly) {
    result = result.filter(l => l.freeShipping)
  }

  // Exclusões manuais
  if (options.excludedIds.size > 0) {
    result = result.filter(l => !options.excludedIds.has(l.id))
  }

  // Deduplicação: mesmo preço + título normalizado
  const seen = new Map<string, boolean>()
  let duplicatesRemoved = 0
  result = result.filter(l => {
    const key = `${l.price.toFixed(2)}|${normalizeTitle(l.title)}`
    if (seen.has(key)) { duplicatesRemoved++; return false }
    seen.set(key, true)
    return true
  })

  return {
    listings: result,
    removedCount: total - result.length,
    duplicatesRemoved,
  }
}

export function confidencePercent(clean: number, total: number): number {
  if (total === 0) return 0
  return Math.round((clean / total) * 100)
}
