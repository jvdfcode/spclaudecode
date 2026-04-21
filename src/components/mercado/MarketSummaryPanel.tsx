import type { MarketSummary, PositionBadge } from '@/types'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

const positionCfg: Record<PositionBadge, { label: string; desc: string; bg: string; text: string; border: string }> = {
  below:   { label: 'Abaixo do mercado',  desc: 'Preço menor que 75% da concorrência',  bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  aligned: { label: 'Alinhado ao mercado',desc: 'Preço competitivo (P25–P75)',           bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
  above:   { label: 'Acima do mercado',   desc: 'Preço maior que 75% da concorrência',  bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
}

interface Props {
  summary: MarketSummary
  totalRaw: number
  fullCount: number
  positionBadge: PositionBadge | null
  salePrice: number | null
}

export default function MarketSummaryPanel({ summary, totalRaw, fullCount, positionBadge, salePrice }: Props) {
  const pos = positionBadge ? positionCfg[positionBadge] : null
  const confidence = totalRaw > 0 ? Math.round((summary.cleanListings / totalRaw) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Índice de confiança */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Base limpa</p>
            <p className="text-lg font-bold text-gray-900">
              {summary.cleanListings} <span className="text-sm font-normal text-gray-400">de {totalRaw} anúncios</span>
            </p>
          </div>
          <div className="text-right">
            <p className={cn(
              'text-2xl font-bold tabular-nums',
              confidence >= 70 ? 'text-green-600' : confidence >= 40 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {confidence}%
            </p>
            <p className="text-xs text-gray-400">confiança</p>
          </div>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', confidence >= 70 ? 'bg-green-500' : confidence >= 40 ? 'bg-yellow-500' : 'bg-red-500')}
            style={{ width: `${confidence}%` }}
          />
        </div>
        {fullCount > 0 && (
          <p className="mt-2 text-xs text-gray-400">{fullCount} anúncio{fullCount !== 1 ? 's' : ''} com Mercado Envios Full</p>
        )}
      </div>

      {/* Métricas de preço */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <PriceMetric label="Mínimo"  value={summary.minPrice}    sub="menor preço" />
        <PriceMetric label="Mediana" value={summary.medianPrice} sub="preço típico" accent />
        <PriceMetric label="Média"   value={summary.avgPrice}    sub="preço médio" />
        <PriceMetric label="Máximo"  value={summary.maxPrice}    sub="maior preço" />
      </div>

      {/* Badge de posicionamento */}
      {pos && salePrice !== null && (
        <div className={cn('rounded-xl border p-4 flex items-start gap-3', pos.bg, pos.border)}>
          <div className="flex-1">
            <p className={cn('text-sm font-bold', pos.text)}>{pos.label}</p>
            <p className={cn('text-xs mt-0.5', pos.text, 'opacity-80')}>{pos.desc}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Seu preço</p>
            <p className={cn('text-base font-bold tabular-nums', pos.text)}>{formatBRL(salePrice)}</p>
            {summary.medianPrice > 0 && (
              <p className="text-xs text-gray-400">
                {salePrice > summary.medianPrice ? '+' : ''}{formatPercent(((salePrice - summary.medianPrice) / summary.medianPrice) * 100)} da mediana
              </p>
            )}
          </div>
        </div>
      )}

      {/* Faixa P25–P75 */}
      {summary.cleanListings > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <p className="text-xs text-gray-500 mb-2">Faixa competitiva (P25–P75)</p>
          <p className="text-sm font-semibold text-gray-800">
            {formatBRL(summary.p25Price)} <span className="text-gray-400 font-normal">até</span> {formatBRL(summary.p75Price)}
          </p>
        </div>
      )}
    </div>
  )
}

function PriceMetric({ label, value, sub, accent }: { label: string; value: number; sub: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-3 text-center">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className={cn('text-sm font-bold tabular-nums mt-0.5', accent ? 'text-blue-700' : 'text-gray-800')}>
        {formatBRL(value)}
      </p>
      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  )
}
