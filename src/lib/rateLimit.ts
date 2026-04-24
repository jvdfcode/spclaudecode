const store = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitResult {
  ok: boolean
  limit: number
  remaining: number
  retryAfter?: number
}

export function checkRateLimit(key: string, limit = 10, windowMs = 60_000): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, limit, remaining: limit - 1 }
  }
  if (entry.count >= limit) {
    return { ok: false, limit, remaining: 0, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  return { ok: true, limit, remaining: limit - entry.count }
}
// Para multi-instância em produção: substituir por @upstash/ratelimit + Redis
