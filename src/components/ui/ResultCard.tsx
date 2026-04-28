import type { ReactNode } from 'react'
import { CircleAlert, CircleCheckBig, CircleX } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ResultCardProps {
  label: string
  value: string
  tone?: 'default' | 'profit' | 'warn' | 'loss'
  footer?: ReactNode
  compact?: boolean
  /**
   * Ícone customizado (sobrescreve o ícone semântico do tone).
   */
  icon?: ReactNode
}

/**
 * ResultCard — Halo DS v1.1 §12.5.
 *
 * Quando o `tone` é semântico (profit/warn/loss), o card renderiza
 * automaticamente um ícone Lucide canônico junto à label — cor não é
 * único sinal, sempre acompanhar de ícone (e o label do produto).
 *
 * Tons mapeados para Halo:
 * - default → Blanc + Eclipse
 * - profit  → Solar suave (positivo, viabilidade) + CircleCheckBig
 * - warn    → Solar pleno (atenção) + CircleAlert
 * - loss    → Eclipse (sério, inviabilidade) + CircleX
 */
const toneClasses: Record<NonNullable<ResultCardProps['tone']>, string> = {
  default: 'bg-white text-halo-navy',
  profit:  'bg-halo-orange-15 text-halo-orange-80',
  warn:    'bg-halo-orange-05 text-halo-orange-100',
  loss:    'bg-halo-navy text-halo-orange',
}

const toneIcons: Record<NonNullable<ResultCardProps['tone']>, ReactNode> = {
  default: null,
  profit:  <CircleCheckBig size={16} strokeWidth={2.2} aria-hidden="true" />,
  warn:    <CircleAlert size={16} strokeWidth={2.2} aria-hidden="true" />,
  loss:    <CircleX size={16} strokeWidth={2.2} aria-hidden="true" />,
}

export function ResultCard({
  label,
  value,
  tone = 'default',
  footer,
  compact = false,
  icon,
}: ResultCardProps) {
  const semanticIcon = icon ?? toneIcons[tone]
  return (
    <article
      className={cn(
        'interactive-panel flex flex-col justify-between rounded-[24px] border border-halo-gray shadow-[0_14px_28px_rgba(45,50,119,0.05)]',
        compact ? 'min-h-[140px] p-4 sm:p-5' : 'min-h-[156px] p-5 sm:p-6',
        toneClasses[tone],
      )}
    >
      <div className="flex items-center gap-2">
        {semanticIcon && <span className="shrink-0 opacity-90">{semanticIcon}</span>}
        <p className="text-[11px] font-semibold uppercase tracking-[0.04em] leading-5 opacity-70 sm:text-xs">
          {label}
        </p>
      </div>
      <p
        className={cn(
          'break-words font-extrabold leading-[1.06] tracking-[-0.025em] tabular-nums',
          compact ? 'mt-3 text-[1.46rem] sm:text-[1.62rem]' : 'mt-4 text-[1.55rem] sm:text-[1.8rem]',
        )}
      >
        {value}
      </p>
      {footer ? (
        <div className={cn('font-medium opacity-75', compact ? 'mt-2 text-[11px] leading-5' : 'mt-3 text-xs')}>
          {footer}
        </div>
      ) : null}
    </article>
  )
}
