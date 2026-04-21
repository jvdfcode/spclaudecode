'use client'

import { useState } from 'react'
import type { ViabilityResult } from '@/types'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import CostBreakdownTable from './CostBreakdownTable'

interface Props {
  result: ViabilityResult
}

const cfg = {
  viable: {
    label: 'Viável',
    icon: '✓',
    border: 'border-green-300',
    headerBg: 'bg-green-500',
    metricColor: 'text-green-700',
    badgeBg: 'bg-green-100 text-green-800',
    barColor: 'bg-green-500',
    hint: 'Boa margem! Este produto é lucrativo nas condições informadas.',
  },
  attention: {
    label: 'Atenção',
    icon: '!',
    border: 'border-yellow-300',
    headerBg: 'bg-yellow-400',
    metricColor: 'text-yellow-700',
    badgeBg: 'bg-yellow-100 text-yellow-800',
    barColor: 'bg-yellow-400',
    hint: 'Margem baixa. Qualquer variação de custo pode tornar inviável.',
  },
  not_viable: {
    label: 'Não Viável',
    icon: '✗',
    border: 'border-red-300',
    headerBg: 'bg-red-500',
    metricColor: 'text-red-700',
    badgeBg: 'bg-red-100 text-red-800',
    barColor: 'bg-red-500',
    hint: 'Prejuízo nesse preço. Veja o Preço Mínimo Viável abaixo.',
  },
}

export default function ResultsPanel({ result }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const { metrics, classification, costBreakdown, input } = result
  const c = cfg[classification]

  // Barra de margem: mapeia -30% → 0% e 0% → 30% ao visual 0-100
  const marginBarPct = Math.max(0, Math.min(100, ((metrics.marginPercent + 10) / 50) * 100))
  const isNotViable = classification === 'not_viable'
  const gapToViable = metrics.minimumViablePrice - input.salePrice

  return (
    <div className={cn('rounded-xl border-2 overflow-hidden shadow-sm', c.border)}>
      {/* Header colorido */}
      <div className={cn('px-5 py-3 flex items-center justify-between', c.headerBg)}>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/30 text-white font-bold text-sm">
            {c.icon}
          </span>
          <span className="font-bold text-white text-base">{c.label}</span>
        </div>
        <span className="text-white/80 text-sm">{c.hint}</span>
      </div>

      <div className="bg-white p-5 space-y-5">
        {/* Barra de margem */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Não viável (&lt;10%)</span>
            <span>Atenção (10–19%)</span>
            <span>Viável (≥20%)</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden relative">
            {/* Faixas de fundo */}
            <div className="absolute inset-0 flex">
              <div className="w-[40%] bg-red-100" />
              <div className="w-[20%] bg-yellow-100" />
              <div className="w-[40%] bg-green-100" />
            </div>
            {/* Marcadores de threshold */}
            <div className="absolute top-0 bottom-0 border-l-2 border-white/80" style={{ left: '40%' }} />
            <div className="absolute top-0 bottom-0 border-l-2 border-white/80" style={{ left: '60%' }} />
            {/* Indicador */}
            <div
              className={cn('absolute top-1 bottom-1 w-2.5 h-1.5 rounded-full -translate-x-1/2 ring-2 ring-white shadow', c.barColor)}
              style={{ left: `${marginBarPct}%` }}
            />
          </div>
          <p className={cn('mt-1.5 text-center text-lg font-bold', c.metricColor)}>
            Margem: {formatPercent(metrics.marginPercent)}
          </p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCard
            label="Lucro"
            value={formatBRL(metrics.profit)}
            hint="Receita − Custos totais"
            highlight={c.metricColor}
            negative={metrics.profit < 0}
          />
          <MetricCard
            label="ROI"
            value={formatPercent(metrics.roiPercent)}
            hint="Retorno sobre o custo"
            negative={metrics.roiPercent < 0}
          />
          <MetricCard
            label="Custo Total"
            value={formatBRL(costBreakdown.total)}
            hint="Tudo que você paga"
          />
        </div>

        {/* Preços de referência */}
        <div className="rounded-lg bg-gray-50 border border-gray-100 divide-y divide-gray-100">
          <PriceLine
            label="Preço Mínimo Viável"
            hint="Onde a margem = 0%"
            value={formatBRL(metrics.minimumViablePrice)}
          />
          <PriceLine
            label="Preço Recomendado"
            hint={`Para atingir ${formatPercent(input.targetMargin * 100)} de margem`}
            value={formatBRL(metrics.recommendedPrice)}
            emphasized
          />
          <PriceLine
            label="Break-even"
            hint="Cobre os custos exatos"
            value={formatBRL(metrics.breakEvenPrice)}
          />
        </div>

        {/* Alerta quando não viável */}
        {isNotViable && gapToViable > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm">
            <p className="font-semibold text-red-700">Para ser viável, aumente o preço em</p>
            <p className="text-2xl font-bold text-red-800 mt-0.5">{formatBRL(gapToViable)}</p>
            <p className="text-red-500 text-xs mt-1">
              Preço atual: {formatBRL(input.salePrice)} → Mínimo: {formatBRL(metrics.minimumViablePrice)}
            </p>
          </div>
        )}

        {/* Detalhamento de custos */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full rounded-lg border border-gray-200 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          {showBreakdown ? '▲ Ocultar' : '▼ Ver'} detalhamento de custos
        </button>
        {showBreakdown && <CostBreakdownTable breakdown={costBreakdown} />}
      </div>
    </div>
  )
}

function MetricCard({
  label, value, hint, highlight, negative,
}: {
  label: string; value: string; hint: string; highlight?: string; negative?: boolean
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
      <p className="text-xs text-gray-400 truncate">{label}</p>
      <p className={cn(
        'text-base font-bold mt-0.5 truncate',
        negative ? 'text-red-600' : (highlight ?? 'text-gray-900')
      )}>
        {value}
      </p>
      <p className="text-xs text-gray-300 mt-0.5 leading-tight">{hint}</p>
    </div>
  )
}

function PriceLine({ label, hint, value, emphasized }: {
  label: string; hint: string; value: string; emphasized?: boolean
}) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3', emphasized && 'bg-blue-50')}>
      <div>
        <p className={cn('text-sm', emphasized ? 'font-semibold text-gray-800' : 'text-gray-600')}>{label}</p>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>
      <span className={cn('text-sm tabular-nums', emphasized ? 'font-bold text-blue-700 text-base' : 'font-medium text-gray-700')}>
        {value}
      </span>
    </div>
  )
}
