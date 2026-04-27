import { createServiceSupabase } from '@/lib/supabase/server'

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  retryAfter?: number
}

export async function checkRateLimit(
  userId: string,
  endpoint: string,
  limit = 10,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  const supabase = createServiceSupabase()
  const windowStart = new Date(Date.now() - windowSeconds * 1000).toISOString()

  const { count, error } = await supabase
    .from('rate_limit_log')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('created_at', windowStart)

  if (error) {
    // Fail open: não bloqueia usuário se o DB estiver indisponível
    console.error(JSON.stringify({ ts: Date.now(), msg: 'rate_limit count error', error: error.message }))
    return { ok: true, limit, remaining: limit }
  }

  const current = count ?? 0

  if (current >= limit) {
    return { ok: false, limit, remaining: 0, retryAfter: windowSeconds }
  }

  await supabase.from('rate_limit_log').insert({ user_id: userId, endpoint })

  return { ok: true, limit, remaining: limit - current - 1 }
}
