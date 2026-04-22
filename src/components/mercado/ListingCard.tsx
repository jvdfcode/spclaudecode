import Image from 'next/image'
import type { MlListing } from '@/types'
import { formatBRL } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

const repCfg: Record<string, { label: string; dot: string }> = {
  '5_green':        { label: 'Excelente', dot: 'bg-green-500'  },
  '4_light_green':  { label: 'Muito bom', dot: 'bg-green-400'  },
  '3_yellow':       { label: 'Bom',       dot: 'bg-yellow-500' },
  '2_orange':       { label: 'Regular',   dot: 'bg-orange-400' },
  '1_red':          { label: 'Fraco',     dot: 'bg-red-500'    },
}

interface Props {
  listing: MlListing
  isExcluded: boolean
  onToggleExclude: (id: string) => void
  onUsePrice?: (price: number) => void
}

export default function ListingCard({ listing, isExcluded, onToggleExclude, onUsePrice }: Props) {
  const rep = listing.sellerReputation ? (repCfg[listing.sellerReputation] ?? null) : null

  return (
    <div className={cn(
      'flex items-center gap-3 rounded-xl border p-3 transition-all',
      isExcluded
        ? 'border-gray-100 bg-gray-50 opacity-40'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
    )}>
      {/* Thumbnail */}
      {listing.thumbnail ? (
        <Image
          src={listing.thumbnail.replace('http://', 'https://')}
          alt=""
          width={44}
          height={44}
          className="rounded-lg object-cover flex-shrink-0 bg-gray-100"
          unoptimized
        />
      ) : (
        <div className="h-11 w-11 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300 text-lg">
          📦
        </div>
      )}

      {/* Título + badges */}
      <div className="flex-1 min-w-0">
        <a
          href={listing.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-gray-700 line-clamp-2 hover:text-blue-600 transition-colors leading-snug"
        >
          {listing.title}
        </a>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          {listing.freeShipping && (
            <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
              Frete grátis
            </span>
          )}
          {listing.isFulfillment && (
            <span className="rounded-full bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700">
              Full
            </span>
          )}
          {listing.condition === 'used' && (
            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
              Usado
            </span>
          )}
          {rep && (
            <span className="flex items-center gap-1">
              <span className={cn('h-1.5 w-1.5 rounded-full', rep.dot)} />
              <span className="text-[10px] text-gray-500">{rep.label}</span>
            </span>
          )}
          {listing.soldQuantity > 0 && (
            <span className="text-[10px] text-gray-400">
              {listing.soldQuantity.toLocaleString('pt-BR')} vendidos
            </span>
          )}
        </div>
      </div>

      {/* Preço + ações */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pl-1">
        <span className={cn(
          'text-sm font-bold tabular-nums',
          isExcluded ? 'text-gray-400 line-through' : 'text-gray-800'
        )}>
          {formatBRL(listing.price)}
        </span>
        <div className="flex gap-1">
          {onUsePrice && !isExcluded && (
            <button
              onClick={() => onUsePrice(listing.price)}
              className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
            >
              Usar preço
            </button>
          )}
          <button
            onClick={() => onToggleExclude(listing.id)}
            className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isExcluded ? 'Incluir' : '✕'}
          </button>
        </div>
      </div>
    </div>
  )
}
