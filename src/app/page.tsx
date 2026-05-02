import type { Metadata } from 'next'
import Link from 'next/link'
import HomeTracking from '@/components/landing/HomeTracking'

export const metadata: Metadata = {
  title: 'SmartPreço — Calculadora de margem real para vendedores Mercado Livre',
  description:
    'Sua reputação cai quando você precifica no escuro. Calcule comissão Classic ou Premium, taxa fixa e frete grátis em 30s — antes de anunciar.',
  openGraph: {
    title: 'Sua reputação cai quando você precifica no escuro',
    description:
      'Calcule comissão Classic ou Premium, taxa fixa e frete grátis em 30s — antes de anunciar. Vendedores ML podem perder R$ 500-1.500/mês com erro de pricing.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-halo-gray-05">
      <HomeTracking />

      <header className="border-b border-halo-gray bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-halo-navy text-halo-orange text-sm font-extrabold">
              SP
            </div>
            <span className="text-sm font-extrabold tracking-[-0.02em] text-halo-navy">SmartPreço</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-halo-navy-60 hover:text-halo-navy transition-colors"
          >
            Já tenho conta →
          </Link>
        </div>
      </header>

      <main>
        {/* HERO — Variante D MeliDev */}
        <section className="mx-auto max-w-3xl px-6 py-12 md:py-20 text-center space-y-6">
          <span className="inline-block rounded-full bg-halo-navy text-halo-orange text-[11px] font-extrabold uppercase tracking-[0.18em] px-3 py-1">
            Calculadora de margem real · Mercado Livre
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-halo-navy leading-tight">
            Sua reputação cai quando você
            <br className="hidden md:block" />
            precifica no escuro.
          </h1>

          <p className="mx-auto max-w-xl text-base md:text-lg text-halo-navy-80 leading-relaxed">
            Calcule comissão <strong>Classic ou Premium</strong>, taxa fixa e frete grátis em 30s
            — antes de anunciar.
          </p>

          {/* Stat card hero "1 número" — estilo Sellerboard */}
          <div className="mx-auto max-w-md rounded-3xl border border-halo-orange-30 bg-white px-6 py-8 shadow-[0_8px_28px_rgba(252,163,17,0.18)]">
            <p className="text-xs uppercase tracking-[0.18em] text-halo-navy-60 font-extrabold">
              Estimativa de perda mensal
            </p>
            <p
              className="mt-3 text-4xl md:text-5xl font-extrabold text-halo-orange tabular-nums"
              style={{ fontFamily: 'var(--font-instrument-serif, Georgia, serif)' }}
            >
              R$ 500 – R$ 1.500
              <span className="ml-1 align-top text-base text-halo-navy-60">*</span>
            </p>
            <p className="mt-2 text-sm text-halo-navy-60">
              é o que vendedores ML podem perder por mês com erro de pricing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/calculadora-livre?utm_source=home&utm_medium=cta_primary"
              data-track="home_cta_primary_click"
              className="btn-genie inline-flex items-center justify-center rounded-xl bg-halo-navy px-6 py-3 text-sm font-extrabold text-halo-orange shadow-[0_4px_14px_rgba(45,50,119,0.28)] transition-all hover:-translate-y-[2px] active:scale-[0.98]"
            >
              Calcular minha margem real →
            </Link>
            <Link
              href="/precos"
              data-track="home_cta_secondary_click"
              className="inline-flex items-center justify-center rounded-xl border border-halo-gray bg-white px-6 py-3 text-sm font-bold text-halo-navy hover:border-halo-navy transition-colors"
            >
              Ver preços
            </Link>
          </div>

          <p className="text-xs text-halo-navy-40 max-w-md mx-auto">
            * Faixa baseada em política ML + custos típicos de cancelamento e mediação.
            Sua perda real depende do mix de SKUs.
          </p>
        </section>

        {/* SUB-BLOCO 1 — "Mas o ML já não tem calculadora?" */}
        <section
          data-section="ml_calc_diff"
          className="mx-auto max-w-4xl px-6 py-14 border-t border-halo-gray"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-halo-navy text-center mb-2">
            Mas o ML já não tem calculadora?
          </h2>
          <p className="text-sm md:text-base text-halo-navy-60 text-center max-w-2xl mx-auto mb-10">
            Sim — e ela responde uma pergunta diferente da sua.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-halo-gray bg-white p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-halo-navy-40 font-extrabold mb-2">
                Calculadora oficial ML
              </p>
              <p className="text-lg font-extrabold text-halo-navy mb-2">Vender mais</p>
              <p className="text-sm text-halo-navy-60 leading-relaxed">
                Sugere preço de Buy Box e ranqueamento orgânico. Foca em volume.
                Não considera custo fixo, parcelamento, mediação nem reputação amarela.
              </p>
            </div>
            <div className="rounded-2xl border border-halo-orange-30 bg-halo-orange-05 p-6">
              <p className="text-xs uppercase tracking-[0.14em] text-halo-orange-90 font-extrabold mb-2">
                SmartPreço
              </p>
              <p className="text-lg font-extrabold text-halo-navy mb-2">Lucrar mais</p>
              <p className="text-sm text-halo-navy-80 leading-relaxed">
                Margem real considerando comissão por categoria + tipo de anúncio
                (Classic 11% / Premium 17%) + taxa fixa + frete grátis + parcelamento.
                Não te deixa anunciar no prejuízo.
              </p>
            </div>
          </div>
        </section>

        {/* SUB-BLOCO 2 — Como funciona em 3 passos */}
        <section
          data-section="how_it_works"
          className="mx-auto max-w-4xl px-6 py-14 border-t border-halo-gray"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-halo-navy text-center mb-10">
            Como funciona em 3 passos
          </h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: '1',
                title: 'Calcule',
                body: 'Insira custo, frete, parcelamento e categoria. Em 30 segundos você vê margem líquida real.',
              },
              {
                n: '2',
                title: 'Compare',
                body: 'Veja o que muda entre anunciar como Free, Classic ou Premium. Identifique onde a margem vaza.',
              },
              {
                n: '3',
                title: 'Decida',
                body: 'Anuncie com preço que protege sua reputação. Evite cancelamentos e mediação por margem negativa.',
              },
            ].map(step => (
              <li key={step.n} className="rounded-2xl border border-halo-gray bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-halo-navy text-halo-orange text-base font-extrabold mb-3">
                  {step.n}
                </div>
                <p className="text-base font-extrabold text-halo-navy mb-1">{step.title}</p>
                <p className="text-sm text-halo-navy-60 leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* SUB-BLOCO 3 — Prova social honesta */}
        <section
          data-section="social_proof"
          className="mx-auto max-w-3xl px-6 py-14 border-t border-halo-gray text-center"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-halo-navy-60 font-extrabold mb-3">
            Sem cadastro · 100% grátis · LGPD
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-halo-navy mb-3">
            A calculadora pública roda direto no seu navegador.
          </h2>
          <p className="text-sm md:text-base text-halo-navy-60 max-w-xl mx-auto mb-6">
            Sem instalação, sem cartão, sem coleta de dados antes do cálculo.
            Você só compartilha email se quiser receber o relatório completo.
          </p>
          <Link
            href="/calculadora-livre?utm_source=home&utm_medium=cta_social_proof"
            data-track="home_cta_primary_click"
            className="inline-flex items-center justify-center rounded-xl bg-halo-navy px-6 py-3 text-sm font-extrabold text-halo-orange shadow-[0_4px_14px_rgba(45,50,119,0.28)] hover:-translate-y-[2px] transition-all"
          >
            Quero calcular agora →
          </Link>
        </section>

        {/* SUB-BLOCO 4 — Pricing teaser */}
        <section
          data-section="pricing_teaser"
          className="mx-auto max-w-4xl px-6 py-14 border-t border-halo-gray text-center"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-halo-navy mb-3">
            Quer cobrir todo seu portfólio?
          </h2>
          <p className="text-sm md:text-base text-halo-navy-60 max-w-xl mx-auto mb-6">
            Planos a partir de R$ 39/mês com cálculo em massa, alertas de margem amarela
            e histórico de reajustes. Sem fidelidade.
          </p>
          <Link
            href="/precos"
            data-track="home_cta_secondary_click"
            className="inline-flex items-center justify-center rounded-xl border border-halo-navy bg-white px-6 py-3 text-sm font-bold text-halo-navy hover:bg-halo-navy hover:text-halo-orange transition-colors"
          >
            Ver planos
          </Link>
        </section>
      </main>

      <footer className="border-t border-halo-gray bg-white py-8 mt-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-xs text-halo-navy-40 space-y-2">
          <p>
            SmartPreço · v1.0 ·{' '}
            <Link href="/privacidade" className="underline hover:text-halo-navy">
              Política de privacidade (LGPD)
            </Link>{' '}
            ·{' '}
            <Link href="/calculadora-livre" className="underline hover:text-halo-navy">
              Calculadora grátis
            </Link>
          </p>
          <p className="text-halo-navy-40">
            Não somos parceiros oficiais do Mercado Livre. Cálculos baseados em política pública ML.
          </p>
        </div>
      </footer>
    </div>
  )
}
