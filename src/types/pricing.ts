export type ListingType = 'free' | 'classic' | 'premium'
export type ViabilityClassification = 'viable' | 'attention' | 'not_viable'
export type ShippingMode = 'none' | 'envios' | 'full'

export interface ViabilityInput {
  productCost: number       // CMV — custo de aquisição do produto
  shippingCost: number      // custo de frete (0 quando shippingMode='none')
  shippingMode: ShippingMode
  packagingCost: number     // embalagem e materiais
  taxRate: number           // imposto sobre venda (0-1, ex: 0.06 = 6%)
  overheadRate: number      // overhead geral (0-1, ex: 0.05 = 5%)
  targetMargin: number      // margem-alvo (0-1, ex: 0.20 = 20%)
  salePrice: number         // preço de venda a testar
  listingType: ListingType
  installments: number      // 1 a 12
}

// Mapa de taxas carregado do banco (ou fallback hardcoded)
export interface MlFeesMap {
  base: Record<ListingType, number>                            // taxa por tipo (1x)
  installment: Record<ListingType, Record<number, number>>     // custo adicional por parcelas
}

export interface CostBreakdown {
  acquisition: number       // CMV
  commission: number        // taxa ML do tipo de anúncio
  installmentFee: number    // custo de parcelamento adicional
  shipping: number          // frete
  packaging: number         // embalagem
  tax: number               // impostos sobre venda
  overhead: number          // overhead sobre venda
  total: number             // soma de todos os componentes
}

export interface ProfitabilityMetrics {
  grossRevenue: number
  totalCost: number
  profit: number            // pode ser negativo
  marginPercent: number     // pode ser negativo
  roiPercent: number        // pode ser negativo
  breakEvenPrice: number
  minimumViablePrice: number  // onde margem = 0%
  recommendedPrice: number    // onde margem = targetMargin
}

export interface ViabilityResult {
  input: ViabilityInput
  costBreakdown: CostBreakdown
  metrics: ProfitabilityMetrics
  classification: ViabilityClassification
  calculatedAt: string      // ISO 8601
}

export interface SimulationScenario {
  salePrice: number
  profit: number
  marginPercent: number
  roiPercent: number
  classification: ViabilityClassification
}
