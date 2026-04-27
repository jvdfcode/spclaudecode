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

import { deleteSku, updateSku, listSkus } from '@/lib/supabase/skus'

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

describe('listSkus', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('retorna SKUs com último cálculo mapeado (LATERAL join)', async () => {
    const chainResult = {
      data: [{
        id: 'sku-1', user_id: 'user-123', name: 'Produto A',
        notes: null, status: 'viable', is_for_sale: false,
        adopted_price: null, created_at: '2026-01-01', updated_at: '2026-01-02',
        sku_calculations: [{
          id: 'calc-1', sku_id: 'sku-1', sale_price: '100',
          listing_type: 'gold_special', margin_percent: '20',
          roi_percent: '25', is_viable: true, is_adopted: true,
          created_at: '2026-01-02', cost_data: {}, result_data: {},
        }],
      }],
      error: null,
    }
    const mockChain = { order: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValue(chainResult) }
    mockSelect.mockReturnValue(mockChain)

    const result = await listSkus()
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('Produto A')
    expect(result[0].latestCalculation?.salePrice).toBe(100)
    expect(mockChain.order).toHaveBeenCalledWith('created_at', { ascending: false, referencedTable: 'sku_calculations' })
    expect(mockChain.limit).toHaveBeenCalledWith(1, { referencedTable: 'sku_calculations' })
  })

  it('retorna latestCalculation null quando SKU não tem cálculos', async () => {
    const chainResult = {
      data: [{
        id: 'sku-2', user_id: 'user-123', name: 'Produto B',
        notes: null, status: 'attention', is_for_sale: false,
        adopted_price: null, created_at: '2026-01-01', updated_at: '2026-01-02',
        sku_calculations: [],
      }],
      error: null,
    }
    const mockChain = { order: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValue(chainResult) }
    mockSelect.mockReturnValue(mockChain)

    const result = await listSkus()
    expect(result[0].latestCalculation).toBeNull()
  })

  it('lança erro quando banco retorna erro', async () => {
    const mockChain = { order: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error listSkus' } }) }
    mockSelect.mockReturnValue(mockChain)

    await expect(listSkus()).rejects.toThrow('DB error listSkus')
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
