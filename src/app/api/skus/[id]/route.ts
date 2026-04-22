import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabase()

  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  let body: { adopted_price?: number; status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 })
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof body.adopted_price === 'number' && body.adopted_price > 0) {
    update.adopted_price = body.adopted_price
  }
  if (body.status) {
    update.status = body.status
    if (body.status === 'for_sale') update.is_for_sale = true
  }

  const { data, error } = await supabase
    .from('skus')
    .update(update)
    .eq('id', params.id)
    .eq('user_id', user.id)  // RLS garante, mas defesa em profundidade
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? 'SKU não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, sku: data })
}
