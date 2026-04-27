'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import type { ViabilityInput, ListingType, ShippingMode, MarketSummary } from '@/types'
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
import ProductIdentification from './ProductIdentification'
import ModeSelection from './ModeSelection'
import MlScenarioCards from '@/components/mercado/MlScenarioCards'

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
  const [input, setInput] = useState<ViabilityInput>(defaultInput)

  // Carregar sessionStorage só após mount (evita hydration mismatch SSR vs client)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(FORM_SESSION_KEY)
      if (saved) setInput({ ...defaultInput, ...JSON.parse(saved) } as ViabilityInput)
    } catch {}
  }, [])

  // Persistir no sessionStorage sempre que input mudar
  useEffect(() => {
    try { sessionStorage.setItem(FORM_SESSION_KEY, JSON.stringify(input)) } catch {}
  }, [input])

  const [productName, setProductName] = useState('')
  const [sku, setSku] = useState('')
  const [mlSummary, setMlSummary] = useState<MarketSummary | null>(null)

  const handleIdentificationChange = useCallback((data: { productName: string; sku: string; mlSummary: MarketSummary | null }) => {
    setProductName(data.productName)
    setSku(data.sku)
    setMlSummary(data.mlSummary)
  }, [])

  const [purchaseMode, setPurchaseMode] = useState<'avulso' | 'massa'>('avulso')

  const handleModeChange = useCallback((data: { mode: 'avulso' | 'massa'; unitCost: number | null }) => {
    setPurchaseMode(data.mode)
    if (data.mode === 'massa' && data.unitCost !== null) {
      setInput(prev => ({ ...prev, productCost: data.unitCost! }))
    }
  }, [])

  const [manualFee, setManualFee] = useState(false)
  const [manualFeeInput, setManualFeeInput] = useState('')
  const [showExtraCosts, setShowExtraCosts] = useState(false)
  const [showMlSection, setShowMlSection] = useState(false)
  const [showFreteSection, setShowFreteSection] = useState(false)
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
      <div className="space-y-4">

        {/* Etapa 1: Identificação do produto */}
        <ProductIdentification onChange={handleIdentificationChange} />

        {/* Etapa 2: Modo de compra */}
        <ModeSelection onChange={handleModeChange} />

        {/* Etapa 3: Custos e precificação */}
        <div className="space-y-2">
        <div className="rounded-[20px] border border-[#cfd4ff] bg-[linear-gradient(135deg,#eef0fb_0%,#f5f6ff_100%)] p-6 space-y-4 shadow-[0_4px_16px_rgba(45,50,119,0.06)]">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs font-extrabold text-gold-400">
              3
            </span>
            <span className="text-sm font-extrabold text-ink-950">Custos e precificação</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Custo do produto"
              hint={purchaseMode === 'massa' ? 'Calculado pelo rateio do lote acima' : 'Quanto você paga para adquirir/fabricar'}
              suffix="R$"
            >
              <Input
                type="number" min={0} step={0.01} placeholder="0,00"
                value={input.productCost || ''}
                onChange={setNum('productCost')}
                readOnly={purchaseMode === 'massa'}
                className={purchaseMode === 'massa'
                  ? 'h-11 text-base font-medium bg-[#eef0fb] border-[#cfd4ff] text-ink-700 cursor-default'
                  : 'h-11 text-base font-medium bg-white'}
              />
            </Field>
            <Field label="Preço de venda" hint="Valor que o comprador paga no ML" suffix="R$">
              <Input type="number" min={0} step={0.01} placeholder="0,00"
                value={input.salePrice || ''}
                onChange={setNum('salePrice')}
                className="h-11 text-base font-medium bg-white" />
            </Field>
          </div>
        </div>

        {/* Custos adicionais — colapsável */}
        <CollapsibleSection
          title="Outros custos e parâmetros"
          icon="⚙️"
          open={showExtraCosts}
          onToggle={() => setShowExtraCosts(v => !v)}
          summary={`Embalagem · Impostos ${(input.taxRate*100).toFixed(0)}% · Overhead ${(input.overheadRate*100).toFixed(0)}% · Margem alvo ${(input.targetMargin*100).toFixed(0)}%`}
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Embalagem" hint="Caixa, plástico bolha, fita, etc." suffix="R$">
              <Input type="number" min={0} step={0.01} placeholder="0,00"
                value={input.packagingCost || ''}
                onChange={setNum('packagingCost')} />
            </Field>
            <Field label="Imposto sobre venda" hint="Simples Nacional: ~6% | MEI: ~0%" suffix="%">
              <Input type="number" min={0} max={100} step={0.1}
                value={(input.taxRate * 100).toFixed(1)}
                onChange={setPercent('taxRate')} />
            </Field>
            <Field label="Overhead" hint="Aluguel, energia, pessoal, etc." suffix="%">
              <Input type="number" min={0} max={100} step={0.1}
                value={(input.overheadRate * 100).toFixed(1)}
                onChange={setPercent('overheadRate')} />
            </Field>
            <Field label="Margem alvo" hint="% mínima para considerar viável" suffix="%">
              <Input type="number" min={0} max={100} step={0.1}
                value={(input.targetMargin * 100).toFixed(1)}
                onChange={setPercent('targetMargin')} />
            </Field>
            <Field label="Custo fixo mensal" hint="Para calcular quantas unidades/mês você precisa vender" suffix="R$">
              <Input type="number" min={0} step={1} placeholder="0,00"
                value={input.monthlyFixedCost || ''}
                onChange={setNum('monthlyFixedCost')} />
            </Field>
          </div>
        </CollapsibleSection>

        {/* Taxas ML — colapsável */}
        <CollapsibleSection
          title="Taxas Mercado Livre"
          icon="🏪"
          open={showMlSection}
          onToggle={() => setShowMlSection(v => !v)}
          summary={`Anúncio ${input.listingType === 'free' ? 'Gratuito' : input.listingType === 'classic' ? 'Clássico' : 'Premium'} · ${effectiveCommissionPct}% comissão · ${input.installments}x`}
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-ink-700">Tipo de anúncio</Label>
              <p className="text-xs text-ink-500">Clássico = visibilidade padrão | Premium = destaque + frete grátis obrigatório</p>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {(['free', 'classic', 'premium'] as ListingType[]).map(type => (
                  <button key={type} type="button" onClick={() => handleListingType(type)}
                    className={cn(
                      'rounded-[12px] border py-2.5 text-sm font-semibold transition-all',
                      input.listingType === type
                        ? 'border-ink-950 bg-primary-50 text-ink-950 shadow-sm'
                        : 'border-paper-200 text-ink-700 hover:border-ink-950/30 hover:text-ink-950'
                    )}>
                    <div>{type === 'free' ? 'Gratuito' : type === 'classic' ? 'Clássico' : 'Premium'}</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {type === 'free' ? '0%' : type === 'classic' ? '11–14%' : '16–19%'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

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

            {input.listingType !== 'free' && (
              <label className="flex cursor-pointer items-start gap-2.5 text-sm select-none">
                <input type="checkbox" checked={manualFee}
                  onChange={e => handleManualFeeToggle(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-ink-950" />
                <div>
                  <span className="text-ink-900 font-medium">Inserir taxa manualmente</span>
                  <p className="text-xs text-ink-500 mt-0.5">Use quando o ML ofereceu uma condição especial</p>
                </div>
              </label>
            )}

            {manualFee && input.listingType !== 'free' && (
              <Field label="Taxa de comissão personalizada" suffix="%">
                <Input type="number" min={0} max={100} step={0.1} value={manualFeeInput}
                  placeholder={`Padrão: ${getCategoryFee(input.categoryId, input.listingType as 'classic' | 'premium')}%`}
                  onChange={e => {
                    setManualFeeInput(e.target.value)
                    const v = parseFloat(e.target.value)
                    setInput(prev => ({ ...prev, commissionOverride: isNaN(v) ? null : v }))
                  }} />
              </Field>
            )}

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

            {!feesLoading && input.listingType !== 'free' && (
              <div className="rounded-[16px] border border-primary-100 bg-primary-50 divide-y divide-primary-100 text-sm overflow-hidden">
                <FeeRow
                  label={manualFee && input.commissionOverride !== null ? 'Comissão (manual)' : `Comissão ${input.categoryId ? `· ${ML_CATEGORY_FEES.find(c => c.id === input.categoryId)?.name}` : '· taxa geral'}`}
                  pct={effectiveCommissionPct}
                  amount={input.salePrice > 0 ? input.salePrice * effectiveCommissionPct / 100 : null}
                  textColor="text-ink-950"
                />
                {installmentPct > 0 && (
                  <FeeRow label={`Parcelamento em ${input.installments}x`} pct={installmentPct}
                    amount={input.salePrice > 0 ? input.salePrice * installmentPct / 100 : null}
                    textColor="text-ink-700" prefix="+" />
                )}
                {installmentPct > 0 && (
                  <FeeRow label="Total ML" pct={effectiveCommissionPct + installmentPct}
                    amount={input.salePrice > 0 ? input.salePrice * (effectiveCommissionPct + installmentPct) / 100 : null}
                    textColor="text-ink-950" bold />
                )}
                {fixedCostLabel && (
                  <div className="flex items-center justify-between px-3 py-2 bg-warn-50">
                    <div>
                      <span className="font-medium text-warn-500">⚠ Custo fixo ML (preço &lt; R$79)</span>
                      <p className="text-xs text-warn-500 mt-0.5 opacity-80">{fixedCostLabel} · cobrado por unidade vendida</p>
                    </div>
                    <span className="font-bold text-warn-500">{formatBRL(fixedCostValue)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* Frete — colapsável */}
        <CollapsibleSection
          title="Modalidade de Frete"
          icon="🚚"
          open={showFreteSection}
          onToggle={() => setShowFreteSection(v => !v)}
          summary={input.shippingMode === 'none' ? 'Sem frete grátis — comprador paga' : input.shippingMode === 'full' ? 'Mercado Envios Full' : 'Mercado Envios'}
        >
          <div className="space-y-3">
            {([
              { mode: 'none' as ShippingMode,   label: 'Sem frete grátis',   desc: 'Comprador paga o frete — sem custo para você' },
              { mode: 'envios' as ShippingMode, label: 'Mercado Envios',      desc: 'Você despacha com etiqueta ML (Correios/transportadora)' },
              { mode: 'full' as ShippingMode,   label: 'Mercado Envios Full', desc: 'Estoque no armazém ML — custo variável por peso/dimensão' },
            ]).map(({ mode, label, desc }) => (
              <label key={mode} className={cn(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
                input.shippingMode === mode ? 'border-ink-950 bg-primary-50' : 'border-paper-200 hover:border-ink-950/30'
              )}>
                <input type="radio" name="shippingMode" value={mode}
                  checked={input.shippingMode === mode}
                  onChange={() => handleShippingMode(mode)}
                  className="mt-0.5 h-4 w-4 accent-ink-950" />
                <div>
                  <p className={cn('text-sm font-medium', input.shippingMode === mode ? 'text-ink-950' : 'text-ink-700')}>{label}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
            {input.shippingMode !== 'none' && (
              <Field
                label={input.shippingMode === 'full' ? 'Custo operacional (Full)' : 'Custo de frete estimado'}
                hint={input.shippingMode === 'full' ? 'Consulte o Seller Center do ML para o valor exato' : 'Custo médio que você paga por envio'}
                suffix="R$"
              >
                <Input type="number" min={0} step={0.01} placeholder="0,00"
                  value={input.shippingCost || ''}
                  onChange={setNum('shippingCost')} />
              </Field>
            )}
          </div>
        </CollapsibleSection>
        </div>{/* fim Etapa 3 */}
      </div>

      {/* ─── RESULTADO ─── */}
      <div className="lg:sticky lg:top-6 self-start space-y-4">
        {result ? (
          <>
            <ResultsPanel result={result} />
            <SaveSkuButton input={input} result={result} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-paper-200 bg-paper-100/40 p-10 text-center gap-3">
            <span className="text-4xl">🧮</span>
            <p className="text-sm font-extrabold text-ink-900">Calculadora pronta</p>
            <p className="text-xs text-ink-500">Preencha o <strong>custo do produto</strong> e o <strong>preço de venda</strong> acima para ver o resultado</p>
          </div>
        )}
      </div>
    </div>

    {/* ─── Etapa 4: Cenários com preços reais do ML ─── */}
    {mlSummary && mlSummary.cleanListings > 0 && input.productCost > 0 && (
      <div className="rounded-[20px] border border-paper-200 bg-white p-6 space-y-4 shadow-[0_4px_16px_rgba(45,50,119,0.04)]">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs font-extrabold text-gold-400">
            4
          </span>
          <span className="text-sm font-extrabold text-ink-950">Posicionamento no mercado</span>
        </div>
        <MlScenarioCards summary={mlSummary} costInput={input} />
      </div>
    )}

    {/* ─── TABELA DE CENÁRIOS ─── */}
    <ScenarioTable input={input} fees={fees} targetMargin={input.targetMargin} />

    {/* ─── Etapa 5: Decisão ─── */}
    {result && (
      <div className="rounded-[20px] border border-paper-200 bg-white p-6 space-y-4 shadow-[0_4px_16px_rgba(45,50,119,0.04)]">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-950 text-xs font-extrabold text-gold-400">
            5
          </span>
          <span className="text-sm font-extrabold text-ink-950">O que fazer com esse produto?</span>
        </div>
        <DecisionPanel input={input} result={result} />
      </div>
    )}
    </div>
  )
}

// ─── Sub-componentes ───

function CollapsibleSection({ title, icon, open, onToggle, summary, children }: {
  title: string; icon: string; open: boolean; onToggle: () => void; summary: string; children: React.ReactNode
}) {
  return (
    <div className="rounded-[20px] border border-paper-200 bg-white overflow-hidden">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-paper-100 transition-colors">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-sm font-semibold text-ink-900">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {!open && <span className="text-xs text-ink-500 hidden sm:block">{summary}</span>}
          <span className={cn('text-ink-500 transition-transform text-xs', open && 'rotate-180')}>▼</span>
        </div>
      </button>
      {open && <div className="px-5 pb-5 space-y-4 border-t border-paper-200 pt-4">{children}</div>}
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-paper-200 bg-white p-5 space-y-4">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-ink-900">
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
      <Label className="text-sm text-ink-700">
        {label}{suffix && <span className="ml-1 text-xs text-ink-500">({suffix})</span>}
      </Label>
      {hint && <p className="text-xs text-ink-500 leading-snug">{hint}</p>}
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
