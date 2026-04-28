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

/**
 * Retorna access_token válido ou null se não conectado / falha no refresh.
 *
 * Resolve DEBT-DB-C3 (race condition no refresh): adquire advisory lock por
 * usuário antes de decidir se faz refresh, e relê o estado pós-lock. Se
 * outra instância já fez refresh enquanto este request esperava o lock, a
 * releitura retorna o token novo sem chamar a API ML novamente.
 *
 * Requer: migration 009 (`acquire_user_lock`); supabase deve ter user_id
 * resolvível (auth.uid em RLS, ou single-row para service role).
 */
export async function getMlAccessToken(supabase: SupabaseClient): Promise<string | null> {
  const initial = await supabase
    .from('ml_tokens')
    .select('user_id, access_token, refresh_token, expires_at')
    .single()

  if (!initial.data) return null
  const row = initial.data as TokenRow & { user_id: string }

  // Token ainda válido por mais de 5 min — caminho rápido sem lock
  if (new Date(row.expires_at) > new Date(Date.now() + 5 * 60 * 1000)) {
    return row.access_token
  }

  // Adquire advisory lock por usuário; segura concorrentes na mesma transação
  const { error: lockError } = await supabase.rpc('acquire_user_lock', {
    p_user_id: row.user_id,
    p_scope: 'ml_token_refresh',
  })

  if (lockError) {
    console.error(
      JSON.stringify({
        ts: Date.now(),
        msg: 'ml_token_refresh lock error',
        error: lockError.message,
      }),
    )
    // Fallback sem lock — race ainda possível, mas melhor que falhar tudo
    return row.access_token
  }

  // Após o lock, relê — pode ter sido renovado por outro request
  const reread = await supabase
    .from('ml_tokens')
    .select('access_token, refresh_token, expires_at')
    .single()

  if (reread.data) {
    const fresh = reread.data as TokenRow
    if (new Date(fresh.expires_at) > new Date(Date.now() + 5 * 60 * 1000)) {
      return fresh.access_token
    }
  }

  // Ainda expirando — este request é o vencedor do lock, faz refresh
  const refreshed = await refreshToken(row.refresh_token)
  if (!refreshed) return null

  await supabase
    .from('ml_tokens')
    .update({
      access_token: refreshed.access_token,
      refresh_token: refreshed.refresh_token,
      expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', row.user_id)

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
