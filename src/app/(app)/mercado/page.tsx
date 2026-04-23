import type { Metadata } from 'next'
import MarketSearch from '@/components/mercado/MarketSearch'
import { WorkspaceNav } from '@/components/layout/WorkspaceNav'
import { PageHeader } from '@/components/layout/PageHeader'

export const metadata: Metadata = { title: 'Análise de Mercado' }

export default function MercadoPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="space-y-0">
      <WorkspaceNav />
      <div className="space-y-6 max-w-3xl">
        <PageHeader
          eyebrow="SmartPreço · Mercado"
          title="Análise de Mercado"
          tagline="Mercado Livre Brasil"
          description="Compare seu preço com anúncios reais e descubra onde você está posicionado no mercado."
        />
        <MarketSearch initialQuery={searchParams.q} />
      </div>
    </div>
  )
}
