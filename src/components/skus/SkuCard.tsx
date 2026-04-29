import Link from 'next/link'
import type { SkuWithLatestCalc } from '@/types/sku'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import SkuCardMenu from './SkuCardMenu'

const statusCfg = {
  viable:    { label: 'Viável',     bg: 'bg-profit-50',   text: 'text-profit-500', border: 'border-profit-200',   dot: 'bg-profit-500' },
  attention: { label: 'Atenção',    bg: 'bg-warn-50',     text: 'text-warn-500',   border: 'border-warn-200',     dot: 'bg-gold-400'   },
  not_viable:{ label: 'Não viável', bg: 'bg-loss-50',     text: 'text-loss-500',   border: 'border-loss-200',     dot: 'bg-loss-500'   },
  draft:     { label: 'Rascunho',   bg: 'bg-paper-100',   text: 'text-ink-700',    border: 'border-paper-200',    dot: 'bg-ink-500'    },
  for_sale:  { label: 'À venda',    bg: 'bg-primary-50',  text: 'text-ink-950',    border: 'border-primary-100',  dot: 'bg-ink-950'    },
}

interface Props {
  sku: SkuWithLatestCalc
}

export default function SkuCard({ sku }: Props) {
  const s = statusCfg[sku.status]
  const calc = sku.latestCalculation
  const margin = calc?.marginPercent ?? null
  const price  = calc?.salePrice ?? null

  return (
    <div className={cn(
      'relative rounded-[20px] border-2 bg-white p-4 space-y-3 hover:shadow-md transition-shadow',
      s.border
    )}>
      <div className="flex items-start justify-between gap-2">
        <Link href={`/skus/${sku.id}`} className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 hover:text-halo-navy transition-colors">
            {sku.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', s.bg, s.text)}>
            <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
            {s.label}
          </span>
          <SkuCardMenu id={sku.id} name={sku.name} notes={sku.notes} />
        </div>
      </div>

      <Link href={`/skus/${sku.id}`} className="block">
        {calc ? (
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Margem" value={margin !== null ? formatPercent(margin) : '—'} accent={s.text} />
            <Metric label="Preço de venda" value={price !== null ? formatBRL(price) : '—'} />
          </div>
        ) : (
          <p className="text-xs text-ink-500">Sem cálculo registrado</p>
        )}

        {sku.notes && (
          <p className="text-xs text-ink-500 line-clamp-1 mt-2">{sku.notes}</p>
        )}

        <p className="text-[11px] text-ink-500 mt-2">
          {new Date(sku.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
        </p>
      </Link>
    </div>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-[12px] bg-paper-100 p-2 text-center">
      <p className="text-[10px] text-ink-500">{label}</p>
      <p className={cn('text-sm font-bold tabular-nums mt-0.5', accent ?? 'text-ink-900')}>{value}</p>
    </div>
  )
}
