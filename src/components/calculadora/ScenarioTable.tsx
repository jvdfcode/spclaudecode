'use client'

import { useMemo, useState } from 'react'
import type { ViabilityInput, MlFeesMap } from '@/types'
import { generateScenarios } from '@/lib/calculations'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  input: ViabilityInput
  fees: MlFeesMap
  targetMargin: number
}

const zoneStyle = {
  viable:    { row: 'bg-profit-50 hover:bg-profit-50',  text: 'text-profit-500', dot: 'bg-profit-500' },
  attention: { row: 'bg-warn-50 hover:bg-warn-50',       text: 'text-warn-500',   dot: 'bg-gold-400'   },
  not_viable:{ row: 'bg-loss-50 hover:bg-loss-50',       text: 'text-loss-500',   dot: 'bg-loss-500'   },
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
    <div className="rounded-[20px] border border-halo-gray bg-white overflow-hidden">
      {/* Cabeçalho — clicável para expandir/colapsar */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-halo-gray-15 transition-colors text-left"
      >
        <div>
          <h3 className="text-sm font-extrabold text-halo-black">Simulador de Cenários</h3>
          <p className="text-xs text-halo-navy-40 mt-0.5">Variação de ±35% ao redor do preço base em passos de 5%</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs text-halo-navy-40">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-loss-500" />Prejuízo</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold-400" />Atenção</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-profit-500" />Viável</span>
          </div>
          <span className="text-xs text-halo-navy font-semibold flex-shrink-0">
            {expanded ? '▲ Fechar' : '▼ Ver simulação'}
          </span>
        </div>
      </button>

      {expanded && (
        <>
          <div className="overflow-x-auto border-t border-halo-gray">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-halo-gray bg-halo-gray-15 text-xs text-halo-navy-40 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left font-medium">Preço de Venda</th>
                  <th className="px-4 py-3 text-right font-medium">Lucro</th>
                  <th className="px-4 py-3 text-right font-medium">Margem</th>
                  <th className="px-4 py-3 text-right font-medium">ROI</th>
                  <th className="px-4 py-3 text-center font-medium w-32"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-halo-gray-15">
                {scenarios.map((s, idx) => {
                  const z = zoneStyle[s.classification]
                  const isCurrent = Math.abs(s.salePrice - input.salePrice) < 0.01
                  const isRecommended = idx === recommendedIdx

                  return (
                    <tr key={idx} className={cn(
                      'transition-colors',
                      z.row,
                      isCurrent && 'ring-2 ring-inset ring-halo-navy',
                    )}>
                      <td className="px-4 py-2.5 font-medium text-halo-black tabular-nums">
                        <div className="flex items-center gap-2">
                          <span className={cn('h-2 w-2 rounded-full flex-shrink-0', z.dot)} />
                          {formatBRL(s.salePrice)}
                          {isCurrent && (
                            <span className="rounded-full bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-950">
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
                      <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                        {formatPercent(s.roiPercent)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isRecommended && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-profit-50 px-2.5 py-0.5 text-[11px] font-semibold text-profit-500">
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
          <div className="px-5 py-3 border-t border-halo-gray bg-halo-gray-15 text-xs text-halo-navy-40">
            ★ Recomendado = primeiro preço que atinge {formatPercent(targetMargin * 100)} de margem alvo
          </div>
        </>
      )}
    </div>
  )
}
