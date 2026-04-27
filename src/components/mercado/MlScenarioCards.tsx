'use client'

import { useMemo, useState } from 'react'
import type { MarketSummary, ViabilityInput } from '@/types'
import { calculateCostBreakdown, calculateProfitabilityMetrics, classifyViability } from '@/lib/calculations'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  summary: MarketSummary
  costInput?: ViabilityInput
}

const FORM_KEY = 'smartpreco_calc_form'

const SCENARIOS = [
  {
    label: 'Agressivo',
    icon: '⚡',
    tagline: 'Preço abaixo da maioria — mais competitivo, margem menor',
    borderIdle:   'border-paper-200',
    borderActive: 'border-gold-400',
    bgAccent:     'bg-warn-50',
    textAccent:   'text-warn-500',
    btnActive:    'bg-warn-500 text-white',
    btnIdle:      'bg-paper-100 text-ink-700 hover:bg-paper-200',
    getPrice: (s: MarketSummary) => s.p25Price,
  },
  {
    label: 'Conservador',
    icon: '⚖️',
    tagline: 'Na mediana do mercado — equilibrado entre risco e retorno',
    borderIdle:   'border-primary-100',
    borderActive: 'border-ink-950',
    bgAccent:     'bg-primary-50',
    textAccent:   'text-ink-950',
    btnActive:    'bg-ink-950 text-gold-400',
    btnIdle:      'bg-primary-50 text-ink-950 hover:bg-[#cfd4ff]',
    getPrice: (s: MarketSummary) => s.medianPrice,
    isRecommended: true,
  },
  {
    label: 'Margem Alta',
    icon: '💰',
    tagline: 'Preço acima da maioria — mais lucro por venda, menos volume',
    borderIdle:   'border-paper-200',
    borderActive: 'border-profit-500',
    bgAccent:     'bg-profit-50',
    textAccent:   'text-profit-500',
    btnActive:    'bg-profit-500 text-white',
    btnIdle:      'bg-paper-100 text-ink-700 hover:bg-paper-200',
    getPrice: (s: MarketSummary) => s.p75Price,
  },
] as const

const viabilityStyle = {
  viable:     { badge: 'bg-profit-50 text-profit-500',  label: '✓ Viável'   },
  attention:  { badge: 'bg-warn-50 text-warn-500',      label: '! Atenção'  },
  not_viable: { badge: 'bg-loss-50 text-loss-500',      label: '✗ Inviável' },
}

export default function MlScenarioCards({ summary, costInput }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const scenarios = useMemo(() => {
    if (summary.cleanListings === 0) return []

    let input: ViabilityInput | null = costInput ?? null
    if (!input) {
      try {
        const raw = sessionStorage.getItem(FORM_KEY)
        if (raw) input = JSON.parse(raw) as ViabilityInput
      } catch {}
    }

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
  }, [summary, costInput])

  if (!scenarios.length) return null

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-extrabold text-ink-950">Cenários com preços reais do ML</p>
        <p className="text-xs text-ink-700 mt-0.5">
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
                'relative flex flex-col rounded-[20px] border-2 bg-white p-4 gap-3',
                'cursor-pointer select-none',
                'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
                isSelected && 'shadow-md -translate-y-0.5',
                border,
              )}
            >
              {'isRecommended' in s && s.isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="rounded-full bg-ink-950 px-3 py-0.5 text-[11px] font-bold text-gold-400 shadow">
                    ★ Recomendado
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg leading-none">{s.icon}</span>
                  <span className={cn('text-sm font-bold', s.textAccent)}>{s.label}</span>
                </div>
                <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', vs.badge)}>
                  {vs.label}
                </span>
              </div>

              <div className={cn(
                'rounded-[14px] px-3 py-4 text-center transition-colors',
                isSelected ? s.bgAccent : 'bg-paper-100',
              )}>
                <p className="text-[11px] uppercase tracking-wider text-ink-500 mb-1">Preço sugerido</p>
                <p className="text-3xl font-extrabold text-ink-950 tabular-nums">{formatBRL(s.price)}</p>
              </div>

              <div className="flex justify-between px-1">
                <div>
                  <p className="text-[11px] text-ink-500">Lucro / unidade</p>
                  <p className={cn(
                    'text-lg font-bold tabular-nums',
                    s.profit < 0 ? 'text-loss-500' : 'text-ink-900',
                  )}>
                    {formatBRL(s.profit)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-ink-500">Margem</p>
                  <p className={cn(
                    'text-lg font-bold tabular-nums',
                    s.marginPercent < 0 ? 'text-loss-500' : 'text-ink-900',
                  )}>
                    {formatPercent(s.marginPercent)}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-ink-500 text-center leading-snug">{s.tagline}</p>

              <a
                href={`/calculadora?preco=${s.price.toFixed(2)}`}
                onClick={e => e.stopPropagation()}
                className={cn(
                  'rounded-[14px] py-2.5 text-center text-sm font-semibold transition-all',
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
