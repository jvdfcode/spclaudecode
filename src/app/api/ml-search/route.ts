import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import type { MlListing } from '@/types'

const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hora

function hashQuery(q: string): string {
  let h = 0
  for (let i = 0; i < q.length; i++) h = Math.imul(31, h) + q.charCodeAt(i) | 0
  return `ml_${Math.abs(h).toString(36)}_${q.length}`
}

// ML bloqueia qualquer IP não-residencial (servidor, cloud, Node.js) com 403,
// mesmo com token válido. A busca real é feita pelo browser do usuário.
// Este endpoint serve apenas para cache Supabase compartilhado entre usuários.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ error: 'Informe ao menos 2 caracteres' }, { status: 400 })
  }

  try {
    const supabase = await createServerSupabase()
    const hash = hashQuery(q.toLowerCase())

    const { data: cached } = await supabase
      .from('ml_search_cache')
      .select('results_json, expires_at')
      .eq('query_hash', hash)
      .single()

    if (cached && new Date(cached.expires_at) > new Date()) {
      return NextResponse.json({ listings: cached.results_json, cached: true })
    }
  } catch {
    // Supabase indisponível — continua para busca no browser
  }

  // Sinaliza ao browser para buscar direto no ML (IP residencial não é bloqueado)
  return NextResponse.json({ clientSide: true }, { status: 503 })
}

export async function POST(req: NextRequest) {
  // Browser envia resultados para cache Supabase após busca bem-sucedida
  try {
    const { q, listings } = await req.json() as { q: string; listings: MlListing[] }
    if (!q || !listings?.length) return NextResponse.json({ ok: false })

    const supabase = await createServerSupabase()
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
  } catch {
    return NextResponse.json({ ok: false })
  }
}
