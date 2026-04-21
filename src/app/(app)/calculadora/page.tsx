import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calculadora — SmartPreço',
}

export default function CalculadoraPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Calculadora de Viabilidade</h1>
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-400">Calculadora — em breve (Story 2.1)</p>
      </div>
    </div>
  )
}
