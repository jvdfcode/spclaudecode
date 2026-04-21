'use server'

import { saveSku } from '@/lib/supabase/skus'
import type { ViabilityInput, ViabilityResult } from '@/types'

export async function saveSkuAction(
  name: string,
  notes: string | undefined,
  input: ViabilityInput,
  result: ViabilityResult
) {
  try {
    const saved = await saveSku(name, notes, input, result)
    return { ok: true as const, skuId: saved.sku.id }
  } catch (err) {
    return { ok: false as const, error: (err as Error).message }
  }
}
