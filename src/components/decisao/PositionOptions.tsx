'use client'

import type { DecisionOption, DecisionOptionId } from '@/hooks/useDecisionEngine'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  options: [DecisionOption, DecisionOption, DecisionOption]
  selected: DecisionOptionId | null
  onSelect: (id: DecisionOptionId) => void
}

const positionLabels = {
  below: 'Abaixo do mercado',
  aligned: 'Alinhado ao mercado',
  above: 'Acima do mercado',
} as const

const optionCfg = {
  economico: {
    icon: '💰',
    base: 'border-blue-200 bg-blue-50',
    active: 'border-blue-500 ring-2 ring-blue-200 bg-blue-50',
    header: 'text-blue-800',
    badge: 'bg-blue-600',
  },
  competitivo: {
    icon: '🎯',
    base: 'border-green-200 bg-green-50',
    active: 'border-green-500 ring-2 ring-green-200 bg-green-50',
    header: 'text-green-800',
    badge: 'bg-green-600',
  },
  premium: {
    icon: '⭐',
    base: 'border-orange-200 bg-orange-50',
    active: 'border-orange-500 ring-2 ring-orange-200 bg-orange-50',
    header: 'text-orange-800',
    badge: 'bg-orange-600',
  },
} as const

export default function PositionOptions({ options, selected, onSelect }: Props) {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      role="radiogroup"
      aria-label="Opções de posicionamento de preço"
    >
      {options.map(option => {
        const cfg = optionCfg[option.id]
        const isSelected = selected === option.id

        return (
          <button
            key={option.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.id)}
            className={cn(
              'rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-300',
              isSelected ? cfg.active : cn(cfg.base, 'hover:border-opacity-60 cursor-pointer')
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xl" aria-hidden="true">{cfg.icon}</span>
              {isSelected && (
                <span className={cn('text-[10px] font-bold text-white rounded-full px-2 py-0.5', cfg.badge)}>
                  Selecionado
                </span>
              )}
            </div>

            <p className={cn('text-sm font-bold', cfg.header)}>{option.label}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">{option.description}</p>

            <div className="mt-3 space-y-1">
              <p className="text-xl font-bold tabular-nums text-gray-900">
                {formatBRL(option.suggestedPrice)}
              </p>
              <p className={cn(
                'text-xs font-medium',
                option.marginPercent >= 0 ? 'text-gray-600' : 'text-red-500'
              )}>
                Margem: {formatPercent(option.marginPercent)}
              </p>
              {option.marketPosition && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {positionLabels[option.marketPosition]}
                </p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
