'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'

interface Status {
  connected: boolean
  expiresAt?: string
}

export default function MlConnectButton() {
  const [status, setStatus] = useState<Status | null>(null)
  const [disconnecting, setDisconnecting] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/ml/status')
      .then(r => r.json())
      .then((data: Status) => setStatus(data))
      .catch(() => setStatus({ connected: false }))
  }, [])

  // Feedback após redirect do OAuth
  useEffect(() => {
    if (searchParams.get('ml_connected')) {
      toast.success('Mercado Livre conectado! Buscas agora usam a API oficial.')
      setStatus({ connected: true })
      router.replace('/mercado')
    }
    const err = searchParams.get('ml_error')
    if (err) {
      const msgs: Record<string, string> = {
        cancelled: 'Conexão cancelada.',
        token_failed: 'Falha ao obter token do Mercado Livre.',
        server: 'Erro interno. Tente novamente.',
      }
      toast.error(msgs[err] ?? 'Erro na conexão com o Mercado Livre.')
      router.replace('/mercado')
    }
  }, [searchParams, router])

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      await fetch('/api/auth/ml/disconnect', { method: 'POST' })
      setStatus({ connected: false })
      toast.success('Mercado Livre desconectado.')
    } catch {
      toast.error('Erro ao desconectar. Tente novamente.')
    } finally {
      setDisconnecting(false)
    }
  }

  if (status === null) {
    return (
      <div className="h-9 w-44 animate-pulse rounded-xl bg-gray-100" aria-hidden />
    )
  }

  if (status.connected) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-green-700">ML Conectado</span>
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="ml-1 text-xs text-green-600 underline hover:text-green-800 disabled:opacity-50"
        >
          {disconnecting ? 'Desconectando...' : 'Desconectar'}
        </button>
      </div>
    )
  }

  return (
    <a
      href="/api/auth/ml/connect"
      className="inline-flex items-center gap-2 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800 hover:bg-yellow-100 transition-colors"
    >
      <span>🔗</span>
      Conectar Mercado Livre
    </a>
  )
}
