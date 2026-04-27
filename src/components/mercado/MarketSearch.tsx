'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { MlListing, MlRawResponse } from '@/types'
import { cleanListings, confidencePercent } from '@/lib/mercadolivre/cleaner'
import type { CleanOptions, ConditionFilter } from '@/lib/mercadolivre/cleaner'
import { analyzeListings, getPositionBadge, fullCount } from '@/lib/mercadolivre/analyzer'
import MarketSummaryPanel from './MarketSummaryPanel'
import PriceDistributionChart from './PriceDistributionChart'
import ListingCard from './ListingCard'
import { cn } from '@/lib/utils'
import MlScenarioCards from './MlScenarioCards'

const CACHE_KEY = 'smartpreco_ml_'
const CACHE_TTL = 60 * 60 * 1000

function readCache(q: string): MlListing[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY + q)
    if (!raw) return null
    const { data, exp } = JSON.parse(raw) as { data: MlListing[]; exp: number }
    if (Date.now() > exp) { localStorage.removeItem(CACHE_KEY + q); return null }
    return data
  } catch { return null }
}

function writeCache(q: string, data: MlListing[]) {
  try { localStorage.setItem(CACHE_KEY + q, JSON.stringify({ data, exp: Date.now() + CACHE_TTL })) } catch {}
}

function mapListings(raw: MlRawResponse): MlListing[] {
  return raw.results.map(r => ({
    id: r.id,
    title: r.title,
    price: r.price,
    currencyId: r.currency_id,
    condition: r.condition ?? 'not_specified',
    freeShipping: r.shipping?.free_shipping ?? false,
    isFulfillment: r.shipping?.logistic_type === 'fulfillment',
    sellerReputation: r.seller?.seller_reputation?.level_id ?? null,
    soldQuantity: r.sold_quantity ?? 0,
    thumbnail: r.thumbnail,
    permalink: r.permalink,
  }))
}

const QUICK_SEARCHES = [
  'fone bluetooth', 'tênis esportivo', 'smartwatch',
  'câmera de segurança', 'mochila escolar', 'fritadeira air fryer',
]

interface Props {
  initialSalePrice?: number
  onUsePrice?: (price: number) => void
  initialQuery?: string
}

type SearchState = 'idle' | 'loading' | 'done' | 'error'

