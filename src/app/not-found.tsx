import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Página não encontrada' }

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-sm">
        <p className="text-5xl" aria-hidden="true">🔍</p>
        <h1 className="text-xl font-bold text-gray-800">Página não encontrada</h1>
        <p className="text-sm text-gray-500">
          O endereço que você acessou não existe ou foi removido.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Ir para o Dashboard
        </Link>
      </div>
    </div>
  )
}
