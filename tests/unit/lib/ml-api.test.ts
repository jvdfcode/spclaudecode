import { describe, it, expect, vi, beforeEach } from 'vitest'

global.fetch = vi.fn()

// Controla o que o Supabase retorna para ml_tokens
let mockTokenRow: { access_token: string; refresh_token: string; expires_at: string } | null = null
let mockUpdateCalled = false

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: async () => ({}), // não usado neste módulo
}))

// Substitui a função que busca token do banco via supabase.from().select().single()
// getMlAccessToken recebe um supabase como parâmetro, então testamos direto
const makeMockSupabase = () => ({
  from: () => ({
    select: () => ({
      single: () => Promise.resolve({ data: mockTokenRow }),
    }),
    update: () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eq: (): any => {
        mockUpdateCalled = true
        return Promise.resolve({ error: null })
      },
    }),
  }),
})

import { getMlAccessToken } from '@/lib/ml-api'

describe('getMlAccessToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockTokenRow = null
    mockUpdateCalled = false
  })

  it('retorna null quando sem token no banco', async () => {
    mockTokenRow = null
    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBeNull()
  })

  it('retorna access_token quando ainda válido (expira em 30min)', async () => {
    mockTokenRow = {
      access_token: 'tok123',
      refresh_token: 'ref',
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    }
    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBe('tok123')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('tenta refresh quando token expirando em < 5 min e retorna novo token', async () => {
    mockTokenRow = {
      access_token: 'old_tok',
      refresh_token: 'ref123',
      expires_at: new Date(Date.now() + 60 * 1000).toISOString(), // 1 min — dentro do limite
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'new_tok', refresh_token: 'new_ref', expires_in: 21600 }),
    })

    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBe('new_tok')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.mercadolibre.com/oauth/token',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('retorna null quando refresh falha', async () => {
    mockTokenRow = {
      access_token: 'old',
      refresh_token: 'bad_ref',
      expires_at: new Date(Date.now() + 60 * 1000).toISOString(),
    }

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })

    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBeNull()
  })
})
