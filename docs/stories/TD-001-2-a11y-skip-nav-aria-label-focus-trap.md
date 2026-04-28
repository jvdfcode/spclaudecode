# Story TD-001-2 — Skip nav + aria-label baseline + focus trap MobileDrawer

**Epic:** EPIC-TD-001
**Status:** Draft
**Owner:** @dev (sugerido; @ux-design-expert como referência)
**Severidade débito:** CRITICAL / HIGH
**Esforço estimado:** 2–3 dias

---

## Contexto

O SmartPreço tem acessibilidade base parcialmente implementada — `prefers-reduced-motion` global, Sonner toast, e MobileDrawer com `role="dialog"`, `aria-modal` e Escape handler estão corretos. Porém três gaps WCAG 2.1 Nível A (nível mínimo obrigatório) precisam ser resolvidos nesta story:

**DEBT-FE-NEW-1 — Skip navigation ausente (SC 2.4.1)**
Usuários de teclado e leitores de tela precisam pressionar Tab várias vezes para chegar ao conteúdo principal em cada troca de rota, pois não há link "Pular para o conteúdo principal" antes do header. Viola WCAG 2.1 SC 2.4.1 (Bypass Blocks) — nível A obrigatório. Localização: `src/app/layout.tsx` (root) e `src/app/(app)/layout.tsx` (app shell).

**DEBT-FE-1 — Botões icon-only sem `aria-label` (SC 1.3.1, 4.1.2)**
Aproximadamente 15 botões com apenas ícone (sem texto visível) em componentes do app shell, TopBar e outros não possuem `aria-label`. Leitores de tela anunciam apenas "botão" sem descrição de função — torna esses controles inacessíveis. WCAG 2.1 Nível A.

**DEBT-FE-NEW-2 — Focus trap ausente em MobileDrawer (SC 2.1.2)**
`MobileDrawer.tsx:52-132` tem `role="dialog"` e Escape handler corretos, mas o foco vaza para elementos fora do drawer ao pressionar Tab — WCAG 2.1 SC 2.1.2 (No Keyboard Trap) e o padrão Modal Dialog do ARIA Authoring Practices exigem que o foco fique confinado dentro do dialog enquanto aberto.

**Review UX Uma (Fase 6)** identifica esses três itens como pré-requisitos para qualquer auditoria WCAG futura e recomenda implementação antes de qualquer feature nova de UI.

---

## Débitos cobertos

- **DEBT-FE-NEW-1** (CRITICAL) — Skip navigation link ausente (WCAG 2.1 SC 2.4.1) — `src/app/(app)/layout.tsx`, `src/app/layout.tsx`
- **DEBT-FE-1** (CRITICAL) — Botões icon-only sem `aria-label` (WCAG 2.1 A) — ~15 componentes
- **DEBT-FE-NEW-2** (HIGH) — Focus trap ausente em MobileDrawer (WCAG 2.1 SC 2.1.2) — `MobileDrawer.tsx:52-132`

---

## Acceptance Criteria

- [ ] **AC1:** Skip link presente como primeiro elemento focusável em `app/layout.tsx` com destino `#main-content`; visível apenas ao receber foco (CSS: `sr-only focus:not-sr-only`); elemento `<main id="main-content">` presente em `(app)/layout.tsx`
- [ ] **AC2:** Todos os botões com apenas ícone (sem texto visível) em `AppShell.tsx`, `TopBar.tsx`, e demais componentes varredura identificar possuem `aria-label` descritivo em português
- [ ] **AC3:** `Tab` enquanto MobileDrawer está aberto não sai do drawer — foco circula dentro dos elementos focusáveis do drawer; `Shift+Tab` no primeiro elemento vai para o último
- [ ] **AC4:** Ao fechar MobileDrawer (Escape ou botão fechar), o foco retorna ao elemento que o abriu (trigger button)
- [ ] **AC5:** Lighthouse A11y score >= 90 em `/` e em `/(app)/dashboard` (run manual ou CI)
- [ ] **AC6:** axe-core (via `@axe-core/react` em dev ou teste automatizado) sem violations de categoria CRITICAL após esta story
- [ ] **AC7:** `pnpm typecheck`, `pnpm lint`, `pnpm test` passando

---

## Tasks

- [ ] **T1:** Varrer o codebase por botões icon-only — `grep -r "IconButton\|<button\|<Button" src/ --include="*.tsx" -l` + inspeção visual nos componentes encontrados; listar todos que precisam de `aria-label`
- [ ] **T2:** Adicionar skip navigation link em `src/app/layout.tsx`:
  ```tsx
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded">
    Pular para o conteúdo principal
  </a>
  ```
