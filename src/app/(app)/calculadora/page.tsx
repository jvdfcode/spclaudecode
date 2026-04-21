import type { Metadata } from 'next'
import CostForm from '@/components/calculadora/CostForm'

export const metadata: Metadata = {
  title: 'Calculadora — SmartPreço',
}

export default function CalculadoraPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calculadora de Viabilidade</h1>
        <p className="mt-1 text-sm text-gray-500">
          Preencha os custos para ver margem, lucro e viabilidade em tempo real.
        </p>
      </div>
      <CostForm />
    </div>
  )
}
