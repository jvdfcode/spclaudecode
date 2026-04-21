// Tipos espelho das tabelas do Supabase
// Gerado manualmente — substituir por `supabase gen types` quando CLI estiver configurado

export interface DbSku {
  id: string
  user_id: string
  name: string
  notes: string | null
  status: 'draft' | 'viable' | 'attention' | 'not_viable' | 'for_sale'
  is_for_sale: boolean
  adopted_price: number | null
  created_at: string
  updated_at: string
}

export interface DbSkuCalculation {
  id: string
  sku_id: string
  cost_data: Record<string, unknown>
  result_data: Record<string, unknown>
  sale_price: number
  listing_type: 'free' | 'classic' | 'premium'
  margin_percent: number | null
  roi_percent: number | null
  is_viable: boolean | null
  is_adopted: boolean
  created_at: string
}

export interface DbMlFee {
  id: string
  listing_type: 'free' | 'classic' | 'premium'
  installments: number
  fee_percent: number
  category_id: string | null
  category_name: string | null
  source_url: string | null
  notes: string | null
  verified_at: string
  updated_at: string
}

export interface DbMlSearchCache {
  id: string
  query_hash: string
  query_text: string
  results_json: Record<string, unknown>
  result_count: number
  expires_at: string
  created_at: string
}
