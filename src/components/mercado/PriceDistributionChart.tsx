'use client'

import type { MlListing } from '@/types'
import { formatBRL } from '@/lib/utils/format'

interface Props {
  listings: MlListing[]
  salePrice?: number
}

const BUCKETS = 8

export default function PriceDistributionChart({ listings, salePrice }: Props) {
  if (listings.length < 2) return null

  const prices = listings.map(l => l.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const bucketSize = range / BUCKETS

  // Contar anúncios por bucket
  const counts = Array(BUCKETS).fill(0)
  for (const p of prices) {
    const idx = Math.min(Math.floor((p - min) / bucketSize), BUCKETS - 1)
    counts[idx]++
  }

  const maxCount = Math.max(...counts)

  // Bucket do preço atual
  const myBucket = salePrice !== undefined
    ? Math.min(Math.floor((salePrice - min) / bucketSize), BUCKETS - 1)
    : -1

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <p className="text-xs font-semibold text-gray-600">Distribuição de preços</p>
      <div className="flex items-end gap-1 h-16">
        {counts.map((count, i) => {
          const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
          const isMyBucket = i === myBucket
          const label = formatBRL(min + i * bucketSize)

          return (
            <div key={i} className="flex flex-col items-center flex-1 gap-0.5" title={`${label}: ${count} anúncios`}>
              <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                <div
                  className={`w-full rounded-t transition-all ${isMyBucket ? 'bg-blue-500' : 'bg-gray-200'}`}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{formatBRL(min)}</span>
        {salePrice !== undefined && (
          <span className="text-blue-600 font-semibold">▲ {formatBRL(salePrice)}</span>
        )}
        <span>{formatBRL(max)}</span>
      </div>
    </div>
  )
}
