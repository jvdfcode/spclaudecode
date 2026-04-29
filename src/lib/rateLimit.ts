import { createServiceSupabase } from '@/lib/supabase/server'

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  retryAfter?: number
}

/**
 * Converte qualquer string (ex.: IP) em UUID v4-like deterministico.
 * Usado para rate limit de usuarios anonimos onde user_id é requerido como uuid.
 */
export function stringToUuid(input: string): string {
  let h1 = 0x9dc5811c
  let h2 = 0x6d4e4b1a
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 0x9e3779b9) >>> 0
    h2 = Math.imul(h2 ^ c, 0x6c62272e) >>> 0
  }
  const toHex = (n: number, len: number) => n.toString(16).padStart(len, '0').slice(0, len)
  const p1 = toHex(h1, 8)
  const p2 = toHex((h2 >>> 16) & 0xffff, 4)
  const p3 = '4' + toHex((h2 >>> 8) & 0x0fff, 3)
  const p4 = (0x8 | (h1 & 0x3)).toString(16) + toHex(h2 & 0x0fff, 3)
  const p5 = toHex(h1, 4) + toHex(h2, 8)
  return `${p1}-${p2}-${p3}-${p4}-${p5}`
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
