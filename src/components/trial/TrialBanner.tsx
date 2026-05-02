'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TrialStatus {
  active: boolean
  daysRemaining: number | null
  expiresAt: string | null
  variant: string | null
  expired: boolean
  converted: boolean
}

/**
 * Banner pequeno mostrando dias restantes de trial. Renderiza apenas quando:
 * - Usuário tem trial ativo (não expirado, não convertido)
 * - daysRemaining > 0
 *
 * Não-bloqueante: erro de fetch é silencioso (banner some). Story VIAB-R3-1.
 */
export default function TrialBanner() {
  const [status, setStatus] = useState<TrialStatus | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/trial/status', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!cancelled && data) setStatus(data as TrialStatus)
      })
      .catch(() => {
        // Silencioso — banner é cosmético
      })
    return () => { cancelled = true }
  }, [])

  if (!status?.active || status.daysRemaining === null || status.daysRemaining <= 0) {
    return null
  }

  const isLastDays = status.daysRemaining <= 3
  const bgClass = isLastDays
    ? 'bg-halo-orange-15 border-halo-orange'
    : 'bg-halo-navy-10 border-halo-navy-20'

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-xs ${bgClass}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-halo-navy">
        <strong>Trial Pro:</strong>{' '}
        {status.daysRemaining === 1 ? '1 dia restante' : `${status.daysRemaining} dias restantes`}
        {isLastDays && ' — não perca o acesso completo'}
      </span>
      <Link
        href="/precos"
        className="rounded-lg bg-halo-navy px-3 py-1.5 text-xs font-extrabold text-halo-orange hover:-translate-y-px transition-transform"
      >
        Continuar como Pro
      </Link>
    </div>
  )
}
