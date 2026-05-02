/**
 * A/B test de pricing (Story MKT-001-4).
 * Variantes simples atribuídas via hash do cookie `sp_exp_pricing` que
 * persiste a escolha por sessão.
 *
 * Origem: Recomendação Finch (OMIE — testar antes de fixar) + Raduan
 * (declarar posicionamento).
 */

export type PricingVariant = 'A' | 'B' | 'C' | 'D'

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
  D: 49, // Variante D — Trial 14d Pro completo + fallback Free 1 SKU pós-expiração [VIAB-R3-1]
}

/**
 * Variante D usa Trial 14d em vez de Free tier eterno como onboarding.
 * Endereça M4 finding (Free tier viola padrão de mercado — 0/3 concorrentes BR usam).
 */
export const TRIAL_VARIANT: PricingVariant = 'D'
export const TRIAL_DURATION_DAYS = 14

export const PRICING_COOKIE = 'sp_exp_pricing'

export function pricingTableFor(variant: PricingVariant): PricingTable {
  const proPrice = VARIANT_PRICES[variant]
  const isTrialVariant = variant === 'D'
  return {
    variantId: variant,
    proPrice,
    plans: [
      {
        id: 'free',
        name: isTrialVariant ? 'Trial 14d' : 'Free',
        monthlyPrice: 0,
        features: isTrialVariant
          ? [
              'Pro completo grátis por 14 dias',
              'Sem cartão',
              'SKUs ilimitados durante trial',
              'Análise de mercado ilimitada',
              'Após expirar: Free 1 SKU',
            ]
          : [
              'Calculadora completa',
              'Até 5 SKUs no portfólio',
              'Análise de mercado: 10 buscas/mês',
              'Histórico de cálculos por SKU',
            ],
        cta: isTrialVariant ? 'Começar trial 14d grátis' : 'Começar grátis',
        href: isTrialVariant ? '/cadastro?trial=14' : '/cadastro',
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
  if (cookieValue === 'A' || cookieValue === 'B' || cookieValue === 'C' || cookieValue === 'D') {
    return cookieValue
  }
  // Distribuição uniforme entre 4 variantes. v0 não-determinístico — em produção,
  // hash do user-id (deterministicVariantFromUserId) garante estabilidade por usuário.
  const r = Math.random()
  if (r < 0.25) return 'A'
  if (r < 0.5) return 'B'
  if (r < 0.75) return 'C'
  return 'D'
}

/**
 * Bucket determinístico por user_id usando hash simples (FNV-1a) para A/B test
 * de Free eterno (variantes A/B/C agrupadas) vs Trial 14d (variante D).
 * Garante estabilidade da atribuição entre sessões e dispositivos do mesmo usuário.
 *
 * @param userId UUID do usuário (auth.users.id)
 * @returns 'D' (trial) se hash impar, 'B' (Free R$49 — variante mais estável) se par
 */
export function deterministicVariantFromUserId(userId: string): PricingVariant {
  let hash = 0x811c9dc5
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  // 50/50 split entre Trial (D) e Free B (controle)
  return (hash & 1) === 1 ? 'D' : 'B'
}
