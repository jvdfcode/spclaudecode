import type { Metadata } from 'next'
import { getKpiBaseline } from '@/lib/analytics/kpis'

export const metadata: Metadata = {
  title: 'KPIs do funil',
}

// Dashboard interno de KPIs (Story MKT-001-5).
// Lê funnel_events + leads via service role e mostra os 4 KPIs baseline.
export default async function KpisPage() {
  const kpis = await getKpiBaseline(30)

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink-700">
          SmartPreço · KPIs
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-ink-950">
          Funil de aquisição (últimos {kpis.windowDays} dias)
        </h1>
        <p className="mt-1 text-xs text-ink-500">
          Atualizado em {new Date(kpis.generatedAt).toLocaleString('pt-BR')}
        </p>
      </header>

      <section aria-labelledby="aquisicao" className="space-y-3">
        <h2 id="aquisicao" className="text-sm font-extrabold uppercase tracking-wide text-ink-700">
          Aquisição
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard label="Páginas vistas" value={kpis.pageViews} hint="lead-magnet + /precos" />
          <KpiCard
            label="Cálculos no Lead Magnet"
            value={kpis.leadMagnetCalculations}
            hint="evento lead_magnet_calculated"
          />
          <KpiCard
            label="Pricing visualizado"
            value={kpis.pricingViewed}
            hint="evento pricing_viewed"
          />
        </div>
      </section>

      <section aria-labelledby="conversao" className="space-y-3">
        <h2 id="conversao" className="text-sm font-extrabold uppercase tracking-wide text-ink-700">
          Conversão
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Leads capturados"
            value={kpis.leadsCaptured}
            hint="tabela leads (com opt-in LGPD)"
          />
          <KpiCard
            label="Cálculo → Lead"
            value={`${(kpis.conversionLeadMagnetToLead * 100).toFixed(1)}%`}
            hint="leads / cálculos"
            highlight
          />
          <KpiCard
            label="Pricing → Click"
            value={`${(kpis.conversionPricingToClick * 100).toFixed(1)}%`}
            hint="cliques / visualizações"
            highlight
          />
        </div>
      </section>

      <section aria-labelledby="ab-test" className="space-y-3">
        <h2 id="ab-test" className="text-sm font-extrabold uppercase tracking-wide text-ink-700">
          A/B test de pricing (cliques por variante)
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {(['A', 'B', 'C'] as const).map((v) => (
            <KpiCard
              key={v}
              label={`Variante ${v}`}
              value={kpis.pricingClicksByVariant[v] ?? 0}
              hint={
                v === 'A' ? 'Pro a R$ 39' : v === 'B' ? 'Pro a R$ 49' : 'Pro a R$ 59'
              }
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-paper-200 bg-white p-6 text-sm text-ink-700 leading-relaxed">
        <p>
          Esses 4 KPIs são o baseline da Story MKT-001-5 (Bloco I — validação de mercado).
          Eles alimentam o output documental{' '}
          <code className="font-mono text-xs">docs/business/ICP-validation-2026-Q2.md</code>
          {' '}que é pré-requisito para liberar H2 (cleanup + performance).
        </p>
        <p className="mt-3">
          CAC e LTV ainda são <strong>hipóteses</strong> — vão ser preenchidos quando
          MKT-001-3 (entrevistas ICP) e MKT-001-2 (OMIE concorrência) gerarem os dados de
          custo de canal e ticket médio real.
        </p>
      </section>
    </div>
  )
}

function KpiCard({
  label,
  value,
  hint,
  highlight,
}: {
  label: string
  value: number | string
  hint?: string
  highlight?: boolean
}) {
  return (
    <div
      className={
        'rounded-2xl border-2 p-5 transition-all ' +
        (highlight
          ? 'border-ink-950 bg-white shadow-[0_4px_14px_rgba(45,50,119,0.08)]'
          : 'border-paper-200 bg-white')
      }
    >
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold tabular-nums text-ink-950">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-700">{hint}</p>}
    </div>
  )
}
