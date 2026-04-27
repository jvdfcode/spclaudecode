import type { MarketSummary, PositionBadge } from '@/types'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

const positionCfg: Record<PositionBadge, {
  label: string; desc: string; icon: string
  bg: string; text: string; border: string
}> = {
  below:   { label: 'Abaixo do mercado',   desc: 'Preço menor que 75% da concorrência — pode subir',  icon: '⬇️', bg: 'bg-primary-50',  text: 'text-ink-950',    border: 'border-primary-100'  },
  aligned: { label: 'Alinhado ao mercado', desc: 'Preço competitivo — dentro da faixa P25–P75',        icon: '✅', bg: 'bg-profit-50',   text: 'text-profit-500', border: 'border-profit-200'   },
  above:   { label: 'Acima do mercado',    desc: 'Preço maior que 75% da concorrência — revise',       icon: '⬆️', bg: 'bg-warn-50',     text: 'text-warn-500',   border: 'border-warn-200'     },
}

interface Props {
  summary: MarketSummary
  totalRaw: number
  fullCount: number
  positionBadge: PositionBadge | null
  salePrice: number | null
}

export default function MarketSummaryPanel({ summary, totalRaw, fullCount: fullCnt, positionBadge, salePrice }: Props) {
  const pos        = positionBadge ? positionCfg[positionBadge] : null
  const confidence = totalRaw > 0 ? Math.round((summary.cleanListings / totalRaw) * 100) : 0
  const confColor  = confidence >= 70 ? 'text-profit-500' : confidence >= 40 ? 'text-warn-500' : 'text-loss-500'
  const barColor   = confidence >= 70 ? 'bg-profit-500'  : confidence >= 40 ? 'bg-gold-400'   : 'bg-loss-500'

  return (
    <div className="space-y-3">

      {pos && salePrice !== null && (
        <div className={cn('rounded-[20px] border p-4 flex items-center gap-4', pos.bg, pos.border)}>
          <span className="text-2xl shrink-0">{pos.icon}</span>
          <div className="flex-1 min-w-0">
            <p className={cn('text-sm font-bold', pos.text)}>{pos.label}</p>
            <p className={cn('text-xs mt-0.5 opacity-80', pos.text)}>{pos.desc}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-ink-500">Seu preço</p>
            <p className={cn('text-lg font-bold tabular-nums', pos.text)}>{formatBRL(salePrice)}</p>
            {summary.medianPrice > 0 && (
              <p className="text-[10px] text-ink-500">
                {salePrice > summary.medianPrice ? '+' : ''}
                {formatPercent(((salePrice - summary.medianPrice) / summary.medianPrice) * 100)} da mediana
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <PriceMetric label="Mínimo"  value={summary.minPrice}    sub="menor preço" />
        <PriceMetric label="Mediana" value={summary.medianPrice} sub="preço típico" accent />
        <PriceMetric label="Média"   value={summary.avgPrice}    sub="preço médio" />
        <PriceMetric label="Máximo"  value={summary.maxPrice}    sub="maior preço" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-[16px] border border-paper-200 bg-paper-100 p-3">
          <p className="text-[10px] text-ink-500 mb-1">Faixa competitiva (P25–P75)</p>
          <p className="text-sm font-semibold text-ink-900">
            {formatBRL(summary.p25Price)} <span className="text-ink-500 font-normal text-xs">até</span> {formatBRL(summary.p75Price)}
          </p>
          {fullCnt > 0 && (
            <p className="text-[10px] text-ink-500 mt-1">{fullCnt} com Mercado Envios Full</p>
          )}
        </div>
        <div className="rounded-[16px] border border-paper-200 bg-paper-100 p-3 flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-ink-500 mb-1">Confiança da base</p>
            <div className="h-1.5 w-full rounded-full bg-paper-200 overflow-hidden">
              <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${confidence}%` }} />
            </div>
          </div>
          <p className={cn('text-xl font-bold tabular-nums shrink-0', confColor)}>{confidence}%</p>
        </div>
      </div>
    </div>
  )
}

function PriceMetric({ label, value, sub, accent }: {
  label: string; value: number; sub: string; accent?: boolean
}) {
  return (
    <div className="rounded-[16px] border border-paper-200 bg-white p-3 text-center">
      <p className="text-[10px] text-ink-500">{label}</p>
      <p className={cn('text-sm font-bold tabular-nums mt-0.5', accent ? 'text-ink-950' : 'text-ink-900')}>
        {formatBRL(value)}
      </p>
      <p className="text-[10px] text-ink-500 mt-0.5">{sub}</p>
    </div>
  )
}
