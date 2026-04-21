// Fonte: https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338
// Fonte: https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077
// Tabela por categoria verificada: abril 2026 (gosmarter.com.br + koncili.com)

export const ML_API = {
  BASE_URL: 'https://api.mercadolibre.com',
  SITE_ID: 'MLB',
  RATE_LIMIT_MS: 1100,
  SEARCH_LIMIT: 50,
  SEARCH_ENDPOINT: '/sites/MLB/search',
} as const

// Comissão base por tipo de anúncio — taxa GERAL (sem categoria específica)
export const ML_FEES = {
  free:    0,
  classic: 11,
  premium: 17,
} as const

// Taxas por categoria — Clássico e Premium (verificadas abril 2026)
// O Anúncio Gratuito tem comissão 0% em todas as categorias
export interface MlCategoryFee {
  id: string
  name: string
  classic: number
  premium: number
}

export const ML_CATEGORY_FEES: MlCategoryFee[] = [
  { id: 'acessorios-veiculos',      name: 'Acessórios para Veículos',      classic: 12,   premium: 17   },
  { id: 'agro',                     name: 'Agro',                           classic: 11.5, premium: 16.5 },
  { id: 'alimentos-bebidas',        name: 'Alimentos e Bebidas',            classic: 14,   premium: 19   },
  { id: 'antiguidades-colecoes',    name: 'Antiguidades e Coleções',        classic: 11.5, premium: 16.5 },
  { id: 'arte-papelaria',           name: 'Arte, Papelaria e Armarinho',    classic: 11.5, premium: 16.5 },
  { id: 'bebes',                    name: 'Bebês',                          classic: 14,   premium: 19   },
  { id: 'beleza-cuidado-pessoal',   name: 'Beleza e Cuidado Pessoal',       classic: 14,   premium: 19   },
  { id: 'brinquedos-hobbies',       name: 'Brinquedos e Hobbies',          classic: 11.5, premium: 16.5 },
  { id: 'calcados-roupas-bolsas',   name: 'Calçados, Roupas e Bolsas',     classic: 14,   premium: 19   },
  { id: 'cameras-acessorios',       name: 'Câmeras e Acessórios',          classic: 11,   premium: 16   },
  { id: 'casa-moveis-decoracao',    name: 'Casa, Móveis e Decoração',       classic: 11.5, premium: 16.5 },
  { id: 'construcao',               name: 'Construção',                     classic: 11.5, premium: 16.5 },
  { id: 'eletrodomesticos',         name: 'Eletrodomésticos',               classic: 11,   premium: 16   },
  { id: 'eletronicos-audio-video',  name: 'Eletrônicos, Áudio e Vídeo',    classic: 13,   premium: 18   },
  { id: 'esportes-fitness',         name: 'Esportes e Fitness',             classic: 14,   premium: 19   },
  { id: 'festas-lembrancinhas',     name: 'Festas e Lembrancinhas',         classic: 11.5, premium: 16.5 },
  { id: 'games',                    name: 'Games',                          classic: 13,   premium: 18   },
  { id: 'industria-comercio',       name: 'Indústria e Comércio',           classic: 12,   premium: 17   },
  { id: 'informatica',              name: 'Informática',                    classic: 11,   premium: 16   },
  { id: 'ingressos',                name: 'Ingressos',                      classic: 11.5, premium: 16.5 },
  { id: 'instrumentos-musicais',    name: 'Instrumentos Musicais',          classic: 11.5, premium: 16.5 },
  { id: 'joias-relogios',           name: 'Joias e Relógios',               classic: 12.5, premium: 17.5 },
  { id: 'livros-revistas-comics',   name: 'Livros, Revistas e Comics',      classic: 12,   premium: 17   },
  { id: 'musica-filmes-seriados',   name: 'Música, Filmes e Seriados',      classic: 12,   premium: 17   },
  { id: 'pet-shop',                 name: 'Pet Shop',                       classic: 12.5, premium: 17.5 },
  { id: 'saude',                    name: 'Saúde',                          classic: 12,   premium: 17   },
]

// Custo fixo por item vendido (aplica quando preço de venda < R$79)
// Fonte: múltiplas fontes cruzadas, verificado abril 2026
// ATENÇÃO: Para Envios Full + preço < R$79, a partir de março/2026 o custo passou a
// ser VARIÁVEL (por peso/dimensão/preço). Nesses casos o usuário deve inserir manualmente.
export const ML_FIXED_COST = [
  { minPrice: 0,     maxPrice: 12.49, cost: null as null }, // 50% do valor (variável)
  { minPrice: 12.50, maxPrice: 28.99, cost: 6.25 },
  { minPrice: 29.00, maxPrice: 49.99, cost: 6.50 },
  { minPrice: 50.00, maxPrice: 78.99, cost: 6.75 },
] as const

export function getFixedCost(salePrice: number): number {
  if (salePrice <= 0 || salePrice >= 79) return 0
  if (salePrice < 12.50) return salePrice * 0.5  // 50% do valor
  const rule = (ML_FIXED_COST as readonly { minPrice: number; maxPrice: number; cost: number | null }[])
    .find(r => r.cost !== null && salePrice >= r.minPrice && salePrice <= r.maxPrice)
  return rule?.cost ?? 0
}

export function getFixedCostLabel(salePrice: number): string | null {
  if (salePrice <= 0 || salePrice >= 79) return null
  if (salePrice < 12.50) return `50% do valor = ${(salePrice * 0.5).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
  if (salePrice < 29) return 'R$ 6,25 por unidade'
  if (salePrice < 50) return 'R$ 6,50 por unidade'
  return 'R$ 6,75 por unidade'
}

export function getCategoryFee(categoryId: string | null | undefined, listingType: 'classic' | 'premium' | 'free'): number {
  if (listingType === 'free') return 0
  if (!categoryId) return ML_FEES[listingType]
  const cat = ML_CATEGORY_FEES.find(c => c.id === categoryId)
  if (!cat) return ML_FEES[listingType]
  return cat[listingType]
}

// Custo de parcelamento ADICIONAL à comissão base (em %)
// Fonte secundária: https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077
// Valores verificados abril 2026 via gosmarter.com.br e koncili.com
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

export const ML_POSITIONING = {
  BELOW_THRESHOLD: 25,
  ABOVE_THRESHOLD: 75,
} as const

export const ML_CACHE = {
  TTL_MS:    60 * 60 * 1000,
  TTL_HOURS: 1,
} as const

export const VIABILITY_THRESHOLDS = {
  VIABLE_MIN:    20,
  ATTENTION_MIN: 10,
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
