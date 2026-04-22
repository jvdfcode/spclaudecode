'use client'

import { useEffect } from 'react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    // Log para monitoramento futuro (ex: Sentry)
    console.error('[SmartPreço] Erro global:', error.digest ?? 'sem digest')
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-5xl" aria-hidden="true">⚠️</p>
        <h1 className="text-xl font-bold text-gray-800">Algo deu errado</h1>
        <p className="text-sm text-gray-500">
          Ocorreu um erro inesperado. Nossa equipe foi notificada.
        </p>
        <div className="flex justify-center gap-2">
          <button
            onClick={reset}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/dashboard"
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Ir ao Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
