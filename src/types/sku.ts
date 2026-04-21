import type { ListingType, ViabilityInput, ViabilityResult } from './pricing'

export type SkuStatus = 'draft' | 'viable' | 'attention' | 'not_viable' | 'for_sale'

export interface Sku {
  id: string
  userId: string
  name: string
  notes: string | null
  status: SkuStatus
  isForSale: boolean
  adoptedPrice: number | null
  createdAt: string
  updatedAt: string
}

export interface SkuCalculation {
  id: string
  skuId: string
  costData: ViabilityInput
  resultData: ViabilityResult
  salePrice: number
  listingType: ListingType
  marginPercent: number | null
  roiPercent: number | null
  isViable: boolean | null
  isAdopted: boolean
  createdAt: string
}

export interface SkuWithLatestCalc extends Sku {
  latestCalculation: SkuCalculation | null
}

export interface CreateSkuPayload {
  name: string
  notes?: string
}

export interface UpdateSkuPayload {
  name?: string
  notes?: string
  status?: SkuStatus
  isForSale?: boolean
  adoptedPrice?: number | null
}
