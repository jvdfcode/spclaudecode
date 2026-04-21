import Link from 'next/link'
import type { SkuWithLatestCalc } from '@/types/sku'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

const statusCfg = {
  viable:    { label: 'Viável',      bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-400' },
  attention: { label: 'Atenção',     bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  not_viable:{ label: 'Não viável',  bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-400'   },
  draft:     { label: 'Rascunho',    bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-200',   dot: 'bg-gray-400'  },
  for_sale:  { label: 'À venda',     bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400'  },
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
    <Link href={`/skus/${sku.id}`} className={cn(
      'block rounded-xl border-2 bg-white p-4 space-y-3 hover:shadow-md transition-shadow',
      s.border
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{sku.name}</h3>
        <span className={cn('flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', s.bg, s.text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} />
          {s.label}
        </span>
      </div>

      {/* Métricas */}
      {calc ? (
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Margem" value={margin !== null ? formatPercent(margin) : '—'} accent={s.text} />
          <Metric label="Preço de venda" value={price !== null ? formatBRL(price) : '—'} />
        </div>
      ) : (
        <p className="text-xs text-gray-400">Sem cálculo registrado</p>
      )}

      {/* Notas */}
      {sku.notes && (
        <p className="text-xs text-gray-400 line-clamp-1">{sku.notes}</p>
      )}

      {/* Data */}
      <p className="text-[11px] text-gray-300">
        {new Date(sku.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>
    </Link>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-2 text-center">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className={cn('text-sm font-bold tabular-nums mt-0.5', accent ?? 'text-gray-700')}>{value}</p>
    </div>
  )
}
