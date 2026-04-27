'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import type { ViabilityInput, ViabilityResult } from '@/types'
import { useDecisionEngine } from '@/hooks/useDecisionEngine'
import type { DecisionOptionId, DecisionOption } from '@/hooks/useDecisionEngine'
import PositionOptions from './PositionOptions'
import { adoptSkuAction } from '@/app/(app)/calculadora/actions'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Props {
  input: ViabilityInput
  result: ViabilityResult
}

type AdoptState = 'idle' | 'form' | 'saving' | 'done' | 'error'

export default function DecisionPanel({ input, result }: Props) {
  const engine = useDecisionEngine(result)
  const [selected, setSelected] = useState<DecisionOptionId | null>(null)
  const [adoptState, setAdoptState] = useState<AdoptState>('idle')
  const [skuName, setSkuName] = useState('')
  const [skuNotes, setSkuNotes] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)

  if (!engine) return null

  const { options, summary } = engine
  const selectedOption: DecisionOption | null = options.find(o => o.id === selected) ?? null

  async function handleAdopt() {
    if (!selectedOption || !skuName.trim()) return
    setAdoptState('saving')
    const res = await adoptSkuAction(skuName, skuNotes || undefined, input, result, selectedOption.suggestedPrice)
    if (res.ok) {
      setSavedId(res.skuId)
      setAdoptState('done')
      toast.success(`Preço ${selectedOption.label} adotado — SKU "${skuName}" salvo!`)
    } else {
      setErrorMsg(res.error)
      setAdoptState('error')
      toast.error('Erro ao adotar preço. Tente novamente.')
    }
  }

  if (adoptState === 'done' && selectedOption) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center space-y-3">
        <p className="text-3xl" aria-hidden="true">✅</p>
        <p className="text-sm font-bold text-green-700">Preço adotado com sucesso!</p>
        <p className="text-xs text-green-600">
          <span className="font-semibold">{skuName}</span> · {formatBRL(selectedOption.suggestedPrice)} ({selectedOption.label})
        </p>
        <div className="flex justify-center gap-2 pt-1">
          <Link
            href={`/skus/${savedId}`}
            className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Ver SKU
          </Link>
          <Link
            href="/skus"
            className="rounded-lg border border-green-300 px-4 py-2 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors"
          >
            Meus SKUs
          </Link>
        </div>
        <button
          onClick={() => {
            setAdoptState('idle')
            setSelected(null)
            setSkuName('')
            setSkuNotes('')
            setSavedId(null)
          }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Fazer nova análise
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div>
        <h3 className="text-base font-extrabold text-ink-950">Decisão de Preço</h3>
        <p className="text-xs text-ink-700 mt-0.5">
          Escolha uma estratégia de posicionamento com base no seu custo
          {summary.hasMarketData ? ' e no mercado real.' : '.'}
        </p>
      </div>

      {/* Aviso sem dados de mercado */}
      {!summary.hasMarketData && (
        <div className="rounded-[12px] border border-[#cfd4ff] bg-[#eef0fb] px-3 py-2.5 text-xs text-ink-950 flex items-start gap-2">
          <span aria-hidden="true">💡</span>
          <span>
            Faça uma busca no <strong>Bloco Mercado</strong> para incluir dados reais da concorrência na análise.
          </span>
        </div>
      )}

      {/* Opções de posicionamento */}
      <PositionOptions options={options} selected={selected} onSelect={setSelected} />

      {/* Resumo da análise (visível quando há seleção) */}
      {selectedOption && (
        <div className="rounded-[20px] border border-paper-200 bg-white p-4 space-y-3">
          <p className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Resumo da análise</p>
          <div className={cn(
            'grid gap-2 text-center',
            summary.hasMarketData && summary.marketMedian !== null ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'
          )}>
            <SummaryItem label="Custo total" value={formatBRL(summary.totalCost)} />
            <SummaryItem
              label="Margem resultante"
              value={formatPercent(selectedOption.marginPercent)}
              accent={selectedOption.marginPercent >= 0}
              negative={selectedOption.marginPercent < 0}
            />
            {summary.hasMarketData && summary.marketMedian !== null && (
              <SummaryItem label="Mediana do mercado" value={formatBRL(summary.marketMedian)} />
            )}
            {summary.hasMarketData && summary.marketMedian !== null && (
              <SummaryItem
                label="Gap da mediana"
                value={`${selectedOption.suggestedPrice >= summary.marketMedian ? '+' : ''}${formatPercent(
                  ((selectedOption.suggestedPrice - summary.marketMedian) / summary.marketMedian) * 100
                )}`}
              />
            )}
          </div>
        </div>
      )}

      {/* Botão adotar (estado idle) */}
      {adoptState === 'idle' && (
        <button
          disabled={!selectedOption}
          onClick={() => setAdoptState('form')}
          aria-disabled={!selectedOption}
          className={cn(
            'w-full rounded-xl py-3 text-sm font-semibold transition-colors',
            selectedOption
              ? 'bg-ink-950 text-gold-400 hover:bg-ink-900 cursor-pointer'
              : 'bg-paper-100 text-ink-500 cursor-not-allowed'
          )}
        >
          {selectedOption ? `Adotar preço ${selectedOption.label} →` : 'Selecione uma opção'}
        </button>
      )}

      {/* Formulário de confirmação */}
      {(adoptState === 'form' || adoptState === 'saving' || adoptState === 'error') && selectedOption && (
        <div className="rounded-[20px] border border-paper-200 bg-white p-4 space-y-3 shadow-[0_4px_16px_rgba(45,50,119,0.06)]">
          <p className="text-sm font-semibold text-ink-900">
            Adotar{' '}
            <span className="font-extrabold text-ink-950">{formatBRL(selectedOption.suggestedPrice)}</span>
            {' '}— {selectedOption.label}
          </p>

          <div className="space-y-1.5">
            <label htmlFor="decision-sku-name" className="text-xs text-gray-500">
              Nome do produto <span className="text-red-400">*</span>
            </label>
            <Input
              id="decision-sku-name"
              autoFocus
              placeholder="Ex: Fone Bluetooth XYZ"
              value={skuName}
              onChange={e => setSkuName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdopt()}
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="decision-sku-notes" className="text-xs text-gray-500">
              Notas <span className="text-gray-300">(opcional)</span>
            </label>
            <Input
              id="decision-sku-notes"
              placeholder="Observações, variações, fornecedor..."
              value={skuNotes}
              onChange={e => setSkuNotes(e.target.value)}
              maxLength={300}
            />
          </div>

          {adoptState === 'error' && (
            <p role="alert" className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAdopt}
              disabled={!skuName.trim() || adoptState === 'saving'}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors',
                skuName.trim() && adoptState !== 'saving'
                  ? 'bg-ink-950 text-gold-400 hover:bg-ink-900'
                  : 'bg-paper-100 text-ink-500 cursor-not-allowed'
              )}
            >
              {adoptState === 'saving' ? 'Salvando...' : 'Confirmar adoção'}
            </button>
            <button
              onClick={() => { setAdoptState('idle'); setErrorMsg('') }}
              className="px-4 rounded-[12px] border border-paper-200 text-sm text-ink-700 hover:bg-paper-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryItem({
  label, value, accent, negative,
}: {
  label: string
  value: string
  accent?: boolean
  negative?: boolean
}) {
  return (
    <div className="rounded-[12px] border border-paper-200 bg-paper-100 p-2.5">
      <p className="text-[10px] text-ink-500">{label}</p>
      <p className={cn(
        'text-sm font-bold tabular-nums mt-0.5',
        accent ? 'text-ink-950' : negative ? 'text-loss-500' : 'text-ink-900'
      )}>
        {value}
      </p>
    </div>
  )
}
