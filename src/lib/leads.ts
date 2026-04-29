import { createServiceSupabase } from '@/lib/supabase/server'

export interface LeadInsert {
  email: string
  source?: string
  context?: Record<string, unknown> | null
  lgpdOptin: boolean
  userAgent?: string | null
}

/**
 * Persiste um lead capturado pelo Lead Magnet (MKT-001-1).
 * Usa service_role pois a tabela `leads` nega acesso direto a authenticated/anon
 * (RLS da migration 010). Server-side only.
 */
export async function saveLead(input: LeadInsert): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createServiceSupabase()

  const { error } = await supabase.from('leads').insert({
    email: input.email,
    source: input.source ?? 'lead-magnet',
    context: input.context ?? null,
    lgpd_optin: input.lgpdOptin,
    user_agent: input.userAgent ?? null,
  })

  if (error) {
    console.error(
      JSON.stringify({
        ts: Date.now(),
        msg: 'lead insert error',
        error: error.message,
      }),
    )
    return { ok: false, error: 'Não foi possível registrar agora. Tente novamente em alguns minutos.' }
  }

  return { ok: true }
}
