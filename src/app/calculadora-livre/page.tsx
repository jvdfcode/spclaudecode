import type { Metadata } from 'next'
import LeadMagnetForm from '@/components/lead-magnet/LeadMagnetForm'

export const metadata: Metadata = {
  title: 'Calculadora grátis de viabilidade Mercado Livre — SmartPreço',
  description:
    'Descubra em 30 segundos quanto você está perdendo em cada venda no ML. Sem cadastro, sem cartão.',
  openGraph: {
    title: 'Quanto você perde em cada venda no Mercado Livre?',
    description:
      'Calculadora grátis: custo real, taxa ML, parcelamento, frete e margem em uma tela.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function CalculadoraLivrePage() {
  return (
    <div className="min-h-screen bg-halo-gray-05">
      <header className="border-b border-halo-gray bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-halo-navy text-halo-orange text-sm font-extrabold">
              SP
            </div>
            <span className="text-sm font-extrabold tracking-[-0.02em] text-halo-navy">SmartPreço</span>
          </div>
          <a
            href="/login"
            className="text-sm font-medium text-halo-navy-60 hover:text-halo-navy transition-colors"
          >
            Já tenho conta →
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        <section className="mb-10 text-center space-y-3">
          <span className="inline-block rounded-full bg-halo-navy text-halo-orange text-[11px] font-extrabold uppercase tracking-[0.18em] px-3 py-1">
            Calculadora grátis · Sem cadastro
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-halo-navy">
            Descubra em 30 segundos quanto você está
            <br className="hidden md:block" />
            perdendo em cada venda no Mercado Livre
          </h1>
          <p className="mx-auto max-w-xl text-sm md:text-base text-halo-navy-60 leading-relaxed">
            Custo real, taxa de anúncio, parcelamento e margem — tudo em uma tela.
            Sem instalação, sem cadastro, sem cartão.
          </p>
        </section>

        <LeadMagnetForm />

        <section className="mt-12 grid gap-4 md:grid-cols-3 text-center">
          <div className="rounded-2xl border border-halo-gray bg-white p-5">
            <p className="text-2xl font-extrabold text-halo-navy">100%</p>
            <p className="mt-1 text-xs text-halo-navy-60">grátis e sem cadastro</p>
          </div>
          <div className="rounded-2xl border border-halo-gray bg-white p-5">
            <p className="text-2xl font-extrabold text-halo-navy">30s</p>
            <p className="mt-1 text-xs text-halo-navy-60">para descobrir sua margem real</p>
          </div>
          <div className="rounded-2xl border border-halo-gray bg-white p-5">
            <p className="text-2xl font-extrabold text-halo-navy">+R$ 0,00</p>
            <p className="mt-1 text-xs text-halo-navy-60">é o que você está deixando na mesa hoje</p>
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-halo-gray bg-white py-6">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-halo-navy-40">
          SmartPreço · v1.0 ·{' '}
          <a href="/login" className="underline hover:text-halo-navy">
            Quero o portfólio completo (grátis no MVP)
          </a>
        </div>
      </footer>
    </div>
  )
}
