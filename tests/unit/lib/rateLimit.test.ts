import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock do módulo Supabase antes de importar o módulo testado
const mockSelect = vi.fn()
const mockInsert = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createServiceSupabase: () => ({
    from: () => ({
      select: () => ({ count: 'exact', head: true, eq: () => ({ eq: () => ({ gte: mockSelect }) }) }),
      insert: mockInsert,
    }),
  }),
}))

// Helper: configura o mock para retornar uma contagem específica
function mockCount(n: number) {
  mockSelect.mockResolvedValueOnce({ count: n, error: null })
  mockInsert.mockResolvedValueOnce({ error: null })
}

import { checkRateLimit } from '@/lib/rateLimit'

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('primeira req passa com remaining correto', async () => {
    mockCount(0) // nenhuma req anterior
    const r = await checkRateLimit('user-a', 'ml-proxy', 3)
    expect(r.ok).toBe(true)
    expect(r.remaining).toBe(2) // limit(3) - current(0) - 1
  })

  it('bloqueia quando count >= limit', async () => {
    mockSelect.mockResolvedValueOnce({ count: 3, error: null })
    // insert não deve ser chamado
    const r = await checkRateLimit('user-b', 'ml-proxy', 3)
    expect(r.ok).toBe(false)
    expect(r.remaining).toBe(0)
    expect(r.retryAfter).toBeGreaterThan(0)
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('retorna limit correto nos headers', async () => {
    mockCount(0)
    const r = await checkRateLimit('user-c', 'ml-proxy', 7)
    expect(r.limit).toBe(7)
  })

  it('fail open — retorna ok:true se DB falhar', async () => {
    mockSelect.mockResolvedValueOnce({ count: null, error: { message: 'DB error' } })
    const r = await checkRateLimit('user-d', 'ml-proxy', 10)
    expect(r.ok).toBe(true)
    expect(r.remaining).toBe(10)
  })
})
