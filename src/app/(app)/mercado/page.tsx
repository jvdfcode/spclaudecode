import type { Metadata } from 'next'
import MarketSearch from '@/components/mercado/MarketSearch'

export const metadata: Metadata = {
  title: 'Análise de Mercado',
}

export default function MercadoPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Análise de Mercado</h1>
        <p className="mt-1 text-sm text-gray-500">
          Compare seu preço com anúncios reais do Mercado Livre e descubra onde você está posicionado.
        </p>
      </div>
      <MarketSearch initialQuery={searchParams.q} />
    </div>
  )
}
