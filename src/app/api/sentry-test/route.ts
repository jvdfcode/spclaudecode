import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

// Rota temporária para verificar AC5 — remover após confirmar evento no dashboard
export async function GET() {
  Sentry.captureMessage('SmartPreço — teste de integração Sentry', 'info')
  return NextResponse.json({ ok: true, message: 'Evento enviado ao Sentry' })
}
