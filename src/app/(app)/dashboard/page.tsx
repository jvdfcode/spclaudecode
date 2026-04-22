import type { Metadata } from 'next'
import { createServerSupabase } from '@/lib/supabase/server'
import Link from 'next/link'
import WelcomeTour from '@/components/onboarding/WelcomeTour'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.email?.split('@')[0] ?? 'vendedor'

  return (
    <div className="space-y-8 max-w-4xl">
      <WelcomeTour />

      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, <span className="text-blue-600">{name}</span> 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">O que vamos analisar hoje?</p>
      </div>

      {/* Cards de ação principal */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/calculadora"
          className="group relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-200"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white text-xl shadow-sm">
            🧮
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Nova Análise</p>
            <p className="text-sm text-gray-500 mt-0.5">Calcule viabilidade e margem de um produto</p>
          </div>
          <span className="absolute bottom-4 right-4 text-blue-200 group-hover:text-blue-400 transition-colors text-lg">→</span>
        </Link>

        <Link
          href="/skus"
          className="group relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600 text-xl">
            📦
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">Meus SKUs</p>
            <p className="text-sm text-gray-500 mt-0.5">Portfólio de produtos com status de viabilidade</p>
          </div>
          <span className="absolute bottom-4 right-4 text-gray-200 group-hover:text-gray-400 transition-colors text-lg">→</span>
        </Link>

        <Link
          href="/mercado"
          className="group relative overflow-hidden flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-600 text-xl">
            🏪
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">Pesquisar Mercado</p>
            <p className="text-sm text-gray-500 mt-0.5">Compare preços com anúncios reais do ML</p>
          </div>
          <span className="absolute bottom-4 right-4 text-gray-200 group-hover:text-gray-400 transition-colors text-lg">→</span>
        </Link>
      </div>

      {/* Como funciona */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Como funciona o SmartPreço</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '1', icon: '💰', title: 'Informe o custo', desc: 'Produto, embalagem, impostos e frete' },
            { step: '2', icon: '📊', title: 'Simule cenários', desc: 'Veja margem em diferentes preços' },
            { step: '3', icon: '🏪', title: 'Compare o mercado', desc: 'Anúncios reais do Mercado Livre' },
            { step: '4', icon: '🎯', title: 'Decida o preço', desc: 'Econômico, Competitivo ou Premium' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="flex gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex-shrink-0 mt-0.5">
                {step}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{icon} {title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
