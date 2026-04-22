'use client'

import { useState, useMemo, useEffect } from 'react'
import type { ViabilityInput, ListingType, ShippingMode } from '@/types'
import { calculateViability } from '@/lib/calculations'
import { useMlFees } from '@/lib/hooks/useMlFees'
import {
  ML_CATEGORY_FEES, ML_INSTALLMENT_FEES,
  getCategoryFee, getFixedCost, getFixedCostLabel,
} from '@/lib/mercadolivre.config'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { formatBRL, formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import ResultsPanel from './ResultsPanel'
import ScenarioTable from './ScenarioTable'
import SaveSkuButton from './SaveSkuButton'
import DecisionPanel from '@/components/decisao/DecisionPanel'

const FORM_SESSION_KEY = 'smartpreco_calc_form'

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
  monthlyFixedCost: 0,
}

export default function CostForm() {
  const [input, setInput] = useState<ViabilityInput>(() => {
    try {
      const saved = sessionStorage.getItem(FORM_SESSION_KEY)
      if (saved) return { ...defaultInput, ...JSON.parse(saved) } as ViabilityInput
    } catch {}
    return defaultInput
  })
  // Persistir estado no sessionStorage para não perder ao navegar entre páginas
  useEffect(() => {
    try { sessionStorage.setItem(FORM_SESSION_KEY, JSON.stringify(input)) } catch {}
  }, [input])

  const [manualFee, setManualFee] = useState(false)
  const [manualFeeInput, setManualFeeInput] = useState('')
  const { fees, loading: feesLoading } = useMlFees()

  const result = useMemo(() => {
    if (input.salePrice <= 0 || input.productCost <= 0) return null
    try { return calculateViability(input, fees) } catch { return null }
  }, [input, fees])

  const effectiveCommissionPct = input.commissionOverride !== null
    ? (input.commissionOverride ?? 0)
    : getCategoryFee(input.categoryId, input.listingType as 'classic' | 'premium' | 'free')

  const installmentPct = input.installments === 1
    ? 0
    : ((ML_INSTALLMENT_FEES[input.listingType] as Record<number, number>)?.[input.installments] ?? 0)

  const fixedCostValue = getFixedCost(input.salePrice)
  const fixedCostLabel = getFixedCostLabel(input.salePrice)

  const setNum = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(prev => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }))

  const setPercent = (field: keyof ViabilityInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(prev => ({ ...prev, [field]: (parseFloat(e.target.value) || 0) / 100 }))

  const handleListingType = (type: ListingType) =>
    setInput(prev => ({ ...prev, listingType: type, commissionOverride: null }))

  const handleCategory = (id: string) =>
    setInput(prev => ({ ...prev, categoryId: id === '' ? null : id, commissionOverride: null }))

  const handleManualFeeToggle = (on: boolean) => {
    setManualFee(on)
    if (!on) { setManualFeeInput(''); setInput(prev => ({ ...prev, commissionOverride: null })) }
  }

  const handleShippingMode = (mode: ShippingMode) =>
    setInput(prev => ({ ...prev, shippingMode: mode, shippingCost: mode === 'none' ? 0 : prev.shippingCost }))

  return (
    <div className="space-y-6">
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

      {/* ─── FORMULÁRIO ─── */}
      <div className="space-y-6">

        {/* Seção 1: Produto */}
        <Section title="Produto" icon="📦">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Custo do produto (CMV)" hint="Quanto você paga para adquirir/fabricar" suffix="R$">
              <Input type="number" min={0} step={0.01} placeholder="0,00" onChange={setNum('productCost')} />
            </Field>
            <Field label="Preço de venda" hint="Valor que o comprador paga no ML" suffix="R$">
              <Input type="number" min={0} step={0.01} placeholder="0,00" onChange={setNum('salePrice')} />
            </Field>
            <Field label="Embalagem" hint="Caixa, plástico bolha, fita, etc." suffix="R$">
              <Input type="number" min={0} step={0.01} placeholder="0,00" onChange={setNum('packagingCost')} />
            </Field>
            <Field label="Imposto sobre venda" hint="Simples Nacional: ~6% | MEI: ~0%" suffix="%">
              <Input type="number" min={0} max={100} step={0.1} defaultValue={6} onChange={setPercent('taxRate')} />
            </Field>
            <Field label="Overhead" hint="Aluguel, energia, pessoal, etc." suffix="%">
              <Input type="number" min={0} max={100} step={0.1} defaultValue={5} onChange={setPercent('overheadRate')} />
            </Field>
            <Field label="Margem alvo" hint="% mínima para considerar viável" suffix="%">
              <Input type="number" min={0} max={100} step={0.1} defaultValue={20} onChange={setPercent('targetMargin')} />
            </Field>
            <Field label="Custo fixo mensal" hint="Aluguel, funcionários, energia — para calcular quantas unidades/mês você precisa vender" suffix="R$">
              <Input type="number" min={0} step={1} placeholder="0,00" onChange={setNum('monthlyFixedCost')} />
            </Field>
          </div>
        </Section>

        {/* Seção 2: Taxas ML */}
        <Section title="Taxas Mercado Livre" icon="🏪">
          {/* Tipo de anúncio */}
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Tipo de anúncio</Label>
            <p className="text-xs text-gray-400">Clássico = visibilidade padrão | Premium = destaque + frete grátis obrigatório</p>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {(['free', 'classic', 'premium'] as ListingType[]).map(type => (
                <button key={type} type="button" onClick={() => handleListingType(type)}
                  className={cn(
                    'rounded-lg border py-2.5 text-sm font-medium transition-all',
                    input.listingType === type
                      ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  )}>
                  <div>{type === 'free' ? 'Gratuito' : type === 'classic' ? 'Clássico' : 'Premium'}</div>
                  <div className="text-xs opacity-70 mt-0.5">
                    {type === 'free' ? '0%' : type === 'classic' ? '11–14%' : '16–19%'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Categoria */}
          {input.listingType !== 'free' && !manualFee && (
            <Field label="Categoria do produto" hint="A taxa varia por categoria — selecione a mais próxima">
              <NativeSelect
                value={input.categoryId ?? ''}
                onChange={e => handleCategory(e.target.value)}
                options={[
                  { value: '', label: `Taxa geral (${input.listingType === 'classic' ? '11' : '17'}%)` },
                  ...ML_CATEGORY_FEES.map(c => ({
                    value: c.id,
                    label: `${c.name} — ${input.listingType === 'classic' ? c.classic : c.premium}%`,
                  })),
                ]}
              />
            </Field>
          )}

          {/* Toggle manual */}
          {input.listingType !== 'free' && (
            <label className="flex cursor-pointer items-start gap-2.5 text-sm select-none">
              <input type="checkbox" checked={manualFee}
                onChange={e => handleManualFeeToggle(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-blue-600" />
              <div>
                <span className="text-gray-700 font-medium">Inserir taxa manualmente</span>
                <p className="text-xs text-gray-400 mt-0.5">Use quando o ML ofereceu uma condição especial (ex: promoção, categoria diferente)</p>
              </div>
            </label>
          )}

          {manualFee && input.listingType !== 'free' && (
            <Field label="Taxa de comissão personalizada" hint="Informe o % que o ML cobra no seu caso" suffix="%">
              <Input type="number" min={0} max={100} step={0.1} value={manualFeeInput}
                placeholder={`Padrão: ${getCategoryFee(input.categoryId, input.listingType as 'classic' | 'premium')}%`}
                onChange={e => {
                  setManualFeeInput(e.target.value)
                  const v = parseFloat(e.target.value)
                  setInput(prev => ({ ...prev, commissionOverride: isNaN(v) ? null : v }))
                }} />
            </Field>
          )}

          {/* Parcelas */}
          <Field label="Parcelas máximas" hint="Custo adicional cobrado pelo ML ao parcelar sem juros">
            <NativeSelect
              value={String(input.installments)}
              onChange={e => setInput(prev => ({ ...prev, installments: parseInt(e.target.value) }))}
              options={Array.from({ length: 12 }, (_, i) => ({
                value: String(i + 1),
                label: i === 0
                  ? '1x (sem custo adicional)'
                  : `${i + 1}x (+${(ML_INSTALLMENT_FEES[input.listingType] as Record<number, number>)?.[i + 1] ?? 0}%)`,
              }))}
            />
          </Field>

          {/* Resumo das taxas ML */}
          {!feesLoading && input.listingType !== 'free' && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 divide-y divide-blue-100 text-sm overflow-hidden">
              <FeeRow
                label={manualFee && input.commissionOverride !== null ? 'Comissão (manual)' : `Comissão ${input.categoryId ? `· ${ML_CATEGORY_FEES.find(c => c.id === input.categoryId)?.name}` : '· taxa geral'}`}
                pct={effectiveCommissionPct}
                amount={input.salePrice > 0 ? input.salePrice * effectiveCommissionPct / 100 : null}
                textColor="text-blue-800"
              />
              {installmentPct > 0 && (
                <FeeRow
                  label={`Parcelamento em ${input.installments}x`}
                  pct={installmentPct}
                  amount={input.salePrice > 0 ? input.salePrice * installmentPct / 100 : null}
                  textColor="text-blue-700"
                  prefix="+"
                />
              )}
              {(installmentPct > 0) && (
                <FeeRow
                  label="Total ML"
                  pct={effectiveCommissionPct + installmentPct}
                  amount={input.salePrice > 0 ? input.salePrice * (effectiveCommissionPct + installmentPct) / 100 : null}
                  textColor="text-blue-900"
                  bold
                />
              )}
              {fixedCostLabel && (
                <div className="flex items-center justify-between px-3 py-2 bg-orange-50">
                  <div>
                    <span className="font-medium text-orange-700">⚠ Custo fixo ML (preço &lt; R$79)</span>
                    <p className="text-xs text-orange-500 mt-0.5">{fixedCostLabel} · cobrado por unidade vendida</p>
                  </div>
                  <span className="font-bold text-orange-700">{formatBRL(fixedCostValue)}</span>
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Seção 3: Frete */}
        <Section title="Modalidade de Frete" icon="🚚">
          <p className="text-xs text-gray-400 -mt-2">Escolha como o produto será entregue ao comprador</p>
          <div className="space-y-2">
            {([
              { mode: 'none' as ShippingMode,   label: 'Sem frete grátis',     desc: 'Comprador paga o frete — sem custo para você' },
              { mode: 'envios' as ShippingMode, label: 'Mercado Envios',        desc: 'Você despacha com etiqueta ML (Correios/transportadora)' },
              { mode: 'full' as ShippingMode,   label: 'Mercado Envios Full',   desc: 'Estoque no armazém ML — custo variável por peso/dimensão' },
            ]).map(({ mode, label, desc }) => (
              <label key={mode} className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
                input.shippingMode === mode
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}>
                <input type="radio" name="shippingMode" value={mode}
                  checked={input.shippingMode === mode}
                  onChange={() => handleShippingMode(mode)}
                  className="mt-0.5 h-4 w-4 accent-blue-600" />
                <div>
                  <p className={cn('text-sm font-medium', input.shippingMode === mode ? 'text-blue-900' : 'text-gray-700')}>{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>

          {input.shippingMode !== 'none' && (
            <Field
              label={input.shippingMode === 'full' ? 'Custo operacional (Full)' : 'Custo de frete estimado'}
              hint={input.shippingMode === 'full' ? 'Consulte o Seller Center do ML para o valor exato por produto' : 'Custo médio que você paga por envio'}
              suffix="R$"
            >
              <Input type="number" min={0} step={0.01} placeholder="0,00" onChange={setNum('shippingCost')} />
            </Field>
          )}
        </Section>
      </div>

      {/* ─── RESULTADO ─── */}
      <div className="lg:sticky lg:top-6 self-start space-y-4">
        {result ? (
          <>
            <ResultsPanel result={result} />
            <SaveSkuButton input={input} result={result} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-10 text-center gap-3">
            <span className="text-4xl">🧮</span>
            <p className="text-sm font-medium text-gray-500">Calculadora pronta</p>
            <p className="text-xs text-gray-400">Preencha o <strong>custo do produto</strong> e o <strong>preço de venda</strong> para ver o resultado em tempo real</p>
          </div>
        )}
      </div>
    </div>

    {/* ─── TABELA DE CENÁRIOS ─── */}
    <ScenarioTable input={input} fees={fees} targetMargin={input.targetMargin} />

    {/* ─── DECISÃO DE PREÇO ─── */}
    {result && (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <DecisionPanel input={input} result={result} />
      </div>
    )}
    </div>
  )
}

// ─── Sub-componentes ───

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <span>{icon}</span>{title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, hint, suffix, children }: {
  label: string; hint?: string; suffix?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-600">
        {label}{suffix && <span className="ml-1 text-xs text-gray-400">({suffix})</span>}
      </Label>
      {hint && <p className="text-xs text-gray-400 leading-snug">{hint}</p>}
      {children}
    </div>
  )
}

function FeeRow({ label, pct, amount, textColor, prefix = '', bold }: {
  label: string; pct: number; amount: number | null; textColor: string; prefix?: string; bold?: boolean
}) {
  return (
    <div className={cn('flex justify-between items-center px-3 py-2', bold && 'font-semibold')}>
      <span className={cn('text-sm', textColor)}>{label}</span>
      <span className={cn('tabular-nums text-sm', textColor)}>
        {prefix}{pct}%{amount !== null ? ` · ${formatBRL(amount)}` : ''}
      </span>
    </div>
  )
}

function NativeSelect({ options, value, onChange }: {
  options: { value: string; label: string }[]
  value?: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <select value={value} onChange={onChange}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1',
        'text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  )
}