- [ ] **T3:** Adicionar `id="main-content"` no elemento `<main>` de `src/app/(app)/layout.tsx` (ou criar landmark se não existir)
- [ ] **T4:** Adicionar `aria-label` em todos os botões icon-only identificados no T1 — labels em português descritivo (ex: "Fechar", "Abrir menu", "Editar item", "Excluir item")
- [ ] **T5:** Criar hook `src/hooks/useFocusTrap.ts`:
  - Recebe `containerRef: React.RefObject<HTMLElement>` e `isActive: boolean`
  - Quando `isActive = true`, intercepta keydown Tab/Shift+Tab
  - Seleciona todos os elementos focusáveis dentro do container: `a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])`
  - Circula entre primeiro e último; libera quando `isActive = false`
- [ ] **T6:** Integrar `useFocusTrap` em `src/components/MobileDrawer.tsx:52-132`:
  - Criar `ref` para o container do drawer
  - Chamar `useFocusTrap(containerRef, isOpen)`
  - Ao fechar: `triggerRef.current?.focus()` — capturar ref do trigger antes de abrir
- [ ] **T7:** Escrever teste unitário para `useFocusTrap` em `tests/unit/useFocusTrap.test.ts` — testar ciclo de foco com elementos mock
- [ ] **T8:** Escrever teste de integração básico para skip link em `tests/unit/layout.test.tsx` — verificar presença do link e do `id="main-content"`
- [ ] **T9:** Run Lighthouse A11y em `/` e `/(app)/dashboard`; documentar score antes e depois nos comentários do PR
- [ ] **T10:** Executar `pnpm typecheck && pnpm lint && pnpm test`

---

## File List

_(preenchido durante implementação)_

- `src/app/layout.tsx` — modificado (T2)
- `src/app/(app)/layout.tsx` — modificado (T3)
- `src/hooks/useFocusTrap.ts` — criado (T5)
- `src/components/MobileDrawer.tsx` — modificado (T6)
- `src/components/AppShell.tsx` — modificado se necessário (T4)
- `src/components/TopBar.tsx` — modificado se necessário (T4)
- _(outros componentes identificados no T1)_
- `tests/unit/useFocusTrap.test.ts` — criado (T7)
- `tests/unit/layout.test.tsx` — criado ou modificado (T8)

---

## Notas técnicas

**Skip link — padrão recomendado:**
O link deve ser o primeiro filho do `<body>`. Em Next.js App Router, adicioná-lo como primeiro filho do layout root (`app/layout.tsx`) antes de qualquer outro elemento. Estilização via Tailwind: `className="sr-only focus:not-sr-only"` — invisível por padrão, visível ao receber foco via teclado.

**Varredura de botões icon-only — referências da review UX Uma (Fase 6):**
Os candidatos prováveis identificados incluem: botões de fechar/abrir em TopBar, botões de ação em listas de SKUs, botões de navegação mobile em AppShell, e qualquer `<Button variant="ghost">` com apenas `<Icon />` como filho.

**Focus trap — seletor de elementos focusáveis:**
```ts
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
```

**Retorno de foco ao fechar drawer:**
Antes de abrir o drawer, capturar `document.activeElement` como `triggerRef`. Ao fechar (via Escape handler existente em `MobileDrawer.tsx` ou via `onClose` callback), chamar `triggerRef.current?.focus()`.

**Referências:**
- `docs/reviews/ux-specialist-review.md` — review Uma (Fase 6), seção A11y
- `src/components/MobileDrawer.tsx:52-132` — implementação atual com `role="dialog"` e Escape handler
- ARIA Authoring Practices — Modal Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WCAG 2.1 SC 2.4.1 (Bypass Blocks) e SC 2.1.2 (No Keyboard Trap)

---

## Riscos / Plano de rollback

**Risco:** Hook `useFocusTrap` pode interferir com outros comportamentos de teclado dentro do drawer (ex: inputs com Tab para navegação interna).

**Mitigação:** O seletor de focusáveis inclui inputs/selects — Tab navega entre eles normalmente dentro do trap. Testar com drawer contendo formulário antes de merge.

**Rollback:** Todas as alterações são aditivas (novos atributos HTML, novo hook). `git revert` é seguro sem efeito colateral em dados ou contratos de API.

---

*Story gerada por @pm (Morgan) — EPIC-TD-001 — Brownfield Discovery Fase 10 — 2026-04-27*
