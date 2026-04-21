'use client'

import { useState, useMemo } from 'react'
import type { ViabilityInput, ListingType, ShippingMode } from '@/types'
import { calculateViability } from '@/lib/calculations'
import { useMlFees } from '@/lib/hooks/useMlFees'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import ResultsPanel from './ResultsPanel'

const defaultInput: ViabilityInput = {
  productCost: 0,
  shippingCost: 0,
  shippingMode: 'none',
  packagingCost: 0,
  taxRate: 0.06,
  overheadRate: 0.05,
  targetMargin: 0.20,
  salePrice: 0,
  listingType: 'classic',
  installments: 1,
}

const SHIPPING_LABELS: Record<ShippingMode, string> = {
  none:   'Sem frete grátis (comprador paga)',
  envios: 'Mercado Envios',
  full:   'Mercado Envios Full',
}

export default function CostForm() {
  const [input, setInput] = useState<ViabilityInput>(defaultInput)
  const { fees, loading: feesLoading } = useMlFees()

  const result = useMemo(() => {
    if (input.salePrice <= 0 || input.productCost <= 0) return null
    try {
      return calculateViability(input, fees)
    } catch {
      return null
    }
  }, [input, fees])

  const commissionPct = fees.base[input.listingType] ?? 0
  const installmentPct = input.installments === 1
    ? 0
    : (fees.installment[input.listingType]?.[input.installments] ?? 0)
  const totalFeePct = commissionPct + installmentPct
  const totalFeeAmount = input.salePrice > 0 ? input.salePrice * totalFeePct / 100 : null

  const setNum = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))
  }

  const setPercent = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(prev => ({ ...prev, [field]: (parseFloat(e.target.value) || 0) / 100 }))
  }

  const handleShippingMode = (mode: ShippingMode) => {
    setInput(prev => ({
      ...prev,
      shippingMode: mode,
      shippingCost: mode === 'none' ? 0 : prev.shippingCost,
    }))
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

        {/* Taxas ML */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-700">Taxas Mercado Livre</h3>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo de Anúncio">
              <NativeSelect
                defaultValue="classic"
                onChange={e => setInput(prev => ({ ...prev, listingType: e.target.value as ListingType }))}
                options={[
                  { value: 'free',    label: `Gratuito (${fees.base.free}%)` },
                  { value: 'classic', label: `Clássico (${fees.base.classic}%)` },
                  { value: 'premium', label: `Premium (${fees.base.premium}%)` },
                ]}
              />
            </Field>

            <Field label="Parcelas máximas">
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

          {!feesLoading && (
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">Comissão do anúncio</span>
                <span className="font-medium text-blue-800">
                  {commissionPct}%
                  {input.salePrice > 0 && input.installments === 1
                    ? ` · ${formatBRL(input.salePrice * commissionPct / 100)}`
                    : ''}
                </span>
              </div>
              {installmentPct > 0 && (
                <>
                  <div className="flex justify-between mt-1">
                    <span className="text-blue-600">Custo de parcelamento</span>
                    <span className="font-medium text-blue-800">
                      +{installmentPct}%
                      {input.salePrice > 0
                        ? ` · ${formatBRL(input.salePrice * installmentPct / 100)}`
                        : ''}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-blue-200 mt-1 pt-1">
                    <span className="font-medium text-blue-700">Total ML</span>
                    <span className="font-bold text-blue-900">
                      {formatPercent(totalFeePct / 100)}
                      {totalFeeAmount !== null ? ` · ${formatBRL(totalFeeAmount)}` : ''}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Frete */}
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-700">Modalidade de Frete</h3>

          <div className="grid grid-cols-1 gap-2">
            {(Object.entries(SHIPPING_LABELS) as [ShippingMode, string][]).map(([mode, label]) => (
              <label key={mode} className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                input.shippingMode === mode
                  ? 'border-blue-400 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300'
              )}>
                <input
                  type="radio"
                  name="shippingMode"
                  value={mode}
                  checked={input.shippingMode === mode}
                  onChange={() => handleShippingMode(mode)}
                  className="h-4 w-4 accent-blue-600"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {input.shippingMode !== 'none' && (
            <Field label="Custo estimado de frete" hint="R$">
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="0,00"
                onChange={setNum('shippingCost')}
              />
            </Field>
          )}
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
