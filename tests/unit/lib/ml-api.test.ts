import { describe, it, expect, vi, beforeEach } from 'vitest'

global.fetch = vi.fn()

interface TokenRow {
  user_id: string
  access_token: string
  refresh_token: string
  expires_at: string
}

let singleQueue: Array<{ data: TokenRow | null }> = []
let mockUpdateCalled = false
let mockRpcCalled = false

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: async () => ({}), // não usado neste módulo
}))

// Mock supabase com:
// - select().single() respondendo da fila (1ª chamada = leitura inicial,
//   2ª chamada = releitura pós-lock se houver refresh)
// - rpc('acquire_user_lock', ...) registra que foi chamado
// - update().eq() registra que foi chamado
const makeMockSupabase = () => ({
  from: () => ({
    select: () => ({
      single: () => Promise.resolve(singleQueue.shift() ?? { data: null }),
    }),
    update: () => ({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eq: (): any => {
        mockUpdateCalled = true
        return Promise.resolve({ error: null })
      },
    }),
  }),
  rpc: vi.fn(async (_name: string, _params: unknown) => {
    mockRpcCalled = true
    return { data: null, error: null }
  }),
})

import { getMlAccessToken } from '@/lib/ml-api'

describe('getMlAccessToken (com advisory lock — DEBT-DB-C3)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    singleQueue = []
    mockUpdateCalled = false
    mockRpcCalled = false
  })

  it('retorna null quando sem token no banco', async () => {
    singleQueue = [{ data: null }]
    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBeNull()
    expect(mockRpcCalled).toBe(false) // não chega ao lock
  })

  it('retorna access_token quando ainda válido (caminho rápido sem lock)', async () => {
    singleQueue = [
      {
        data: {
          user_id: 'u-1',
          access_token: 'tok123',
          refresh_token: 'ref',
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
      },
    ]
    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBe('tok123')
    expect(global.fetch).not.toHaveBeenCalled()
    expect(mockRpcCalled).toBe(false) // caminho rápido não pega lock
  })

  it('adquire lock e faz refresh quando token expirando em < 5 min', async () => {
    const expiring = new Date(Date.now() + 60 * 1000).toISOString()
    singleQueue = [
      // 1ª leitura: inicial
      {
        data: {
          user_id: 'u-2',
          access_token: 'old_tok',
          refresh_token: 'ref123',
          expires_at: expiring,
        },
      },
      // 2ª leitura: pós-lock, ainda expirando — este request faz o refresh
      {
        data: {
          user_id: 'u-2',
          access_token: 'old_tok',
          refresh_token: 'ref123',
          expires_at: expiring,
        },
      },
    ]

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'new_tok',
        refresh_token: 'new_ref',
        expires_in: 21600,
      }),
    })

    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBe('new_tok')
    expect(mockRpcCalled).toBe(true)
    expect(mockUpdateCalled).toBe(true)
    expect(global.fetch).toHaveBeenCalled()
  })

  it('não chama API ML se outro request já refrescou pós-lock', async () => {
    const expiring = new Date(Date.now() + 60 * 1000).toISOString()
    const fresh = new Date(Date.now() + 30 * 60 * 1000).toISOString()
    singleQueue = [
      // 1ª leitura: inicial, expirando
      {
        data: {
          user_id: 'u-3',
          access_token: 'old_tok',
          refresh_token: 'ref',
          expires_at: expiring,
        },
      },
      // 2ª leitura: pós-lock, outro request já renovou
      {
        data: {
          user_id: 'u-3',
          access_token: 'fresh_tok',
          refresh_token: 'fresh_ref',
          expires_at: fresh,
        },
      },
    ]

    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBe('fresh_tok')
    expect(mockRpcCalled).toBe(true)
    expect(global.fetch).not.toHaveBeenCalled() // não refaz refresh
    expect(mockUpdateCalled).toBe(false)
  })

  it('retorna null quando refresh falha', async () => {
    const expiring = new Date(Date.now() + 60 * 1000).toISOString()
    singleQueue = [
      {
        data: {
          user_id: 'u-4',
          access_token: 'old',
          refresh_token: 'bad_ref',
          expires_at: expiring,
        },
      },
      {
        data: {
          user_id: 'u-4',
          access_token: 'old',
          refresh_token: 'bad_ref',
          expires_at: expiring,
        },
      },
    ]

    ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ ok: false })

    const token = await getMlAccessToken(makeMockSupabase() as never)
    expect(token).toBeNull()
  })
})
