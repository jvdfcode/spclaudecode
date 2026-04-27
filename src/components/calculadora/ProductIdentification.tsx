'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { MlListing, MlRawResponse, MarketSummary } from '@/types'
import { analyzeListings } from '@/lib/mercadolivre/analyzer'
import { formatBRL } from '@/lib/utils/format'
import { cn } from '@/lib/utils'

interface Props {
  onChange: (data: { productName: string; sku: string; mlSummary: MarketSummary | null }) => void
}

type SearchState = 'idle' | 'searching' | 'done' | 'error'

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

async function searchML(q: string): Promise<MlListing[]> {
  const serverRes = await fetch(`/api/ml-search?q=${encodeURIComponent(q)}`)
  const serverData = await serverRes.json() as { listings?: MlListing[]; clientSide?: boolean }

  if (serverRes.ok && serverData.listings) return serverData.listings

  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=50`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`ML ${res.status}`)
  const data = await res.json() as MlRawResponse
  const listings = mapListings(data)

  if (listings.length > 0) {
    fetch('/api/ml-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, listings }),
    }).catch(() => {})
  }

  return listings
}

export default function ProductIdentification({ onChange }: Props) {
  const [productName, setProductName] = useState('')
  const [sku, setSku]                 = useState('')
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const [listings, setListings]       = useState<MlListing[]>([])
  const [summary, setSummary]         = useState<MarketSummary | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setListings([]); setSummary(null); setSearchState('idle'); return
    }
    setSearchState('searching')
    try {
      const results = await searchML(q.trim())
      setListings(results)
      setSummary(analyzeListings(results))
      setSearchState('done')
    } catch {
      setSearchState('error')
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(productName), 800)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [productName, doSearch])

  useEffect(() => {
    onChange({ productName, sku, mlSummary: summary })
  }, [productName, sku, summary, onChange])

  const top3 = listings.slice(0, 3)

  return (
    <div className="step-enter rounded-[20px] border border-paper-200 bg-white overflow-hidden shadow-[0_4px_16px_rgba(45,50,119,0.06)]">

      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink-950 text-gold-400 text-sm font-extrabold">
          1
        </span>
        <div>
          <p className="text-sm font-extrabold text-ink-950">Identificação do produto</p>
          <p className="text-xs text-ink-500 mt-0.5">A busca no Mercado Livre inicia automaticamente</p>
        </div>
        {searchState === 'searching' && (
          <span className="ml-auto block h-4 w-4 rounded-full border-2 border-ink-950/20 border-t-ink-950 animate-spin flex-shrink-0" />
        )}
        {searchState === 'done' && summary && (
          <span className="ml-auto text-xs font-semibold text-profit-500 bg-profit-50 px-2 py-0.5 rounded-full flex-shrink-0">
            {summary.cleanListings} anúncios
          </span>
        )}
      </div>

      <div className="h-px bg-paper-200 mx-5" />

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-700">
              Nome do produto <span className="text-loss-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="Ex: Fone Bluetooth JBL Tune 510..."
                className="w-full rounded-[10px] border border-paper-200 bg-paper-100 pl-4 pr-10 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 transition-all focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500">
                <svg className={cn('h-4 w-4', productName.length >= 2 && searchState !== 'searching' ? 'text-ink-950' : 'text-ink-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-700">
              SKU <span className="text-ink-500">(opcional)</span>
            </label>
            <input
              type="text"
              value={sku}
              onChange={e => setSku(e.target.value)}
              placeholder="Ex: JBL-510-BLK"
              className="w-full rounded-[10px] border border-paper-200 bg-paper-100 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-500 transition-all focus:outline-none focus:ring-2 focus:ring-ink-950/20 focus:border-ink-950 focus:bg-white"
            />
          </div>
        </div>

        {searchState === 'done' && summary && summary.cleanListings > 0 && (
          <div className="step-enter rounded-[16px] bg-paper-100 border border-paper-200 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              {([
                { label: 'Mínimo',  value: summary.minPrice,    color: 'text-profit-500', bg: 'bg-profit-50 border-profit-200' },
                { label: 'Mediana', value: summary.medianPrice, color: 'text-ink-950',    bg: 'bg-[#eef0fb] border-[#cfd4ff]' },
                { label: 'Máximo',  value: summary.maxPrice,    color: 'text-ink-700',    bg: 'bg-white border-paper-200'      },
              ] as const).map(({ label, value, color, bg }) => (
                <div key={label} className={cn('rounded-[12px] px-2 py-2.5 border', bg)}>
                  <p className="text-[10px] font-medium text-ink-500 uppercase tracking-wide">{label}</p>
                  <p className={cn('text-sm font-bold tabular-nums mt-0.5', color)}>{formatBRL(value)}</p>
                </div>
              ))}
            </div>

            {top3.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {top3.map(l => (
                  <div key={l.id} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-ink-700 truncate">{l.title}</p>
                    <span className="text-xs font-semibold text-ink-900 tabular-nums shrink-0">
                      {formatBRL(l.price)}
                    </span>
                  </div>
                ))}
                <a
                  href={`/mercado?q=${encodeURIComponent(productName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block pt-1 text-center text-[11px] font-medium text-ink-950 hover:text-ink-900 transition-colors"
                >
                  ver todos os anúncios →
                </a>
              </div>
            )}
          </div>
        )}

        {searchState === 'error' && (
          <p className="step-enter rounded-[12px] bg-loss-50 border border-loss-200 px-3 py-2 text-xs text-loss-500">
            Não foi possível buscar no Mercado Livre agora. Continue preenchendo normalmente.
          </p>
        )}
      </div>
    </div>
  )
}
