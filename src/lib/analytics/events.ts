/**
 * Tracking de eventos do funil (Story MKT-001-5 + PROD-001-13).
 *
 * Emite via `navigator.sendBeacon` para `/api/track` (persiste em funnel_events)
 * e via `@vercel/analytics` track() para o dashboard nativo.
 * Não falha em SSR (verifica `window`); não bloqueia render.
 */

import { track } from '@vercel/analytics'

export type FunnelEventName =
  | 'lead_magnet_calculated'
  | 'lead_captured'
  | 'pricing_viewed'
  | 'pricing_plan_clicked'
  | 'calculo_iniciado'
  | 'resultado_exibido'
  | 'cta_clicado'
  | 'email_submetido'
  // VIAB-R1-2 — landing pública
  | 'home_view'
  | 'home_cta_primary_click'
  | 'home_cta_secondary_click'
  | 'home_section_view'
  // VIAB-R1-2.1 — tracking de exibição do email gate
  | 'calc_email_capture_shown'

export interface FunnelEventPayload {
  [key: string]: string | number | boolean | null | undefined
}

const ENDPOINT = '/api/track'

/**
 * Emite um evento de funil. Não-bloqueante. Em SSR vira no-op.
 */
export function trackFunnel(name: FunnelEventName, payload: FunnelEventPayload = {}): void {
  if (typeof window === 'undefined') return

  // 1) Vercel Analytics
  try {
    track(name, payload as Record<string, string>)
  } catch {
    // ignora — analytics nunca pode quebrar a UI
  }

  // 2) Endpoint interno via beacon (não bloqueia navegação)
  try {
    const body = JSON.stringify({ name, payload, ts: Date.now() })
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(ENDPOINT, blob)
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // ignora — analytics nunca pode quebrar a UI
  }
}
