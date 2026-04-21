import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import type { MlListing, MlRawResponse } from '@/types'

const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

function hashQuery(q: string): string {
  // hash simples e determinístico para o cache key
  let h = 0
  for (let i = 0; i < q.length; i++) {
    h = Math.imul(31, h) + q.charCodeAt(i) | 0
  }
  return `ml_${Math.abs(h).toString(36)}_${q.length}`
}

function mapListings(raw: MlRawResponse): MlListing[] {
  return raw.results.map(r => ({
    id: r.id,
    title: r.title,
    price: r.price,
    currencyId: r.currency_id,
    freeShipping: r.shipping?.free_shipping ?? false,
    isFulfillment: r.shipping?.logistic_type === 'fulfillment',
    sellerReputation: r.seller?.seller_reputation?.level_id ?? null,
    soldQuantity: r.sold_quantity ?? 0,
    thumbnail: r.thumbnail,
    permalink: r.permalink,
  }))
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Informe ao menos 2 caracteres para buscar' }, { status: 400 })
  }

  const supabase = await createServerSupabase()
  const hash = hashQuery(q.toLowerCase())

  // Verificar cache
  const { data: cached } = await supabase
    .from('ml_search_cache')
    .select('results_json, expires_at')
    .eq('query_hash', hash)
    .single()

  if (cached && new Date(cached.expires_at) > new Date()) {
    return NextResponse.json({ listings: cached.results_json, cached: true })
  }

  // Buscar na ML API
  try {
    const url = `${ML_SEARCH_URL}?q=${encodeURIComponent(q)}&limit=50`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      const status = res.status
      if (status === 429) return NextResponse.json({ error: 'Muitas buscas em pouco tempo. Aguarde um momento.' }, { status: 429 })
      if (status === 403) return NextResponse.json({ error: 'API do Mercado Livre indisponível no momento.' }, { status: 503 })
      return NextResponse.json({ error: `Erro na API do Mercado Livre (${status})` }, { status: 502 })
    }

    const data: MlRawResponse = await res.json()
    const listings = mapListings(data)

    // Salvar/atualizar cache
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString()
    await supabase.from('ml_search_cache').upsert({
      query_hash: hash,
      query_text: q,
      results_json: listings as unknown as Record<string, unknown>[],
      result_count: listings.length,
      expires_at: expiresAt,
    }, { onConflict: 'query_hash' })

    return NextResponse.json({ listings, cached: false })
  } catch {
    return NextResponse.json({ error: 'Erro de conexão com o Mercado Livre. Tente novamente.' }, { status: 503 })
  }
}
