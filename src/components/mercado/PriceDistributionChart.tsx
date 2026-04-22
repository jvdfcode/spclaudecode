'use client'

import type { MlListing } from '@/types'
import { formatBRL } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  listings: MlListing[]
  salePrice?: number
}

const BUCKETS = 8

export default function PriceDistributionChart({ listings, salePrice }: Props) {
  if (listings.length < 2) return null

  const prices     = listings.map(l => l.price)
  const min        = Math.min(...prices)
  const max        = Math.max(...prices)
  const range      = max - min || 1
  const bucketSize = range / BUCKETS

  const counts = Array(BUCKETS).fill(0) as number[]
  for (const p of prices) {
    const idx = Math.min(Math.floor((p - min) / bucketSize), BUCKETS - 1)
    counts[idx]++
  }
  const maxCount = Math.max(...counts)

  const myBucket = salePrice !== undefined
    ? Math.min(Math.floor((salePrice - min) / bucketSize), BUCKETS - 1)
    : -1

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-600">Distribuição de preços</p>
        {salePrice !== undefined && (
          <span className="text-[10px] font-semibold text-blue-600">
            ▲ seu preço: {formatBRL(salePrice)}
          </span>
        )}
      </div>

      <div className="flex items-end gap-1 h-20">
        {counts.map((count, i) => {
          const heightPct = maxCount > 0 ? (count / maxCount) * 100 : 0
          const isMy      = i === myBucket
          const bucketMin = formatBRL(min + i * bucketSize)
          const bucketMax = formatBRL(min + (i + 1) * bucketSize)

          return (
            <div key={i}
              className="group relative flex flex-col items-center flex-1"
              style={{ height: '100%' }}
              title={`${bucketMin} – ${bucketMax}: ${count} anúncio${count !== 1 ? 's' : ''}`}
            >
              <div className="w-full flex-1 flex items-end">
                <div
                  className={cn(
                    'w-full rounded-t transition-all',
                    isMy ? 'bg-blue-500' : 'bg-gray-200 group-hover:bg-gray-300'
                  )}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                />
              </div>
              {count > 0 && (
                <p className="text-[8px] text-gray-400 mt-0.5 tabular-nums">{count}</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{formatBRL(min)}</span>
        <span>{formatBRL(max)}</span>
      </div>
    </div>
  )
}
