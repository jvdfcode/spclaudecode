'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { ViabilityInput, ViabilityResult } from '@/types'
import { saveSkuAction } from '@/app/(app)/calculadora/actions'
import { Input } from '@/components/ui/input'
import { GenieButton } from '@/components/ui/genie-button'

interface Props {
  input: ViabilityInput
  result: ViabilityResult
}

type State = 'idle' | 'form' | 'saving' | 'saved' | 'error'

export default function SaveSkuButton({ input, result }: Props) {
  const [state, setState] = useState<State>('idle')
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) return
    setState('saving')
    const res = await saveSkuAction(name, notes || undefined, input, result)
    if (res.ok) {
      setSavedId(res.skuId)
      setState('saved')
      toast.success(`SKU "${name}" salvo com sucesso!`)
    } else {
      setErrorMsg(res.error)
      setState('error')
      toast.error('Erro ao salvar SKU. Tente novamente.')
    }
  }

  /* ── Estado: SKU salvo com sucesso ── */
  if (state === 'saved') {
    return (
      <div className="genie-pop-in rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5 space-y-4 shadow-[0_2px_16px_rgba(34,197,94,0.15)]">
        {/* Cabeçalho de sucesso */}
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shadow-[0_2px_8px_rgba(34,197,94,0.4)] text-white text-lg font-bold shrink-0">
            ✓
          </span>
          <div>
            <p className="text-sm font-bold text-green-800">SKU salvo com sucesso!</p>
            <p className="text-xs text-green-600 mt-0.5 truncate max-w-[180px]">{name}</p>
          </div>
        </div>

        {/* Ações primárias */}
        <div className="flex gap-2">
          <GenieButton
            variant="success"
            size="sm"
            fullWidth
            onClick={() => { window.location.href = `/skus/${savedId}` }}
          >
            Ver SKU
          </GenieButton>
          <GenieButton
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => { window.location.href = '/skus' }}
          >
            Meus SKUs
          </GenieButton>
        </div>

        {/* Ação de mercado */}
        <GenieButton
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => { window.location.href = `/mercado?q=${encodeURIComponent(name)}` }}
        >
          🔍 Comparar no ML
        </GenieButton>

        {/* Resetar */}
        <button
          onClick={() => { setState('idle'); setName(''); setNotes(''); setSavedId(null) }}
          className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1"
        >
          Fazer novo cálculo
        </button>
      </div>
    )
  }

  /* ── Estado: idle — botão convite ── */
  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('form')}
        className="btn-genie w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/60 py-3 text-sm font-semibold text-blue-700 transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-[0_2px_12px_rgba(59,130,246,0.18)] active:scale-[0.98]"
      >
        + Salvar como SKU
      </button>
    )
  }

  /* ── Estado: formulário de nome ── */
  return (
    <div className="genie-pop-in rounded-2xl border border-blue-200 bg-white p-4 space-y-3 shadow-[0_2px_14px_rgba(59,130,246,0.12)]">
      <p className="text-sm font-bold text-gray-800">Salvar como SKU</p>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">
          Nome do produto <span className="text-red-400">*</span>
        </label>
        <Input
          autoFocus
          placeholder="Ex: Fone Bluetooth XYZ"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          maxLength={100}
          className="h-10 rounded-xl"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500 font-medium">
          Notas <span className="text-gray-300">(opcional)</span>
        </label>
        <Input
          placeholder="Observações, variações, fornecedor..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          maxLength={300}
          className="h-10 rounded-xl"
        />
      </div>

      {state === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
          {errorMsg}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <GenieButton
          onClick={handleSave}
          disabled={!name.trim()}
          loading={state === 'saving'}
          variant={name.trim() ? 'primary' : 'ghost'}
          size="sm"
          className="flex-1"
        >
          Salvar
        </GenieButton>
        <GenieButton
          onClick={() => { setState('idle'); setName(''); setNotes(''); setErrorMsg('') }}
          variant="ghost"
          size="sm"
          className="px-4"
        >
          Cancelar
        </GenieButton>
      </div>
    </div>
  )
}
