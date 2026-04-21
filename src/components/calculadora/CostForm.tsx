'use client'

import { useState, useMemo } from 'react'
import type { ViabilityInput, ListingType } from '@/types'
import { calculateViability } from '@/lib/calculations'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

  const setNum = (field: keyof ViabilityInput, raw: string) => {
    const value = parseFloat(raw) || 0
    setInput(prev => ({ ...prev, [field]: value }))
  }

  const setPercent = (field: keyof ViabilityInput, raw: string) => {
    const value = (parseFloat(raw) || 0) / 100
    setInput(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Formulário */}
      <div className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Dados do Produto</h2>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Custo do Produto (CMV)" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={e => setNum('productCost', e.target.value)} />
          </Field>

          <Field label="Preço de Venda" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={e => setNum('salePrice', e.target.value)} />
          </Field>

          <Field label="Embalagem" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={e => setNum('packagingCost', e.target.value)} />
          </Field>

          <Field label="Frete" hint="R$">
            <Input type="number" min={0} step={0.01} placeholder="0,00"
              onChange={e => setNum('shippingCost', e.target.value)} />
          </Field>

          <Field label="Imposto sobre venda" hint="%">
            <Input type="number" min={0} max={100} step={0.1} defaultValue={6}
              onChange={e => setPercent('taxRate', e.target.value)} />
          </Field>

          <Field label="Overhead" hint="%">
            <Input type="number" min={0} max={100} step={0.1} defaultValue={5}
              onChange={e => setPercent('overheadRate', e.target.value)} />
          </Field>

          <Field label="Margem alvo" hint="%">
            <Input type="number" min={0} max={100} step={0.1} defaultValue={20}
              onChange={e => setPercent('targetMargin', e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <Field label="Tipo de Anúncio">
            <Select defaultValue="classic"
              onValueChange={v => setInput(prev => ({ ...prev, listingType: v as ListingType }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Gratuito (0%)</SelectItem>
                <SelectItem value="classic">Clássico (11%)</SelectItem>
                <SelectItem value="premium">Premium (17%)</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Parcelas">
            <Select defaultValue="1"
              onValueChange={(v) => v && setInput(prev => ({ ...prev, installments: parseInt(v) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                  <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      {/* Resultado */}
      <div>
        {result ? (
          <ResultsPanel result={result} />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
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
