'use client'

import { useState } from 'react'
import type { ViabilityResult } from '@/types'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import CostBreakdownTable from './CostBreakdownTable'

interface Props {
  result: ViabilityResult
}

const classificationConfig = {
  viable: {
    label: 'Viável',
    bg: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-800',
    text: 'text-green-700',
  },
  attention: {
    label: 'Atenção',
    bg: 'bg-yellow-50 border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
    text: 'text-yellow-700',
  },
  not_viable: {
    label: 'Não Viável',
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-800',
    text: 'text-red-700',
  },
}

export default function ResultsPanel({ result }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const { metrics, classification, costBreakdown } = result
  const cfg = classificationConfig[classification]

  return (
    <div className={cn('rounded-xl border-2 p-5 space-y-4', cfg.bg)}>
      {/* Badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Resultado</h2>
        <span className={cn('rounded-full px-3 py-1 text-sm font-bold', cfg.badge)}>
          {cfg.label}
        </span>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Lucro" value={formatBRL(metrics.profit)} highlight={cfg.text} />
        <Metric label="Margem" value={formatPercent(metrics.marginPercent)} highlight={cfg.text} />
        <Metric label="ROI" value={formatPercent(metrics.roiPercent)} />
        <Metric label="Custo Total" value={formatBRL(costBreakdown.total)} />
      </div>

      {/* Preços calculados */}
      <div className="rounded-lg bg-white/60 p-3 space-y-2">
        <PriceLine label="Preço Mínimo Viável" value={formatBRL(metrics.minimumViablePrice)} />
        <PriceLine label="Preço Recomendado" value={formatBRL(metrics.recommendedPrice)} emphasized />
        <PriceLine label="Break-even" value={formatBRL(metrics.breakEvenPrice)} />
      </div>

      {/* Detalhamento */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        {showBreakdown ? 'Ocultar' : 'Ver'} detalhamento de custos
      </button>
      {showBreakdown && <CostBreakdownTable breakdown={costBreakdown} />}
    </div>
  )
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="rounded-lg bg-white/70 p-3">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={cn('text-lg font-bold text-gray-900', highlight)}>{value}</p>
    </div>
  )
}

function PriceLine({ label, value, emphasized }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className={cn('text-sm', emphasized ? 'font-semibold text-gray-800' : 'text-gray-500')}>
        {label}
      </span>
      <span className={cn('text-sm', emphasized ? 'font-bold text-gray-900' : 'text-gray-700')}>
        {value}
      </span>
    </div>
  )
}
