import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock do módulo Supabase antes de importar o módulo testado.
// Após migration 009, checkRateLimit usa RPC `rate_limit_check_and_insert`
// em vez do par select+insert.
const mockRpc = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createServiceSupabase: () => ({
    rpc: mockRpc,
  }),
}))

// Helper: configura a RPC para retornar a contagem ANTERIOR ao insert.
// A RPC sempre insere uma linha; o cliente decide ok=true/false a partir
// do (current_count + 1) versus limit.
function mockPreviousCount(n: number) {
  mockRpc.mockResolvedValueOnce({
    data: [{ current_count: n, inserted: true }],
    error: null,
  })
}

import { checkRateLimit } from '@/lib/rateLimit'

describe('checkRateLimit (RPC com advisory lock)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('primeira req passa com remaining correto', async () => {
    mockPreviousCount(0)
    const r = await checkRateLimit('user-a', 'ml-proxy', 3)
    expect(r.ok).toBe(true)
    // limit=3, previous=0, totalAfterInsert=1 → remaining = 3 - 1 = 2
    expect(r.remaining).toBe(2)
  })

  it('bloqueia quando count anterior >= limit', async () => {
    mockPreviousCount(3) // já tinha 3 reqs; esta seria a 4ª
    const r = await checkRateLimit('user-b', 'ml-proxy', 3)
    expect(r.ok).toBe(false)
    expect(r.remaining).toBe(0)
    expect(r.retryAfter).toBeGreaterThan(0)
  })

  it('limita exatamente no boundary', async () => {
    mockPreviousCount(2) // permitida; vira a 3ª
    const r = await checkRateLimit('user-c', 'ml-proxy', 3)
    expect(r.ok).toBe(true)
    expect(r.remaining).toBe(0)
  })

  it('fail open — retorna ok:true se RPC falhar', async () => {
    mockRpc.mockResolvedValueOnce({ data: null, error: { message: 'DB error' } })
    const r = await checkRateLimit('user-d', 'ml-proxy', 10)
    expect(r.ok).toBe(true)
    expect(r.remaining).toBe(10)
  })

  it('aceita data como objeto único (não-array)', async () => {
    // Algumas versões do supabase-js retornam data como objeto direto
    mockRpc.mockResolvedValueOnce({
      data: { current_count: 5, inserted: true },
      error: null,
    })
    const r = await checkRateLimit('user-e', 'ml-proxy', 10)
    expect(r.ok).toBe(true)
    expect(r.remaining).toBe(4)
  })
})

describe('checkRateLimit — concorrência (DEBT-DB-H3)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('10 chamadas paralelas com limit=5: até 5 ok, restante bloqueado', async () => {
    // A RPC é serializada pelo advisory_xact_lock no DB. Cada chamada vê
    // o estado consistente: previous_count incrementa monotonicamente.
    // Mockamos a serialização explicitamente: 1ª vê 0, 2ª vê 1, ... 10ª vê 9.
    for (let i = 0; i < 10; i++) {
      mockRpc.mockResolvedValueOnce({
        data: [{ current_count: i, inserted: true }],
        error: null,
      })
    }

    const limit = 5
    const results = await Promise.all(
      Array.from({ length: 10 }, () => checkRateLimit('user-concurrent', 'ml-proxy', limit)),
    )

    const okCount = results.filter(r => r.ok).length
    const blockedCount = results.filter(r => !r.ok).length

    // Veto Pedro Valério (CI gate): nunca mais que `limit` chamadas ok
    expect(okCount).toBeLessThanOrEqual(limit)
    expect(okCount).toBe(5)
    expect(blockedCount).toBe(5)
    expect(mockRpc).toHaveBeenCalledTimes(10)
  })
})
