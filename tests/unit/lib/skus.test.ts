import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── mocks do Supabase server ───────────────────────────────────────────────────
const mockGetUser = vi.fn()
const mockDelete  = vi.fn()
const mockUpdate  = vi.fn()
const mockSelect  = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createServerSupabase: async () => ({
    auth: { getUser: mockGetUser },
    from: (table: string) => ({
      delete: () => ({ eq: () => ({ eq: mockDelete }) }),
      update: (data: unknown) => ({
        eq: () => ({ eq: () => ({ select: () => ({ single: mockUpdate }) }) }),
        _data: data,
      }),
      select: mockSelect,
    }),
  }),
}))

vi.mock('@/lib/calculations', () => ({ calculateViability: vi.fn() }))

import { deleteSku, updateSku } from '@/lib/supabase/skus'

const MOCK_USER = { id: 'user-123' }

describe('deleteSku', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('deleta SKU sem erro quando autenticado', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: MOCK_USER }, error: null })
    mockDelete.mockResolvedValueOnce({ error: null })

    await expect(deleteSku('sku-abc')).resolves.toBeUndefined()
    expect(mockDelete).toHaveBeenCalledOnce()
  })

  it('lança erro quando não autenticado', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null })

    await expect(deleteSku('sku-abc')).rejects.toThrow('Usuário não autenticado')
  })

  it('lança erro quando banco retorna erro', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: MOCK_USER }, error: null })
    mockDelete.mockResolvedValueOnce({ error: { message: 'DB error' } })

    await expect(deleteSku('sku-abc')).rejects.toThrow('DB error')
  })
})

describe('updateSku', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('atualiza e retorna SKU mapeado', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: MOCK_USER }, error: null })
    mockUpdate.mockResolvedValueOnce({
      data: {
        id: 'sku-abc', user_id: 'user-123', name: 'Novo Nome',
        notes: null, status: 'viable', is_for_sale: false,
        adopted_price: null, created_at: '2026-01-01', updated_at: '2026-01-02',
      },
      error: null,
    })

    const sku = await updateSku('sku-abc', { name: 'Novo Nome' })
    expect(sku.name).toBe('Novo Nome')
    expect(sku.id).toBe('sku-abc')
  })

  it('lança erro quando não autenticado', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null }, error: null })

    await expect(updateSku('sku-abc', { name: 'X' })).rejects.toThrow('Usuário não autenticado')
  })
})
