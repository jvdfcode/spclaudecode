import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSkuById } from '@/lib/supabase/skus'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import type { SkuCalculation } from '@/types/sku'
import RecalcularButton from '@/components/skus/RecalcularButton'
import SkuCardMenu from '@/components/skus/SkuCardMenu'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const sku = await getSkuById(id).catch(() => null)
  return { title: sku ? `${sku.name} — SmartPreço` : 'SKU — SmartPreço' }
}

const statusCfg = {
  viable:    { label: 'Viável',     bg: 'bg-green-100',  text: 'text-green-700'  },
  attention: { label: 'Atenção',    bg: 'bg-yellow-100', text: 'text-yellow-700' },
  not_viable:{ label: 'Não viável', bg: 'bg-red-100',    text: 'text-red-700'    },
  draft:     { label: 'Rascunho',   bg: 'bg-gray-100',   text: 'text-gray-600'   },
  for_sale:  { label: 'À venda',    bg: 'bg-blue-100',   text: 'text-blue-700'   },
}

const listingLabel: Record<string, string> = {
  free: 'Gratuito', classic: 'Clássico', premium: 'Premium',
}

export default async function SkuDetailPage({ params }: Props) {
  const { id } = await params
  const sku = await getSkuById(id).catch(() => null)
  if (!sku) notFound()

  const s = statusCfg[sku.status]

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Navegação */}
      <Link href="/skus" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        ← Meus SKUs
      </Link>

      {/* Cabeçalho */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900">{sku.name}</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', s.bg, s.text)}>
              {s.label}
            </span>
            <SkuCardMenu id={sku.id} name={sku.name} notes={sku.notes} redirectOnDelete="/skus" />
          </div>
        </div>
        {sku.notes && <p className="text-sm text-gray-500">{sku.notes}</p>}
        <p className="text-xs text-gray-400">
          Criado em {new Date(sku.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>

        {/* Botão recalcular — pré-preenche calculadora com dados do último cálculo */}
        {sku.calculations[0] && (
          <RecalcularButton costData={sku.calculations[0].costData} />
        )}
      </div>

      {/* Histórico */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Histórico de cálculos <span className="font-normal text-gray-400">({sku.calculations.length})</span>
        </h2>

        {sku.calculations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
            Nenhum cálculo registrado
          </div>
        ) : (
          <div className="space-y-3">
            {sku.calculations.map((calc, idx) => (
              <CalcRow key={calc.id} calc={calc} isLatest={idx === 0} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CalcRow({ calc, isLatest }: { calc: SkuCalculation; isLatest: boolean }) {
  const margin = calc.marginPercent
  const marginColor = margin === null ? 'text-gray-500'
    : margin >= 20 ? 'text-green-700'
    : margin >= 10 ? 'text-yellow-700'
    : 'text-red-700'

  return (
    <div className={cn(
      'rounded-xl border bg-white p-4',
      isLatest ? 'border-blue-200 shadow-sm' : 'border-gray-100'
    )}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {isLatest && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                Mais recente
              </span>
            )}
            <span className="text-xs text-gray-400">
              {new Date(calc.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Anúncio: <span className="font-medium text-gray-700">{listingLabel[calc.listingType] ?? calc.listingType}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-[10px] text-gray-400">Preço</p>
              <p className="text-sm font-semibold text-gray-800 tabular-nums">{formatBRL(calc.salePrice)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Margem</p>
              <p className={cn('text-sm font-bold tabular-nums', marginColor)}>
                {margin !== null ? formatPercent(margin) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">ROI</p>
              <p className="text-sm font-medium text-gray-600 tabular-nums">
                {calc.roiPercent !== null ? formatPercent(calc.roiPercent) : '—'}
              </p>
            </div>
          </div>
          {!isLatest && (
            <RecalcularButton costData={calc.costData} label="Usar" />
          )}
        </div>
      </div>
    </div>
  )
}
