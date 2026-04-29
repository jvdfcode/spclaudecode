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

/**
 * Tons do StatusPill — Halo DS v1.1 §9.4 + §12.5.
 *
 * Cor não é único sinal: ícone + texto são obrigatórios para success/danger
 * (ver ProfitabilityBadge). Os tons abaixo derivam exclusivamente das 5
 * âncoras Halo (Onyx · Eclipse · Solar · Mist · Blanc) — sem cores
 * estranhas ao sistema.
 *
 * Diferenciação semântica com 5 cores:
 * - success → Solar suave (positivo, "isto está bom")
 * - warn    → Solar pleno (atenção, "olhe aqui")
 * - danger  → Eclipse (sério, "pare e veja") — densidade máxima
 * - neutral → Mist (ambiente)
 * - info    → Eclipse claro (informativo)
 * - brand   → Solar+Onyx (call-out de marca)
 */
const toneClasses: Record<NonNullable<StatusPillProps['tone']>, string> = {
  neutral: 'border-halo-gray bg-halo-gray-15 text-halo-black',
  info:    'border-halo-navy-20 bg-halo-navy-10 text-halo-navy',
  warn:    'border-halo-orange-30 bg-halo-orange-05 text-halo-orange-100',
  success: 'border-halo-orange-30 bg-halo-orange-15 text-halo-orange-80',
  danger:  'border-halo-navy bg-halo-navy text-halo-orange',
  brand:   'border-halo-orange-30 bg-halo-orange-15 text-halo-navy',
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
