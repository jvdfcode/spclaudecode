/**
 * Tracking de eventos do funil (Story MKT-001-5).
 *
 * Implementação minimalista: emite via `navigator.sendBeacon` para um
 * endpoint interno `/api/track`, que persiste no Supabase. Quando o
 * Vercel Analytics estiver instalado, o mesmo evento também é enviado
 * via `window.va?.track()` para o dashboard nativo.
 *
 * Não falha em SSR (verifica `window`); não bloqueia render.
 */

export type FunnelEventName =
  | 'lead_magnet_calculated'
  | 'lead_captured'
  | 'pricing_viewed'
  | 'pricing_plan_clicked'

export interface FunnelEventPayload {
  // payload livre — KPIs baseline do dashboard MKT-001-5 leem o que precisarem
  [key: string]: string | number | boolean | null | undefined
}

declare global {
  interface Window {
    // Vercel Analytics injecta `window.va` quando ativo
    va?: { track: (name: string, props?: Record<string, unknown>) => void }
  }
}

const ENDPOINT = '/api/track'

/**
 * Emite um evento de funil. Não-bloqueante. Em SSR vira no-op.
 */
export function trackFunnel(name: FunnelEventName, payload: FunnelEventPayload = {}): void {
  if (typeof window === 'undefined') return

  // 1) Vercel Analytics (se instalado)
  try {
    window.va?.track(name, payload)
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
      // fallback fetch — keepalive permite envio mesmo após unload
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
