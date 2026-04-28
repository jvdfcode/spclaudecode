/**
 * Skip navigation link (WCAG 2.1 SC 2.4.1, Nível A).
 * Resolve DEBT-FE-NEW-1.
 *
 * Renderizado fora-de-tela até receber foco; ao Tab inicial, fica visível
 * no canto superior esquerdo permitindo pular cabeçalho/menu e ir direto
 * para o conteúdo principal (`#main-content`).
 */
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="
        sr-only
        focus:not-sr-only
        focus:fixed focus:top-3 focus:left-3 focus:z-[100]
        focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2
        focus:text-sm focus:font-semibold focus:text-white
        focus:shadow-lg focus:outline-none
        focus:ring-2 focus:ring-gold-400 focus:ring-offset-2
      "
    >
      Pular para o conteúdo
    </a>
  )
}
