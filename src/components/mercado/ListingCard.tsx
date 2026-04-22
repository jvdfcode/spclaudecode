import Image from 'next/image'
import type { MlListing } from '@/types'
import { formatBRL } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

const reputationCfg: Record<string, { label: string; color: string }> = {
  '5_green':  { label: 'Excelente', color: 'text-green-600' },
  '4_light_green': { label: 'Muito bom', color: 'text-green-500' },
  '3_yellow': { label: 'Bom',       color: 'text-yellow-600' },
  '2_orange': { label: 'Regular',   color: 'text-orange-500' },
  '1_red':    { label: 'Fraco',     color: 'text-red-500'   },
}

interface Props {
  listing: MlListing
  isExcluded: boolean
  onToggleExclude: (id: string) => void
  onUsePrice?: (price: number) => void
}

export default function ListingCard({ listing, isExcluded, onToggleExclude, onUsePrice }: Props) {
  const rep = listing.sellerReputation ? (reputationCfg[listing.sellerReputation] ?? null) : null

  return (
    <div className={cn(
      'flex items-start gap-3 rounded-xl border p-3 transition-all',
      isExcluded
        ? 'border-gray-100 bg-gray-50 opacity-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    )}>
      {/* Thumbnail */}
      {listing.thumbnail && (
        <Image
          src={listing.thumbnail.replace('http://', 'https://')}
          alt=""
          width={48}
          height={48}
          className="rounded-lg object-cover flex-shrink-0 bg-gray-100"
          unoptimized
        />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <a
          href={listing.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-700 line-clamp-2 hover:text-blue-600 transition-colors"
        >
          {listing.title}
        </a>
        <div className="flex flex-wrap items-center gap-1.5">
          {listing.freeShipping && (
            <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">Frete grátis</span>
          )}
          {listing.isFulfillment && (
            <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700">Full</span>
          )}
          {rep && (
            <span className={cn('text-[10px] font-medium', rep.color)}>{rep.label}</span>
          )}
          {listing.soldQuantity > 0 && (
            <span className="text-[10px] text-gray-400">{listing.soldQuantity.toLocaleString('pt-BR')} vendidos</span>
          )}
        </div>
      </div>

      {/* Preço + ações */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-sm font-bold text-gray-800 tabular-nums">{formatBRL(listing.price)}</span>
        <div className="flex gap-1">
          {onUsePrice && !isExcluded && (
            <button
              onClick={() => onUsePrice(listing.price)}
              className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Usar preço
            </button>
          )}
          <button
            onClick={() => onToggleExclude(listing.id)}
            className="rounded-md px-2 py-0.5 text-[10px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isExcluded ? 'Incluir' : '✕'}
          </button>
        </div>
      </div>
    </div>
  )
}
