'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { SkuStatus } from '@/types/sku'

const STATUS_OPTIONS: { value: SkuStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'Todos' },
  { value: 'viable',    label: 'Viável' },
  { value: 'attention', label: 'Atenção' },
  { value: 'not_viable',label: 'Não viável' },
  { value: 'for_sale',  label: 'À venda' },
  { value: 'draft',     label: 'Rascunho' },
]

export default function SkuFilters({ total }: { total: number }) {
  const router    = useRouter()
  const pathname  = usePathname()
  const params    = useSearchParams()

  const current  = (params.get('status') ?? 'all') as SkuStatus | 'all'
  const search   = params.get('q') ?? ''

  const push = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value && value !== 'all') next.set(key, value)
    else next.delete(key)
    router.replace(`${pathname}?${next.toString()}`)
  }, [params, pathname, router])

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <input
        type="search"
        placeholder="Buscar por nome..."
        defaultValue={search}
        onChange={e => push('q', e.target.value)}
        className="w-full sm:w-64 rounded-[10px] border border-paper-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950"
      />

      <div className="flex flex-wrap gap-1.5">
        {STATUS_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => push('status', opt.value)}
            className={cn(
              'btn-genie rounded-full px-3 py-1 text-xs font-semibold select-none',
              'transition-all duration-[200ms] ease-[cubic-bezier(.34,1.56,.64,1)]',
              'hover:-translate-y-[1px] active:scale-[0.95] active:translate-y-0',
              current === opt.value
                ? 'bg-ink-950 text-gold-400 shadow-[0_2px_8px_rgba(45,50,119,0.28)]'
                : 'bg-paper-100 text-ink-700 hover:bg-paper-200 hover:shadow-sm'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-ink-500 whitespace-nowrap">{total} produto{total !== 1 ? 's' : ''}</p>
    </div>
  )
}
