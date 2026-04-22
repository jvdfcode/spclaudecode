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

  return (
    <div className="space-y-6">
      <WelcomeTour />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.email?.split('@')[0]}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">O que vamos analisar hoje?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/calculadora"
          className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-primary">Novo Cálculo</p>
            <p className="text-sm text-gray-500">Analise a viabilidade de um produto</p>
          </div>
        </Link>

        <Link
          href="/skus"
          className="group flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-primary">Meus SKUs</p>
            <p className="text-sm text-gray-500">Seus SKUs aparecerão aqui</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
