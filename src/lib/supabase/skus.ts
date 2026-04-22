'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { calculateViability } from '@/lib/calculations'
import type { ViabilityInput, ViabilityResult } from '@/types'
import type { Sku, SkuCalculation, SkuWithLatestCalc } from '@/types/sku'
import type { DbSku, DbSkuCalculation } from '@/types/database'

function mapSku(row: DbSku): Sku {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    notes: row.notes,
    status: row.status,
    isForSale: row.is_for_sale,
    adoptedPrice: row.adopted_price ? Number(row.adopted_price) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapCalc(row: DbSkuCalculation): SkuCalculation {
  return {
    id: row.id,
    skuId: row.sku_id,
    costData: row.cost_data as unknown as ViabilityInput,
    resultData: row.result_data as unknown as ViabilityResult,
    salePrice: Number(row.sale_price),
    listingType: row.listing_type,
    marginPercent: row.margin_percent ? Number(row.margin_percent) : null,
    roiPercent: row.roi_percent ? Number(row.roi_percent) : null,
    isViable: row.is_viable,
    isAdopted: row.is_adopted,
    createdAt: row.created_at,
  }
}

export async function saveSku(
  name: string,
  notes: string | undefined,
  input: ViabilityInput,
  result: ViabilityResult
): Promise<{ sku: Sku; calculation: SkuCalculation }> {
  const supabase = await createServerSupabase()

  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) throw new Error('Usuário não autenticado')

  if (!name.trim()) throw new Error('Nome do SKU é obrigatório')

  const status = result.classification === 'viable'
    ? 'viable'
    : result.classification === 'attention'
    ? 'attention'
    : 'not_viable'

  const { data: skuRow, error: skuErr } = await supabase
    .from('skus')
    .insert({ user_id: user.id, name: name.trim(), notes: notes?.trim() || null, status })
    .select()
    .single()

  if (skuErr || !skuRow) throw new Error(skuErr?.message ?? 'Falha ao criar SKU')

  const { data: calcRow, error: calcErr } = await supabase
    .from('sku_calculations')
    .insert({
      sku_id: skuRow.id,
      cost_data: input as unknown as Record<string, unknown>,
      result_data: result as unknown as Record<string, unknown>,
      sale_price: input.salePrice,
      listing_type: input.listingType,
      margin_percent: result.metrics.marginPercent,
      roi_percent: result.metrics.roiPercent,
      is_viable: result.classification === 'viable',
      is_adopted: true,
    })
    .select()
    .single()

  if (calcErr || !calcRow) throw new Error(calcErr?.message ?? 'Falha ao salvar cálculo')

  return { sku: mapSku(skuRow), calculation: mapCalc(calcRow) }
}

export async function getSkuById(id: string): Promise<(Sku & { calculations: SkuCalculation[] }) | null> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('skus')
    .select(`*, sku_calculations (*)`)
    .eq('id', id)
    .single()

  if (error || !data) return null

  const calcs: DbSkuCalculation[] = (data.sku_calculations as DbSkuCalculation[]) ?? []
  return {
    ...mapSku(data as DbSku),
    calculations: calcs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(mapCalc),
  }
}

export async function adoptSku(
  name: string,
  notes: string | undefined,
  input: ViabilityInput,
  result: ViabilityResult,
  adoptedPrice: number
): Promise<{ sku: Sku; calculation: SkuCalculation }> {
  const supabase = await createServerSupabase()

  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) throw new Error('Usuário não autenticado')

  if (!name.trim()) throw new Error('Nome do SKU é obrigatório')
  if (adoptedPrice <= 0) throw new Error('Preço adotado deve ser maior que zero')

  const { data: skuRow, error: skuErr } = await supabase
    .from('skus')
    .insert({
      user_id: user.id,
      name: name.trim(),
      notes: notes?.trim() || null,
      status: 'for_sale',
      is_for_sale: true,
      adopted_price: adoptedPrice,
    })
    .select()
    .single()

  if (skuErr || !skuRow) throw new Error(skuErr?.message ?? 'Falha ao criar SKU')

  const adoptedInput = { ...input, salePrice: adoptedPrice }
  const adoptedResult = calculateViability(adoptedInput)

  const { data: calcRow, error: calcErr } = await supabase
    .from('sku_calculations')
    .insert({
      sku_id: skuRow.id,
      cost_data: adoptedInput as unknown as Record<string, unknown>,
      result_data: adoptedResult as unknown as Record<string, unknown>,
      sale_price: adoptedPrice,
      listing_type: input.listingType,
      margin_percent: adoptedResult.metrics.marginPercent,
      roi_percent: adoptedResult.metrics.roiPercent,
      is_viable: adoptedResult.classification === 'viable',
      is_adopted: true,
    })
    .select()
    .single()

  if (calcErr || !calcRow) throw new Error(calcErr?.message ?? 'Falha ao salvar cálculo')

  return { sku: mapSku(skuRow), calculation: mapCalc(calcRow) }
}

export async function listSkus(): Promise<SkuWithLatestCalc[]> {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from('skus')
    .select(`
      *,
      sku_calculations (
        id, sku_id, sale_price, listing_type,
        margin_percent, roi_percent, is_viable, is_adopted,
        cost_data, result_data, created_at
      )
    `)
    .order('updated_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data ?? []).map((row: DbSku & { sku_calculations: DbSkuCalculation[] }) => {
    const calcs: DbSkuCalculation[] = row.sku_calculations ?? []
    const latest = calcs.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0] ?? null

    return {
      ...mapSku(row as DbSku),
      latestCalculation: latest ? mapCalc(latest) : null,
    }
  })
}
