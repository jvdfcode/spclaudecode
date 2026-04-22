'use client'

import { useMemo, useEffect, useState } from 'react'
import type { ViabilityResult } from '@/types/pricing'
import type { MarketSummary, PositionBadge } from '@/types/mercado'
import { calculateViability } from '@/lib/calculations'
import { getPositionBadge } from '@/lib/mercadolivre/analyzer'

export type DecisionOptionId = 'economico' | 'competitivo' | 'premium'

export interface DecisionOption {
  id: DecisionOptionId
  label: string
  description: string
  suggestedPrice: number
  marginPercent: number
  profitAmount: number
  marketPosition: PositionBadge | null
}

export interface DecisionSummary {
  totalCost: number
  minimumViablePrice: number
  hasMarketData: boolean
  marketMedian: number | null
}

export interface DecisionEngineResult {
  options: [DecisionOption, DecisionOption, DecisionOption]
  summary: DecisionSummary
}

const SESSION_KEY = 'smartpreco_market_summary'

export function useDecisionEngine(result: ViabilityResult | null): DecisionEngineResult | null {
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) setMarketSummary(JSON.parse(stored) as MarketSummary)
    } catch {
      // sessionStorage indisponível ou JSON inválido — ignora silenciosamente
    }
  }, [])

  return useMemo(() => {
    if (!result) return null

    const { input, metrics } = result
    const { minimumViablePrice, recommendedPrice, totalCost } = metrics

    const hasMarketData = !!marketSummary && marketSummary.cleanListings >= 4

    function calcOption(price: number): { margin: number; profit: number; position: PositionBadge | null } {
      const r = calculateViability({ ...input, salePrice: price })
      return {
        margin: r.metrics.marginPercent,
        profit: r.metrics.profit,
        position: hasMarketData && marketSummary ? getPositionBadge(price, marketSummary) : null,
      }
    }

    let economicoPrice: number
    let competitivoPrice: number
    let premiumPrice: number

    if (hasMarketData && marketSummary) {
      economicoPrice = Math.max(marketSummary.p25Price, minimumViablePrice * 1.02)
      competitivoPrice = Math.max(marketSummary.medianPrice, minimumViablePrice * 1.02)
      premiumPrice = Math.max(marketSummary.p75Price, minimumViablePrice * 1.05)
    } else {
      economicoPrice = minimumViablePrice * 1.05
      competitivoPrice = recommendedPrice
      premiumPrice = recommendedPrice * 1.15
    }

    // Garantir ordem ascendente de preços
    economicoPrice = Math.max(economicoPrice, minimumViablePrice * 1.01)
    competitivoPrice = Math.max(competitivoPrice, economicoPrice * 1.001)
    premiumPrice = Math.max(premiumPrice, competitivoPrice * 1.001)

    const ec = calcOption(economicoPrice)
    const co = calcOption(competitivoPrice)
    const pr = calcOption(premiumPrice)

    return {
      options: [
        {
          id: 'economico',
          label: 'Econômico',
          description: hasMarketData ? 'Preço abaixo da mediana — mais competitivo' : 'Preço mínimo viável com margem de segurança',
          suggestedPrice: economicoPrice,
          marginPercent: ec.margin,
          profitAmount: ec.profit,
          marketPosition: ec.position,
        },
        {
          id: 'competitivo',
          label: 'Competitivo',
          description: hasMarketData ? 'Alinhado à mediana do mercado' : 'Margem alvo atingida',
          suggestedPrice: competitivoPrice,
          marginPercent: co.margin,
          profitAmount: co.profit,
          marketPosition: co.position,
        },
        {
          id: 'premium',
          label: 'Premium',
          description: hasMarketData ? 'Acima da mediana — posicionamento diferenciado' : '15% acima da margem alvo',
          suggestedPrice: premiumPrice,
          marginPercent: pr.margin,
          profitAmount: pr.profit,
          marketPosition: pr.position,
        },
      ],
      summary: {
        totalCost,
        minimumViablePrice,
        hasMarketData,
        marketMedian: marketSummary?.medianPrice ?? null,
      },
    }
  }, [result, marketSummary])
}
