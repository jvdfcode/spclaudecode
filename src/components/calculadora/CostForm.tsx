'use client'

import { useState, useMemo } from 'react'
import type { ViabilityInput, ListingType, ShippingMode } from '@/types'
import { calculateViability } from '@/lib/calculations'
import { useMlFees } from '@/lib/hooks/useMlFees'
import { ML_CATEGORY_FEES, ML_INSTALLMENT_FEES, getCategoryFee } from '@/lib/mercadolivre.config'
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
  categoryId: null,
  commissionOverride: null,
}

const SHIPPING_LABELS: Record<ShippingMode, string> = {
  none:   'Sem frete grátis (comprador paga)',
  envios: 'Mercado Envios',
  full:   'Mercado Envios Full',
}

export default function CostForm() {
  const [input, setInput] = useState<ViabilityInput>(defaultInput)
  const [manualFee, setManualFee] = useState(false)
  const [manualFeeInput, setManualFeeInput] = useState('')
  const { fees, loading: feesLoading } = useMlFees()

  const result = useMemo(() => {
    if (input.salePrice <= 0 || input.productCost <= 0) return null
    try {
      return calculateViability(input, fees)
    } catch {
      return null
    }
  }, [input, fees])

  // Taxa efetiva para display
  const effectiveCommissionPct = input.commissionOverride !== null
    ? (input.commissionOverride ?? 0)
    : getCategoryFee(input.categoryId, input.listingType as 'classic' | 'premium' | 'free')

  const installmentPct = input.installments === 1
    ? 0
    : ((ML_INSTALLMENT_FEES[input.listingType] as Record<number, number>)?.[input.installments] ?? 0)
  const totalFeePct = effectiveCommissionPct + installmentPct
  const commissionAmount = input.salePrice > 0 ? input.salePrice * effectiveCommissionPct / 100 : null
  const totalFeeAmount = input.salePrice > 0 ? input.salePrice * totalFeePct / 100 : null

  const setNum = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))

  const setPercent = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(prev => ({ ...prev, [field]: (parseFloat(e.target.value) || 0) / 100 }))

  const handleShippingMode = (mode: ShippingMode) =>
    setInput(prev => ({ ...prev, shippingMode: mode, shippingCost: mode === 'none' ? 0 : prev.shippingCost }))

  const handleListingType = (type: ListingType) => {
    setInput(prev => ({ ...prev, listingType: type }))
    if (!manualFee) {
      // Resetar override ao trocar tipo
      setInput(prev => ({ ...prev, listingType: type, commissionOverride: null }))
    }
  }

  const handleCategory = (id: string) => {
    const categoryId = id === '' ? null : id
    setInput(prev => ({ ...prev, categoryId, commissionOverride: null }))
  }

  const handleManualFeeToggle = (on: boolean) => {
    setManualFee(on)
    if (!on) {
      setManualFeeInput('')
      setInput(prev => ({ ...prev, commissionOverride: null }))
    }
  }

  const handleManualFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setManualFeeInput(raw)
    const parsed = parseFloat(raw)
    setInput(prev => ({
      ...prev,
      commissionOverride: isNaN(parsed) ? null : parsed,
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

          {/* Tipo de anúncio */}
          <div className="grid grid-cols-3 gap-2">
            {(['free', 'classic', 'premium'] as ListingType[]).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleListingType(type)}
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm transition-colors text-center',
                  input.listingType === type
                    ? 'border-blue-400 bg-blue-50 font-semibold text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                )}
              >
                {type === 'free' ? 'Gratuito' : type === 'classic' ? 'Clássico' : 'Premium'}
              </button>
            ))}
          </div>

          {/* Categoria */}
          {input.listingType !== 'free' && !manualFee && (
            <Field label="Categoria do produto">
              <NativeSelect
                value={input.categoryId ?? ''}
                onChange={e => handleCategory(e.target.value)}
                options={[
                  { value: '', label: 'Geral (taxa padrão)' },
                  ...ML_CATEGORY_FEES.map(c => ({
                    value: c.id,
                    label: `${c.name} — ${input.listingType === 'classic' ? c.classic : c.premium}%`,
                  })),
                ]}
              />
            </Field>
          )}

          {/* Parcelas */}
          <Field label="Parcelas máximas">
            <NativeSelect
              value={String(input.installments)}
              onChange={e => setInput(prev => ({ ...prev, installments: parseInt(e.target.value) }))}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1}x`,
              }))}
            />
          </Field>

          {/* Toggle manual */}
          {input.listingType !== 'free' && (
            <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
              <input
                type="checkbox"
                checked={manualFee}
                onChange={e => handleManualFeeToggle(e.target.checked)}
                className="h-4 w-4 rounded accent-blue-600"
              />
              <span className="text-gray-600">Inserir taxa de comissão manualmente</span>
            </label>
          )}

          {manualFee && input.listingType !== 'free' && (
            <Field label="Taxa de comissão" hint="%">
              <Input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={manualFeeInput}
                placeholder={`Ex: ${getCategoryFee(input.categoryId, input.listingType as 'classic' | 'premium')}`}
                onChange={handleManualFeeChange}
              />
            </Field>
          )}

          {/* Display de taxas */}
          {!feesLoading && input.listingType !== 'free' && (
            <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-600">
                  Comissão
                  {manualFee && input.commissionOverride !== null
                    ? ' (manual)'
                    : input.categoryId
                      ? ` (${ML_CATEGORY_FEES.find(c => c.id === input.categoryId)?.name})`
                      : ' (geral)'}
                </span>
                <span className="font-medium text-blue-800">
                  {effectiveCommissionPct}%
                  {commissionAmount !== null ? ` · ${formatBRL(commissionAmount)}` : ''}
                </span>
              </div>
              {installmentPct > 0 && (
                <div className="flex justify-between">
                  <span className="text-blue-600">Parcelamento ({input.installments}x)</span>
                  <span className="font-medium text-blue-800">
                    +{installmentPct}%
                    {input.salePrice > 0 ? ` · ${formatBRL(input.salePrice * installmentPct / 100)}` : ''}
                  </span>
                </div>
              )}
              {(installmentPct > 0) && (
                <div className="flex justify-between border-t border-blue-200 pt-1">
                  <span className="font-medium text-blue-700">Total ML</span>
                  <span className="font-bold text-blue-900">
                    {formatPercent(totalFeePct / 100)}
                    {totalFeeAmount !== null ? ` · ${formatBRL(totalFeeAmount)}` : ''}
                  </span>
                </div>
              )}
              {input.salePrice > 0 && input.salePrice < 79 && input.salePrice >= 10 && (
                <div className="flex justify-between border-t border-orange-200 pt-1 mt-1">
                  <span className="text-orange-600 font-medium">⚠ Custo fixo (item &lt; R$79)</span>
                  <span className="font-bold text-orange-700">
                    {formatBRL(input.salePrice <= 20 ? 5.50 : 6.00)}
                  </span>
                </div>
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
                type="number" min={0} step={0.01} placeholder="0,00"
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
  value,
  onChange,
}: {
  options: { value: string; label: string }[]
  value?: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <select
      value={value}
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
