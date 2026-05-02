'use client'

import { useEffect, useRef } from 'react'
import { trackFunnel } from '@/lib/analytics/events'

/**
 * Client island da landing pública (`src/app/page.tsx`).
 *
 * Responsabilidades:
 * 1. `home_view` no mount (uma vez, idempotente em StrictMode)
 * 2. Delegação de click para elementos com `data-track="home_cta_primary_click" | "home_cta_secondary_click"`
 * 3. `home_section_view` quando seção com `data-section` entra em viewport (IntersectionObserver)
 *
 * Mantém o componente do server pequeno e SEO-friendly — só hidrata o que precisa
 * de interatividade. Padrão "islands" do React 19/Next.js 14.
 */
export default function HomeTracking() {
  const viewedRef = useRef(false)
  const sectionsSeenRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (viewedRef.current) return
    viewedRef.current = true

    trackFunnel('home_view', {
      pathname: window.location.pathname,
      referrer: document.referrer || null,
    })

    // Delegação de click — mais eficiente que adicionar handler em cada CTA
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element | null)?.closest('[data-track]')
      if (!target) return
      const eventName = target.getAttribute('data-track')
      if (
        eventName === 'home_cta_primary_click' ||
        eventName === 'home_cta_secondary_click'
      ) {
        const href = target.getAttribute('href') || null
        trackFunnel(eventName, { href })
      }
    }

    document.addEventListener('click', handleClick)

    // Intersection observer para sub-blocos
    const sections = document.querySelectorAll<HTMLElement>('[data-section]')
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const section = entry.target.getAttribute('data-section')
          if (!section || sectionsSeenRef.current.has(section)) continue
          sectionsSeenRef.current.add(section)
          trackFunnel('home_section_view', { section })
        }
      },
      { threshold: 0.4 },
    )
    sections.forEach(s => observer.observe(s))

    return () => {
      document.removeEventListener('click', handleClick)
      observer.disconnect()
    }
  }, [])

  return null
}
