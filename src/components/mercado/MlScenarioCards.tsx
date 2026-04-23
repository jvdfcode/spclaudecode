'use client'

import { useMemo, useState } from 'react'
import type { MarketSummary, ViabilityInput } from '@/types'
import { calculateCostBreakdown, calculateProfitabilityMetrics, classifyViability } from '@/lib/calculations'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  summary: MarketSummary
}

const FORM_KEY = 'smartpreco_calc_form'

const SCENARIOS = [
  {
    label: 'Agressivo',
    icon: '⚡',
    tagline: 'Preço abaixo da maioria — mais competitivo, margem menor',
    borderIdle:   'border-gray-100',
    borderActive: 'border-amber-400',
    bgAccent:     'bg-amber-50',
    textAccent:   'text-amber-700',
    btnActive:    'bg-amber-500 hover:bg-amber-600 text-white',
    btnIdle:      'bg-gray-100 hover:bg-gray-200 text-gray-600',
    getPrice: (s: MarketSummary) => s.p25Price,
  },
  {
    label: 'Conservador',
    icon: '⚖️',
    tagline: 'Na mediana do mercado — equilibrado entre risco e retorno',
    borderIdle:   'border-blue-200',
    borderActive: 'border-blue-500',
    bgAccent:     'bg-blue-50',
    textAccent:   'text-blue-700',
    btnActive:    'bg-blue-600 hover:bg-blue-700 text-white',
    btnIdle:      'bg-blue-100 hover:bg-blue-200 text-blue-700',
    getPrice: (s: MarketSummary) => s.medianPrice,
    isRecommended: true,
  },
  {
    label: 'Margem Alta',
    icon: '💰',
    tagline: 'Preço acima da maioria — mais lucro por venda, menos volume',
    borderIdle:   'border-gray-100',
    borderActive: 'border-purple-500',
    bgAccent:     'bg-purple-50',
    textAccent:   'text-purple-700',
    btnActive:    'bg-purple-600 hover:bg-purple-700 text-white',
    btnIdle:      'bg-gray-100 hover:bg-gray-200 text-gray-600',
    getPrice: (s: MarketSummary) => s.p75Price,
  },
] as const

const viabilityStyle = {
  viable:     { badge: 'bg-green-100 text-green-700',   label: '✓ Viável'   },
  attention:  { badge: 'bg-yellow-100 text-yellow-700', label: '! Atenção'  },
  not_viable: { badge: 'bg-red-100 text-red-700',       label: '✗ Inviável' },
}

export default function MlScenarioCards({ summary }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const scenarios = useMemo(() => {
    if (summary.cleanListings === 0) return []

    let input: ViabilityInput | null = null
    try {
      const raw = sessionStorage.getItem(FORM_KEY)
      if (raw) input = JSON.parse(raw) as ViabilityInput
    } catch {}

    if (!input || input.productCost <= 0) return []

    return SCENARIOS.map(def => {
      const price = def.getPrice(summary)
      const scenarioInput = { ...input!, salePrice: price }
      const costs   = calculateCostBreakdown(scenarioInput)
      const metrics = calculateProfitabilityMetrics(scenarioInput, costs)
      return {
        ...def,
        price,
        profit:         metrics.profit,
        marginPercent:  metrics.marginPercent,
        classification: classifyViability(metrics.marginPercent) as keyof typeof viabilityStyle,
      }
    })
  }, [summary])

  if (!scenarios.length) return null

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-gray-800">Cenários com preços reais do ML</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Cruzamento dos seus custos com os preços encontrados no mercado
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map(s => {
          const vs         = viabilityStyle[s.classification]
          const isSelected = selected === s.label
          const border     = isSelected ? s.borderActive : s.borderIdle

          return (
            <div
              key={s.label}
              onClick={() => setSelected(isSelected ? null : s.label)}
              className={cn(
                'relative flex flex-col rounded-2xl border-2 bg-white p-4 gap-3',
                'cursor-pointer select-none',
                'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                isSelected && 'shadow-md -translate-y-0.5',
                border,
              )}
            >
              {/* Badge recomendado */}
              {'isRecommended' in s && s.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-bold text-white shadow">
                    ★ Recomendado
                  </span>
                </div>
              )}

              {/* Cabeçalho: nome + badge viabilidade */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg leading-none">{s.icon}</span>
                  <span className={cn('text-sm font-bold', s.textAccent)}>{s.label}</span>
                </div>
                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', vs.badge)}>
                  {vs.label}
                </span>
              </div>

              {/* Preço — elemento principal */}
              <div className={cn(
                'rounded-xl px-3 py-4 text-center transition-colors',
                isSelected ? s.bgAccent : 'bg-gray-50',
              )}>
                <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Preço sugerido</p>
                <p className="text-3xl font-bold text-gray-900 tabular-nums">{formatBRL(s.price)}</p>
              </div>

              {/* Lucro e margem */}
              <div className="flex justify-between px-1">
                <div>
                  <p className="text-[11px] text-gray-400">Lucro / unidade</p>
                  <p className={cn(
                    'text-lg font-bold tabular-nums',
                    s.profit < 0 ? 'text-red-600' : 'text-gray-800',
                  )}>
                    {formatBRL(s.profit)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-400">Margem</p>
                  <p className={cn(
                    'text-lg font-bold tabular-nums',
                    s.marginPercent < 0 ? 'text-red-600' : 'text-gray-800',
                  )}>
                    {formatPercent(s.marginPercent)}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-[11px] text-gray-400 text-center leading-snug">{s.tagline}</p>

              {/* Botão "Usar este preço" */}
              <a
                href={`/calculadora?preco=${s.price.toFixed(2)}`}
                onClick={e => e.stopPropagation()}
                className={cn(
                  'rounded-xl py-2.5 text-center text-sm font-semibold transition-all',
                  isSelected ? s.btnActive : s.btnIdle,
                )}
              >
                Usar este preço →
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
