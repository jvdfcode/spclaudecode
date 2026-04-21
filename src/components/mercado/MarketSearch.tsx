'use client'

import { useState, useMemo } from 'react'
import type { MlListing } from '@/types'
import { cleanListings, confidencePercent, DEFAULT_CLEAN_OPTIONS } from '@/lib/mercadolivre/cleaner'
import type { CleanOptions, ConditionFilter } from '@/lib/mercadolivre/cleaner'
import { analyzeListings, getPositionBadge, fullCount } from '@/lib/mercadolivre/analyzer'
import MarketSummaryPanel from './MarketSummaryPanel'
import PriceDistributionChart from './PriceDistributionChart'
import ListingCard from './ListingCard'
import { cn } from '@/lib/utils'

interface Props {
  initialSalePrice?: number
  onUsePrice?: (price: number) => void
}

type SearchState = 'idle' | 'loading' | 'done' | 'error'

export default function MarketSearch({ initialSalePrice, onUsePrice }: Props) {
  const [query, setQuery]           = useState('')
  const [state, setState]           = useState<SearchState>('idle')
  const [errorMsg, setErrorMsg]     = useState('')
  const [rawListings, setRaw]       = useState<MlListing[]>([])
  const [wasCached, setWasCached]   = useState(false)
  const salePrice                   = initialSalePrice
  const [excludedIds, setExcluded]  = useState<Set<string>>(new Set())

  const [opts, setOpts] = useState<Omit<CleanOptions, 'excludedIds'>>({
    removeKits: true,
    condition: 'all',
    freeShippingOnly: false,
  })

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim() || query.length < 2) return
    setState('loading')
    setErrorMsg('')
    setExcluded(new Set())

    try {
      const res = await fetch(`/api/ml-search?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) { setErrorMsg(data.error ?? 'Erro na busca'); setState('error'); return }
      setRaw(data.listings ?? [])
      setWasCached(data.cached ?? false)
      setState('done')
    } catch {
      setErrorMsg('Erro de conexão. Verifique sua internet e tente novamente.')
      setState('error')
    }
  }

  const { listings: cleanedListings, duplicatesRemoved } = useMemo(
    () => cleanListings(rawListings, { ...opts, excludedIds }),
    [rawListings, opts, excludedIds]
  )

  const summary  = useMemo(() => analyzeListings(cleanedListings), [cleanedListings])
  const badge    = useMemo(() => getPositionBadge(salePrice ?? 0, summary), [salePrice, summary])
  const fullCnt  = useMemo(() => fullCount(cleanedListings), [cleanedListings])
  const conf     = confidencePercent(cleanedListings.length, rawListings.length)

  function toggleExclude(id: string) {
    setExcluded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">
      {/* Campo de busca */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar produto no Mercado Livre... ex: fone bluetooth"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={state === 'loading'}
        />
        <button
          type="submit"
          disabled={state === 'loading' || query.length < 2}
          className={cn(
            'rounded-xl px-5 py-3 text-sm font-semibold transition-colors',
            state === 'loading' || query.length < 2
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {state === 'loading' ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Loading */}
      {state === 'loading' && (
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-6">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-500">Buscando no Mercado Livre...</p>
        </div>
      )}

      {/* Erro */}
      {state === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Resultados */}
      {state === 'done' && rawListings.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-400">
          Nenhum resultado encontrado para &ldquo;{query}&rdquo;
        </div>
      )}

      {state === 'done' && rawListings.length > 0 && (
        <>
          {/* Cabeçalho dos resultados */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-800">{rawListings.length}</span> anúncios encontrados
              {wasCached && <span className="ml-2 text-gray-400">(resultado em cache)</span>}
              {duplicatesRemoved > 0 && <span className="ml-2 text-gray-400">· {duplicatesRemoved} duplicado{duplicatesRemoved !== 1 ? 's' : ''} removido{duplicatesRemoved !== 1 ? 's' : ''}</span>}
            </p>
            <p className="text-xs font-semibold text-gray-700">
              Base limpa: {cleanedListings.length} ({conf}%)
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={opts.removeKits}
                onChange={e => setOpts(o => ({ ...o, removeKits: e.target.checked }))}
                className="h-3.5 w-3.5 accent-blue-600" />
              Remover kits/combos
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={opts.freeShippingOnly}
                onChange={e => setOpts(o => ({ ...o, freeShippingOnly: e.target.checked }))}
                className="h-3.5 w-3.5 accent-blue-600" />
              Somente frete grátis
            </label>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span>Condição:</span>
              {(['all', 'new', 'used'] as ConditionFilter[]).map(c => (
                <button key={c} onClick={() => setOpts(o => ({ ...o, condition: c }))}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 transition-colors',
                    opts.condition === c ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                  )}>
                  {c === 'all' ? 'Todos' : c === 'new' ? 'Novo' : 'Usado'}
                </button>
              ))}
            </div>
          </div>

          {/* Painel de análise */}
          {cleanedListings.length > 0 && (
            <>
              <MarketSummaryPanel
                summary={summary}
                totalRaw={rawListings.length}
                fullCount={fullCnt}
                positionBadge={badge}
                salePrice={salePrice ?? null}
              />
              <PriceDistributionChart listings={cleanedListings} salePrice={salePrice} />
            </>
          )}

          {/* Lista de anúncios */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">Anúncios ({cleanedListings.length + excludedIds.size})</p>
            {rawListings.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isExcluded={excludedIds.has(listing.id)}
                onToggleExclude={toggleExclude}
                onUsePrice={onUsePrice}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
