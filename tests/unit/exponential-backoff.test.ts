import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { withBackoff } from '@/lib/utils/exponential-backoff'

vi.mock('@sentry/nextjs', () => ({
  captureMessage: vi.fn(),
  captureException: vi.fn(),
}))

function makeResponse(status: number, body: unknown = {}): Response {
  return new Response(JSON.stringify(body), { status })
}

describe('withBackoff', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('sucesso na 1ª tentativa retorna ok com 1 attempt', async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(makeResponse(200))
    const promise = withBackoff(fetcher, { endpoint: 'test' })

    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.attempts).toBe(1)
    }
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('429 retentado até sucesso na 3ª tentativa', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(makeResponse(429))
      .mockResolvedValueOnce(makeResponse(429))
      .mockResolvedValueOnce(makeResponse(200))

    const promise = withBackoff(fetcher, { endpoint: 'test' })

    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.attempts).toBe(3)
    }
    expect(fetcher).toHaveBeenCalledTimes(3)
  })

  it('429 esgota após 5 tentativas e retorna exhausted', async () => {
    const fetcher = vi.fn().mockResolvedValue(makeResponse(429))

    const promise = withBackoff(fetcher, { endpoint: 'test', maxRetries429: 5 })

    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.exhausted).toBe(true)
      expect(result.status).toBe(429)
      expect(result.attempts).toBe(5)
    }
    expect(fetcher).toHaveBeenCalledTimes(5)
  })

  it('500 esgota após 3 tentativas (default maxRetries5xx)', async () => {
    const fetcher = vi.fn().mockResolvedValue(makeResponse(500))

    const promise = withBackoff(fetcher, { endpoint: 'test' })

    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.exhausted).toBe(true)
      expect(result.status).toBe(500)
      expect(result.attempts).toBe(3)
    }
    expect(fetcher).toHaveBeenCalledTimes(3)
  })

  it('4xx ≠ 429 retorna sem retry (não-retentável)', async () => {
    const fetcher = vi.fn().mockResolvedValue(makeResponse(401))

    const promise = withBackoff(fetcher, { endpoint: 'test' })

    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.exhausted).toBe(false)
      expect(result.status).toBe(401)
      expect(result.attempts).toBe(1)
    }
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('erro de rede retentado e captura no Sentry após exhaustion', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('network failure'))

    const promise = withBackoff(fetcher, { endpoint: 'test' })

    await vi.runAllTimersAsync()
    const result = await promise

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.exhausted).toBe(true)
      expect(result.error).toBeInstanceOf(Error)
    }
    expect(fetcher).toHaveBeenCalledTimes(3)
  })
})
