import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import PricingTableClient from '@/components/pricing/PricingTableClient'
import { PRICING_COOKIE, pricingTableFor, variantFromCookie } from '@/lib/pricing-experiment'

export const metadata: Metadata = {
  title: 'Planos e preços — SmartPreço',
  description:
    'Free para começar, Pro para o portfólio completo, Agency para multi-conta ML. Sem cartão para testar.',
  openGraph: {
    title: 'Planos SmartPreço — precificação inteligente para vendedores ML',
    description:
      'Free, Pro e Agency. Comece grátis e suba quando precisar de SKUs ilimitados.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default async function PricingPage() {
  const cookieStore = await cookies()
  const variant = variantFromCookie(cookieStore.get(PRICING_COOKIE)?.value)
  const table = pricingTableFor(variant)

  return (
    <div className="min-h-screen bg-paper-50">
      <header className="border-b border-paper-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-gold-400 text-sm font-extrabold">
              SP
            </div>
            <span className="text-sm font-extrabold tracking-[-0.02em] text-ink-950">SmartPreço</span>
          </a>
          <a
            href="/login"
            className="text-sm font-medium text-ink-700 hover:text-ink-950 transition-colors"
          >
            Já tenho conta →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <section className="mb-12 text-center space-y-3">
          <span className="inline-block rounded-full bg-ink-950 text-gold-400 text-[11px] font-extrabold uppercase tracking-[0.18em] px-3 py-1">
            Posicionamento — Liderança em Produto
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-ink-950">
            O motor de decisão de preço mais
            <br className="hidden md:block" />
            preciso para o Mercado Livre Brasil
          </h1>
          <p className="mx-auto max-w-xl text-sm md:text-base text-ink-700 leading-relaxed">
            Comece grátis. Pague só quando precisar de SKUs ilimitados ou multi-conta.
            Sem cartão para testar.
          </p>
        </section>

        <PricingTableClient table={table} />

        <section className="mt-16 rounded-2xl border border-paper-200 bg-white p-8 space-y-4">
          <h2 className="text-lg font-extrabold text-ink-950">Perguntas frequentes</h2>
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

      <footer className="mt-16 border-t border-paper-200 bg-white py-6">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-ink-500">
          SmartPreço · v1.0 · variante de pricing: <span className="font-mono">{variant}</span>
        </div>
      </footer>
    </div>
  )
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="font-semibold text-ink-950">{q}</p>
      <p className="mt-1 text-ink-700 leading-relaxed">{a}</p>
    </div>
  )
}
