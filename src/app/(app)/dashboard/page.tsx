import type { Metadata } from 'next'
import Link from 'next/link'
import { listSkus } from '@/lib/supabase/skus'
import { createServerSupabase } from '@/lib/supabase/server'
import WelcomeTour from '@/components/onboarding/WelcomeTour'
import { WorkspaceNav } from '@/components/layout/WorkspaceNav'
import { formatPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils'
import type { SkuWithLatestCalc } from '@/types/sku'

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

const statusCfg = {
  viable:     { label: 'Viáveis',     dot: 'bg-green-400',  text: 'text-green-700'  },
  attention:  { label: 'Atenção',     dot: 'bg-yellow-400', text: 'text-yellow-700' },
  not_viable: { label: 'Não viáveis', dot: 'bg-red-400',    text: 'text-red-700'    },
  for_sale:   { label: 'À venda',     dot: 'bg-blue-400',   text: 'text-blue-700'   },
  draft:      { label: 'Rascunho',    dot: 'bg-gray-400',   text: 'text-gray-500'   },
}

function computeStats(skus: SkuWithLatestCalc[]) {
  const byStatus = {
    viable:     skus.filter(s => s.status === 'viable').length,
    attention:  skus.filter(s => s.status === 'attention').length,
    not_viable: skus.filter(s => s.status === 'not_viable').length,
    for_sale:   skus.filter(s => s.status === 'for_sale').length,
  }
  const withMargin = skus.filter(s => s.latestCalculation?.marginPercent != null)
  const avgMargin = withMargin.length
    ? withMargin.reduce((acc, s) => acc + s.latestCalculation!.marginPercent!, 0) / withMargin.length
    : null
  return { total: skus.length, byStatus, avgMargin }
}

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const rawName = user?.user_metadata?.full_name as string | undefined
  const name = rawName?.trim()
    || user?.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    || 'vendedor'

  const skus = await listSkus().catch(() => [])
  const stats = computeStats(skus)
  const recentSkus = skus.slice(0, 3)
  const hasSkus = stats.total > 0

  return (
    <div className="space-y-0">
      <WorkspaceNav />
      <div className="space-y-8 max-w-4xl">
        <WelcomeTour />

        {/* Header */}
        <header className="relative overflow-hidden rounded-[28px] border border-halo-gray bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(45,50,119,0.08)]">
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,var(--halo-orange)_0%,var(--halo-navy)_100%)]" />
          <div className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_center,rgba(255,230,0,0.14),transparent_62%)]" />
          <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-halo-navy-60">
            Bem-vindo de volta
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-halo-navy sm:text-4xl">
            Olá, <span className="text-[var(--halo-navy)]">{name}</span>
          </h1>
          <p className="mt-2 text-sm text-halo-navy-60 leading-6">
            {hasSkus
              ? `Você tem ${stats.total} SKU${stats.total !== 1 ? 's' : ''} no portfólio. Confira o resumo abaixo.`
              : 'O que vamos analisar hoje? Precifique com precisão e tome decisões baseadas em dados reais.'}
          </p>
        </header>

        {/* Métricas do portfólio */}
        {hasSkus && (
          <section aria-label="Resumo do portfólio">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-halo-navy-60 mb-4">
              Portfólio
            </p>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              <StatCard
                value={String(stats.total)}
                label="Total de SKUs"
                sub={null}
                accent="text-halo-navy"
              />
              <StatCard
                value={String(stats.byStatus.viable + stats.byStatus.for_sale)}
                label="Saudáveis"
                sub={stats.byStatus.for_sale > 0 ? `${stats.byStatus.for_sale} à venda` : null}
                accent="text-green-700"
                dot="bg-green-400"
              />
              <StatCard
                value={String(stats.byStatus.attention)}
                label="Em atenção"
                sub={stats.byStatus.not_viable > 0 ? `${stats.byStatus.not_viable} não viável` : null}
                accent="text-yellow-700"
                dot="bg-yellow-400"
              />
              <StatCard
                value={stats.avgMargin !== null ? formatPercent(stats.avgMargin) : '—'}
                label="Margem média"
                sub="dos SKUs calculados"
                accent={
                  stats.avgMargin === null ? 'text-gray-400'
                  : stats.avgMargin >= 20 ? 'text-green-700'
                  : stats.avgMargin >= 10 ? 'text-yellow-700'
                  : 'text-red-700'
                }
              />
            </div>

            {stats.total > 1 && (
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {(Object.entries(stats.byStatus) as [keyof typeof stats.byStatus, number][])
                  .filter(([, count]) => count > 0)
                  .map(([key, count]) => (
                    <span key={key} className="inline-flex items-center gap-1 rounded-full bg-halo-gray-15 px-2.5 py-1 text-[11px] font-semibold text-halo-navy-60">
                      <span className={cn('h-1.5 w-1.5 rounded-full', statusCfg[key].dot)} />
                      {statusCfg[key].label}: {count}
                    </span>
                  ))}
              </div>
            )}
          </section>
        )}

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
                  : 'border-halo-gray bg-white shadow-[0_8px_24px_rgba(45,50,119,0.06)]',
              ].join(' ')}
            >
              {accent && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,var(--halo-orange)_0%,var(--halo-navy)_100%)]" />
              )}
              <div className={[
                'flex h-11 w-11 items-center justify-center rounded-[14px] text-xl shadow-sm',
                accent ? 'bg-halo-navy text-halo-orange' : 'bg-halo-gray-15 text-halo-navy-60',
              ].join(' ')}>
                {icon}
              </div>
              <div className="flex-1">
                <p className={['font-extrabold text-sm tracking-[-0.01em]', accent ? 'text-halo-navy' : 'text-halo-black'].join(' ')}>
                  {label}
                </p>
                <p className="text-xs text-halo-navy-60 mt-1 leading-5">{desc}</p>
              </div>
              <span className={['text-lg transition-colors', accent ? 'text-halo-navy group-hover:text-[var(--halo-navy)]' : 'text-halo-gray group-hover:text-halo-navy-60'].join(' ')}>
                →
              </span>
            </Link>
          ))}
        </div>

        {/* SKUs recentes */}
        {hasSkus && recentSkus.length > 0 && (
          <section aria-label="SKUs recentes">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-halo-navy-60">
                Recentes
              </p>
              <Link href="/skus" className="text-xs font-semibold text-[var(--halo-navy)] hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="space-y-2">
              {recentSkus.map(sku => {
                const cfg = statusCfg[sku.status]
                const margin = sku.latestCalculation?.marginPercent ?? null
                return (
                  <Link
                    key={sku.id}
                    href={`/skus/${sku.id}`}
                    className="flex items-center gap-3 rounded-[16px] border border-halo-gray bg-white px-4 py-3 hover:shadow-sm transition-shadow"
                  >
                    <span className={cn('h-2 w-2 rounded-full flex-shrink-0', cfg.dot)} />
                    <span className="flex-1 min-w-0 text-sm font-semibold text-halo-black truncate">
                      {sku.name}
                    </span>
                    {margin !== null && (
                      <span className={cn('text-sm font-bold tabular-nums flex-shrink-0', cfg.text)}>
                        {formatPercent(margin)}
                      </span>
                    )}
                    <span className="text-halo-white-300 text-sm flex-shrink-0">→</span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Como funciona — apenas para novos usuários sem SKUs */}
        {!hasSkus && (
          <div className="rounded-[24px] border border-halo-gray bg-white p-6 shadow-[0_8px_24px_rgba(45,50,119,0.06)]">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-halo-navy-60 mb-5">
              Como funciona o SmartPreço
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ step, icon, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-halo-navy text-halo-orange text-xs font-extrabold flex-shrink-0 mt-0.5">
                    {step}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-halo-navy">{icon} {title}</p>
                    <p className="text-xs text-halo-navy-60 mt-1 leading-5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  value, label, sub, accent, dot,
}: {
  value: string
  label: string
  sub: string | null
  accent: string
  dot?: string
}) {
  return (
    <div className="rounded-[20px] border border-halo-gray bg-white p-4 shadow-[0_4px_16px_rgba(45,50,119,0.05)]">
      <div className="flex items-center gap-1.5 mb-1">
        {dot && <span className={cn('h-2 w-2 rounded-full flex-shrink-0', dot)} />}
        <p className="text-[11px] font-semibold text-halo-navy-60 leading-none">{label}</p>
      </div>
      <p className={cn('text-2xl font-extrabold tabular-nums tracking-[-0.03em]', accent)}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-halo-black-600 mt-0.5">{sub}</p>}
    </div>
  )
}
