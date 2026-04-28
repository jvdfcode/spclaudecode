import { useEffect, type RefObject } from 'react'

/**
 * Mantém o foco do teclado dentro de um container quando ativo.
 * Resolve DEBT-FE-NEW-2 (focus trap ausente em MobileDrawer).
 *
 * Comportamento:
 * - Ao ativar: move foco para o primeiro elemento focável dentro do container
 *   e marca o `parentInertSelector` (ex.: AppShell) com `inert` para esconder
 *   o conteúdo de fundo de leitores de tela e do tab order.
 * - Tab/Shift+Tab ciclam dentro do container.
 * - Ao desativar: remove `inert` e restaura o foco para o trigger anterior.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  parentInertSelector?: string,
) {
  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const previousActive = document.activeElement as HTMLElement | null
    const parent = parentInertSelector
      ? document.querySelector<HTMLElement>(parentInertSelector)
      : null

    if (parent) parent.setAttribute('inert', '')

    const focusables = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )

    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      container.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const activeEl = document.activeElement as HTMLElement | null

      if (e.shiftKey && activeEl === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      if (parent) parent.removeAttribute('inert')
      previousActive?.focus()
    }
  }, [active, containerRef, parentInertSelector])
}
