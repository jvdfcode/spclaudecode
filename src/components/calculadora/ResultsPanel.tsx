'use client'

import { useState } from 'react'
import { CircleAlert, CircleCheckBig, CircleX, ChevronDown, ChevronUp } from 'lucide-react'
import type { ViabilityResult } from '@/types'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import CostBreakdownTable from './CostBreakdownTable'
import { ProfitabilityBadge } from '@/components/ui/ProfitabilityBadge'
import { ResultCard } from '@/components/ui/ResultCard'

interface Props {
  result: ViabilityResult
}

const cfg = {
  viable: {
    hint: 'Boa margem! Este produto é lucrativo nas condições informadas.',
    barColor: 'bg-profit-500',
    metricTone: 'profit' as const,
    metricColor: 'text-profit-500',
  },
  attention: {
    hint: 'Margem baixa. Qualquer variação de custo pode tornar inviável.',
    barColor: 'bg-warn-500',
    metricTone: 'warn' as const,
    metricColor: 'text-warn-500',
  },
  not_viable: {
    hint: 'Prejuízo nesse preço. Veja o Preço Mínimo Viável abaixo.',
    barColor: 'bg-loss-500',
    metricTone: 'loss' as const,
    metricColor: 'text-loss-500',
  },
}

export default function ResultsPanel({ result }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const { metrics, classification, costBreakdown, input } = result
  const c = cfg[classification]

  // Barra de margem: 0–50% mapeado para 0–100%
  const marginBarPct = Math.max(0, Math.min(100, (metrics.marginPercent / 50) * 100))
  const isNotViable = classification === 'not_viable'
  const gapToViable = metrics.priceGapToViable

  return (
    <div className="rounded-[28px] border border-paper-200 overflow-hidden shadow-[0_16px_40px_rgba(45,50,119,0.08)] bg-white">
      {/* Barra gradiente + cabeçalho */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#FFE600_0%,#2D3277_100%)]" />
      <div className="relative px-6 pt-6 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-ink-700">
              Resultado da análise
            </p>
            <p className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-ink-950">
              {c.hint}
            </p>
          </div>
          <ProfitabilityBadge classification={classification} />
        </div>

        {/* Barra de margem */}
        <div className="mt-5">
          <div className="flex justify-between text-[11px] mb-2 font-medium">
            <span className="text-loss-500">Inviável &lt;0%</span>
            <span className="text-warn-500">Atenção 10–19%</span>
            <span className="text-profit-500">Viável ≥20%</span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-paper-100 overflow-hidden border border-paper-200">
            <div className="absolute inset-0 flex">
              <div className="w-[40%] bg-loss-50" />
              <div className="w-[20%] bg-warn-50" />
              <div className="w-[40%] bg-profit-50" />
            </div>
            <div className="absolute top-0 bottom-0 w-px bg-white/80" style={{ left: '40%' }} />
            <div className="absolute top-0 bottom-0 w-px bg-white/80" style={{ left: '60%' }} />
            <div
              className={cn('absolute top-0.5 h-2 w-2 rounded-full -translate-x-1/2 ring-2 ring-white shadow-md', c.barColor)}
              style={{ left: `${marginBarPct}%` }}
            />
          </div>
          <p className={cn('mt-3 text-center text-2xl font-extrabold tabular-nums tracking-[-0.02em]', c.metricColor)}>
            {formatPercent(metrics.marginPercent)} de margem
          </p>
        </div>
      </div>

      {/* Grid de métricas */}
      <div className="px-6 pb-5">
        <div className="grid grid-cols-3 gap-3">
          <ResultCard
            label="Lucro"
            value={formatBRL(metrics.profit)}
            tone={metrics.profit < 0 ? 'loss' : c.metricTone}
            compact
            footer={`ROI: ${formatPercent(metrics.roiPercent)}`}
          />
          <ResultCard
            label="Custo Total"
            value={formatBRL(costBreakdown.total)}
            compact
            footer="CMV + ML + impostos"
          />
          <ResultCard
            label="Preço Break-even"
            value={formatBRL(metrics.minimumViablePrice)}
            compact
            footer="Lucro = R$0,00"
          />
        </div>
      </div>

      {/* Preços de referência */}
      <div className="mx-6 mb-5 rounded-[20px] border border-paper-200 divide-y divide-paper-200 overflow-hidden">
        <PriceLine
          label="Preço Mínimo Viável"
          hint="Menor preço que cobre todos os custos"
          value={formatBRL(metrics.minimumViablePrice)}
        />
        <PriceLine
          label="Preço Recomendado"
          hint={`Para atingir ${formatPercent(input.targetMargin * 100)} de margem`}
          value={formatBRL(metrics.recommendedPrice)}
          emphasized
        />
      </div>

      {/* Break-even mensal (quando houver custo fixo) */}
      {metrics.breakEvenUnits !== null && (
        <div className="mx-6 mb-5 rounded-[20px] border border-[#cfd4ff] bg-[#eef0fb] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink-950">Break-even mensal</p>
              <p className="text-xs text-ink-700 mt-0.5">
                Unidades para cobrir R${input.monthlyFixedCost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de custo fixo
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-ink-950 tabular-nums">{metrics.breakEvenUnits}</p>
              <p className="text-xs text-ink-700">unidades/mês</p>
            </div>
          </div>
        </div>
      )}

      {/* Alerta inviável */}
      {isNotViable && gapToViable > 0 && (
        <div className="mx-6 mb-5 rounded-[20px] bg-loss-50 border border-loss-200 p-4">
          <p className="text-sm font-bold text-loss-500">Para ser viável, aumente o preço em:</p>
          <p className="text-2xl font-extrabold text-loss-500 mt-1 tabular-nums">{formatBRL(gapToViable)}</p>
          <p className="text-xs text-loss-500/70 mt-1">
            {formatBRL(input.salePrice)} atual → mínimo {formatBRL(metrics.minimumViablePrice)}
          </p>
        </div>
      )}

      {/* Detalhamento de custos */}
      <div className="px-6 pb-6">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full rounded-[16px] border border-paper-200 py-2.5 text-sm text-ink-700 hover:bg-paper-100 hover:text-ink-950 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          {showBreakdown ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showBreakdown ? 'Ocultar' : 'Ver'} detalhamento de custos
        </button>
        {showBreakdown && (
          <div className="mt-4">
            <CostBreakdownTable breakdown={costBreakdown} />
          </div>
        )}
      </div>
    </div>
  )
}

function PriceLine({ label, hint, value, emphasized }: {
  label: string; hint: string; value: string; emphasized?: boolean
}) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 gap-4', emphasized && 'bg-[#eef0fb]')}>
      <div className="min-w-0">
        <p className={cn('text-sm', emphasized ? 'font-bold text-ink-950' : 'font-medium text-ink-700')}>
          {label}
        </p>
        <p className="text-xs text-ink-500 truncate">{hint}</p>
      </div>
      <span className={cn(
        'text-sm tabular-nums shrink-0',
        emphasized ? 'font-extrabold text-ink-950 text-base' : 'font-semibold text-ink-900',
      )}>
        {value}
      </span>
    </div>
  )
}
