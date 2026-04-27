'use server'

import { revalidatePath } from 'next/cache'
import { deleteSku, updateSku } from '@/lib/supabase/skus'

export async function deleteSkuAction(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await deleteSku(id)
    revalidatePath('/skus')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

export async function updateSkuAction(
  id: string,
  fields: { name?: string; notes?: string | null }
): Promise<{ ok: boolean; error?: string }> {
  try {
    await updateSku(id, fields)
    revalidatePath('/skus')
    revalidatePath(`/skus/${id}`)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
