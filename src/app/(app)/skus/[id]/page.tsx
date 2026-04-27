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
  viable:    { label: 'Viável',     bg: 'bg-profit-50',  text: 'text-profit-500' },
  attention: { label: 'Atenção',    bg: 'bg-warn-50',    text: 'text-warn-500'   },
  not_viable:{ label: 'Não viável', bg: 'bg-loss-50',    text: 'text-loss-500'   },
  draft:     { label: 'Rascunho',   bg: 'bg-paper-100',  text: 'text-ink-700'    },
  for_sale:  { label: 'À venda',    bg: 'bg-primary-50', text: 'text-ink-950'    },
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
      <Link href="/skus" className="inline-flex items-center gap-1.5 text-sm text-ink-700 hover:text-ink-950 transition-colors">
        ← Meus SKUs
      </Link>

      <div className="relative overflow-hidden rounded-[24px] border border-paper-200 bg-white p-6 space-y-3 shadow-[0_8px_24px_rgba(45,50,119,0.06)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#FFE600_0%,#2D3277_100%)]" />
        <div className="flex items-start justify-between gap-3 pt-1">
          <h1 className="text-xl font-extrabold text-ink-950">{sku.name}</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={cn('rounded-full px-3 py-1 text-sm font-semibold', s.bg, s.text)}>
              {s.label}
            </span>
            <SkuCardMenu id={sku.id} name={sku.name} notes={sku.notes} redirectOnDelete="/skus" />
          </div>
        </div>
        {sku.notes && <p className="text-sm text-ink-700">{sku.notes}</p>}
        <p className="text-xs text-ink-500">
          Criado em {new Date(sku.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>

        {sku.calculations[0] && (
          <RecalcularButton costData={sku.calculations[0].costData} />
        )}
      </div>

      <div>
        <h2 className="text-sm font-extrabold text-ink-900 mb-3">
          Histórico de cálculos <span className="font-normal text-ink-500">({sku.calculations.length})</span>
        </h2>

        {sku.calculations.length === 0 ? (
          <div className="rounded-[20px] border-2 border-dashed border-paper-200 p-8 text-center text-sm text-ink-500">
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
  const marginColor = margin === null ? 'text-ink-500'
    : margin >= 20 ? 'text-profit-500'
    : margin >= 10 ? 'text-warn-500'
    : 'text-loss-500'

  return (
    <div className={cn(
      'rounded-[20px] border bg-white p-4',
      isLatest ? 'border-primary-100 shadow-[0_4px_16px_rgba(45,50,119,0.08)]' : 'border-paper-200'
    )}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {isLatest && (
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-ink-950">
                Mais recente
              </span>
            )}
            <span className="text-xs text-ink-500">
              {new Date(calc.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-xs text-ink-700">
            Anúncio: <span className="font-medium text-ink-900">{listingLabel[calc.listingType] ?? calc.listingType}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-right">
            <div>
              <p className="text-[10px] text-ink-500">Preço</p>
              <p className="text-sm font-semibold text-ink-900 tabular-nums">{formatBRL(calc.salePrice)}</p>
            </div>
            <div>
              <p className="text-[10px] text-ink-500">Margem</p>
              <p className={cn('text-sm font-bold tabular-nums', marginColor)}>
                {margin !== null ? formatPercent(margin) : '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-ink-500">ROI</p>
              <p className="text-sm font-medium text-ink-700 tabular-nums">
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
