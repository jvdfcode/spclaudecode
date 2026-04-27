import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import WelcomeTour from '@/components/onboarding/WelcomeTour'
import { WorkspaceNav } from '@/components/layout/WorkspaceNav'

export const metadata: Metadata = { title: 'Dashboard' }

const actionCards = [
  {
    href: '/calculadora',
    icon: '🧮',
    label: 'Nova Análise',
    desc: 'Calcule viabilidade, margem e simule cenários de preço',
    accent: true,
  },
  {
    href: '/skus',
    icon: '📦',
    label: 'Meus SKUs',
    desc: 'Portfólio de produtos com status de viabilidade',
    accent: false,
  },
  {
    href: '/mercado',
    icon: '🏪',
    label: 'Pesquisar Mercado',
    desc: 'Compare preços com anúncios reais do Mercado Livre',
    accent: false,
  },
]

const steps = [
  { step: '1', icon: '💰', title: 'Informe o custo', desc: 'Produto, embalagem, impostos e frete' },
  { step: '2', icon: '📊', title: 'Simule cenários', desc: 'Veja margem em diferentes preços de venda' },
  { step: '3', icon: '🏪', title: 'Compare o mercado', desc: 'Anúncios reais do Mercado Livre em tempo real' },
  { step: '4', icon: '🎯', title: 'Decida o preço', desc: 'Econômico, Competitivo ou Premium' },
]

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const rawName = user?.user_metadata?.full_name as string | undefined
  const name = rawName?.trim()
    || user?.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    || 'vendedor'

  return (
    <div className="space-y-0">
      <WorkspaceNav />
      <div className="space-y-8 max-w-4xl">
      <WelcomeTour />

      {/* Header */}
      <header className="relative overflow-hidden rounded-[28px] border border-paper-200 bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(45,50,119,0.08)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#FFE600_0%,#2D3277_100%)]" />
        <div className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_center,rgba(255,230,0,0.14),transparent_62%)]" />
        <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-ink-700">
          Bem-vindo de volta
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-ink-950 sm:text-4xl">
          Olá, <span className="text-[#2d3277]">{name}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-700 leading-6">
          O que vamos analisar hoje? Precifique com precisão e tome decisões baseadas em dados reais.
        </p>
      </header>

      {/* Cards de ação */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actionCards.map(({ href, icon, label, desc, accent }) => (
          <Link
            key={href}
            href={href}
            className={[
              'interactive-panel group relative overflow-hidden flex flex-col gap-4 rounded-[24px] border p-6 transition-all',
              accent
                ? 'border-[#cfd4ff] bg-[linear-gradient(135deg,#eef0fb_0%,#f5f6ff_100%)] shadow-[0_12px_32px_rgba(45,50,119,0.10)]'
                : 'border-paper-200 bg-white shadow-[0_8px_24px_rgba(45,50,119,0.06)]',
            ].join(' ')}
          >
            {accent && (
              <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,#FFE600_0%,#2D3277_100%)]" />
            )}
            <div className={[
              'flex h-11 w-11 items-center justify-center rounded-[14px] text-xl shadow-sm',
              accent ? 'bg-ink-950 text-gold-400' : 'bg-paper-100 text-ink-700',
            ].join(' ')}>
              {icon}
            </div>
            <div className="flex-1">
              <p className={['font-extrabold text-sm tracking-[-0.01em]', accent ? 'text-ink-950' : 'text-ink-900'].join(' ')}>
                {label}
              </p>
              <p className="text-xs text-ink-700 mt-1 leading-5">{desc}</p>
            </div>
            <span className={['text-lg transition-colors', accent ? 'text-ink-950 group-hover:text-[#2d3277]' : 'text-paper-200 group-hover:text-ink-700'].join(' ')}>
              →
            </span>
          </Link>
        ))}
      </div>

      {/* Como funciona */}
      <div className="rounded-[24px] border border-paper-200 bg-white p-6 shadow-[0_8px_24px_rgba(45,50,119,0.06)]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-ink-700 mb-5">
          Como funciona o SmartPreço
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, icon, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-gold-400 text-xs font-extrabold flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="text-sm font-bold text-ink-950">{icon} {title}</p>
                <p className="text-xs text-ink-700 mt-1 leading-5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
