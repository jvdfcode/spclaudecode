import type { SupabaseClient } from '@supabase/supabase-js'
import type { MlListing, MlRawResponse } from '@/types'

const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token'
const ML_SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search'

interface TokenRow {
  access_token: string
  refresh_token: string
  expires_at: string
}

interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

async function refreshToken(refreshToken: string): Promise<TokenResponse | null> {
  try {
    const res = await fetch(ML_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.ML_APP_ID!,
        client_secret: process.env.ML_CLIENT_SECRET!,
        refresh_token: refreshToken,
      }),
    })
    if (!res.ok) return null
    return await res.json() as TokenResponse
  } catch {
    return null
  }
}

// Retorna access_token válido ou null se não conectado / falha no refresh
export async function getMlAccessToken(supabase: SupabaseClient): Promise<string | null> {
  const { data } = await supabase
    .from('ml_tokens')
    .select('access_token, refresh_token, expires_at')
    .single()

  if (!data) return null
  const row = data as TokenRow

  // Token ainda válido por mais de 5 min
  if (new Date(row.expires_at) > new Date(Date.now() + 5 * 60 * 1000)) {
    return row.access_token
  }

  // Refresh
  const refreshed = await refreshToken(row.refresh_token)
  if (!refreshed) return null

  await supabase.from('ml_tokens').update({
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token,
    expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  })

  return refreshed.access_token
}

// Busca anúncios via API oficial com token de usuário
export async function searchMlApi(q: string, accessToken: string): Promise<MlListing[]> {
  const url = new URL(ML_SEARCH_URL)
  url.searchParams.set('q', q)
  url.searchParams.set('limit', '50')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`ML API ${res.status}`)

  const data = await res.json() as MlRawResponse
  return (data.results ?? []).map(r => ({
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
