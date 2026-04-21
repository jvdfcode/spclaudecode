import type { MlListing, MarketSummary, PositionBadge } from '@/types'

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0
  const idx = (p / 100) * (sorted.length - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

export function analyzeListings(listings: MlListing[]): MarketSummary {
  const prices = listings.map(l => l.price).sort((a, b) => a - b)
  const n = prices.length

  if (n === 0) {
    return {
      totalListings: 0, cleanListings: 0, confidencePercent: 0,
      minPrice: 0, maxPrice: 0, medianPrice: 0, avgPrice: 0,
      p25Price: 0, p75Price: 0,
    }
  }

  const sum = prices.reduce((a, b) => a + b, 0)

  return {
    totalListings: n,
    cleanListings: n,
    confidencePercent: 100,
    minPrice: prices[0],
    maxPrice: prices[n - 1],
    medianPrice: percentile(prices, 50),
    avgPrice: sum / n,
    p25Price: percentile(prices, 25),
    p75Price: percentile(prices, 75),
  }
}

export function getPositionBadge(salePrice: number, summary: MarketSummary): PositionBadge | null {
  if (!salePrice || summary.cleanListings === 0) return null
  if (salePrice < summary.p25Price) return 'below'
  if (salePrice > summary.p75Price) return 'above'
  return 'aligned'
}

export function fullCount(listings: MlListing[]): number {
  return listings.filter(l => l.isFulfillment).length
}
