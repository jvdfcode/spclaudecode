import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import type { MlListing, MlRawResponse } from '@/types'

const ML_BASE       = 'https://api.mercadolibre.com'
const ML_SEARCH_URL = `${ML_BASE}/sites/MLB/search`
const CACHE_TTL_MS  = 60 * 60 * 1000 // 1 hora
const RATE_LIMIT_MS = 1100

// ─── Token em memória (válido por 6h, renovado automaticamente) ───────────────
let mlToken: { value: string; expiresAt: number } | null = null

async function getToken(): Promise<string | null> {
  const appId  = process.env.ML_APP_ID?.trim()
  const secret = process.env.ML_CLIENT_SECRET?.trim()
  if (!appId || !secret) return null

  if (mlToken && Date.now() < mlToken.expiresAt - 60_000) return mlToken.value

  try {
    const res = await fetch(`${ML_BASE}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: `grant_type=client_credentials&client_id=${appId}&client_secret=${secret}`,
      next: { revalidate: 0 },
    })
    if (!res.ok) return null
    const data = await res.json() as { access_token: string; expires_in: number }
    mlToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 }
    return mlToken.value
  } catch { return null }
}

// ─── Rate limiter simples (single-instance) ───────────────────────────────────
let lastReq = 0
async function throttle() {
  const wait = RATE_LIMIT_MS - (Date.now() - lastReq)
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  lastReq = Date.now()
}

// ─── Cache key ────────────────────────────────────────────────────────────────
function hashQuery(q: string): string {
  let h = 0
  for (let i = 0; i < q.length; i++) h = Math.imul(31, h) + q.charCodeAt(i) | 0
  return `ml_${Math.abs(h).toString(36)}_${q.length}`
}

// ─── Mapear resposta bruta → MlListing ───────────────────────────────────────
function mapListings(raw: MlRawResponse): MlListing[] {
  return raw.results.map(r => ({
    id: r.id,
    title: r.title,
    price: r.price,
    currencyId: r.currency_id,
    condition: r.condition ?? 'not_specified',
    freeShipping: r.shipping?.free_shipping ?? false,
    isFulfillment: r.shipping?.logistic_type === 'fulfillment',
    sellerReputation: r.seller?.seller_reputation?.level_id ?? null,
    soldQuantity: r.sold_quantity ?? 0,
    thumbnail: r.thumbnail,
    permalink: r.permalink,
  }))
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Informe ao menos 2 caracteres' }, { status: 400 })
  }

  const supabase = await createServerSupabase()
  const hash     = hashQuery(q.toLowerCase())

  // 1. Cache Supabase
  const { data: cached } = await supabase
    .from('ml_search_cache')
    .select('results_json, expires_at')
    .eq('query_hash', hash)
    .single()

  if (cached && new Date(cached.expires_at) > new Date()) {
    return NextResponse.json({ listings: cached.results_json, cached: true })
  }

  // 2. Buscar no ML com token (se configurado) ou sem
  const token = await getToken()
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    await throttle()
    const url = `${ML_SEARCH_URL}?q=${encodeURIComponent(q)}&limit=50`
    const res = await fetch(url, { headers, next: { revalidate: 0 } })

    // ML bloqueia IPs de servidores cloud (com ou sem token) → browser busca direto
    if (res.status === 403) {
      return NextResponse.json({ clientSide: true }, { status: 503 })
    }

    if (!res.ok) {
      if (res.status === 429) return NextResponse.json({ error: 'Limite de requisições atingido. Aguarde um momento.' }, { status: 429 })
      return NextResponse.json({ error: `Erro na API do Mercado Livre (${res.status})` }, { status: 502 })
    }

    const data     = await res.json() as MlRawResponse
    const listings = mapListings(data)

    // 3. Salvar cache Supabase
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString()
    await supabase.from('ml_search_cache').upsert({
      query_hash:   hash,
      query_text:   q,
      results_json: listings as unknown as Record<string, unknown>[],
      result_count: listings.length,
      expires_at:   expiresAt,
    }, { onConflict: 'query_hash' })

    return NextResponse.json({ listings, cached: false })
  } catch {
    return NextResponse.json({ error: 'Erro de conexão com o Mercado Livre.' }, { status: 503 })
  }
}
