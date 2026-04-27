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

  if (state === 'saved') {
    return (
      <div className="genie-pop-in rounded-[20px] border border-profit-200 bg-profit-50 p-5 space-y-4 shadow-[0_4px_16px_rgba(14,159,110,0.12)]">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-profit-500 shadow-[0_2px_8px_rgba(14,159,110,0.35)] text-white text-lg font-bold shrink-0">
            ✓
          </span>
          <div>
            <p className="text-sm font-bold text-profit-500">SKU salvo com sucesso!</p>
            <p className="text-xs text-profit-500 mt-0.5 opacity-80 truncate max-w-[180px]">{name}</p>
          </div>
        </div>

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

        <GenieButton
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => { window.location.href = `/mercado?q=${encodeURIComponent(name)}` }}
        >
          🔍 Comparar no ML
        </GenieButton>

        <button
          onClick={() => { setState('idle'); setName(''); setNotes(''); setSavedId(null) }}
          className="w-full text-xs text-ink-500 hover:text-ink-900 transition-colors pt-1"
        >
          Fazer novo cálculo
        </button>
      </div>
    )
  }

  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('form')}
        className="btn-genie w-full rounded-[16px] border-2 border-dashed border-primary-100 bg-primary-50 py-3 text-sm font-semibold text-ink-950 transition-all duration-200 hover:border-ink-950/30 hover:bg-[#eef0fb] hover:shadow-[0_2px_12px_rgba(45,50,119,0.12)] active:scale-[0.98]"
      >
        + Salvar como SKU
      </button>
    )
  }

  return (
    <div className="genie-pop-in rounded-[20px] border border-paper-200 bg-white p-4 space-y-3 shadow-[0_4px_16px_rgba(45,50,119,0.08)]">
      <p className="text-sm font-bold text-ink-950">Salvar como SKU</p>

      <div className="space-y-1.5">
        <label className="text-xs text-ink-700 font-medium">
          Nome do produto <span className="text-loss-500">*</span>
        </label>
        <Input
          autoFocus
          placeholder="Ex: Fone Bluetooth XYZ"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          maxLength={100}
          className="h-10 rounded-[12px]"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-ink-700 font-medium">
          Notas <span className="text-ink-500">(opcional)</span>
        </label>
        <Input
          placeholder="Observações, variações, fornecedor..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          maxLength={300}
          className="h-10 rounded-[12px]"
        />
      </div>

      {state === 'error' && (
        <p className="text-xs text-loss-500 bg-loss-50 rounded-[10px] px-3 py-2 border border-loss-200">
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
