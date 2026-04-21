import type { CostBreakdown } from '@/types'
import { formatBRL } from '@/lib/utils/format'

interface Props {
  breakdown: CostBreakdown
}

const rows = [
  { key: 'acquisition', label: 'Custo do Produto (CMV)' },
  { key: 'commission', label: 'Comissão ML' },
  { key: 'installmentFee', label: 'Custo de Parcelamento' },
  { key: 'shipping', label: 'Frete' },
  { key: 'packaging', label: 'Embalagem' },
  { key: 'tax', label: 'Impostos' },
  { key: 'overhead', label: 'Overhead' },
] as const

export default function CostBreakdownTable({ breakdown }: Props) {
  return (
    <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
        Detalhamento de Custos
      </p>
      <div className="space-y-1">
        {rows.map(({ key, label }) => (
          breakdown[key] > 0 && (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-700">{formatBRL(breakdown[key])}</span>
            </div>
          )
        ))}
        <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-bold">
          <span className="text-gray-700">Total</span>
          <span className="text-gray-900">{formatBRL(breakdown.total)}</span>
        </div>
      </div>
    </div>
  )
}
