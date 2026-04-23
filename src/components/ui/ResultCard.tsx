import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ResultCardProps {
  label: string
  value: string
  tone?: 'default' | 'profit' | 'warn' | 'loss'
  footer?: ReactNode
  compact?: boolean
}

const toneClasses: Record<NonNullable<ResultCardProps['tone']>, string> = {
  default: 'bg-white text-ink-950',
  profit:  'bg-profit-50 text-profit-500',
  warn:    'bg-warn-50 text-warn-500',
  loss:    'bg-loss-50 text-loss-500',
}

export function ResultCard({
  label,
  value,
  tone = 'default',
  footer,
  compact = false,
}: ResultCardProps) {
  return (
    <article
      className={cn(
        'interactive-panel flex flex-col justify-between rounded-[24px] border border-paper-200 shadow-[0_14px_28px_rgba(45,50,119,0.05)]',
        compact ? 'min-h-[140px] p-4 sm:p-5' : 'min-h-[156px] p-5 sm:p-6',
        toneClasses[tone],
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] leading-5 opacity-70 sm:text-xs">
        {label}
      </p>
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
