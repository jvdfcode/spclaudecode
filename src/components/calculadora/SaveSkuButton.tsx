'use client'

import { useState } from 'react'
import type { ViabilityInput, ViabilityResult } from '@/types'
import { saveSkuAction } from '@/app/(app)/calculadora/actions'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'

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
    } else {
      setErrorMsg(res.error)
      setState('error')
    }
  }

  if (state === 'saved') {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-bold text-lg">✓</span>
          <span className="text-sm font-semibold text-green-700">SKU salvo com sucesso!</span>
        </div>
        <div className="flex gap-2">
          <a
            href={`/skus/${savedId}`}
            className="flex-1 rounded-lg bg-green-600 py-2 text-center text-sm font-semibold text-white hover:bg-green-700 transition-colors"
          >
            Ver SKU
          </a>
          <a
            href="/skus"
            className="flex-1 rounded-lg border border-green-300 py-2 text-center text-sm font-medium text-green-700 hover:bg-green-100 transition-colors"
          >
            Meus SKUs
          </a>
        </div>
        <button
          onClick={() => { setState('idle'); setName(''); setNotes(''); setSavedId(null) }}
          className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
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
        className="w-full rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 hover:border-blue-400 transition-colors"
      >
        + Salvar como SKU
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-blue-200 bg-white p-4 space-y-3 shadow-sm">
      <p className="text-sm font-semibold text-gray-800">Salvar como SKU</p>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500">Nome do produto <span className="text-red-400">*</span></label>
        <Input
          autoFocus
          placeholder="Ex: Fone Bluetooth XYZ"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          maxLength={100}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-gray-500">Notas <span className="text-gray-300">(opcional)</span></label>
        <Input
          placeholder="Observações, variações, fornecedor..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          maxLength={300}
        />
      </div>

      {state === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={!name.trim() || state === 'saving'}
          className={cn(
            'flex-1 rounded-lg py-2 text-sm font-semibold transition-colors',
            name.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          )}
        >
          {state === 'saving' ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          onClick={() => { setState('idle'); setName(''); setNotes(''); setErrorMsg('') }}
          className="px-4 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
