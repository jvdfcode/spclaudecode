'use client'

import { useMemo, useState } from 'react'
import type { ViabilityInput, MlFeesMap } from '@/types'
import { generateScenarios } from '@/lib/calculations'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  input: ViabilityInput
  fees: MlFeesMap
  targetMargin: number // 0-1
}

const zoneStyle = {
  viable:    { row: 'bg-green-50 hover:bg-green-100',   text: 'text-green-700',  dot: 'bg-green-400'  },
  attention: { row: 'bg-yellow-50 hover:bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-400' },
  not_viable:{ row: 'bg-red-50 hover:bg-red-100',       text: 'text-red-700',    dot: 'bg-red-400'    },
}

export default function ScenarioTable({ input, fees, targetMargin }: Props) {
  const [expanded, setExpanded] = useState(false)

  const scenarios = useMemo(() => {
    if (input.salePrice <= 0 || input.productCost <= 0) return []
    return generateScenarios(input, 15, 0.05)
  }, [input, fees]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!scenarios.length) return null

  const recommendedIdx = scenarios.findIndex(s => s.marginPercent >= targetMargin * 100)

  return (
    <div className="rounded-[20px] border border-paper-200 bg-white overflow-hidden">
      {/* Cabeçalho — clicável para expandir/colapsar */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-paper-100 transition-colors text-left"
      >
        <div>
          <h3 className="text-sm font-extrabold text-ink-900">Simulador de Cenários</h3>
          <p className="text-xs text-ink-500 mt-0.5">Variação de ±35% ao redor do preço base em passos de 5%</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-ink-500">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-400" />Prejuízo</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-400" />Atenção</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-400" />Viável</span>
          </div>
          <span className="text-xs text-ink-950 font-semibold flex-shrink-0">
            {expanded ? '▲ Fechar' : '▼ Ver simulação'}
          </span>
        </div>
      </button>

      {/* Conteúdo expansível */}
      {expanded && (
        <>
          <div className="overflow-x-auto border-t border-paper-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-paper-200 bg-paper-100 text-xs text-ink-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left font-medium">Preço de Venda</th>
                  <th className="px-4 py-3 text-right font-medium">Lucro</th>
                  <th className="px-4 py-3 text-right font-medium">Margem</th>
                  <th className="px-4 py-3 text-right font-medium">ROI</th>
                  <th className="px-4 py-3 text-center font-medium w-32"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-100">
                {scenarios.map((s, idx) => {
                  const z = zoneStyle[s.classification]
                  const isCurrent = Math.abs(s.salePrice - input.salePrice) < 0.01
                  const isRecommended = idx === recommendedIdx

                  return (
                    <tr key={idx} className={cn(
                      'transition-colors',
                      z.row,
                      isCurrent && 'ring-2 ring-inset ring-ink-950',
                    )}>
                      <td className="px-4 py-2.5 font-medium text-ink-900 tabular-nums">
                        <div className="flex items-center gap-2">
                          <span className={cn('h-2 w-2 rounded-full flex-shrink-0', z.dot)} />
                          {formatBRL(s.salePrice)}
                          {isCurrent && (
                            <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                              atual
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={cn('px-4 py-2.5 text-right tabular-nums font-medium', z.text)}>
                        {formatBRL(s.profit)}
                      </td>
                      <td className={cn('px-4 py-2.5 text-right tabular-nums font-semibold', z.text)}>
                        {formatPercent(s.marginPercent)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">
                        {formatPercent(s.roiPercent)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-[11px] font-semibold text-green-700">
                            ★ Recomendado
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-paper-200 bg-paper-100 text-xs text-ink-500">
            ★ Recomendado = primeiro preço que atinge {formatPercent(targetMargin * 100)} de margem alvo
          </div>
        </>
      )}
    </div>
  )
}
