import type { Metadata } from 'next'
import Link from 'next/link'
import { listSkus } from '@/lib/supabase/skus'
import SkuCard from '@/components/skus/SkuCard'
import SkuFilters from '@/components/skus/SkuFilters'
import type { SkuStatus } from '@/types/sku'
import { WorkspaceNav } from '@/components/layout/WorkspaceNav'
import { PageHeader } from '@/components/layout/PageHeader'

export const metadata: Metadata = { title: 'Meus SKUs' }

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>
}

export default async function SkusPage({ searchParams }: Props) {
  const { status, q } = await searchParams

  let skus = await listSkus().catch(() => [])

  if (status && status !== 'all') {
    skus = skus.filter(s => s.status === (status as SkuStatus))
  }
  if (q) {
    const lower = q.toLowerCase()
    skus = skus.filter(s => s.name.toLowerCase().includes(lower))
  }

  return (
    <div className="space-y-0">
      <WorkspaceNav />
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            eyebrow="SmartPreço · Portfólio"
            title="Meus SKUs"
            description="Portfólio de produtos calculados com status de viabilidade e histórico de análises."
          />
          <a
            href="/calculadora"
            className="btn-genie shrink-0 inline-flex items-center justify-center gap-2 rounded-[14px] bg-ink-950 px-4 py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(45,50,119,0.28)] hover:shadow-[0_6px_20px_rgba(45,50,119,0.36)] transition-all duration-[220ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-[2px] active:scale-[0.96] mt-6"
          >
            + Nova Análise
          </a>
        </div>

        <SkuFilters total={skus.length} />

        {skus.length === 0 ? (
          <EmptySkus hasFilter={!!(status && status !== 'all') || !!q} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {skus.map(sku => (
              <SkuCard key={sku.id} sku={sku} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptySkus({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-paper-200 bg-white py-16 text-center gap-4">
      <span className="text-5xl">📦</span>
      {hasFilter ? (
        <>
          <p className="text-sm font-bold text-ink-950">Nenhum SKU encontrado com esses filtros</p>
          <p className="text-xs text-ink-700">Tente ajustar o filtro de status ou a busca</p>
        </>
      ) : (
        <>
          <p className="text-sm font-bold text-ink-950">Nenhum produto salvo ainda</p>
          <p className="text-xs text-ink-700 max-w-xs">
            Use a calculadora para analisar um produto e clique em &ldquo;Salvar como SKU&rdquo;
          </p>
          <Link
            href="/calculadora"
            className="mt-2 rounded-[12px] bg-ink-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-ink-900 transition-colors"
          >
            Ir para a Calculadora
          </Link>
        </>
      )}
    </div>
  )
}
