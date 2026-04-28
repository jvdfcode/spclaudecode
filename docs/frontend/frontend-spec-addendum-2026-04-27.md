# Frontend Spec — Addendum 2026-04-27

**Workflow:** brownfield-discovery (AIOX) — Fase 3 (re-run)
**Agente:** @ux-design-expert (Uma)
**Base:** `docs/frontend/frontend-spec.md` (2026-04-23)

> Este adendo complementa o documento base com auditoria quantitativa de A11y, estados de UI, i18n, forms, feedback e SEO. NÃO substitui o doc base, que descreve o design system em detalhe.

## 1. Inventário (refinado)

| Métrica | Valor |
|---------|-------|
| Componentes em `src/components/` | 50 TSX |
| LOC total | ~5.452 |
| Componentes com `'use client'` | 35 |
| Server Components | 15 |
| Rotas com `loading.tsx` | 5 (calculadora, skus, mercado, dashboard, skus/[id]) |
| Rotas com `error.tsx` dedicado | 0 (apenas global em `src/app/error.tsx`) |
| Rotas com `not-found.tsx` dedicado | 0 (apenas global) |
| `<Suspense>` no código | 3 ocorrências (1 com fallback) |
| Pages com `metadata` exportada | 5/9 |

## 2. Acessibilidade (auditoria quantitativa)

| Métrica | Contagem | Avaliação |
|---------|----------|-----------|
| `aria-*` em src/ | 43 | Cobertura parcial (~41%) |
| `role=` | 12 | Pontual |
| `aria-label` | 14 | Pontual |
| `aria-hidden` | 11 | Bom uso (decorativo: ripples/spinners) |
| `<img>` nativo sem `alt` | 0 | Tudo via `next/image` ou SVG inline |
| `tabIndex`/focus | 21 | OK |
| `lang="pt-BR"` | ✓ | `layout.tsx` |
| `next/font` | ✓ | Manrope |
| `prefers-reduced-motion` | ✓ | global em `globals.css` (resolvido vs base 2026-04-23) |
| `role="alert"` em error de form | ✓ | `LoginForm.tsx:76`, `SignupForm.tsx:166` |
| Skip nav link | ✗ | ainda ausente (gap base) |

**Gaps específicos novos:**
- ~15 botões icon-only sem `aria-label`/text (ModeSelection, PositionOptions, DecisionPanel, partes de CostForm).
- Forms sem `aria-describedby` ligando mensagem de erro ao input.
- GenieButton spinner com `aria-hidden` mas botão sem `aria-busy={loading}`.

## 3. Estados de UI (refinados)

| Item | Status | Observação |
|------|--------|------------|
| Loading global | ✓ | 5/9 rotas |
| Skeleton custom | ✓ | `SkeletonRows` |
| Empty states | ✓ | `EmptyState` reutilizável + customs por página |
| Error boundary | ✓ | `ErrorBoundary.tsx` (class component) |
| Suspense streaming | ⚠️ | Subutilizado — pages do `(app)` não envolvem componentes async com Suspense |
| MarketSearch loading | ✗ | `mercado/MarketSearch.tsx:50-79` faz fetch (3 estratégias) sem indicador visual |

## 4. Internacionalização

❌ **Sem framework** (`next-intl`, `react-intl` ausentes). 100% hardcoded em pt-BR.

Amostras:
- `LoginForm.tsx:19` — "Informe seu email."
- `SignupForm.tsx:40` — "A senha deve ter pelo menos 6 caracteres."
- `skus/page.tsx:185` — "Nenhum SKU encontrado com esses filtros"
- `MarketSearch.tsx:57` — "Scraper sem resultados"
- `skus/[id]/page.tsx` — "Nenhum cálculo registrado"

## 5. Forms

| Form | Caminho | Validação | Lib |
|------|---------|-----------|-----|
| Login | `auth/LoginForm.tsx` | useState + regex email | nenhum |
| Signup | `auth/SignupForm.tsx` | useState + strength + match | nenhum |
| Recuperar | `auth/RecoverForm.tsx` | trim email | nenhum |
| MarketSearch | `mercado/MarketSearch.tsx` | sem validação | nenhum |

Sem `react-hook-form`, `zod` ou `Yup`. Validação cliente é manual; server-side via Supabase Auth.

## 6. Feedback (sonner)

12 chamadas `toast.success`/`toast.error` em SaveSkuButton, DecisionPanel, SkuCardMenu e fluxos Supabase. Padrão consistente em pt-BR. Provider em `layout.tsx:35`: `<Toaster richColors position="top-right" duration={3000} />`.

**Resolve gap base:** "Sem toast/notificação global" — agora há sonner integrado.

## 7. Componentes monolíticos (>300 LOC)

| Arquivo | LOC | Recomendação |
|---------|-----|--------------|
| `calculadora/CostForm.tsx` | 487 | Decompor em CostFields + ValidationLogic + Submit |
| `mercado/MarketSearch.tsx` | 418 | Separar SearchForm + ResultsList + FetchStrategies |

## 8. Débitos frontend (consolidados, novos / refinados)

### CRITICAL

- **FE-1** — Botões icon-only sem `aria-label` — WCAG 2.1 A.
- **FE-2** — Sem framework i18n; 100% strings hardcoded pt-BR (refator caro à frente).

### HIGH

- **FE-3** — Forms sem `aria-describedby` (LoginForm/SignupForm) — WCAG 2.1 AA.
- **FE-4** — MarketSearch sem loading visual durante fetch.
- **FE-13** — Sidebar mobile (do doc base) **permanece pendente**: sem hamburger menu (verificar se MobileDrawer está integrado em AppShell — se não, é HIGH).

### MEDIUM

- **FE-5** — GenieButton sem `aria-busy={loading}`.
- **FE-6** — `<Suspense>` subutilizado nas pages do `(app)`.
- **FE-7** — Validação de email frouxa; adotar `zod`.
- **FE-11** — `CostForm.tsx` 487 LOC.
- **FE-12** — `MarketSearch.tsx` 418 LOC.

### LOW

- **FE-8** — Mistura motion library × CSS para animações.
- **FE-9** — Metadata ausente nas rotas `(auth)`.
- **FE-10** — `localStorage` em MarketSearch sem fallback de erro.

## 9. Resolvidos desde 2026-04-23

| Gap base | Status |
|----------|--------|
| Sem toast/notificação global | ✅ sonner integrado |
| `prefers-reduced-motion` ausente | ✅ global em globals.css |
| Tipos DB manuais (M3 base) | ✅ `supabase.gen.ts` gerado |
| Sidebar mobile | 🟡 verificar — `MobileDrawer.tsx` existe em `components/layout/` |

## 10. Prioridades

1. **FE-1** + **FE-2** (CRITICAL — A11y + i18n)
2. **FE-3** + **FE-4** + **FE-13** (HIGH)
3. **FE-11** + **FE-12** (decomposição de monolíticos)

---
*Re-run brownfield-discovery — Fase 3 — 2026-04-27*
