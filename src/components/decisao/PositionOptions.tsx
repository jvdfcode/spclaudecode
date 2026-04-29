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
                ? 'border-halo-navy bg-[linear-gradient(135deg,#eef0fb_0%,#f5f6ff_100%)] shadow-[0_8px_24px_rgba(45,50,119,0.12)]'
                : 'border-halo-gray bg-white hover:border-halo-gray hover:shadow-[0_4px_16px_rgba(45,50,119,0.06)] cursor-pointer'
            )}
          >
            {isSelected && (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,var(--halo-orange)_0%,var(--halo-navy)_100%)]" />
            )}

            <div className="flex items-start justify-between mb-3">
              <span className="text-xl" aria-hidden="true">{cfg.icon}</span>
              {isSelected && (
                <span className="text-[10px] font-extrabold text-halo-orange bg-halo-navy rounded-full px-2 py-0.5">
                  Selecionado
                </span>
              )}
            </div>

            <p className="text-sm font-extrabold text-halo-navy">{option.label}</p>
            <p className="text-xs text-halo-navy-60 mt-0.5 leading-snug">{option.description}</p>

            <div className="mt-3 space-y-0.5">
              <p className="text-xl font-extrabold tabular-nums text-halo-navy">
                {formatBRL(option.suggestedPrice)}
              </p>
              <p className={cn(
                'text-xs font-semibold',
                marginGood ? 'text-halo-orange-80' : marginWarn ? 'text-halo-orange-100' : 'text-halo-navy'
              )}>
                Margem: {formatPercent(option.marginPercent)}
              </p>
              {option.marketPosition && (
                <p className="text-[10px] text-halo-navy-40 mt-0.5">
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
