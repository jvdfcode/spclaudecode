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
    <div className="rounded-[20px] border border-[#cfd4ff] bg-[linear-gradient(135deg,#eef0fb_0%,#f5f6ff_100%)] p-6 space-y-4 shadow-[0_4px_16px_rgba(45,50,119,0.06)]">

      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs font-extrabold text-gold-400">
          2
        </span>
        <span className="text-sm font-extrabold text-ink-950">Modo de compra</span>
      </div>

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
              'flex flex-col items-start gap-1.5 rounded-[16px] border-2 p-4 text-left transition-all',
              mode === opt.value
                ? 'border-ink-950 bg-white shadow-[0_4px_12px_rgba(45,50,119,0.12)]'
                : 'border-transparent bg-white/60 hover:bg-white/80'
            )}
          >
            <span className="text-2xl leading-none">{opt.icon}</span>
            <span className={cn(
              'text-sm font-semibold',
              mode === opt.value ? 'text-ink-950' : 'text-ink-700'
            )}>
              {opt.title}
            </span>
            <span className="text-[11px] text-ink-500 leading-snug">{opt.desc}</span>
          </button>
        ))}
      </div>

      {mode === 'massa' && (
        <div className="rounded-[16px] border border-paper-200 bg-white p-4 space-y-4">

          <p className="text-xs font-extrabold text-ink-700 uppercase tracking-wide">
            Calculadora de custo por unidade
          </p>

          <div className="grid grid-cols-2 gap-3">
            <BatchField label="Custo total do lote" hint="Quanto pagou pelo lote inteiro" suffix="R$">
              <input
                type="number" min={0} step={0.01} placeholder="0,00"
                value={batchCost}
                onChange={e => setBatchCost(e.target.value)}
                className="w-full rounded-[10px] border border-paper-200 bg-paper-100 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950"
              />
            </BatchField>

            <BatchField label="Quantidade de unidades" hint="Quantas unidades no lote">
              <input
                type="number" min={1} step={1} placeholder="0"
                value={units}
                onChange={e => setUnits(e.target.value)}
                className="w-full rounded-[10px] border border-paper-200 bg-paper-100 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950"
              />
            </BatchField>

            <BatchField label="Frete do lote" hint="Frete para receber o lote" suffix="R$">
              <input
                type="number" min={0} step={0.01} placeholder="0,00"
                value={shippingCost}
                onChange={e => setShippingCost(e.target.value)}
                className="w-full rounded-[10px] border border-paper-200 bg-paper-100 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950"
              />
            </BatchField>

            <BatchField label="Importação / taxa" hint="Despacho aduaneiro, II, etc." suffix="R$">
              <input
                type="number" min={0} step={0.01} placeholder="0,00"
                value={importCost}
                onChange={e => setImportCost(e.target.value)}
                className="w-full rounded-[10px] border border-paper-200 bg-paper-100 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950"
              />
            </BatchField>
          </div>

          <div className={cn(
            'rounded-[14px] p-4 text-center transition-colors',
            unitCost !== null
              ? 'bg-[linear-gradient(135deg,#eef0fb_0%,#f5f6ff_100%)] border border-[#cfd4ff]'
              : 'bg-paper-100 border border-paper-200'
          )}>
            {unitCost !== null ? (
              <>
                <p className="text-[11px] uppercase tracking-wider text-ink-700 mb-1">Custo por unidade</p>
                <p className="text-3xl font-extrabold text-ink-950 tabular-nums">{formatBRL(unitCost)}</p>
                <p className="text-[11px] text-ink-500 mt-1">
                  {formatBRL(totalBatchExpense)} ÷ {unitsN} unid. · será usado como custo do produto
                </p>
              </>
            ) : (
              <p className="text-xs text-ink-500">Preencha os campos acima para calcular o custo por unidade</p>
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
      <label className="text-xs font-medium text-ink-700">
        {label}{suffix && <span className="ml-1 text-[10px] text-ink-500">({suffix})</span>}
      </label>
      {hint && <p className="text-[10px] text-ink-500">{hint}</p>}
      {children}
    </div>
  )
}
