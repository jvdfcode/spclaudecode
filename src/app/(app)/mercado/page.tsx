import type { Metadata } from 'next'
import MarketSearch from '@/components/mercado/MarketSearch'

export const metadata: Metadata = {
  title: 'Mercado — SmartPreço',
}

export default function MercadoPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Análise de Mercado</h1>
        <p className="mt-1 text-sm text-gray-500">
          Busque produtos similares no Mercado Livre e veja como seu preço se posiciona.
        </p>
      </div>
      <MarketSearch />
    </div>
  )
}
