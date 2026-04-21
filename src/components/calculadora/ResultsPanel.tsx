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
    barColor: 'bg-green-500',
    hint: 'Boa margem! Este produto é lucrativo nas condições informadas.',
  },
  attention: {
    label: 'Atenção',
    icon: '!',
    border: 'border-yellow-300',
    headerBg: 'bg-yellow-400',
    metricColor: 'text-yellow-700',
    barColor: 'bg-yellow-400',
    hint: 'Margem baixa. Qualquer variação de custo pode tornar inviável.',
  },
  not_viable: {
    label: 'Não Viável',
    icon: '✗',
    border: 'border-red-300',
    headerBg: 'bg-red-500',
    metricColor: 'text-red-700',
    barColor: 'bg-red-500',
    hint: 'Prejuízo nesse preço. Veja o Preço Mínimo Viável abaixo.',
  },
}

export default function ResultsPanel({ result }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false)
  const { metrics, classification, costBreakdown, input } = result
  const c = cfg[classification]

  // Barra de margem: 0-50% mapeado para 0-100% da barra
  const marginBarPct = Math.max(0, Math.min(100, (metrics.marginPercent / 50) * 100))
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
        <span className="text-white/80 text-xs text-right max-w-[200px] leading-tight">{c.hint}</span>
      </div>

      <div className="bg-white p-5 space-y-5">

        {/* Barra de margem */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className="text-red-400">Inviável &lt;0%</span>
            <span className="text-yellow-500">Atenção 10–19%</span>
            <span className="text-green-500">Viável ≥20%</span>
          </div>
          <div className="relative h-4 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="w-[40%] bg-red-100" />
              <div className="w-[20%] bg-yellow-100" />
              <div className="w-[40%] bg-green-100" />
            </div>
            <div className="absolute top-0 bottom-0 w-px bg-white/70" style={{ left: '40%' }} />
            <div className="absolute top-0 bottom-0 w-px bg-white/70" style={{ left: '60%' }} />
            <div
              className={cn('absolute top-1 h-2 w-2 rounded-full -translate-x-1/2 ring-2 ring-white shadow-md', c.barColor)}
              style={{ left: `${marginBarPct}%` }}
            />
          </div>
          <p className={cn('mt-2 text-center text-2xl font-bold tabular-nums', c.metricColor)}>
            {formatPercent(metrics.marginPercent)} de margem
          </p>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-3 gap-2.5">
          <MetricCard
            label="Lucro"
            value={formatBRL(metrics.profit)}
            formula={`Preço de venda − Custo total\n= ${formatBRL(input.salePrice)} − ${formatBRL(costBreakdown.total)}`}
            highlight={c.metricColor}
            negative={metrics.profit < 0}
          />
          <MetricCard
            label="ROI"
            value={formatPercent(metrics.roiPercent)}
            formula={`Lucro ÷ Custo total × 100\n= ${formatBRL(metrics.profit)} ÷ ${formatBRL(costBreakdown.total)} × 100`}
            negative={metrics.roiPercent < 0}
          />
          <MetricCard
            label="Custo Total"
            value={formatBRL(costBreakdown.total)}
            formula={`CMV + Comissão ML + Parcelamento\n+ Frete + Embalagem + Imposto\n+ Overhead + Custo fixo ML`}
          />
        </div>

        {/* Preços de referência */}
        <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          <PriceLine
            label="Break-even"
            hint="Preço onde lucro = R$0,00"
            formula={`Custos totais variáveis ÷ (1 − taxas percentuais)\nAbaixo disso você tem prejuízo`}
            value={formatBRL(metrics.breakEvenPrice)}
          />
          <PriceLine
            label="Preço Mínimo Viável"
            hint="Onde a margem = 0%"
            formula={`Menor preço que cobre todos os custos.\nAbaixo = prejuízo`}
            value={formatBRL(metrics.minimumViablePrice)}
          />
          <PriceLine
            label="Preço Recomendado"
            hint={`Para atingir ${formatPercent(input.targetMargin * 100)} de margem`}
            formula={`Custo total ÷ (1 − margem alvo)\n= ${formatBRL(costBreakdown.total)} ÷ (1 − ${formatPercent(input.targetMargin * 100)})`}
            value={formatBRL(metrics.recommendedPrice)}
            emphasized
          />
        </div>

        {/* Break-even em unidades */}
        {metrics.breakEvenUnits !== null && (
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-purple-800">
                  Break-even mensal
                  <Tooltip text={`Custo fixo mensal ÷ Lucro por unidade\n= ${formatBRL(input.monthlyFixedCost)} ÷ ${formatBRL(metrics.profit)}`} />
                </p>
                <p className="text-xs text-purple-500 mt-0.5">
                  Unidades por mês para cobrir R${input.monthlyFixedCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de custo fixo
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-700 tabular-nums">{metrics.breakEvenUnits}</p>
                <p className="text-xs text-purple-400">unidades/mês</p>
              </div>
            </div>
          </div>
        )}

        {/* Alerta quando não viável */}
        {isNotViable && gapToViable > 0 && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-700">Para ser viável, aumente o preço em:</p>
            <p className="text-2xl font-bold text-red-800 mt-1 tabular-nums">{formatBRL(gapToViable)}</p>
            <p className="text-xs text-red-400 mt-1">
              {formatBRL(input.salePrice)} atual → mínimo {formatBRL(metrics.minimumViablePrice)}
            </p>
          </div>
        )}

        {/* Detalhamento */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full rounded-lg border border-gray-200 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          {showBreakdown ? '▲ Ocultar' : '▼ Ver'} detalhamento de custos
        </button>
        {showBreakdown && <CostBreakdownTable breakdown={costBreakdown} />}
      </div>
    </div>
  )
}

// ─── Sub-componentes ───

function MetricCard({ label, value, formula, highlight, negative }: {
  label: string; value: string; formula: string; highlight?: string; negative?: boolean
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center">
      <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
        {label}<Tooltip text={formula} />
      </p>
      <p className={cn(
        'text-base font-bold mt-1 tabular-nums',
        negative ? 'text-red-600' : (highlight ?? 'text-gray-900')
      )}>
        {value}
      </p>
    </div>
  )
}

function PriceLine({ label, hint, formula, value, emphasized }: {
  label: string; hint: string; formula: string; value: string; emphasized?: boolean
}) {
  return (
    <div className={cn('flex items-center justify-between px-4 py-3 gap-4', emphasized && 'bg-blue-50')}>
      <div className="min-w-0">
        <p className={cn('text-sm flex items-center gap-1', emphasized ? 'font-semibold text-gray-800' : 'text-gray-600')}>
          {label}<Tooltip text={formula} />
        </p>
        <p className="text-xs text-gray-400 truncate">{hint}</p>
      </div>
      <span className={cn(
        'text-sm tabular-nums shrink-0',
        emphasized ? 'font-bold text-blue-700 text-base' : 'font-medium text-gray-700'
      )}>
        {value}
      </span>
    </div>
  )
}

function Tooltip({ text }: { text: string }) {
  return (
    <span
      className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full bg-gray-200 text-gray-500 text-[9px] font-bold hover:bg-blue-100 hover:text-blue-600 transition-colors"
      title={text}
    >
      ?
    </span>
  )
}
