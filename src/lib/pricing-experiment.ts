/**
 * A/B test de pricing (Story MKT-001-4).
 * Variantes simples atribuídas via hash do cookie `sp_exp_pricing` que
 * persiste a escolha por sessão.
 *
 * Origem: Recomendação Finch (OMIE — testar antes de fixar) + Raduan
 * (declarar posicionamento).
 */

export type PricingVariant = 'A' | 'B' | 'C'

export interface PricingPlan {
  id: 'free' | 'pro' | 'agency'
  name: string
  monthlyPrice: number | null
  highlight?: boolean
  features: string[]
  cta: string
  href: string
}

export interface PricingTable {
  variantId: PricingVariant
  proPrice: number
  plans: PricingPlan[]
}

const VARIANT_PRICES: Record<PricingVariant, number> = {
  A: 39,
  B: 49,
  C: 59,
}

export const PRICING_COOKIE = 'sp_exp_pricing'

export function pricingTableFor(variant: PricingVariant): PricingTable {
  const proPrice = VARIANT_PRICES[variant]
  return {
    variantId: variant,
    proPrice,
    plans: [
      {
        id: 'free',
        name: 'Free',
        monthlyPrice: 0,
        features: [
          'Calculadora completa',
          'Até 5 SKUs no portfólio',
          'Análise de mercado: 10 buscas/mês',
          'Histórico de cálculos por SKU',
        ],
        cta: 'Começar grátis',
        href: '/cadastro',
      },
      {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: proPrice,
        highlight: true,
        features: [
          'Tudo do Free',
          'SKUs ilimitados',
          'Análise de mercado: ilimitada',
          'Cenários de preço com simulador',
          'Recálculo em lote do portfólio',
          'Suporte por email',
        ],
        cta: 'Assinar Pro',
        href: '/cadastro?plan=pro',
      },
      {
        id: 'agency',
        name: 'Agency',
        monthlyPrice: 149,
        features: [
          'Tudo do Pro',
          'Multi-conta ML (até 10)',
          'Relatórios mensais em PDF',
          'API + webhook (em breve)',
          'Suporte dedicado',
        ],
        cta: 'Falar com vendas',
        href: '/calculadora-livre?contact=agency',
      },
    ],
  }
}

/**
 * Decide a variante a partir do cookie atual; cai para distribuição
 * uniforme se cookie não existe ou é inválido.
 */
export function variantFromCookie(cookieValue: string | undefined): PricingVariant {
  if (cookieValue === 'A' || cookieValue === 'B' || cookieValue === 'C') {
    return cookieValue
  }
  // Distribuição estável usando contador interno (não-determinística por
  // request, OK para v0 — em produção, hash do user-id daria estabilidade).
  const r = Math.random()
  if (r < 1 / 3) return 'A'
  if (r < 2 / 3) return 'B'
  return 'C'
}