export default function MarketSearch({ initialSalePrice, onUsePrice, initialQuery }: Props) {
  const [query, setQuery]         = useState('')
  const [activeQuery, setActive]  = useState('')
  const [state, setState]         = useState<SearchState>('idle')
  const [errorMsg, setError]      = useState('')
  const [rawListings, setRaw]     = useState<MlListing[]>([])
  const [wasCached, setCached]    = useState(false)
  const [excludedIds, setExcluded] = useState<Set<string>>(new Set())
  const [opts, setOpts] = useState<Omit<CleanOptions, 'excludedIds'>>({
    removeKits: true,
    condition: 'all',
    freeShippingOnly: false,
  })

  const doSearch = useCallback(async (q: string) => {
    const term = q.trim()
    if (!term || term.length < 2) return

    setState('loading')
    setError('')
    setExcluded(new Set())
    setActive(term)

    const cached = readCache(term.toLowerCase())
    if (cached) { setRaw(cached); setCached(true); setState('done'); return }

    try {
      const serverRes = await fetch(`/api/ml-search?q=${encodeURIComponent(term)}`)
      const serverData = await serverRes.json() as {
        listings?: MlListing[]
        cached?: boolean
        clientSide?: boolean
        error?: string
      }

      if (serverRes.ok && serverData.listings) {
        writeCache(term.toLowerCase(), serverData.listings)
        setRaw(serverData.listings)
        setCached(serverData.cached ?? false)
        setState('done')
        return
      }

      if (serverRes.status === 503 && serverData.clientSide) {
        const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(term)}&limit=50`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`ML ${res.status}`)
        const data = await res.json() as MlRawResponse
        const listings = mapListings(data)
        writeCache(term.toLowerCase(), listings)
        setRaw(listings)
        setCached(false)
        setState('done')
        fetch(`/api/ml-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: term, listings }),
        }).catch(() => {})
        return
      }

      setError(serverData.error ?? 'Erro inesperado. Tente novamente.')
      setState('error')
    } catch {
      setError('Não foi possível conectar ao Mercado Livre. Verifique sua conexão.')
      setState('error')
    }
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    await doSearch(query)
  }

  const { listings: clean, duplicatesRemoved } = useMemo(
    () => cleanListings(rawListings, { ...opts, excludedIds }),
    [rawListings, opts, excludedIds]
  )
  const summary  = useMemo(() => analyzeListings(clean), [clean])
  const badge    = useMemo(() => getPositionBadge(initialSalePrice ?? 0, summary), [initialSalePrice, summary])
  const fullCnt  = useMemo(() => fullCount(clean), [clean])
  const conf     = confidencePercent(clean.length, rawListings.length)

  useEffect(() => {
    if (state === 'done' && summary.cleanListings > 0) {
      try { sessionStorage.setItem('smartpreco_market_summary', JSON.stringify(summary)) } catch {}
    }
  }, [state, summary])

  useEffect(() => {
    if (initialQuery?.trim()) {
      setQuery(initialQuery.trim())
      doSearch(initialQuery.trim())
    }
  }, [initialQuery, doSearch])

  function toggleExclude(id: string) {
    setExcluded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">

      {/* BARRA DE BUSCA */}
      <form onSubmit={handleSearch}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Busque um produto... ex: fone bluetooth, tênis nike"
              className="w-full rounded-[16px] border border-paper-200 bg-white pl-11 pr-4 py-3.5 text-sm text-ink-900 placeholder:text-ink-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950"
              disabled={state === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={state === 'loading' || query.trim().length < 2}
            className={cn(
              'rounded-[16px] px-6 py-3.5 text-sm font-semibold transition-all shadow-sm',
              state === 'loading' || query.trim().length < 2
                ? 'bg-paper-100 text-ink-500 cursor-not-allowed'
                : 'bg-ink-950 text-gold-400 hover:opacity-90 active:scale-95'
            )}
          >
            {state === 'loading'
              ? <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-gold-400/30 border-t-gold-400 animate-spin" />
                  Buscando
                </span>
              : 'Buscar'}
          </button>
        </div>
      </form>

      {/* ESTADO INICIAL */}
      {state === 'idle' && (
        <div className="rounded-[24px] border border-paper-200 bg-white p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-4xl">🏪</p>
            <p className="text-sm font-extrabold text-ink-950">Inteligência de preços em tempo real</p>
            <p className="text-xs text-ink-700 max-w-xs mx-auto">
              Busque um produto e veja estatísticas de anúncios reais do Mercado Livre para posicionar seu preço com precisão
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-ink-500 text-center font-semibold uppercase tracking-wide">Sugestões</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_SEARCHES.map(s => (
                <button key={s} type="button"
                  onClick={() => { setQuery(s); doSearch(s) }}
                  className="rounded-full border border-paper-200 bg-paper-100 px-3.5 py-1.5 text-xs text-ink-700 hover:border-ink-950/30 hover:bg-[#eef0fb] hover:text-ink-950 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { icon: '📊', label: 'Mínimo, mediana e máximo' },
              { icon: '📍', label: 'Posição do seu preço' },
              { icon: '📈', label: 'Distribuição de preços' },
            ].map(({ icon, label }) => (
              <div key={label} className="rounded-[16px] bg-paper-100 p-3 text-center border border-paper-200">
                <p className="text-xl">{icon}</p>
                <p className="text-[10px] text-ink-700 mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LOADING */}
      {state === 'loading' && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 py-1 text-sm text-ink-700">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-950/20 border-t-ink-950 animate-spin" />
            Buscando no Mercado Livre...
          </div>
          <div className="animate-pulse space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[16px] border border-paper-200 bg-white p-3">
                <div className="h-11 w-11 rounded-[10px] bg-paper-100 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="h-3 bg-paper-100 rounded w-4/5" />
                  <div className="h-3 bg-paper-100 rounded w-3/5" />
                  <div className="h-2 bg-paper-100 rounded w-1/3" />
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="h-4 w-16 bg-paper-100 rounded" />
                  <div className="h-5 w-12 bg-paper-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERRO */}
      {state === 'error' && (
        <div className="rounded-[20px] border border-loss-200 bg-loss-50 p-6 text-center space-y-3">
          <p className="text-3xl">⚠️</p>
          <p className="text-sm font-semibold text-loss-500">Não foi possível buscar</p>
          <p className="text-xs text-loss-500 opacity-80 max-w-xs mx-auto">{errorMsg}</p>
          <button onClick={() => doSearch(activeQuery)}
            className="rounded-[12px] border border-loss-200 bg-white px-5 py-2 text-xs font-semibold text-loss-500 hover:bg-loss-50 transition-colors">
            Tentar novamente
          </button>
        </div>
      )}

      {/* SEM RESULTADOS */}
      {state === 'done' && rawListings.length === 0 && (
        <div className="rounded-[20px] border-2 border-dashed border-paper-200 bg-white p-10 text-center space-y-2">
          <p className="text-3xl">🔍</p>
          <p className="text-sm font-semibold text-ink-900">Nenhum resultado para &ldquo;{activeQuery}&rdquo;</p>
          <p className="text-xs text-ink-700">Tente um termo mais genérico ou verifique a ortografia</p>
        </div>
      )}

      {/* RESULTADOS */}
      {state === 'done' && rawListings.length > 0 && (
        <div className="space-y-4">

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold text-ink-950">
                {rawListings.length} anúncios — &ldquo;{activeQuery}&rdquo;
              </p>
              <p className="text-xs text-ink-700 mt-0.5">
                Base limpa: <strong className="text-ink-900">{clean.length}</strong> anúncios · {conf}% confiança
                {duplicatesRemoved > 0 && ` · ${duplicatesRemoved} duplicados removidos`}
                {wasCached && ' · cache'}
              </p>
            </div>
            <button onClick={() => setState('idle')}
              className="shrink-0 text-xs font-semibold text-ink-950 hover:text-ink-900 transition-colors">
              ← Nova busca
            </button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <FilterChip active={opts.removeKits} onClick={() => setOpts(o => ({ ...o, removeKits: !o.removeKits }))}>
              Sem kits
            </FilterChip>
            <FilterChip active={opts.freeShippingOnly} onClick={() => setOpts(o => ({ ...o, freeShippingOnly: !o.freeShippingOnly }))}>
              Frete grátis
            </FilterChip>
            <div className="flex overflow-hidden rounded-[12px] border border-paper-200">
              {(['all', 'new', 'used'] as ConditionFilter[]).map(c => (
                <button key={c} onClick={() => setOpts(o => ({ ...o, condition: c }))}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold transition-colors',
                    opts.condition === c ? 'bg-ink-950 text-gold-400' : 'bg-white text-ink-700 hover:bg-paper-100'
                  )}>
                  {c === 'all' ? 'Todos' : c === 'new' ? 'Novo' : 'Usado'}
                </button>
              ))}
            </div>
          </div>

          {clean.length > 0 && (
            <>
              <MarketSummaryPanel
                summary={summary}
                totalRaw={rawListings.length}
                fullCount={fullCnt}
                positionBadge={badge}
                salePrice={initialSalePrice ?? null}
              />
              <PriceDistributionChart listings={clean} salePrice={initialSalePrice} />
              <MlScenarioCards summary={summary} />
            </>
          )}

          <div className="space-y-2">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink-500">
              Anúncios ({clean.length + excludedIds.size})
            </p>
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
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children }: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button onClick={onClick}
      className={cn(
        'rounded-[12px] border px-3 py-1.5 text-xs font-semibold transition-colors',
        active
          ? 'border-ink-950 bg-primary-50 text-ink-950'
          : 'border-paper-200 bg-white text-ink-700 hover:border-ink-950/30'
      )}>
      {children}
    </button>
  )
}
