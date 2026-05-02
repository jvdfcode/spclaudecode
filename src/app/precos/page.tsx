import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import PricingTableClient from '@/components/pricing/PricingTableClient'
import PricingTracking from '@/components/pricing/PricingTracking'
import { PRICING_COOKIE, pricingTableFor, variantFromCookie } from '@/lib/pricing-experiment'

export const metadata: Metadata = {
  title: 'Pare de precificar no escuro — SmartPreço para vendedores Mercado Livre',
  description:
    'Vendedores ML perdem entre R$ 500 e R$ 1.500/mês com erro de pricing. Por R$ 39/mês, você para de perder.',
  openGraph: {
    title: 'Pare de precificar no escuro',
    description:
      'Veja exatamente onde sua margem está vazando — e corrija hoje. Calculadora de margem real para Mercado Livre Brasil.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default async function PricingPage() {
  const cookieStore = await cookies()
  const variant = variantFromCookie(cookieStore.get(PRICING_COOKIE)?.value)
  const table = pricingTableFor(variant)

  return (
    <div className="min-h-screen bg-halo-gray-05">
      <header className="border-b border-halo-gray bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-halo-navy text-halo-orange text-sm font-extrabold">
              SP
            </div>
            <span className="text-sm font-extrabold tracking-[-0.02em] text-halo-navy">SmartPreço</span>
          </a>
          <a
            href="/login"
            className="text-sm font-medium text-halo-navy-60 hover:text-halo-navy transition-colors"
          >
            Já tenho conta →
          </a>
        </div>
      </header>

      <PricingTracking />

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <section className="mb-12 text-center space-y-5">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-halo-navy leading-tight">
            Pare de precificar no escuro.
            <br className="hidden md:block" />
            Veja exatamente onde sua margem está vazando — e corrija hoje.
          </h1>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-halo-navy-80 leading-relaxed">
            Vendedores ML perdem entre <strong>R$ 500 e R$ 1.500/mês</strong> com erro de pricing.<sup>*</sup>
            Por R$ 39/mês, você para de perder.
          </p>

          {/* 3 stat cards above-the-fold (estilo VIAB-R1-2) */}
          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto pt-4">
            <div className="rounded-2xl border border-halo-gray bg-white p-5">
              <p
                className="text-3xl font-extrabold text-halo-navy tabular-nums"
                style={{ fontFamily: 'var(--font-instrument-serif, Georgia, serif)' }}
              >
                R$ 39
              </p>
              <p className="mt-1 text-xs text-halo-navy-60">por mês — plano entry</p>
            </div>
            <div className="rounded-2xl border border-halo-orange-30 bg-halo-orange-05 p-5">
              <p
                className="text-3xl font-extrabold text-halo-orange tabular-nums"
                style={{ fontFamily: 'var(--font-instrument-serif, Georgia, serif)' }}
              >
                R$ 500–1.500
              </p>
              <p className="mt-1 text-xs text-halo-navy-80">perda média/mês evitada<sup>*</sup></p>
            </div>
            <div className="rounded-2xl border border-halo-gray bg-white p-5">
              <p
                className="text-3xl font-extrabold text-halo-navy tabular-nums"
                style={{ fontFamily: 'var(--font-instrument-serif, Georgia, serif)' }}
              >
                30s
              </p>
              <p className="mt-1 text-xs text-halo-navy-60">para descobrir sua margem real</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/cadastro?trial=14&utm_source=precos&utm_medium=cta_primary"
              data-track="pricing_cta_trial_click"
              className="inline-flex items-center justify-center rounded-xl bg-halo-navy px-6 py-3 text-sm font-extrabold text-halo-orange shadow-[0_4px_14px_rgba(45,50,119,0.28)] hover:-translate-y-[2px] active:scale-[0.98] transition-all"
            >
              Começar trial 14d grátis →
            </Link>
            <Link
              href="/calculadora-livre?utm_source=precos&utm_medium=cta_secondary"
              data-track="pricing_cta_calc_click"
              className="inline-flex items-center justify-center rounded-xl border border-halo-gray bg-white px-6 py-3 text-sm font-bold text-halo-navy hover:border-halo-navy transition-colors"
            >
              Calcular grátis primeiro
            </Link>
          </div>
        </section>

        <PricingTableClient table={table} />

        <section className="mt-16 rounded-2xl border border-halo-gray bg-white p-8 space-y-4">
          <h2 className="text-lg font-extrabold text-halo-navy">Perguntas frequentes</h2>
          <div className="grid gap-6 md:grid-cols-2 text-sm">
            <Faq
              q="Posso começar sem cartão?"
              a="Sim. O plano Free não pede cartão. Você só insere quando assina Pro ou Agency."
            />
            <Faq
              q="Como funciona o teste do Pro?"
              a="14 dias para testar o Pro completo. Cancela em 1 clique antes do fim do período se quiser ficar no Free."
            />
            <Faq
              q="O que é multi-conta no Agency?"
              a="Você gerencia até 10 contas ML diferentes na mesma conta SmartPreço — útil para agências que cuidam de mais de um seller."
            />
            <Faq
              q="Posso cancelar a qualquer momento?"
              a="Sim, mensal sem fidelidade. O acesso permanece até o fim do ciclo já pago."
            />
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-halo-gray bg-white py-6">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-halo-navy-40 space-y-2">
          <p>
            <sup>*</sup> Faixa baseada em política ML + custos típicos de cancelamento e mediação.
            Sua perda real depende do mix de SKUs.
          </p>
          <p>
            SmartPreço · v1.0 ·{' '}
            <Link href="/privacidade" className="underline hover:text-halo-navy">Política de privacidade</Link>
            {' · '}variante: <span className="font-mono">{variant}</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="font-semibold text-halo-navy">{q}</p>
      <p className="mt-1 text-halo-navy-60 leading-relaxed">{a}</p>
    </div>
  )
}
