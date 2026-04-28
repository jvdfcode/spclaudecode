'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { saveLead } from '@/lib/leads'

const leadInputSchema = z.object({
  email: z.string().trim().min(1, 'Informe seu email.').email('Email inválido.'),
  lgpdOptin: z.boolean(),
  context: z.record(z.string(), z.unknown()).nullable().optional(),
})

export type LeadActionResult =
  | { ok: true }
  | { ok: false; error: string }

/**
 * Server Action do Lead Magnet (MKT-001-1).
 * Valida email com zod e persiste em `leads` via service role.
 * Captura User-Agent server-side para analytics simples (sem PII extra).
 */
export async function captureLeadAction(input: unknown): Promise<LeadActionResult> {
  const parsed = leadInputSchema.safeParse(input)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { ok: false, error: first?.message ?? 'Dados inválidos.' }
  }

  if (!parsed.data.lgpdOptin) {
    return {
      ok: false,
      error: 'Para te enviarmos o resultado, precisamos do seu aceite de uso de email.',
    }
  }

  const headersList = await headers()
  const userAgent = headersList.get('user-agent')

  return saveLead({
    email: parsed.data.email,
    source: 'lead-magnet',
    context: parsed.data.context ?? null,
    lgpdOptin: parsed.data.lgpdOptin,
    userAgent,
  })
}
