import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meus SKUs — SmartPreço',
}

export default function SkusPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Meus SKUs</h1>
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-400">Meus SKUs — em breve (Story 4.1)</p>
      </div>
    </div>
  )
}
