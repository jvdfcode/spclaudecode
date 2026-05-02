import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createServerSupabase } from '@/lib/supabase/server'
import { TRIAL_DURATION_DAYS, deterministicVariantFromUserId } from '@/lib/pricing-experiment'

/**
 * GET /api/trial/status — retorna estado do trial do usuário autenticado.
 * Response: { active, daysRemaining, expiresAt, variant, expired, converted }
 *
 * POST /api/trial/status — inicia trial (idempotente — se trial já existe,
 * retorna o existente sem criar novo).
 *
 * Story: VIAB-R3-1 (Trial 14d híbrido). Endereça M4 finding.
 */

interface TrialRow {
  user_id: string
  started_at: string
  expires_at: string
  variant: string
  converted_at: string | null
  expired: boolean
}

interface TrialStatus {
  active: boolean
  daysRemaining: number | null
  expiresAt: string | null
  variant: string | null
  expired: boolean
  converted: boolean
}

function computeStatus(row: TrialRow | null): TrialStatus {
  if (!row) {
    return { active: false, daysRemaining: null, expiresAt: null, variant: null, expired: false, converted: false }
  }
  const expiresAt = new Date(row.expires_at)
  const now = new Date()
  const msRemaining = expiresAt.getTime() - now.getTime()
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)))
  const converted = row.converted_at !== null
  const expired = row.expired || (msRemaining <= 0 && !converted)
  return {
    active: !expired && !converted && daysRemaining > 0,
    daysRemaining: expired || converted ? 0 : daysRemaining,
    expiresAt: row.expires_at,
    variant: row.variant,
    expired,
    converted,
  }
}

export async function GET() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('trials')
    .select('user_id, started_at, expires_at, variant, converted_at, expired')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    Sentry.captureException(error, {
      tags: { component: 'trial_status', method: 'GET' },
      extra: { user_id: user.id },
    })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  return NextResponse.json(computeStatus(data as TrialRow | null))
}

export async function POST() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Idempotente: se trial já existe, retorna o existente
  const { data: existing } = await supabase
    .from('trials')
    .select('user_id, started_at, expires_at, variant, converted_at, expired')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(computeStatus(existing as TrialRow))
  }

  const variant = deterministicVariantFromUserId(user.id)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000)

  const { data: created, error } = await supabase
    .from('trials')
    .insert({
      user_id: user.id,
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      variant,
    })
    .select('user_id, started_at, expires_at, variant, converted_at, expired')
    .single()

  if (error) {
    Sentry.captureException(error, {
      tags: { component: 'trial_status', method: 'POST', kind: 'insert_failed' },
      extra: { user_id: user.id, variant },
    })
    return NextResponse.json({ error: 'failed_to_start_trial' }, { status: 500 })
  }

  Sentry.captureMessage('trial_started', {
    level: 'info',
    tags: { component: 'trial_status', method: 'POST' },
    extra: { user_id: user.id, variant, expires_at: expiresAt.toISOString() },
  })

  return NextResponse.json(computeStatus(created as TrialRow))
}
