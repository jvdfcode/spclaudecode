import { Suspense } from 'react'
import type { Metadata } from 'next'
import MarketSearch from '@/components/mercado/MarketSearch'
import MlConnectButton from '@/components/mercado/MlConnectButton'
import { WorkspaceNav } from '@/components/layout/WorkspaceNav'
import { PageHeader } from '@/components/layout/PageHeader'

export const metadata: Metadata = { title: 'Análise de Mercado' }

export default function MercadoPage({ searchParams }: { searchParams: { q?: string } }) {
  return (
    <div className="space-y-0">
      <WorkspaceNav />
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            eyebrow="SmartPreço · Mercado"
            title="Análise de Mercado"
            tagline="Mercado Livre Brasil"
            description="Compare seu preço com anúncios reais e descubra onde você está posicionado no mercado."
          />
          <div className="mt-6 shrink-0">
            <Suspense fallback={null}>
              <MlConnectButton />
            </Suspense>
          </div>
        </div>
        <MarketSearch initialQuery={searchParams.q} />
      </div>
    </div>
  )
}
