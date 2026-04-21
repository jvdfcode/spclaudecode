'use client'

import { useState, useMemo } from 'react'
import type { ViabilityInput, ListingType } from '@/types'
import { calculateViability } from '@/lib/calculations'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/cn'
import ResultsPanel from './ResultsPanel'

const defaultInput: ViabilityInput = {
  productCost: 0,
  shippingCost: 0,
  packagingCost: 0,
  taxRate: 0.06,
  overheadRate: 0.05,
  targetMargin: 0.20,
  salePrice: 0,
  listingType: 'classic',
  installments: 1,
}

export default function CostForm() {
  const [input, setInput] = useState<ViabilityInput>(defaultInput)

  const result = useMemo(() => {
    if (input.salePrice <= 0 || input.productCost <= 0) return null
    try {
      return calculateViability(input)
    } catch {
      return null
    }
  }, [input])

  const setNum = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))
  }

  const setPercent = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(prev => ({ ...prev, [field]: (parseFloat(e.target.value) || 0) / 100 }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Formulário */}
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Dados do Produto</h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Custo do Produto (CMV)" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={setNum('productCost')} />
          </Field>

          <Field label="Preço de Venda" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={setNum('salePrice')} />
          </Field>

          <Field label="Embalagem" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={setNum('packagingCost')} />
          </Field>

          <Field label="Frete" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={setNum('shippingCost')} />
          </Field>

          <Field label="Imposto sobre venda" hint="%">
            <Input type="number" min={0} max={100} step={0.1} defaultValue={6}
              onChange={setPercent('taxRate')} />
          </Field>

          <Field label="Overhead" hint="%">
            <Input type="number" min={0} max={100} step={0.1} defaultValue={5}
              onChange={setPercent('overheadRate')} />
          </Field>

          <Field label="Margem alvo" hint="%">
            <Input type="number" min={0} max={100} step={0.1} defaultValue={20}
              onChange={setPercent('targetMargin')} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <Field label="Tipo de Anúncio">
            <NativeSelect
              defaultValue="classic"
              onChange={e => setInput(prev => ({ ...prev, listingType: e.target.value as ListingType }))}
              options={[
                { value: 'free', label: 'Gratuito (0%)' },
                { value: 'classic', label: 'Clássico (11%)' },
                { value: 'premium', label: 'Premium (17%)' },
              ]}
            />
          </Field>

          <Field label="Parcelas">
            <NativeSelect
              defaultValue="1"
              onChange={e => setInput(prev => ({ ...prev, installments: parseInt(e.target.value) }))}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1}x`,
              }))}
            />
          </Field>
        </div>
      </div>

      {/* Resultado */}
      <div>
        {result ? (
          <ResultsPanel result={result} />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-6 text-center text-gray-400">
            <p className="text-sm">Preencha o custo do produto e o preço de venda para ver o resultado</p>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-600">
        {label}{hint && <span className="ml-1 text-xs text-gray-400">({hint})</span>}
      </Label>
      {children}
    </div>
  )
}

function NativeSelect({
  options,
  defaultValue,
  onChange,
}: {
  options: { value: string; label: string }[]
  defaultValue?: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <select
      defaultValue={defaultValue}
      onChange={onChange}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1',
        'text-sm shadow-sm transition-colors',
        'focus:outline-none focus:ring-1 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
