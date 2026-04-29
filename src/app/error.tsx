'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error, {
      tags: { source: 'global-error-boundary' },
      extra: { digest: error.digest },
    })
    console.error('[SmartPreço] Erro global:', error.digest ?? 'sem digest')
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-5xl" aria-hidden="true">⚠️</p>
        <h1 className="text-xl font-bold text-ink-950">Algo deu errado</h1>
        <p className="text-sm text-ink-700">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={reset}
            className="rounded-[12px] bg-ink-950 px-5 py-2.5 text-sm font-semibold text-gold-400 hover:opacity-90 transition-opacity"
          >
            Tentar novamente
          </button>
          <a
            href="/dashboard"
            className="rounded-[12px] border border-paper-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-paper-100 transition-colors"
          >
            Ir ao Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
