import { createServiceSupabase } from '@/lib/supabase/server'

/**
 * Cálculo dos 4 KPIs baseline da Story MKT-001-5.
 * Lê `funnel_events` (migration 011) e `leads` (migration 010).
 *
 * Janela default: últimos 30 dias.
 */

export interface KpiBaseline {
  windowDays: number
  // Aquisição
  pageViews: number // pricing_viewed + lead_magnet calculated
  leadMagnetCalculations: number
  // Conversão de funil
  leadsCaptured: number
  pricingViewed: number
  pricingPlanClicked: number
  // KPI ativos
  conversionLeadMagnetToLead: number // leads / lead_magnet_calculated
  conversionPricingToClick: number // pricing_plan_clicked / pricing_viewed
  // Variantes A/B (top-3 por cliques)
  pricingClicksByVariant: Record<string, number>
  generatedAt: string
}

const EVENT_NAMES = [
  'lead_magnet_calculated',
  'lead_captured',
  'pricing_viewed',
  'pricing_plan_clicked',
] as const

interface CountRow {
  name: string
  count: number
}

interface PricingClickRow {
  payload: { variant?: string }
}

export async function getKpiBaseline(windowDays = 30): Promise<KpiBaseline> {
  const supabase = createServiceSupabase()
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString()

  // 1) Contagem por evento
  const counts: Record<string, number> = Object.fromEntries(EVENT_NAMES.map((n) => [n, 0]))

  for (const name of EVENT_NAMES) {
    const { count } = await supabase
      .from('funnel_events')
      .select('id', { count: 'exact', head: true })
      .eq('name', name)
      .gte('created_at', since)
    counts[name] = count ?? 0
  }

  // 2) Cliques por variante (top do A/B test)
  const { data: clicks } = await supabase
    .from('funnel_events')
    .select('payload')
    .eq('name', 'pricing_plan_clicked')
    .gte('created_at', since)
    .returns<PricingClickRow[]>()

  const pricingClicksByVariant: Record<string, number> = { A: 0, B: 0, C: 0 }
  for (const row of clicks ?? []) {
    const v = row.payload?.variant
    if (v === 'A' || v === 'B' || v === 'C') {
      pricingClicksByVariant[v] = (pricingClicksByVariant[v] ?? 0) + 1
    }
  }

  // 3) Leads — fonte primária é a tabela `leads`, não funnel_events
  const { count: leadsCaptured } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', since)

  const leadMagnetCalculations = counts.lead_magnet_calculated
  const pricingViewed = counts.pricing_viewed
  const pricingPlanClicked = counts.pricing_plan_clicked
  const leads = leadsCaptured ?? 0

  return {
    windowDays,
    pageViews: leadMagnetCalculations + pricingViewed,
    leadMagnetCalculations,
    leadsCaptured: leads,
    pricingViewed,
    pricingPlanClicked,
    conversionLeadMagnetToLead: ratio(leads, leadMagnetCalculations),
    conversionPricingToClick: ratio(pricingPlanClicked, pricingViewed),
    pricingClicksByVariant,
    generatedAt: new Date().toISOString(),
  }
}

function ratio(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return Number((numerator / denominator).toFixed(4))
}

interface CountFn {
  (): Promise<{ count: number }>
}

// Helpers exportados para teste unitário (mantêm a aritmética testável
// sem precisar mockar Supabase inteiro)
export function _ratioForTesting(n: number, d: number): number {
  return ratio(n, d)
}
export type { CountRow, CountFn }
