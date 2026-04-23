'use client'

import { m } from 'motion/react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Nenhum dado disponível',
  description = 'Preencha os dados para ver o resultado aqui.',
}: EmptyStateProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-dashed border-paper-200 bg-paper-100 p-6 text-sm text-ink-700"
    >
      <p className="font-bold text-ink-950">{title}</p>
      <p className="mt-2 leading-6">{description}</p>
    </m.div>
  )
}
