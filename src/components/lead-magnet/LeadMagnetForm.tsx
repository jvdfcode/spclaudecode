'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { calculateViability } from '@/lib/calculations'
import { trackFunnel } from '@/lib/analytics/events'
import type { ListingType, ViabilityInput, ViabilityResult } from '@/types'
import { captureLeadAction } from '@/app/calculadora-livre/actions'

const baseInput: ViabilityInput = {
  productCost: 0,
  shippingCost: 0,
  shippingMode: 'none',
  packagingCost: 0,
  taxRate: 0.06,
  overheadRate: 0.05,
  targetMargin: 0.2,
  salePrice: 0,
  listingType: 'classic',
  installments: 1,
  categoryId: null,
  commissionOverride: null,
  monthlyFixedCost: 0,
}

const LISTING_OPTIONS: { value: ListingType; label: string }[] = [
  { value: 'free', label: 'Grátis' },
  { value: 'classic', label: 'Clássico' },
  { value: 'premium', label: 'Premium' },
]

function brl(n: number): string {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function LeadMagnetForm() {
  const [productCost, setProductCost] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [listingType, setListingType] = useState<ListingType>('classic')
  const [installments, setInstallments] = useState(1)

  const [result, setResult] = useState<ViabilityResult | null>(null)

  const [email, setEmail] = useState('')
  const [optin, setOptin] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    const productCostNum = Number(productCost.replace(',', '.'))
    const salePriceNum = Number(salePrice.replace(',', '.'))

    if (!productCostNum || productCostNum <= 0) {
      toast.error('Informe o custo do produto.')
      return
    }
    if (!salePriceNum || salePriceNum <= 0) {
      toast.error('Informe o preço de venda.')
      return
    }

    try {
      const input: ViabilityInput = {
        ...baseInput,
        productCost: productCostNum,
        salePrice: salePriceNum,
        listingType,
        installments,
      }
      const r = calculateViability(input)
      setResult(r)
      trackFunnel('lead_magnet_calculated', {
        marginPercent: Number(r.metrics.marginPercent.toFixed(4)),
        classification: r.classification,
        listingType: r.input.listingType,
        installments: r.input.installments,
      })
    } catch (err) {
      toast.error('Não foi possível calcular. Verifique os valores informados.')
      console.error(err)
    }
  }

  function handleCaptureLead(e: React.FormEvent) {
    e.preventDefault()
    setEmailError('')

    startTransition(async () => {
      const r = await captureLeadAction({
        email,
        lgpdOptin: optin,
        context: result
          ? {
              productCost: result.input.productCost,
              salePrice: result.input.salePrice,
              listingType: result.input.listingType,
              installments: result.input.installments,
              marginPercent: result.metrics.marginPercent,
              classification: result.classification,
            }
          : null,
      })

      if (!r.ok) {
        setEmailError(r.error)
        return
      }

      setSubmitted(true)
      trackFunnel('lead_captured', {
        source: 'lead-magnet',
        hasContext: Boolean(result),
      })
      toast.success('Recebemos! Em instantes você vai receber o link no seu email.')
    })
  }

  const classificationCopy = (() => {
    if (!result) return null
    const margin = result.metrics.marginPercent * 100
    if (result.classification === 'viable') {
      return { tone: 'profit' as const, headline: `Margem de ${margin.toFixed(1)}% — viável.` }
    }
    if (result.classification === 'attention') {
      return { tone: 'warn' as const, headline: `Margem de ${margin.toFixed(1)}% — atenção.` }
    }
    return { tone: 'loss' as const, headline: `Margem de ${margin.toFixed(1)}% — inviável.` }
  })()

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCalculate}
        aria-label="Calculadora de viabilidade Mercado Livre"
        className="rounded-2xl border border-paper-200 bg-white p-6 shadow-[0_2px_8px_rgba(45,50,119,0.06)] space-y-5"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="lm-cost" className="text-xs font-semibold text-ink-700 uppercase tracking-wide">
              Custo do produto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-500">R$</span>
              <input
                id="lm-cost"
                type="text"
                inputMode="decimal"
                placeholder="50,00"
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
                className="w-full rounded-xl border border-paper-200 bg-white pl-9 pr-3 py-2.5 text-sm text-ink-950 focus:outline-none focus:ring-2 focus:ring-ink-950/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lm-sale" className="text-xs font-semibold text-ink-700 uppercase tracking-wide">
              Preço de venda
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-500">R$</span>
              <input
                id="lm-sale"
                type="text"
                inputMode="decimal"
                placeholder="89,90"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full rounded-xl border border-paper-200 bg-white pl-9 pr-3 py-2.5 text-sm text-ink-950 focus:outline-none focus:ring-2 focus:ring-ink-950/20"
              />
            </div>
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold text-ink-700 uppercase tracking-wide">
            Tipo de anúncio
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {LISTING_OPTIONS.map((opt) => {
              const checked = listingType === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setListingType(opt.value)}
                  className={
                    'rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all ' +
                    (checked
                      ? 'border-ink-950 bg-ink-950 text-gold-400'
                      : 'border-paper-200 bg-white text-ink-700 hover:border-ink-700')
                  }
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <div className="space-y-1.5">
          <label htmlFor="lm-installments" className="text-xs font-semibold text-ink-700 uppercase tracking-wide">
            Parcelamento
          </label>
          <select
            id="lm-installments"
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            className="w-full rounded-xl border border-paper-200 bg-white px-3 py-2.5 text-sm text-ink-950 focus:outline-none focus:ring-2 focus:ring-ink-950/20"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}x {n === 1 ? '(à vista)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="btn-genie w-full rounded-xl bg-ink-950 px-5 py-3 text-sm font-extrabold text-gold-400 shadow-[0_4px_14px_rgba(45,50,119,0.28)] transition-all hover:-translate-y-[2px] active:scale-[0.98]"
        >
          Calcular viabilidade
        </button>
      </form>

      {result && classificationCopy && (
        <section
          aria-live="polite"
          className={
            'rounded-2xl border-2 p-6 space-y-4 ' +
            (classificationCopy.tone === 'profit'
              ? 'border-profit-200 bg-profit-50'
              : classificationCopy.tone === 'warn'
              ? 'border-warn-200 bg-warn-50'
              : 'border-loss-200 bg-loss-50')
          }
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink-700">
              Resultado
            </p>
            <p className="mt-1 text-2xl font-extrabold text-ink-950">{classificationCopy.headline}</p>
            <p className="mt-2 text-sm text-ink-700">
              Lucro líquido por unidade: <strong>{brl(result.metrics.profit)}</strong> · ROI{' '}
              <strong>{(result.metrics.roiPercent * 100).toFixed(1)}%</strong>
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 text-xs">
            <Stat label="Custo total" value={brl(result.metrics.totalCost)} />
            <Stat
              label="Comissão ML"
              value={`${result.costBreakdown.effectiveCommissionPct.toFixed(2)}% (${brl(result.costBreakdown.commission)})`}
            />
            <Stat label="Preço mín. viável" value={brl(result.metrics.minimumViablePrice)} />
          </div>

          {!submitted ? (
            <form onSubmit={handleCaptureLead} className="space-y-3 pt-3 border-t border-paper-200">
              <p className="text-sm text-ink-950 font-semibold">
                Quer ver isso para os seus 50 SKUs? É grátis no MVP.
              </p>
              <div className="space-y-1.5">
                <label htmlFor="lm-email" className="sr-only">
                  Seu email
                </label>
                <input
                  id="lm-email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(emailError) || undefined}
                  aria-describedby={emailError ? 'lm-email-error' : undefined}
                  disabled={pending}
                  className="w-full rounded-xl border border-paper-200 bg-white px-3 py-2.5 text-sm text-ink-950 focus:outline-none focus:ring-2 focus:ring-ink-950/20 disabled:opacity-60"
                />
                {emailError && (
                  <span id="lm-email-error" className="block text-xs text-loss-500">
                    {emailError}
                  </span>
                )}
              </div>
              <label className="flex items-start gap-2 text-xs text-ink-700">
                <input
                  type="checkbox"
                  checked={optin}
                  onChange={(e) => setOptin(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-paper-200"
                  required
                  disabled={pending}
                />
                <span>
                  Aceito receber o link de acesso por email. Não envio spam — apenas o link e
                  ocasionais novidades sobre precificação no ML. Posso descadastrar a qualquer momento (LGPD).
                </span>
              </label>
              <button
                type="submit"
                disabled={pending}
                aria-busy={pending}
                className="btn-genie w-full rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-extrabold text-gold-400 shadow-[0_4px_14px_rgba(45,50,119,0.28)] transition-all hover:-translate-y-[2px] active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {pending ? 'Enviando…' : 'Quero o portfólio completo (grátis)'}
              </button>
            </form>
          ) : (
            <div
              role="status"
              className="rounded-xl border border-profit-200 bg-white p-4 text-sm text-ink-950"
            >
              ✓ Recebido! Em instantes você vai receber o link no email{' '}
              <strong>{email}</strong>. Não esqueça de checar a caixa de spam.
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-paper-200 p-3">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className="mt-1 text-sm font-extrabold tabular-nums text-ink-950">{value}</p>
    </div>
  )
}
