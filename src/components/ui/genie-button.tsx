'use client'

import { useState, useRef, useCallback, forwardRef } from 'react'
import { cn } from '@/lib/utils'

/* ----------------------------------------------------------------
   Ripple state — posição e tamanho calculados no clique
---------------------------------------------------------------- */
interface RippleItem {
  id: number
  x: number
  y: number
  size: number
}

/* ----------------------------------------------------------------
   Variantes de aparência
---------------------------------------------------------------- */
export type GenieVariant =
  | 'primary'    // gradiente azul-índigo, CTA principal
  | 'success'    // gradiente verde, ação de confirmar/salvar
  | 'secondary'  // branco com borda, ação secundária
  | 'ghost'      // transparente, ação terciária
  | 'outline'    // borda azul, alternativa ao primário
  | 'danger'     // gradiente vermelho, ação destrutiva

export type GenieSize = 'sm' | 'md' | 'lg'

export interface GenieButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: GenieVariant
  size?: GenieSize
  loading?: boolean
  fullWidth?: boolean
}

/* ----------------------------------------------------------------
   Estilos por variante
---------------------------------------------------------------- */
const variantClasses: Record<GenieVariant, string> = {
  primary: [
    'bg-ink-950',
    'text-gold-400',
    'shadow-[0_2px_14px_rgba(45,50,119,0.32)]',
    'hover:shadow-[0_5px_22px_rgba(45,50,119,0.44)]',
    'border border-ink-950/25',
  ].join(' '),

  success: [
    'bg-profit-500',
    'text-white',
    'shadow-[0_2px_14px_rgba(14,159,110,0.30)]',
    'hover:shadow-[0_5px_22px_rgba(14,159,110,0.42)]',
    'border border-profit-500/25',
  ].join(' '),

  secondary: [
    'bg-white text-ink-700',
    'shadow-[0_1px_6px_rgba(45,50,119,0.09)]',
    'hover:shadow-[0_3px_14px_rgba(45,50,119,0.13)]',
    'border border-paper-200 hover:border-paper-300',
  ].join(' '),

  ghost: [
    'bg-transparent text-ink-700',
    'border border-transparent',
    'hover:bg-paper-100 hover:text-ink-950 hover:border-paper-200',
  ].join(' '),

  outline: [
    'bg-transparent text-ink-950',
    'border-2 border-[#cfd4ff]',
    'hover:bg-[#eef0fb]',
  ].join(' '),

  danger: [
    'bg-loss-500',
    'text-white',
    'shadow-[0_2px_14px_rgba(214,69,69,0.30)]',
    'hover:shadow-[0_5px_22px_rgba(214,69,69,0.42)]',
  ].join(' '),
}

const sizeClasses: Record<GenieSize, string> = {
  sm: 'h-8  px-3 text-xs  rounded-lg  gap-1.5 [&_svg]:size-3.5',
  md: 'h-10 px-4 text-sm  rounded-xl  gap-2   [&_svg]:size-4',
  lg: 'h-12 px-6 text-base rounded-xl gap-2.5 [&_svg]:size-5',
}

/* ----------------------------------------------------------------
   Componente
---------------------------------------------------------------- */
export const GenieButton = forwardRef<HTMLButtonElement, GenieButtonProps>(
  function GenieButton(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      children,
      className,
      disabled,
      onClick,
      ...props
    },
    externalRef,
  ) {
    const [ripples, setRipples] = useState<RippleItem[]>([])
    const internalRef = useRef<HTMLButtonElement>(null)
    const ref = (externalRef as React.RefObject<HTMLButtonElement>) ?? internalRef
    const counter = useRef(0)

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = ref.current
        if (btn) {
          const rect = btn.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const size = Math.max(rect.width, rect.height) * 2.4
          const id = ++counter.current
          setRipples(prev => [...prev, { id, x: x - size / 2, y: y - size / 2, size }])
          setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 680)
        }
        onClick?.(e)
      },
      [onClick, ref],
    )

    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        onClick={handleClick}
        className={cn(
          /* estrutura */
          'btn-genie inline-flex items-center justify-center font-semibold select-none',
          /* transição spring — lift no hover, bounce no press */
          'transition-[transform,box-shadow,background-color,border-color] duration-[220ms]',
          'ease-[cubic-bezier(.34,1.56,.64,1)]',
          'hover:-translate-y-[2px]',
          'active:scale-[0.96] active:translate-y-0 active:duration-75',
          /* disabled */
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'disabled:hover:translate-y-0 disabled:active:scale-100 disabled:shadow-none',
          /* focus */
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-ink-950/30 focus-visible:ring-offset-2',
          /* variante e tamanho */
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {/* Spinner de loading */}
        {loading && (
          <span
            aria-hidden
            className="size-[1em] shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}

        {/* Conteúdo com fade quando loading */}
        <span className={cn('transition-opacity duration-150', loading && 'opacity-55')}>
          {children}
        </span>

        {/* Ripples do clique */}
        {ripples.map(({ id, x, y, size }) => (
          <span
            key={id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-white/28"
            style={{
              left: x,
              top: y,
              width: size,
              height: size,
              animation: 'genie-ripple 0.68s ease-out forwards',
            }}
          />
        ))}
      </button>
    )
  },
)
