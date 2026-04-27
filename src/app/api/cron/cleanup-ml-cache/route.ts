import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase/server'

// Vercel Cron Job — executa diariamente às 03:00 UTC (vercel.json)
// Requer Authorization: Bearer ${CRON_SECRET} (fornecido automaticamente pelo Vercel)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceSupabase()

  const [cacheResult, rateLimitResult] = await Promise.all([
    supabase
      .from('ml_search_cache')
      .delete({ count: 'exact' })
      .lt('expires_at', new Date().toISOString()),
    supabase
      .from('rate_limit_log')
      .delete({ count: 'exact' })
      .lt('created_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()), // > 2h
  ])

  if (cacheResult.error || rateLimitResult.error) {
    const msg = cacheResult.error?.message ?? rateLimitResult.error?.message
    console.log(JSON.stringify({ ts: Date.now(), msg: 'cleanup error', error: msg }))
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }

  console.log(JSON.stringify({
    ts: Date.now(),
    msg: 'cleanup ok',
    cache_deleted: cacheResult.count ?? 0,
    rate_limit_deleted: rateLimitResult.count ?? 0,
  }))
  return NextResponse.json({
    ok: true,
    cache_deleted: cacheResult.count ?? 0,
    rate_limit_deleted: rateLimitResult.count ?? 0,
  })
}
