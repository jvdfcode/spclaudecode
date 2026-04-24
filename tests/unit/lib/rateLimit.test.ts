import { describe, it, expect } from 'vitest'
import { checkRateLimit } from '@/lib/rateLimit'

describe('checkRateLimit', () => {
  it('primeira req passa com remaining = limit - 1', () => {
    const r = checkRateLimit('u-a', 3, 60_000)
    expect(r.ok).toBe(true)
    expect(r.remaining).toBe(2)
  })

  it('remaining decrementa a cada chamada', () => {
    checkRateLimit('u-b', 5, 60_000)
    const r = checkRateLimit('u-b', 5, 60_000)
    expect(r.remaining).toBe(3)
  })

  it('bloqueia após atingir o limite', () => {
    for (let i = 0; i < 2; i++) checkRateLimit('u-c', 2, 60_000)
    const r = checkRateLimit('u-c', 2, 60_000)
    expect(r.ok).toBe(false)
    expect(r.remaining).toBe(0)
    expect(r.retryAfter).toBeGreaterThan(0)
  })

  it('chaves distintas são janelas independentes', () => {
    for (let i = 0; i < 1; i++) checkRateLimit('u-d', 1, 60_000)
    const blocked = checkRateLimit('u-d', 1, 60_000)
    const fresh = checkRateLimit('u-e', 1, 60_000)
    expect(blocked.ok).toBe(false)
    expect(fresh.ok).toBe(true)
  })

  it('retorna limit correto nos headers', () => {
    const r = checkRateLimit('u-f', 7, 60_000)
    expect(r.limit).toBe(7)
  })
})
