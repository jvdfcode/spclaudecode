// Fonte: https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338
// Fonte: https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077
// Verificado em: 2026-04-20

export const ML_API = {
  BASE_URL: 'https://api.mercadolibre.com',
  SITE_ID: 'MLB',
  RATE_LIMIT_MS: 1100,
  SEARCH_LIMIT: 50,
  SEARCH_ENDPOINT: '/sites/MLB/search',
} as const

// Comissão base por tipo de anúncio (1 parcela, sem parcelamento)
export const ML_FEES = {
  free:    0,
  classic: 11,
  premium: 17,
} as const

// Custo de parcelamento ADICIONAL à comissão base (em %)
// Uso: ML_INSTALLMENT_FEES[listingType][installments]
export const ML_INSTALLMENT_FEES = {
  free: {
    1: 0,
  },
  classic: {
    1:  0,    2:  3.89, 3:  5.05, 4:  5.83,
    5:  6.36, 6:  6.43, 7:  8.03, 8:  8.51,
    9:  8.95, 10: 9.21, 11: 9.63, 12: 9.99,
  },
  premium: {
    1:  0,    2:  3.89, 3:  5.05, 4:  5.83,
    5:  6.36, 6:  6.43, 7:  8.03, 8:  8.51,
    9:  8.95, 10: 9.21, 11: 9.63, 12: 9.99,
  },
} as const

export const ML_FILTERS = {
  KIT_KEYWORDS: [
    'kit', 'combo', 'par de', '2x', '3x', '4x', '5x', '10x',
    'pacote', 'caixa com', 'conjunto', 'lote',
  ],
} as const

// Percentis para posicionamento: abaixo/alinhado/acima
export const ML_POSITIONING = {
  BELOW_THRESHOLD: 25,   // < P25 → abaixo do mercado
  ABOVE_THRESHOLD: 75,   // > P75 → acima do mercado
} as const

export const ML_CACHE = {
  TTL_MS:    60 * 60 * 1000,
  TTL_HOURS: 1,
} as const

// Thresholds de classificação por margem %
export const VIABILITY_THRESHOLDS = {
  VIABLE_MIN:    20,   // margem ≥ 20% → viable
  ATTENTION_MIN: 10,   // margem ≥ 10% → attention
  // margem < 10% → not_viable
} as const

export const SKU_STATUS_LABELS = {
  draft:      'Rascunho',
  viable:     'Viável',
  attention:  'Atenção',
  not_viable: 'Não viável',
  for_sale:   'À venda',
} as const

export const LISTING_TYPE_LABELS = {
  free:    'Gratuito',
  classic: 'Clássico',
  premium: 'Premium',
} as const
