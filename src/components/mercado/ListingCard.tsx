import Image from 'next/image'
import type { MlListing } from '@/types'
import { formatBRL } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

const repCfg: Record<string, { label: string; dot: string }> = {
  '5_green':        { label: 'Excelente', dot: 'bg-profit-500' },
  '4_light_green':  { label: 'Muito bom', dot: 'bg-profit-500' },
  '3_yellow':       { label: 'Bom',       dot: 'bg-gold-400'   },
  '2_orange':       { label: 'Regular',   dot: 'bg-warn-500'   },
  '1_red':          { label: 'Fraco',     dot: 'bg-loss-500'   },
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
      'flex items-center gap-3 rounded-[16px] border p-3 transition-all',
      isExcluded
        ? 'border-paper-200 bg-paper-100 opacity-40'
        : 'border-paper-200 bg-white hover:border-ink-950/20 hover:shadow-sm'
    )}>
      {listing.thumbnail ? (
        <Image
          src={listing.thumbnail.replace('http://', 'https://')}
          alt=""
          width={44}
          height={44}
          className="rounded-[10px] object-cover flex-shrink-0 bg-paper-100"
          unoptimized
        />
      ) : (
        <div className="h-11 w-11 rounded-[10px] bg-paper-100 flex-shrink-0 flex items-center justify-center text-ink-500 text-lg">
          📦
        </div>
      )}

      <div className="flex-1 min-w-0">
        <a
          href={listing.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-ink-700 line-clamp-2 hover:text-ink-950 transition-colors leading-snug"
        >
          {listing.title}
        </a>
        <div className="flex flex-wrap items-center gap-1.5 mt-1">
          {listing.freeShipping && (
            <span className="rounded-full bg-profit-50 px-1.5 py-0.5 text-[10px] font-medium text-profit-500">
              Frete grátis
            </span>
          )}
          {listing.isFulfillment && (
            <span className="rounded-full bg-warn-50 px-1.5 py-0.5 text-[10px] font-medium text-warn-500">
              Full
            </span>
          )}
          {listing.condition === 'used' && (
            <span className="rounded-full bg-paper-100 px-1.5 py-0.5 text-[10px] text-ink-700">
              Usado
            </span>
          )}
          {rep && (
            <span className="flex items-center gap-1">
              <span className={cn('h-1.5 w-1.5 rounded-full', rep.dot)} />
              <span className="text-[10px] text-ink-700">{rep.label}</span>
            </span>
          )}
          {listing.soldQuantity > 0 && (
            <span className="text-[10px] text-ink-500">
              {listing.soldQuantity.toLocaleString('pt-BR')} vendidos
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pl-1">
        <span className={cn(
          'text-sm font-bold tabular-nums',
          isExcluded ? 'text-ink-500 line-through' : 'text-ink-900'
        )}>
          {formatBRL(listing.price)}
        </span>
        <div className="flex gap-1">
          {onUsePrice && !isExcluded && (
            <button
              onClick={() => onUsePrice(listing.price)}
              className="rounded-[8px] bg-primary-50 border border-primary-100 px-2 py-0.5 text-[10px] font-semibold text-ink-950 hover:bg-[#cfd4ff] transition-colors"
            >
              Usar preço
            </button>
          )}
          <button
            onClick={() => onToggleExclude(listing.id)}
            className="rounded-[8px] px-2 py-0.5 text-[10px] font-medium text-ink-500 hover:text-ink-900 hover:bg-paper-100 transition-colors"
          >
            {isExcluded ? 'Incluir' : '✕'}
          </button>
        </div>
      </div>
    </div>
  )
}
