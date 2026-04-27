import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rateLimit'
import { getMlAccessToken, searchMlApi } from '@/lib/ml-api'
import type { MlListing } from '@/types'

const log = (msg: string, data?: object) =>
  console.log(JSON.stringify({ ts: Date.now(), msg, ...data }))

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

function hashQuery(q: string): string {
  let h = 0
  for (let i = 0; i < q.length; i++) h = Math.imul(31, h) + q.charCodeAt(i) | 0
  return `ml_${Math.abs(h).toString(36)}_${q.length}`
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Informe ao menos 2 caracteres' }, { status: 400 })
  }

  try {
    const supabase = await createServerSupabase()
    const hash = hashQuery(q.toLowerCase())

    // 1. Cache Supabase
    const { data: cached } = await supabase
      .from('ml_search_cache')
      .select('results_json, expires_at')
      .eq('query_hash', hash)
      .single()

    if (cached && new Date(cached.expires_at as string) > new Date()) {
      return NextResponse.json({ listings: cached.results_json, cached: true })
    }

    // 2. Se usuário tem token ML, busca autenticada server-side
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const accessToken = await getMlAccessToken(supabase)
      if (accessToken) {
        try {
          const listings = await searchMlApi(q, accessToken)
          if (listings.length > 0) {
            // Salva no cache em background
            const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString()
            void supabase.from('ml_search_cache').upsert({
              query_hash:   hash,
              query_text:   q,
              results_json: listings as unknown as Record<string, unknown>[],
              result_count: listings.length,
              expires_at:   expiresAt,
            }, { onConflict: 'query_hash' })

            return NextResponse.json({ listings, mlAuthenticated: true })
          }
        } catch (err) {
          log('ml-search api error', { error: String(err) })
          // Fallback para método client-side
        }
      }
    }
  } catch (err) {
    log('ml-search error', { error: String(err) })
  }

  // Fallback: sinaliza ao browser para buscar direto (IP residencial não é bloqueado)
  return NextResponse.json({ clientSide: true }, { status: 503 })
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 })
    }

    const rl = await checkRateLimit(user.id, 'ml-search', 20)
    if (!rl.ok) {
      return NextResponse.json(
        { ok: false, error: 'Muitas requisições de cache.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(rl.limit),
            'X-RateLimit-Remaining': '0',
            'Retry-After': String(rl.retryAfter),
          },
        }
      )
    }

    const { q, listings } = await req.json() as { q: string; listings: MlListing[] }
    if (!q || !listings?.length) return NextResponse.json({ ok: false })

    const hash = hashQuery(q.toLowerCase())
    const expiresAt = new Date(Date.now() + CACHE_TTL_MS).toISOString()

    await supabase.from('ml_search_cache').upsert({
      query_hash:   hash,
      query_text:   q,
      results_json: listings as unknown as Record<string, unknown>[],
      result_count: listings.length,
      expires_at:   expiresAt,
    }, { onConflict: 'query_hash' })

    return NextResponse.json({ ok: true })
  } catch (err) {
    log('ml-search cache write error', { error: String(err) })
    return NextResponse.json({ ok: false })
  }
}
