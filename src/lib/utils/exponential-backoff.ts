import * as Sentry from '@sentry/nextjs'

/**
 * Backoff exponencial para chamadas externas — endereça F3 Cenário B do
 * relatório de viabilidade 2026-04-30 (`searchMlApi` violava VB006
 * [ML-OFFICIAL] por não retentar 429/5xx).
 *
 * - Retries em 429 (rate limit ML): até 5 tentativas, backoff 2^n × 1000ms
 *   (2s, 4s, 8s, 16s, 32s). Total worst case ≈ 62s.
 * - Retries em 5xx (server error ML): até 3 tentativas (mais conservador).
 * - Jitter aleatório 0-500ms por tentativa para evitar thundering herd.
 * - Sentry captura `ml_api_rate_limited` e `ml_api_exhausted` para monitoramento.
 *
 * Não-retry em 4xx ≠ 429 (erro de cliente — refazer não resolve).
 */

export interface BackoffOptions {
  /** Número máximo de tentativas em 429 (default 5). */
  maxRetries429?: number
  /** Número máximo de tentativas em 5xx (default 3). */
  maxRetries5xx?: number
  /** Delay base em ms — multiplicado por 2^attempt (default 1000). */
  baseDelayMs?: number
  /** Jitter aleatório máximo em ms (default 500). */
  jitterMs?: number
  /** Identificador do endpoint para Sentry (ex: 'ml_search'). */
  endpoint: string
  /** user_id opcional para Sentry context. */
  userId?: string | null
}

export interface BackoffResult<T> {
  ok: true
  value: T
  attempts: number
}

export interface BackoffError {
  ok: false
  status: number | null
  attempts: number
  exhausted: boolean
  error?: unknown
}

const DEFAULTS = {
  maxRetries429: 5,
  maxRetries5xx: 3,
  baseDelayMs: 1000,
  jitterMs: 500,
} as const

function computeDelay(attempt: number, baseDelayMs: number, jitterMs: number): number {
  const exponential = baseDelayMs * Math.pow(2, attempt)
  const jitter = Math.random() * jitterMs
  return exponential + jitter
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wrapper de fetch com retry/backoff. A `fetcher` deve retornar uma `Response`
 * (não consumida — o caller faz `.json()` no `value` retornado).
 *
 * Em sucesso (2xx): retorna `{ ok: true, value: response, attempts }`.
 * Em falha: retorna `{ ok: false, status, attempts, exhausted, error? }`.
 */
export async function withBackoff<T extends Response>(
  fetcher: () => Promise<T>,
  opts: BackoffOptions,
): Promise<BackoffResult<T> | BackoffError> {
  const config = { ...DEFAULTS, ...opts }
  const maxAttempts = Math.max(config.maxRetries429, config.maxRetries5xx) + 1

  let lastStatus: number | null = null

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetcher()
      lastStatus = response.status

      if (response.ok) {
        return { ok: true, value: response, attempts: attempt + 1 }
      }

      const isRateLimit = response.status === 429
      const isServerError = response.status >= 500 && response.status < 600

      if (!isRateLimit && !isServerError) {
        // 4xx ≠ 429 — não-retentável (auth, bad request, not found etc.)
        return {
          ok: false,
          status: response.status,
          attempts: attempt + 1,
          exhausted: false,
        }
      }

      const limit = isRateLimit ? config.maxRetries429 : config.maxRetries5xx
      const isLastAttempt = attempt >= limit - 1

      if (isLastAttempt) {
        Sentry.captureMessage('ml_api_exhausted', {
          level: 'error',
          tags: {
            component: 'ml_api_backoff',
            endpoint: config.endpoint,
            kind: isRateLimit ? '429_exhausted' : '5xx_exhausted',
          },
          extra: {
            status: response.status,
            attempts: attempt + 1,
            user_id: config.userId ?? null,
          },
        })
        return {
          ok: false,
          status: response.status,
          attempts: attempt + 1,
          exhausted: true,
        }
      }

      if (isRateLimit) {
        Sentry.captureMessage('ml_api_rate_limited', {
          level: 'warning',
          tags: {
            component: 'ml_api_backoff',
            endpoint: config.endpoint,
            kind: '429',
          },
          extra: {
            attempt: attempt + 1,
            user_id: config.userId ?? null,
          },
        })
      }

      const delay = computeDelay(attempt, config.baseDelayMs, config.jitterMs)
      await sleep(delay)
    } catch (err) {
      // Erros de rede (DNS, timeout) — tratamos como retentável até maxRetries5xx
      const isLastAttempt = attempt >= config.maxRetries5xx - 1
      if (isLastAttempt) {
        Sentry.captureException(err, {
          tags: {
            component: 'ml_api_backoff',
            endpoint: config.endpoint,
            kind: 'network_exhausted',
          },
          extra: {
            attempts: attempt + 1,
            user_id: config.userId ?? null,
          },
        })
        return {
          ok: false,
          status: lastStatus,
          attempts: attempt + 1,
          exhausted: true,
          error: err,
        }
      }
      const delay = computeDelay(attempt, config.baseDelayMs, config.jitterMs)
      await sleep(delay)
    }
  }

  // Unreachable em condições normais — guard final
  return {
    ok: false,
    status: lastStatus,
    attempts: maxAttempts,
    exhausted: true,
  }
}
