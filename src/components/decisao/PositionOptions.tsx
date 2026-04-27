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
  economico:  { icon: '💰', label: 'Econômico'  },
  competitivo:{ icon: '🎯', label: 'Competitivo' },
  premium:    { icon: '⭐', label: 'Premium'     },
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
        const marginGood = option.marginPercent >= 20
        const marginWarn = option.marginPercent >= 0 && option.marginPercent < 20
        const marginBad  = option.marginPercent < 0

        return (
          <button
            key={option.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option.id)}
            className={cn(
              'relative rounded-[20px] border-2 p-4 text-left transition-all focus:outline-none overflow-hidden',
              isSelected
                ? 'border-ink-950 bg-[linear-gradient(135deg,#eef0fb_0%,#f5f6ff_100%)] shadow-[0_8px_24px_rgba(45,50,119,0.12)]'
                : 'border-paper-200 bg-white hover:border-paper-200 hover:shadow-[0_4px_16px_rgba(45,50,119,0.06)] cursor-pointer'
            )}
          >
            {isSelected && (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#FFE600_0%,#2D3277_100%)]" />
            )}

            <div className="flex items-start justify-between mb-3">
              <span className="text-xl" aria-hidden="true">{cfg.icon}</span>
              {isSelected && (
                <span className="text-[10px] font-extrabold text-gold-400 bg-ink-950 rounded-full px-2 py-0.5">
                  Selecionado
                </span>
              )}
            </div>

            <p className="text-sm font-extrabold text-ink-950">{option.label}</p>
            <p className="text-xs text-ink-700 mt-0.5 leading-snug">{option.description}</p>

            <div className="mt-3 space-y-0.5">
              <p className="text-xl font-extrabold tabular-nums text-ink-950">
                {formatBRL(option.suggestedPrice)}
              </p>
              <p className={cn(
                'text-xs font-semibold',
                marginGood ? 'text-profit-500' : marginWarn ? 'text-warn-500' : 'text-loss-500'
              )}>
                Margem: {formatPercent(option.marginPercent)}
              </p>
              {option.marketPosition && (
                <p className="text-[10px] text-ink-500 mt-0.5">
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
