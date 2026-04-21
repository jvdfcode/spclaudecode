export type PositionBadge = 'below' | 'aligned' | 'above'

export interface MlListing {
  id: string
  title: string
  price: number
  currencyId: string        // 'BRL'
  condition: 'new' | 'used' | 'not_specified'
  freeShipping: boolean
  isFulfillment: boolean    // Full
  sellerReputation: string | null
  soldQuantity: number
  thumbnail: string
  permalink: string
}

export interface MlRawResponse {
  results: Array<{
    id: string
    title: string
    price: number
    currency_id: string
    condition: 'new' | 'used' | 'not_specified'
    shipping: { free_shipping: boolean; logistic_type: string }
    seller: { seller_reputation?: { level_id: string } }
    sold_quantity: number
    thumbnail: string
    permalink: string
  }>
  paging: { total: number; offset: number; limit: number }
}

export interface CleanedSearchResult {
  listings: MlListing[]
  removedCount: number
  duplicatesRemoved: number
}

export interface MarketSummary {
  totalListings: number
  cleanListings: number
  confidencePercent: number
  minPrice: number
  maxPrice: number
  medianPrice: number
  avgPrice: number
  p25Price: number
  p75Price: number
}

