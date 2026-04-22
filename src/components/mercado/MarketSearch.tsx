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

// ─── Cache localStorage (performance, não fix de API) ─────────────────────────
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

// ─── Mapeador da resposta bruta do ML ─────────────────────────────────────────
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

// ─── Busca via scraping server-side (lista.mercadolivre.com.br + cheerio) ──────
async function fetchFromScraper(q: string): Promise<MlListing[]> {
  const res = await fetch(`/api/ml-proxy?q=${encodeURIComponent(q)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error ?? `Scraper ${res.status}`)
  }
  const data = await res.json() as { listings?: MlListing[]; error?: string }
  if (!data.listings?.length) throw new Error('Scraper sem resultados')
  return data.listings
}

// ─── Busca direta do browser (ML direto — funciona de IPs residenciais normais) ─
async function fetchFromBrowser(q: string): Promise<MlListing[]> {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=50`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ML direto ${res.status}`)
  const data = await res.json() as MlRawResponse
  return mapListings(data)
}

// ─── CORS proxy público (browser → corsproxy.io → ML) — para IPs bloqueados ────
async function fetchViaCorsProxy(q: string): Promise<MlListing[]> {
  const mlUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=50`
  const proxy = `https://corsproxy.io/?${encodeURIComponent(mlUrl)}`
  const res = await fetch(proxy, { headers: { 'x-requested-with': 'XMLHttpRequest' } })
  if (!res.ok) throw new Error(`Proxy ${res.status}`)
  const data = await res.json() as MlRawResponse
  if (!data.results) throw new Error('Proxy sem resultados')
  return mapListings(data)
}

const QUICK_SEARCHES = [
  'fone bluetooth', 'tênis esportivo', 'smartwatch',
  'câmera de segurança', 'mochila escolar', 'fritadeira air fryer',
]

interface Props {
  initialSalePrice?: number
  onUsePrice?: (price: number) => void
}

type SearchState = 'idle' | 'loading' | 'done' | 'error'

export default function MarketSearch({ initialSalePrice, onUsePrice }: Props) {
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

    // 1. Cache local (performance)
    const cached = readCache(term.toLowerCase())
    if (cached) { setRaw(cached); setCached(true); setState('done'); return }

    try {
      // 2. Servidor (com autenticação ML se configurada, cache Supabase)
      const serverRes = await fetch(`/api/ml-search?q=${encodeURIComponent(term)}`)
      const serverData = await serverRes.json() as {
        listings?: MlListing[]
        cached?: boolean
        clientSide?: boolean
        error?: string
      }

      if (serverRes.ok && serverData.listings) {
        // Servidor retornou resultados (autenticado ou não)
        writeCache(term.toLowerCase(), serverData.listings)
        setRaw(serverData.listings)
        setCached(serverData.cached ?? false)
        setState('done')
        return
      }

      if (serverRes.status === 503 && serverData.clientSide) {
        // 3. Scraper server-side (lista.mercadolivre.com.br — funciona de qualquer IP)
        let listings: MlListing[]
        try {
          listings = await fetchFromScraper(term)
        } catch {
          // 4. Fallback: browser direto ao ML
          listings = await fetchFromBrowser(term)
        }
        writeCache(term.toLowerCase(), listings)
        setRaw(listings)
        setCached(false)
        setState('done')
        // Salva no cache Supabase em background
        fetch(`/api/ml-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: term, listings }),
        }).catch(() => {})
        return
      }

      // Erro real (429, 502, etc.)
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

  function toggleExclude(id: string) {
    setExcluded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5">

      {/* ─── BARRA DE BUSCA ─── */}
      <form onSubmit={handleSearch}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Busque um produto... ex: fone bluetooth, tênis nike"
              className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
              disabled={state === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={state === 'loading' || query.trim().length < 2}
            className={cn(
              'rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all shadow-sm',
              state === 'loading' || query.trim().length < 2
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            )}
          >
            {state === 'loading'
              ? <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Buscando
                </span>
              : 'Buscar'}
          </button>
        </div>
      </form>

      {/* ─── ESTADO INICIAL ─── */}
      {state === 'idle' && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-4xl">🏪</p>
            <p className="text-sm font-semibold text-gray-800">Inteligência de preços em tempo real</p>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Busque um produto e veja estatísticas de anúncios reais do Mercado Livre para posicionar seu preço com precisão
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-gray-400 text-center">Sugestões</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_SEARCHES.map(s => (
                <button key={s} type="button"
                  onClick={() => { setQuery(s); doSearch(s) }}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors">
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
              <div key={label} className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xl">{icon}</p>
                <p className="text-[10px] text-gray-500 mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── LOADING ─── */}
      {state === 'loading' && (
        <div className="space-y-3 animate-pulse">
          <div className="h-28 rounded-xl bg-gray-100" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-gray-100" />)}
          </div>
          <div className="h-20 rounded-xl bg-gray-100" />
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-gray-100" />)}
        </div>
      )}

      {/* ─── ERRO ─── */}
      {state === 'error' && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center space-y-3">
          <p className="text-3xl">⚠️</p>
          <p className="text-sm font-semibold text-red-700">Não foi possível buscar</p>
          <p className="text-xs text-red-600 max-w-xs mx-auto">{errorMsg}</p>
          <button onClick={() => doSearch(activeQuery)}
            className="rounded-xl border border-red-200 bg-white px-5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors">
            Tentar novamente
          </button>
        </div>
      )}

      {/* ─── SEM RESULTADOS ─── */}
      {state === 'done' && rawListings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center space-y-2">
          <p className="text-3xl">🔍</p>
          <p className="text-sm font-semibold text-gray-600">Nenhum resultado para &ldquo;{activeQuery}&rdquo;</p>
          <p className="text-xs text-gray-400">Tente um termo mais genérico ou verifique a ortografia</p>
        </div>
      )}

      {/* ─── RESULTADOS ─── */}
      {state === 'done' && rawListings.length > 0 && (
        <div className="space-y-4">

          {/* Cabeçalho */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {rawListings.length} anúncios — &ldquo;{activeQuery}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Base limpa: <strong className="text-gray-600">{clean.length}</strong> anúncios · {conf}% confiança
                {duplicatesRemoved > 0 && ` · ${duplicatesRemoved} duplicados removidos`}
                {wasCached && ' · cache'}
              </p>
            </div>
            <button onClick={() => setState('idle')}
              className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
              ← Nova busca
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 items-center">
            <FilterChip active={opts.removeKits} onClick={() => setOpts(o => ({ ...o, removeKits: !o.removeKits }))}>
              Sem kits
            </FilterChip>
            <FilterChip active={opts.freeShippingOnly} onClick={() => setOpts(o => ({ ...o, freeShippingOnly: !o.freeShippingOnly }))}>
              Frete grátis
            </FilterChip>
            <div className="flex overflow-hidden rounded-xl border border-gray-200">
              {(['all', 'new', 'used'] as ConditionFilter[]).map(c => (
                <button key={c} onClick={() => setOpts(o => ({ ...o, condition: c }))}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium transition-colors',
                    opts.condition === c ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  )}>
                  {c === 'all' ? 'Todos' : c === 'new' ? 'Novo' : 'Usado'}
                </button>
              ))}
            </div>
          </div>

          {/* Análise */}
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
            </>
          )}

          {/* Lista */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
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
        'rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
      )}>
      {children}
    </button>
  )
}
