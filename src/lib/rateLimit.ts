import { createServiceSupabase } from '@/lib/supabase/server'

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  retryAfter?: number
}

/**
 * Converte qualquer string (ex.: IP) em UUID v4-like deterministico.
 * Usado para rate limit de usuarios anonimos onde user_id e requerido como uuid.
 */
export function stringToUuid(input: string): string {
  // Hash djb2 simples
  let h1 = 0x9dc5811c
  let h2 = 0x6d4e4b1a
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 0x9e3779b9) >>> 0
    h2 = Math.imul(h2 ^ c, 0x6c62272e) >>> 0
  }
  const toHex = (n: number, len: number) => n.toString(16).padStart(len, '0').slice(0, len)
  // Formato: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx (version 4 like)
  const p1 = toHex(h1, 8)
  const p2 = toHex((h2 >>> 16) & 0xffff, 4)
  const p3 = '4' + toHex((h2 >>> 8) & 0x0fff, 3)
  const p4 = (0x8 | (h1 & 0x3)).toString(16) + toHex(h2 & 0x0fff, 3)
  const p5 = toHex(h1, 4) + toHex(h2, 8)
  return `${p1}-${p2}-${p3}-${p4}-${p5}`
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
