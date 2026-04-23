'use client'

import { useState, useEffect } from 'react'
import { formatBRL } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  onChange: (data: { mode: 'avulso' | 'massa'; unitCost: number | null }) => void
}

type Mode = 'avulso' | 'massa'

export default function ModeSelection({ onChange }: Props) {
  const [mode, setMode] = useState<Mode>('avulso')

  // Campos da compra em massa
  const [batchCost, setBatchCost]       = useState('')
  const [units, setUnits]               = useState('')
  const [shippingCost, setShippingCost] = useState('')
  const [importCost, setImportCost]     = useState('')

  const batchCostN    = parseFloat(batchCost)    || 0
  const unitsN        = parseInt(units)           || 0
  const shippingCostN = parseFloat(shippingCost) || 0
  const importCostN   = parseFloat(importCost)   || 0

  const totalBatchExpense = batchCostN + shippingCostN + importCostN
  const unitCost          = unitsN > 0 ? totalBatchExpense / unitsN : null

  useEffect(() => {
    if (mode === 'avulso') {
      onChange({ mode: 'avulso', unitCost: null })
    } else {
      onChange({ mode: 'massa', unitCost })
    }
  }, [mode, unitCost, onChange])

  return (
    <div className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50 p-6 space-y-4">

      {/* Indicador de etapa */}
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
          2
        </span>
        <span className="text-sm font-semibold text-violet-800">Modo de compra</span>
      </div>

      {/* Seletor de modo */}
      <div className="grid grid-cols-2 gap-3">
        {([
          {
            value: 'avulso' as Mode,
            icon: '📦',
            title: 'Compra avulsa',
            desc: 'Uma unidade por vez, custo direto do produto',
          },
          {
            value: 'massa' as Mode,
            icon: '🏭',
            title: 'Compra em massa',
            desc: 'Lote com frete, importação e rateio por unidade',
          },
        ]).map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            className={cn(
              'flex flex-col items-start gap-1.5 rounded-xl border-2 p-4 text-left transition-all',
              mode === opt.value
                ? 'border-violet-500 bg-white shadow-sm'
                : 'border-transparent bg-white/60 hover:bg-white/80'
            )}
          >
            <span className="text-2xl leading-none">{opt.icon}</span>
            <span className={cn(
              'text-sm font-semibold',
              mode === opt.value ? 'text-violet-800' : 'text-gray-600'
            )}>
              {opt.title}
            </span>
            <span className="text-[11px] text-gray-400 leading-snug">{opt.desc}</span>
          </button>
        ))}
      </div>

      {/* Calculadora de lote — só aparece em modo massa */}
      {mode === 'massa' && (
        <div className="rounded-xl border border-violet-100 bg-white p-4 space-y-4">

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Calculadora de custo por unidade
          </p>

          <div className="grid grid-cols-2 gap-3">
            <BatchField label="Custo total do lote" hint="Quanto pagou pelo lote inteiro" suffix="R$">
              <input
                type="number" min={0} step={0.01} placeholder="0,00"
                value={batchCost}
                onChange={e => setBatchCost(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </BatchField>

            <BatchField label="Quantidade de unidades" hint="Quantas unidades no lote">
              <input
                type="number" min={1} step={1} placeholder="0"
                value={units}
                onChange={e => setUnits(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </BatchField>

            <BatchField label="Frete do lote" hint="Frete para receber o lote" suffix="R$">
              <input
                type="number" min={0} step={0.01} placeholder="0,00"
                value={shippingCost}
                onChange={e => setShippingCost(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </BatchField>

            <BatchField label="Importação / taxa" hint="Despacho aduaneiro, II, etc." suffix="R$">
              <input
                type="number" min={0} step={0.01} placeholder="0,00"
                value={importCost}
                onChange={e => setImportCost(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </BatchField>
          </div>

          {/* Resultado do rateio */}
          <div className={cn(
            'rounded-xl p-4 text-center transition-colors',
            unitCost !== null ? 'bg-violet-50 border border-violet-200' : 'bg-gray-50 border border-gray-100'
          )}>
            {unitCost !== null ? (
              <>
                <p className="text-[11px] uppercase tracking-wider text-violet-500 mb-1">Custo por unidade</p>
                <p className="text-3xl font-bold text-violet-700 tabular-nums">{formatBRL(unitCost)}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatBRL(totalBatchExpense)} ÷ {unitsN} unid. · será usado como custo do produto
                </p>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-400">Preencha os campos acima para calcular o custo por unidade</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function BatchField({ label, hint, suffix, children }: {
  label: string; hint?: string; suffix?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">
        {label}{suffix && <span className="ml-1 text-[10px] text-gray-400">({suffix})</span>}
      </label>
      {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
      {children}
    </div>
  )
}
