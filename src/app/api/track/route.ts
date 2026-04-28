import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import { createServiceSupabase } from '@/lib/supabase/server'

/**
 * Endpoint interno de tracking (Story MKT-001-5).
 * Recebe eventos do funil enviados via `navigator.sendBeacon` por
 * `src/lib/analytics/events.ts`. Persiste em `funnel_events` (migration
 * 011) sem exigir auth — eventos pré-cadastro precisam funcionar
 * anonimamente.
 *
 * NÃO logga PII além do que o cliente enviou; se o cliente mandar email
 * no payload, ele só é persistido junto se for explícito (lead_captured
 * já usa a tabela `leads`).
 */

const trackInputSchema = z.object({
  name: z.string().min(1).max(80),
  payload: z.record(z.string(), z.unknown()).optional().default({}),
  ts: z.number().int().positive(),
})

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const parsed = trackInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'invalid_payload' }, { status: 400 })
  }

  const supabase = createServiceSupabase()
  const userAgent = req.headers.get('user-agent')
  const referer = req.headers.get('referer')

  const { error } = await supabase.from('funnel_events').insert({
    name: parsed.data.name,
    payload: parsed.data.payload,
    ts_client: new Date(parsed.data.ts).toISOString(),
    user_agent: userAgent,
    referer,
  })

  if (error) {
    Sentry.captureException(error, {
      tags: { source: 'api/track', event: parsed.data.name },
    })
    console.error(JSON.stringify({ ts: Date.now(), msg: 'track insert error', error: error.message }))
  }

  // sempre 204 — analytics não pode bloquear o usuário, mesmo se DB falhar
  return new NextResponse(null, { status: 204 })
}
