'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface UtmParams {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
}

const EMPTY: UtmParams = { utm_source: null, utm_medium: null, utm_campaign: null }
const SESSION_KEY = 'sp_utm'

export function useUtmParams(): UtmParams {
  const searchParams = useSearchParams()
  const [params, setParams] = useState<UtmParams>(EMPTY)

  useEffect(() => {
    const utm_source = searchParams.get('utm_source')
    const utm_medium = searchParams.get('utm_medium')
    const utm_campaign = searchParams.get('utm_campaign')

    if (utm_source || utm_medium || utm_campaign) {
      const fresh = { utm_source, utm_medium, utm_campaign }
      setParams(fresh)
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh)) } catch {}
      return
    }

    // UTM não está na URL — recuperar da sessão (ex: após redirect)
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) setParams(JSON.parse(stored) as UtmParams)
    } catch {}
  }, [searchParams])

  return params
}
