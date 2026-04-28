'use client'

import { useEffect } from 'react'
import { trackFunnel } from '@/lib/analytics/events'
import type { PricingPlan, PricingTable } from '@/lib/pricing-experiment'

interface Props {
  table: PricingTable
}

export default function PricingTableClient({ table }: Props) {
  // Persiste a variante atribuída no cookie + emite pricing_viewed na primeira render
  useEffect(() => {
    document.cookie = `sp_exp_pricing=${table.variantId}; path=/; max-age=2592000; SameSite=Lax`
    trackFunnel('pricing_viewed', { variant: table.variantId, proPrice: table.proPrice })
  }, [table.variantId, table.proPrice])

  function handleClick(plan: PricingPlan) {
    trackFunnel('pricing_plan_clicked', {
      plan: plan.id,
      variant: table.variantId,
      proPrice: table.proPrice,
      monthlyPrice: plan.monthlyPrice,
    })
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {table.plans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} onClick={() => handleClick(plan)} />
      ))}
    </div>
  )
}

function PlanCard({ plan, onClick }: { plan: PricingPlan; onClick: () => void }) {
  const priceLabel =
    plan.monthlyPrice === 0
      ? 'R$ 0'
      : plan.monthlyPrice == null
      ? 'sob consulta'
      : `R$ ${plan.monthlyPrice}`

  return (
    <article
      className={
        'relative rounded-2xl border-2 p-6 transition-all ' +
        (plan.highlight
          ? 'border-ink-950 bg-white shadow-[0_8px_24px_rgba(45,50,119,0.12)]'
          : 'border-paper-200 bg-white hover:border-ink-700')
      }
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ink-950 text-gold-400 text-[10px] font-extrabold uppercase tracking-[0.16em] px-3 py-1">
          Mais popular
        </span>
      )}

      <h2 className="text-lg font-extrabold text-ink-950">{plan.name}</h2>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-ink-950 tabular-nums">{priceLabel}</span>
        {plan.monthlyPrice != null && plan.monthlyPrice > 0 && (
          <span className="text-sm text-ink-500">/mês</span>
        )}
      </div>

      <ul className="mt-5 space-y-2 text-sm text-ink-700">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2">
            <span className="mt-0.5 text-profit-500" aria-hidden="true">
              ✓
            </span>
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      <a
        href={plan.href}
        onClick={onClick}
        className={
          'btn-genie mt-6 inline-flex w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-extrabold transition-all ' +
          (plan.highlight
            ? 'bg-ink-950 text-gold-400 shadow-[0_4px_14px_rgba(45,50,119,0.28)] hover:-translate-y-[2px]'
            : 'border-2 border-ink-950 text-ink-950 hover:bg-ink-950 hover:text-white')
        }
      >
        {plan.cta}
      </a>
    </article>
  )
}
