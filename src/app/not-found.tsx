import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Página não encontrada' }

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-5xl" aria-hidden="true">🔍</p>
        <h1 className="text-xl font-bold text-ink-950">Página não encontrada</h1>
        <p className="text-sm text-ink-700">
          O endereço que você acessou não existe ou foi removido.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-[12px] bg-ink-950 px-6 py-2.5 text-sm font-semibold text-gold-400 hover:opacity-90 transition-opacity"
        >
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  )
}
