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
  const { count, error } = await supabase
    .from('ml_search_cache')
    .delete({ count: 'exact' })
    .lt('expires_at', new Date().toISOString())

  if (error) {
    console.log(JSON.stringify({ ts: Date.now(), msg: 'cleanup-ml-cache error', error: error.message }))
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  console.log(JSON.stringify({ ts: Date.now(), msg: 'cleanup-ml-cache ok', deleted: count ?? 0 }))
  return NextResponse.json({ ok: true, deleted: count ?? 0 })
}
