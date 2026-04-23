import type { Metadata } from 'next'
import Link from 'next/link'
import { listSkus } from '@/lib/supabase/skus'
import SkuCard from '@/components/skus/SkuCard'
import SkuFilters from '@/components/skus/SkuFilters'
import type { SkuStatus } from '@/types/sku'

export const metadata: Metadata = {
  title: 'Meus SKUs',
}

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function SkusPage({ searchParams }: Props) {
  const { status, q } = await searchParams

  let skus = await listSkus().catch(() => [])

  // Filtro por status
  if (status && status !== 'all') {
    skus = skus.filter(s => s.status === (status as SkuStatus))
  }

  // Filtro por nome
  if (q) {
    const lower = q.toLowerCase()
    skus = skus.filter(s => s.name.toLowerCase().includes(lower))
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus SKUs</h1>
          <p className="mt-1 text-sm text-gray-500">Portfólio de produtos calculados</p>
        </div>
        <a
          href="/calculadora"
          className="btn-genie inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-[0_2px_14px_rgba(79,70,229,0.32)] hover:shadow-[0_5px_22px_rgba(79,70,229,0.44)] border border-indigo-500/25 transition-all duration-[220ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-[2px] active:scale-[0.96] active:translate-y-0"
        >
          + Novo cálculo
        </a>
      </div>

      {/* Filtros */}
      <SkuFilters total={skus.length} />

      {/* Grid ou estado vazio */}
      {skus.length === 0 ? (
        <EmptyState hasFilter={!!(status && status !== 'all') || !!q} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skus.map(sku => (
            <SkuCard key={sku.id} sku={sku} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white py-16 text-center gap-4">
      <span className="text-5xl">📦</span>
      {hasFilter ? (
        <>
          <p className="text-sm font-medium text-gray-600">Nenhum SKU encontrado com esses filtros</p>
          <p className="text-xs text-gray-400">Tente ajustar o filtro de status ou a busca</p>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-gray-600">Nenhum produto salvo ainda</p>
          <p className="text-xs text-gray-400">Use a calculadora para analisar um produto e clique em &ldquo;Salvar como SKU&rdquo;</p>
          <Link
            href="/calculadora"
            className="mt-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Ir para a Calculadora
          </Link>
        </>
      )}
    </div>
  )
}
