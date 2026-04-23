import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusPillProps {
  label: string
  tone?: 'neutral' | 'info' | 'warn' | 'success' | 'danger' | 'brand'
  dot?: boolean
  icon?: ReactNode
  compact?: boolean
  minWidthClassName?: string
  children?: ReactNode
}

const toneClasses: Record<NonNullable<StatusPillProps['tone']>, string> = {
  neutral: 'border-paper-200 bg-paper-100 text-ink-900',
  info:    'border-[#cfd4ff] bg-[#eef0fb] text-ink-950',
  warn:    'border-warn-200 bg-warn-50 text-warn-500',
  success: 'border-profit-200 bg-profit-50 text-profit-500',
  danger:  'border-loss-200 bg-loss-50 text-loss-500',
  brand:   'border-[#fff1a6] bg-[#fff9cc] text-ink-950',
}

export function StatusPill({
  label,
  tone = 'neutral',
  dot = false,
  icon,
  compact = false,
  minWidthClassName,
  children,
}: StatusPillProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border font-extrabold tracking-[0.02em] shadow-[0_6px_16px_rgba(20,20,20,0.04)]',
        toneClasses[tone],
        compact ? 'px-3 py-1 text-[11px]' : 'min-h-9 px-3 py-1.5 text-xs',
        minWidthClassName,
      )}
    >
      {dot ? <span className="h-2 w-2 rounded-full bg-current opacity-80" /> : null}
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {label}
      {children}
    </Badge>
  )
}
