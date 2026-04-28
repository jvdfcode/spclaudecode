import { createServiceSupabase } from '@/lib/supabase/server'

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  retryAfter?: number
}

/**
 * Verifica e registra uso atômicamente via RPC `rate_limit_check_and_insert`
 * (migration 009). A RPC adquire `pg_advisory_xact_lock(user_id || endpoint)`,
 * conta a janela e insere a linha dentro da mesma transação. Resolve
 * DEBT-DB-H3 (race condition count-then-insert em ambiente serverless).
 *
 * Sempre insere a linha — mesmo sobre o limite — para que tentativas
 * subsequentes vejam a contagem real. O retorno indica se a tentativa
 * atual está dentro do limite.
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string,
  limit = 10,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  const supabase = createServiceSupabase()

  const { data, error } = await supabase.rpc('rate_limit_check_and_insert', {
    p_user_id: userId,
    p_endpoint: endpoint,
    p_window_seconds: windowSeconds,
  })

  if (error || !data) {
    // Fail open: não bloqueia usuário se o DB estiver indisponível
    console.error(
      JSON.stringify({
        ts: Date.now(),
        msg: 'rate_limit rpc error',
        error: error?.message ?? 'no data',
      }),
    )
    return { ok: true, limit, remaining: limit }
  }

  const row = Array.isArray(data) ? data[0] : data
  const previous = Number(row?.current_count ?? 0)
  const totalAfterInsert = previous + 1

  if (totalAfterInsert > limit) {
    return { ok: false, limit, remaining: 0, retryAfter: windowSeconds }
  }

  return { ok: true, limit, remaining: limit - totalAfterInsert }
}
