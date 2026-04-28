import type { Metadata } from 'next'
import CostForm from '@/components/calculadora/CostForm'
import { WorkspaceNav } from '@/components/layout/WorkspaceNav'
import { PageHeader } from '@/components/layout/PageHeader'

export const metadata: Metadata = { title: 'Análise de Custo' }

export default function CalculadoraPage() {
  return (
    <div className="space-y-0">
      <WorkspaceNav />
      <div className="space-y-6">
        <PageHeader
          eyebrow="SmartPreço · Análise de Custo"
          title="Calculadora de Viabilidade"
          tagline="Mercado Livre Brasil"
          description="Preencha os custos para ver margem, lucro e viabilidade em tempo real. Simule cenários e compare com o mercado."
          aside={
            <div className="text-xs text-halo-navy-60 leading-5">
              <p className="font-bold text-halo-navy">Análise em tempo real</p>
              Resultados calculados a cada mudança
            </div>
          }
        />
        <CostForm />
      </div>
    </div>
  )
}
