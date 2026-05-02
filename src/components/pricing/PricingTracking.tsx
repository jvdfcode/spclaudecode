'use client'

import { useEffect, useRef } from 'react'
import { trackFunnel } from '@/lib/analytics/events'

/**
 * Client island da página `/precos` (VIAB-R3-2).
 *
 * Responsabilidades:
 * 1. Delegação de click para elementos com `data-track="pricing_cta_trial_click"`
 *    ou `data-track="pricing_cta_calc_click"`
 * 2. Não dispara `pricing_viewed` aqui (evento já existente, disparado pelo
 *    PricingTableClient ou Vercel Analytics). Pode ser estendido se necessário.
 *
 * Padrão "islands" — server component renderiza copy + estática; este client
 * apenas hidrata interatividade.
 */
export default function PricingTracking() {
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    function handleClick(e: MouseEvent) {
      const target = (e.target as Element | null)?.closest('[data-track]')
      if (!target) return
      const eventName = target.getAttribute('data-track')
      if (
        eventName === 'pricing_cta_trial_click' ||
        eventName === 'pricing_cta_calc_click'
      ) {
        const href = target.getAttribute('href') || null
        trackFunnel(eventName, { href })
      }
    }

    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
