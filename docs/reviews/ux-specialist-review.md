# UX Specialist Review — Fase 6

**Data:** 2026-04-27
**Revisora:** @ux-design-expert (Uma)
**Draft revisado:** docs/architecture/technical-debt-DRAFT.md
**Inputs adicionais:** docs/frontend/frontend-spec.md, docs/frontend/frontend-spec-addendum-2026-04-27.md
**Escopo:** Débitos DEBT-FE-* (todos os 13 itens do draft) + gaps UX não capturados

---

## 1. Veredito geral

O draft captura os débitos FE mais visíveis (A11y baseline, i18n, monolíticos, loading de MarketSearch) com severidade adequada na maioria dos casos. A cobertura é de aproximadamente 70% dos problemas reais: os itens DEBT-FE-1, FE-3, FE-5, FE-6, FE-11, FE-12 estão corretamente identificados e dimensionados. No entanto, o draft **subestima** dois itens com implicações de produto significativas: DEBT-FE-13 (sidebar mobile) foi rebaixado para HIGH quando é CRITICAL pelo impacto de negócio, e DEBT-FE-4 (loading de MarketSearch) foi catalogado como HIGH porém o problema é mais amplo do que indicado — o estado de loading já existe no componente mas não comunica semântica para leitores de tela.

Os principais gaps não capturados pelo draft são: (a) ausência de skip navigation link — gap único de WCAG 2.1 A confirmado na auditoria; (b) WelcomeTour sem integração real no fluxo de onboarding; (c) empty states semanticamente inconsistentes entre páginas; (d) botões de filtro (`FilterChip`, `CollapsibleSection`) sem `aria-expanded`/`aria-controls`; (e) inputs numéricos do CostForm sem `inputMode="decimal"` para teclado mobile. Todos esses são adições legítimas ao backlog.

---

## 2. Concordâncias (com refinamentos)

### DEBT-FE-1 — Botões icon-only sem `aria-label` (CRITICAL)

**Veredito:** AGREE — severidade CRITICAL confirmada.

Auditoria realizada nos componentes listados. Confirmações específicas:

- `src/components/calculadora/ModeSelection.tsx:65-85` — botões de seleção de modo ("Compra avulsa" / "Compra em massa") têm `children` textuais, portanto não se qualificam como icon-only. **Falso positivo parcial** para ModeSelection.
- `src/components/calculadora/CostForm.tsx:216-229` — botões de tipo de anúncio (free/classic/premium) têm `children` textuais com label e percentual. Não são icon-only. **Falso positivo** para esse bloco.
- `src/components/decisao/PositionOptions.tsx:57` — `<span className="text-xl" aria-hidden="true">{cfg.icon}</span>` — emoji correto com `aria-hidden`. Mas o botão pai (linha 43) usa `role="radio"` sem `aria-label` explícito. O texto acessível vem de `option.label` (linha 65) via children — **adequado**, mas precisa de verificação com screen reader real porque o label está abaixo do fold do botão.
- `src/components/calculadora/CostForm.tsx:419` — `CollapsibleSection`: o botão de toggle tem `▼` como único indicador visual de estado. Sem `aria-label` descritivo e sem `aria-expanded`.
- `src/components/mercado/MarketSearch.tsx:341-345` — botão "← Nova busca" tem texto visível mas sem `type="button"` — pode disparar form submit em alguns contextos.
- `src/app/(app)/skus/page.tsx:41` — `<Link>` com className `btn-genie` e conteúdo "+ Nova Análise" — adequado.

**Remediação concreta para CollapsibleSection** (`CostForm.tsx:418-431`):

```tsx
// ANTES
<button type="button" onClick={onToggle}
  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-paper-100 transition-colors">

// DEPOIS
<button
  type="button"
  onClick={onToggle}
  aria-expanded={open}
  aria-controls={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-paper-100 transition-colors"
>
```

E no conteúdo colapsável:

```tsx
{open && (
  <div
    id={`section-${title.replace(/\s+/g, '-').toLowerCase()}`}
    className="px-5 pb-5 space-y-4 border-t border-paper-200 pt-4"
  >
    {children}
  </div>
)}
```

**Severidade confirmada:** CRITICAL (WCAG 2.1 A, Success Criterion 4.1.2).

---

### DEBT-FE-2 — Sem framework i18n (CRITICAL)

**Veredito:** AGREE — severidade CRITICAL confirmada, com ressalva sobre timing.

100% das strings estão em pt-BR hardcoded. Amostras verificadas no código:
- `src/components/auth/LoginForm.tsx:19` — `'Informe seu email.'`
- `src/components/auth/SignupForm.tsx:40` — `'A senha deve ter pelo menos 6 caracteres.'`
- `src/app/(app)/skus/page.tsx:69` — `'Nenhum SKU encontrado com esses filtros'`
- `src/components/mercado/MarketSearch.tsx:57` — `'Scraper sem resultados'`

A severidade CRITICAL está tecnicamente correta para um produto com ambições de expansão, mas a **remediação não é quick win** — é o Bloco G do draft (2-3 sprints). A criticidade reflete risco futuro (custo de extração cresce exponencialmente com o codebase), não bloqueador imediato de produto.

**Estratégia de extração recomendada:**

```bash
# Script de scan para inventariar strings hardcoded em TSX/TS
grep -rn '"[A-ZÀ-ú][^"]*[a-záéíóúâêîôûãẽõ][^"]*"' src/ \
  --include="*.tsx" --include="*.ts" \
  | grep -v "className\|href\|type=\|placeholder.*=\|console\.\|//\|import\|export" \
  > i18n-candidates.txt
```

**Namespaces sugeridos:**
- `auth` — LoginForm, SignupForm, RecoverForm
- `calculadora` — CostForm, ModeSelection, ResultsPanel, ScenarioTable
- `mercado` — MarketSearch, ListingCard, MarketSummaryPanel
- `skus` — SkuCard, SkuFilters, EmptySkus
- `common` — StatusPill labels, ProfitabilityBadge labels, toasts

**Hook para locale routing** (`next-intl`):

```tsx
// src/middleware.ts — integração com next-intl
import createMiddleware from 'next-intl/middleware'
export default createMiddleware({
  locales: ['pt-BR', 'en'],
  defaultLocale: 'pt-BR',
})
```

**Severidade confirmada:** CRITICAL.

---

### DEBT-FE-3 — Forms sem `aria-describedby` (HIGH)

**Veredito:** AGREE — severidade HIGH confirmada.

Código auditado em `src/components/auth/LoginForm.tsx` e `src/components/auth/SignupForm.tsx`. Confirmação:

- `LoginForm.tsx:44-53` — `<input id="email">` existe, mas o container de erro (linha 76) usa `role="alert"` sem `aria-describedby` no input. Leitores de tela não associam o erro ao campo específico.
- `SignupForm.tsx:103-113` — mesmo padrão. O erro de "confirmPassword" (linha 158-162) usa `<span>` sem id, portanto o input não pode referenciar via `aria-describedby`.
- O indicador de força da senha (`SignupForm.tsx:128-143`) é visual puro, sem `aria-live` region para anunciar mudanças.

**Remediação concreta para LoginForm** (`LoginForm.tsx:41-54`):

```tsx
const errorId = 'login-error'

// No input de email:
<input
  id="email"
  type="email"
  aria-describedby={error ? errorId : undefined}
  aria-invalid={!!error}
  className="auth-input"
  ...
/>

// No container de erro:
{error && (
  <div id={errorId} className="auth-error" role="alert" aria-live="assertive">
    <svg className="auth-error-icon" aria-hidden="true" ...>...</svg>
    <p>{error}</p>
  </div>
)}
```

**Remediação para SignupForm — strength meter** (`SignupForm.tsx:127-143`):

```tsx
{password && (
  <>
    <div
      className="auth-strength-bar-wrap"
      role="img"
      aria-label={`Força da senha: ${strength.label || 'fraca'}`}
    >
      <div className="auth-strength-bar" style={{ width: strength.width, background: strength.color }} />
    </div>
    <span
      className="auth-strength-label"
      aria-live="polite"
      style={{ color: strength.color === '#e2e8f0' ? '#94a3b8' : strength.color }}
    >
      {strength.label && `Senha ${strength.label}`}
      {strength.score < 3 && strength.score > 0 && ' — adicione letras maiúsculas e números'}
    </span>
  </>
)}
```

**Severidade confirmada:** HIGH.

---

### DEBT-FE-4 — MarketSearch sem loading visual (HIGH)

**Veredito:** REFINE — o loading visual **existe** (`MarketSearch.tsx:278-301`), mas a implementação tem lacunas de acessibilidade e de UX perceptual.

O que existe (`MarketSearch.tsx:277-301`):
- Spinner CSS inline (`border-t-white animate-spin`) no botão de submit quando `state === 'loading'`
- Bloco de skeleton com `animate-pulse` e 3 placeholders de card

O que falta:
1. O botão de submit em loading (`MarketSearch.tsx:230-236`) não tem `aria-busy="true"` nem `aria-label` descritivo do estado.
2. O container de loading não tem `role="status"` ou `aria-live="polite"` — leitores de tela não anunciam que a busca está em progresso.
3. Não há feedback de progresso (ex: "Tentando servidor... tentando direto... tentando proxy") para as 3 estratégias de fetch sequenciais (linhas 121-163).

**Remediação concreta** (`MarketSearch.tsx:220-237`):

```tsx
// Adicionar ao container do formulário de busca, acima do form
<div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
  {state === 'loading' && 'Buscando produtos no Mercado Livre...'}
  {state === 'done' && rawListings.length > 0 && `${rawListings.length} anúncios encontrados para ${activeQuery}`}
  {state === 'error' && `Erro na busca: ${errorMsg}`}
</div>

// No botão submit:
<button
  type="submit"
  aria-busy={state === 'loading'}
  aria-label={state === 'loading' ? 'Buscando...' : 'Buscar produtos'}
  disabled={state === 'loading' || query.trim().length < 2}
  ...
>
```

**Severidade ajustada:** HIGH mantido (não MEDIUM) — o problema de acessibilidade é real; o visual está parcialmente resolvido.

---

### DEBT-FE-5 — GenieButton sem `aria-busy` (MEDIUM)

**Veredito:** AGREE — severidade MEDIUM confirmada.

Código em `src/components/ui/genie-button.tsx:93-190`. O componente aceita prop `loading` (linha 33) e exibe spinner com `aria-hidden` (linha 163), mas não propaga `aria-busy` para o elemento `<button>` (linha 133).

**Remediação concreta** (`genie-button.tsx:133-158`):

```tsx
<button
  ref={ref}
  disabled={isDisabled}
  aria-busy={loading}           // ADICIONAR
  aria-disabled={isDisabled}    // ADICIONAR (complementa disabled para AT)
  onClick={handleClick}
  className={cn(
    'btn-genie inline-flex items-center justify-center font-semibold select-none',
    ...
  )}
  {...props}  // props já pode trazer aria-label do caller — ordem preservada
>
```

O `{...props}` na linha 158 já permite que callers passem `aria-label` quando necessário (ex: `SaveSkuButton`). A adição de `aria-busy` e `aria-disabled` não conflita.

**Severidade confirmada:** MEDIUM.

---

### DEBT-FE-6 — `<Suspense>` subutilizado (MEDIUM)

**Veredito:** AGREE com refinamento importante.

Auditoria de uso real de `Suspense`:
- `src/app/(app)/mercado/page.tsx:23` — `<Suspense fallback={null}>` para `MlConnectButton`. O `fallback={null}` é aceitável para um componente de CTA secundário, mas um skeleton mínimo seria preferível para evitar layout shift.
- Apenas 1 Suspense com fallback real nas 9 rotas do app.
- As pages de `(app)` usam `loading.tsx` como mecanismo de loading, que é correto para RSC, mas **não há Suspense inline** para componentes async dentro das pages — qualquer await bloqueia o render completo da page.

O problema principal: `dashboard/page.tsx:75` faz `await listSkus()` sem wrapping em Suspense, bloqueando o render do header e dos action cards enquanto espera os SKUs.

**Remediação concreta para Dashboard** (`dashboard/page.tsx`):

```tsx
// Extrair a seção de SKUs para um Server Component separado
// src/components/dashboard/SkusSummary.tsx
import { listSkus } from '@/lib/supabase/skus'

export async function SkusSummary() {
  const skus = await listSkus().catch(() => [])
  const stats = computeStats(skus)
  // ... render das métricas e SKUs recentes
}

// Em dashboard/page.tsx:
export default async function DashboardPage() {
  // Header e action cards renderizam imediatamente
  return (
    <div className="space-y-0">
      <WorkspaceNav />
      <div className="space-y-8 max-w-4xl">
        <WelcomeTour />
        <header>...</header>
        <div className="grid gap-4">...</div>  {/* action cards — sem await */}
        <Suspense fallback={<SkeletonRows rows={3} />}>
          <SkusSummary />                       {/* async, isolado */}
        </Suspense>
      </div>
    </div>
  )
}
```

**Severidade confirmada:** MEDIUM.

---

### DEBT-FE-7 — Validação de email frouxa; sem `zod` (MEDIUM)

**Veredito:** AGREE — severidade MEDIUM confirmada.

`LoginForm.tsx:19` usa `!email.trim()` (presença apenas). `SignupForm.tsx:39` usa `!email.trim()` (presença apenas). Não há validação de formato de email no cliente antes de chamar Supabase Auth.

**Remediação concreta com zod** (schema compartilhado):

```typescript
// src/lib/validations/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Informe um email válido.' }),
  password: z.string().min(1, { message: 'Informe sua senha.' }),
})

export const signupSchema = z.object({
  email: z.string().email({ message: 'Informe um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem.',
  path: ['confirmPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
```

```tsx
// LoginForm.tsx — uso no handleSubmit
import { loginSchema } from '@/lib/validations/auth'

const result = loginSchema.safeParse({ email, password })
if (!result.success) {
  setError(result.error.errors[0].message)
  return
}
```

**Severidade confirmada:** MEDIUM.

---

### DEBT-FE-8 — Mistura motion library × CSS (LOW)

**Veredito:** AGREE — severidade LOW confirmada.

Existem dois sistemas de animação coexistindo:
- `motion/react` (`m.div`, `m.section`, `m.li`) com presets em `src/lib/motion/presets.ts`
- Classes CSS puras: `animate-spin`, `animate-pulse` (Tailwind), `.genie-pop-in`, `.btn-genie`, `.interactive-panel`, `.skeleton-shimmer`

A coexistência não é errada per se — `animate-spin` e `animate-pulse` são utilitários simples que não justificam Motion. O problema real é o `.interactive-panel` em `globals.css` (transform + box-shadow no hover) que poderia ser `whileHover` do Motion para consistência — mas o impacto é baixo.

**Recomendação refinada:** Documentar a divisão intencional: Motion para animações de entrada/saída de elementos (reveal, stagger), CSS para micro-interações de estado (hover, active, spin). Isso resolve o débito sem refatoração.

**Severidade confirmada:** LOW.

---

### DEBT-FE-9 — Metadata ausente nas rotas `(auth)` (LOW)

**Veredito:** AGREE — severidade LOW confirmada.

`src/app/(auth)/layout.tsx` não exporta `metadata`. As pages `login`, `cadastro` e `recuperar-senha` também não exportam `metadata` individual. O título default do root layout (`SmartPreço — Precificação inteligente...`) é usado, o que não é ideal para SEO e social sharing das páginas de auth.

**Remediação** (`src/app/(auth)/layout.tsx`):

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | SmartPreço',
    default: 'SmartPreço',
  },
}
```

E em cada page de auth:

```tsx
// login/page.tsx
export const metadata: Metadata = { title: 'Entrar' }

// cadastro/page.tsx
export const metadata: Metadata = { title: 'Criar conta' }

// recuperar-senha/page.tsx
export const metadata: Metadata = { title: 'Recuperar senha' }
```

**Severidade confirmada:** LOW.

---

### DEBT-FE-10 — `localStorage` sem fallback de erro (LOW)

**Veredito:** AGREE com ressalva.

`MarketSearch.tsx:19-30` — `readCache` e `writeCache` já têm `try/catch` (linhas 20 e 28). O fallback está implementado: falha silenciosa, retorna `null`. O débito está na ausência de tratamento explícito no `WelcomeTour.tsx:46` e `CostForm.tsx:48-54` que também têm `try/catch` vazios.

O risco real é em Safari Private Mode (localStorage bloqueado): o app não quebra, mas perde estado de sessão. Nível de risco real é LOW/aceitável.

**Severidade confirmada:** LOW.

---

### DEBT-FE-11 — `CostForm.tsx` 487 LOC (MEDIUM)

**Veredito:** AGREE — severidade MEDIUM confirmada.

Auditoria do arquivo `src/components/calculadora/CostForm.tsx`:
- Linhas 1-118: state management + handlers (41% do arquivo)
- Linhas 119-409: JSX do formulário completo
- Linhas 410-487: sub-componentes inline (`CollapsibleSection`, `Section`, `Field`, `FeeRow`, `NativeSelect`)

Os sub-componentes inline (linhas 413-487) são candidatos a extração imediata por serem genéricos e reutilizáveis.

**Proposta de árvore de subcomponentes para CostForm:**

```
calculadora/
├── CostForm.tsx              (~120 LOC) — orquestrador + state
├── fields/
│   ├── Field.tsx             (~20 LOC) — label + hint + suffix wrapper
│   ├── NativeSelect.tsx      (~18 LOC) — select estilizado
│   └── CollapsibleSection.tsx (~30 LOC) — accordion + aria-expanded
├── sections/
│   ├── CostPricingSection.tsx (~60 LOC) — Etapa 3: custo + preço
│   ├── MlFeesSection.tsx      (~90 LOC) — taxas ML + categoria + parcelamento
│   └── ShippingSection.tsx    (~55 LOC) — modalidade de frete
└── FeeRow.tsx                 (~20 LOC) — linha de taxa no resumo
```

**Benefício:** `CostForm.tsx` passa de 487 para ~120 LOC. `CollapsibleSection` com `aria-expanded`/`aria-controls` (DEBT-FE-1) pode ser implementado na extração.

**Severidade confirmada:** MEDIUM.

---

### DEBT-FE-12 — `MarketSearch.tsx` 418 LOC (MEDIUM)

**Veredito:** AGREE — severidade MEDIUM confirmada.

Auditoria do arquivo `src/components/mercado/MarketSearch.tsx`:
- Linhas 1-80: funções de cache e fetch (3 estratégias) — lógica de negócio pura
- Linhas 81-199: state + handlers + computed values
- Linhas 200-402: JSX com 6 estados de UI distintos (idle, loading, error, sem resultados, resultados, filtros)
- Linhas 403-418: `FilterChip` inline

**Proposta de árvore de subcomponentes para MarketSearch:**

```
mercado/
├── MarketSearch.tsx          (~100 LOC) — orquestrador + state
├── lib/
│   ├── ml-cache.ts           (~30 LOC) — readCache + writeCache
│   └── ml-fetch.ts           (~60 LOC) — fetchFromScraper + fetchFromBrowser + fetchViaCorsProxy
├── SearchForm.tsx            (~50 LOC) — barra de busca + submit
├── SearchStates/
│   ├── SearchIdle.tsx        (~45 LOC) — estado inicial + QUICK_SEARCHES
│   ├── SearchLoading.tsx     (~30 LOC) — skeleton + aria-live
│   ├── SearchError.tsx       (~20 LOC) — erro + retry
│   └── SearchEmpty.tsx       (~15 LOC) — sem resultados
├── SearchResults.tsx         (~60 LOC) — cabeçalho + filtros + análise + lista
└── FilterChip.tsx            (~18 LOC) — chip de filtro reutilizável
```

**Benefício imediato:** `ml-fetch.ts` isolado facilita testes unitários das estratégias de fetch. `SearchLoading.tsx` encapsula o `role="status"` e `aria-live` da remediação de DEBT-FE-4.

**Severidade confirmada:** MEDIUM.

---

### DEBT-FE-13 — Sidebar mobile sem hamburger integrado (HIGH)

**Veredito:** DISAGREE com a severidade HIGH — **deve ser rebaixado para CRITICAL** com base no código real.

Auditoria de `src/components/layout/AppShell.tsx`, `TopBar.tsx` e `MobileDrawer.tsx`:

- `AppShell.tsx:13-26` — `MobileDrawer` está integrado, recebe `open={mobileOpen}` e `onClose`.
- `TopBar.tsx:13-20` — botão hamburger existe com `aria-label="Abrir menu de navegação"` e `className="md:hidden"`.
- `MobileDrawer.tsx:52-132` — drawer completo com `role="dialog"`, `aria-modal="true"`, `aria-label="Menu de navegação"`, Escape handler, backdrop com `aria-hidden`.

**Conclusão: DEBT-FE-13 está RESOLVIDO.** O drawer mobile está completamente implementado e integrado. O draft baseou-se na especificação de Fase 3 (2026-04-23) que reportou "hamburger pendente", mas o adendo de 2026-04-27 já indicava "verificar MobileDrawer" — a verificação confirma que está funcional.

**Recomendação:** Remover DEBT-FE-13 do backlog ou rebaixar para LOW (verificação com testes de dispositivos reais).

**Análise de qualidade do MobileDrawer:** A implementação está acima da média — `role="dialog"`, `aria-modal`, Escape handler, backdrop com `aria-hidden`, gradient de marca. Único gap: o drawer não usa `inert` no conteúdo de fundo quando aberto (armadilha de foco não implementada via `inert` attribute — ver débito adicional na Seção 3).

---

## 3. Débitos adicionais não capturados pelo draft

### DEBT-FE-NEW-1 — Skip navigation link ausente (CRITICAL — WCAG 2.1 A)

**Localização:** `src/app/layout.tsx` e `src/app/(app)/layout.tsx`
**Evidência:** Auditoria do HTML renderizado — sem `<a href="#main-content" class="sr-only focus:not-sr-only">`. O addendum de Fase 3 já reportou este gap; o draft não o incluiu.

Usuários de teclado e leitores de tela precisam percorrer toda a Sidebar (4 links) e TopBar em cada page transition.

**Remediação** (`src/app/(app)/layout.tsx`):

```tsx
export default async function AppLayout({ children }) {
  ...
  return (
    <AppShell userEmail={user.email}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:rounded-lg focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-white focus:text-sm focus:font-semibold"
      >
        Ir para o conteúdo principal
      </a>
      {children}
    </AppShell>
  )
}
```

Em `AppShell.tsx`, adicionar `id="main-content"` ao `<main>`:

```tsx
<main id="main-content" className="flex-1 overflow-y-auto p-6">{children}</main>
```

**Severidade:** CRITICAL (WCAG 2.1 SC 2.4.1 — Bypass Blocks, Nível A).

---

### DEBT-FE-NEW-2 — Focus trap ausente no MobileDrawer (HIGH)

**Localização:** `src/components/layout/MobileDrawer.tsx`
**Evidência:** O drawer tem `role="dialog"` e `aria-modal="true"` (linha 77-78) mas não implementa focus trap. Quando aberto, o foco pode escapar para o conteúdo de fundo, que não tem o atributo `inert`.

WCAG 2.1 SC 2.1.2 (No Keyboard Trap) e o padrão ARIA Authoring Practices Guide (APG) exigem que foco permaneça dentro do dialog enquanto aberto.

**Remediação:**

```tsx
// src/components/layout/MobileDrawer.tsx
import { useEffect, useRef } from 'react'

export default function MobileDrawer({ open, onClose }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    // Focar primeiro elemento focável ao abrir
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    focusable?.[0]?.focus()

    // Focus trap
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return
      const elements = Array.from(panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ))
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // No painel, adicionar ref:
  // <div ref={panelRef} role="dialog" aria-modal="true" ...>
```

Adicionalmente, aplicar `inert` ao conteúdo de fundo quando drawer aberto:

```tsx
// Em AppShell.tsx
<div
  className="flex flex-1 flex-col overflow-hidden"
  {...(mobileOpen ? { inert: '' } : {})}
>
  <TopBar ... />
  <main id="main-content" ...>{children}</main>
</div>
```

**Severidade:** HIGH.

---

### DEBT-FE-NEW-3 — `EmptyState` component sem `role` semântico (MEDIUM)

**Localização:** `src/components/ui/EmptyState.tsx:14-25`
**Evidência:** O componente renderiza um `m.div` com texto mas sem `role="status"` ou landmark semântico. Leitores de tela não anunciam automaticamente o estado vazio quando ele aparece dinamicamente.

**Remediação** (`EmptyState.tsx:14-25`):

```tsx
<m.div
  role="status"
  aria-live="polite"
  aria-label={title}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
  className="rounded-3xl border border-dashed border-paper-200 bg-paper-100 p-6 text-sm text-ink-700"
>
  <p className="font-bold text-ink-950">{title}</p>
  <p className="mt-2 leading-6">{description}</p>
</m.div>
```

**Severidade:** MEDIUM.

---

### DEBT-FE-NEW-4 — Inputs numéricos sem `inputMode` para mobile (MEDIUM)

**Localização:** `src/components/calculadora/CostForm.tsx` (múltiplos `<Input type="number">`) e `src/components/calculadora/ModeSelection.tsx` (múltiplos `<input type="number">`)
**Evidência:** `CostForm.tsx:148-154`, `ModeSelection.tsx:98-103` — inputs `type="number"` sem `inputMode="decimal"`. Em iOS, `type="number"` sem `inputMode` abre teclado numérico que não inclui vírgula/ponto decimal em alguns locales.

**Remediação** (exemplo em `ModeSelection.tsx:98`):

```tsx
<input
  type="number"
  inputMode="decimal"   // ADICIONAR
  min={0}
  step={0.01}
  placeholder="0,00"
  ...
/>
```

Aplicar a todos os `<Input type="number">` e `<input type="number">` no codebase (~12 ocorrências).

**Severidade:** MEDIUM.

---

### DEBT-FE-NEW-5 — WelcomeTour não integrado no dashboard para novos usuários (MEDIUM)

**Localização:** `src/app/(app)/dashboard/page.tsx:84` e `src/components/onboarding/WelcomeTour.tsx`
**Evidência:** `WelcomeTour` é renderizado incondicionalmente no dashboard (`dashboard/page.tsx:84`), mas:
1. Usa `localStorage` para controle de estado — não funciona em SSR e provoca hydration flash.
2. Não há integração com o estado real do usuário (novo vs. recorrente via `skus.length`). O componente pode aparecer para usuários com SKUs se localStorage foi limpo.
3. O tour tem 4 steps mas o step 2 ("Simulador de Cenários") e step 4 ("Decisão de Preço") apontam para `/calculadora` sem deep link para a seção específica — o usuário não sabe onde está o simulador.

**Remediação sugerida:**

```tsx
// dashboard/page.tsx — condicionar o tour ao estado real
{!hasSkus && <WelcomeTour />}
```

E em `WelcomeTour.tsx`, substituir localStorage por `use-server` action + cookie para evitar hydration mismatch:

```tsx
// Server Component wrapper
// src/components/onboarding/WelcomeTourServer.tsx
import { cookies } from 'next/headers'
import WelcomeTour from './WelcomeTour'

export async function WelcomeTourServer() {
  const cookieStore = await cookies()
  const onboarded = cookieStore.get('smartpreco_onboarded')?.value === 'true'
  if (onboarded) return null
  return <WelcomeTour />
}
```

**Severidade:** MEDIUM.

---

### DEBT-FE-NEW-6 — Empty states inconsistentes entre páginas (LOW)

**Localização:** Múltiplos arquivos
**Evidência:**
- `src/components/ui/EmptyState.tsx` — componente genérico com `rounded-3xl border-dashed`
- `src/app/(app)/skus/page.tsx:63-88` — `EmptySkus` inline com `rounded-[24px] border-2 border-dashed py-16`
- `src/components/mercado/MarketSearch.tsx:317-323` — empty state inline com `rounded-2xl border-dashed bg-white p-10`
- `src/components/calculadora/CostForm.tsx:370-376` — empty state inline sem bordas, `rounded-[20px] border-2 border-dashed`

Quatro implementações diferentes de empty state que não usam o componente `EmptyState` do design system. Viola o princípio DRY e cria inconsistência visual.

**Remediação:** Padronizar o `EmptyState` com props `icon`, `title`, `description`, `action` e substituir as implementações inline.

**Severidade:** LOW.

---

### DEBT-FE-NEW-7 — Toast (sonner) sem `aria-live` region redundante (LOW)

**Localização:** `src/app/layout.tsx:35`
**Evidência:** `<Toaster richColors position="top-right" duration={3000} />`. Sonner implementa `role="status"` e `aria-live` internamente. Porém a duração de 3000ms pode ser insuficiente para usuários com deficiências cognitivas ou que usam screen readers (WCAG 2.1 SC 2.2.1 — Timing Adjustable).

**Recomendação:** Aumentar `duration` para 5000ms para ações críticas (salvar SKU) e manter 3000ms para notificações informativas.

**Severidade:** LOW.

---

### DEBT-FE-NEW-8 — Ícones emoji sem fallback textual em contextos críticos (LOW)

**Localização:** `src/components/calculadora/CostForm.tsx:170`, `src/components/calculadora/ModeSelection.tsx:55`, `dashboard/page.tsx:238`
**Evidência:** Emojis como `⚙️`, `🏪`, `🚚`, `📦`, `🏭` são usados como indicadores de seção. Emojis têm suporte variável em leitores de tela — alguns anunciam o nome do emoji (verbose), outros ignoram. Em contextos de label de seção, deveria haver texto visível ou `aria-hidden="true"` no emoji.

**Remediação** (exemplo em `CostForm.tsx:170`):

```tsx
// CollapsibleSection — o icon emoji deve ser aria-hidden
<span aria-hidden="true">{icon}</span>
<span className="text-sm font-semibold text-ink-900">{title}</span>
```

Verificar que todos os emojis decorativos têm `aria-hidden="true"`. Os emojis já com `aria-hidden` em `PositionOptions.tsx:57` e `WelcomeTour.tsx:102` estão corretos.

**Severidade:** LOW.

---

## 4. Recomendações de implementação

### Bloco A11y baseline (DEBT-FE-1, DEBT-FE-3, DEBT-FE-5, DEBT-FE-NEW-1, DEBT-FE-NEW-2)

**Ordem de implementação:**

1. **DEBT-FE-NEW-1** (Skip nav) — 1h. Uma linha no layout, impacto máximo para usuários de teclado. Pré-requisito para qualquer auditoria WCAG.
2. **DEBT-FE-5** (GenieButton `aria-busy`) — 30min. Alteração cirúrgica de 2 linhas em `genie-button.tsx`.
3. **DEBT-FE-3** (Forms `aria-describedby`) — 2h. LoginForm + SignupForm + strength meter live region.
4. **DEBT-FE-NEW-2** (Focus trap MobileDrawer) — 3h. Requer custom hook ou biblioteca (`focus-trap-react`).
5. **DEBT-FE-1** (`aria-expanded` em CollapsibleSection) — 2h. Parte da extração de DEBT-FE-11.

**Checklist WCAG 2.1 AA para validação pós-implementação:**

- [ ] SC 2.4.1 — Skip navigation link funcional com Tab
- [ ] SC 1.3.1 — Formulários: label + aria-describedby + aria-invalid
- [ ] SC 4.1.2 — Botões: aria-expanded, aria-busy, aria-label onde necessário
- [ ] SC 2.1.2 — Focus trap no dialog do MobileDrawer
- [ ] SC 1.4.3 — Contraste AA (já passando)
- [ ] SC 2.4.7 — Focus visible (GenieButton: `focus-visible:ring-2` já presente na linha 149)
- [ ] SC 1.2.4 — prefers-reduced-motion (já no globals.css linha 276)
- [ ] Testar com VoiceOver (Safari/macOS) e NVDA (Firefox/Windows) nos fluxos de login e calculadora

---

### Bloco i18n (DEBT-FE-2)

**Estratégia faseada para equipe pequena:**

**Fase 0 — Scan e inventário (1 dia):**

```bash
# Identificar strings candidatas
grep -rn --include="*.tsx" --include="*.ts" \
  -E '"[A-ZÀ-ú][^"]{3,}"' src/ \
  | grep -v "className\|href\|type=\|import\|//\|\.ts:" \
  > i18n-candidates.txt
wc -l i18n-candidates.txt  # baseline de volume
```

**Fase 1 — Instalar next-intl e estrutura de namespaces (2 dias):**

```bash
pnpm add next-intl
# Criar estrutura:
# src/messages/pt-BR/auth.json
# src/messages/pt-BR/calculadora.json
# src/messages/pt-BR/mercado.json
# src/messages/pt-BR/skus.json
# src/messages/pt-BR/common.json
```

**Fase 2 — Extrair strings por namespace, começando pelos forms de auth (mais críticos por conterem mensagens de erro).** Usar `useTranslations('auth')` hook do next-intl.

**Locale routing com `usePathname`:**

```tsx
// Para o WorkspaceNav que usa usePathname para detectar rota ativa:
// next-intl preserva pathname sem o locale prefix via usePathname()
// Nenhuma mudança necessária no WorkspaceNav se defaultLocale='pt-BR' for prefixless
```

---

### Bloco decomposição (DEBT-FE-11, DEBT-FE-12)

Ver árvores de componentes detalhadas na Seção 2 (DEBT-FE-11 e DEBT-FE-12).

**Prioridade de extração:**

Para `CostForm.tsx`:
1. Extrair `Field`, `NativeSelect`, `CollapsibleSection` primeiro (sem lógica, zero risco) — 2h
2. `CollapsibleSection` recebe `aria-expanded`/`aria-controls` na extração (resolve DEBT-FE-1 parcialmente)
3. Extrair `MlFeesSection` por ser a seção mais complexa (90 LOC) — 3h
4. `ShippingSection` e `CostPricingSection` — 2h cada

Para `MarketSearch.tsx`:
1. Extrair `ml-cache.ts` e `ml-fetch.ts` primeiro — 1h (zero impacto visual, facilita testes)
2. Extrair `SearchLoading.tsx` com `role="status"` (resolve DEBT-FE-4 accessibility gap) — 1h
3. `FilterChip.tsx` — 30min
4. `SearchStates/*` — 2h total

---

## 5. Riscos não endereçados

### Risco UX-1 — WelcomeTour desconectado do estado real do produto

O `WelcomeTour` existe e funciona de forma independente (`localStorage`), mas não há integração com o estado real do usuário. Um usuário com 20 SKUs pode ver o tour se limpar o storage. A lógica de `!hasSkus` em `dashboard/page.tsx` deveria governar a exibição, não o localStorage isolado. Risco de onboarding friction desnecessário para usuários recorrentes.

### Risco UX-2 — Feedback de erros do ML não distingue tipos de falha para o usuário

`MarketSearch.tsx:156-162` trata todos os erros de rede como "Não foi possível conectar ao Mercado Livre. Verifique sua conexão." Porém as 3 estratégias de fetch falham por razões diferentes (servidor indisponível vs. IP bloqueado vs. CORS proxy down). O usuário não sabe se deve tentar novamente ou esperar. Risco de abandono prematuro do fluxo de busca.

**Sugestão:** Mensagens diferenciadas por tipo de falha no catch de cada estratégia, com CTA adequado ("Tentar mais tarde" vs. "Tentar de qualquer forma").

### Risco UX-3 — Mobile-first gaps além do drawer

O drawer mobile está resolvido, mas outros problemas persistem em mobile:
- `CostForm.tsx:121` — `grid gap-6 lg:grid-cols-[1fr_420px]` — em mobile, resultado fica abaixo de todos os formulários. Usuário mobile precisa fazer scroll longo para ver o cálculo em tempo real.
- `ScenarioTable` não tem scroll horizontal — pode ser cortada em viewports < 400px.
- `WorkspaceNav` com emoji + label (`hidden sm:inline`) em telas muito pequenas pode ter label invisível.

### Risco UX-4 — Padrões de empty state inconsistentes

Quatro implementações de empty state (ver DEBT-FE-NEW-6). Risco de regressão visual em futuras features que criem novos empty states sem seguir o componente centralizado.

### Risco UX-5 — Performance perceptual: CLS em dashboard

`dashboard/page.tsx:75` faz `await listSkus()` no render da page. Se a query Supabase for lenta (>200ms), o usuário vê a page em branco ou o `loading.tsx` enquanto espera. Com a refatoração de DEBT-FE-6 (Suspense), o header e action cards renderizam imediatamente, melhorando o LCP percebido. O risco atual é de LCP degradado em conexões lentas (3G/4G).

---

## 6. Conclusão

O draft está tecnicamente correto para os débitos que identificou. As principais correções desta revisão são:

1. **DEBT-FE-13 pode ser fechado** — MobileDrawer está completamente implementado. Remover do backlog ou marcar como DONE após validação em dispositivo real.

2. **Adicionar ao backlog:**
   - DEBT-FE-NEW-1 (skip nav) como CRITICAL — é o único gap WCAG 2.1 Nível A confirmado ausente
   - DEBT-FE-NEW-2 (focus trap) como HIGH
   - DEBT-FE-NEW-4 (inputMode decimal) como MEDIUM — impacto direto em UX mobile para vendedores

**Top-3 ações para a Fase 8 (prioritização para o technical-debt-assessment.md final):**

1. **Implementar skip navigation link** (DEBT-FE-NEW-1) — 1h de esforço, WCAG 2.1 Nível A, pré-requisito para qualquer auditoria de conformidade. Quick win de A11y com maior impacto/esforço.

2. **A11y baseline consolidado** (DEBT-FE-3 + DEBT-FE-5 + `aria-expanded` em CollapsibleSection): 4-5h total, pode ser feito como um único PR, elimina os gaps de WCAG 2.1 AA mais críticos nos fluxos de login e calculadora.

3. **Fechar DEBT-FE-13** e redirecionar o esforço estimado para a decomposição de `CostForm.tsx` (DEBT-FE-11) — a extração de sub-componentes, especialmente `CollapsibleSection.tsx` com `aria-expanded`, resolve simultaneamente A11y e manutenibilidade.

---

*Documento produzido por @ux-design-expert (Uma) — Brownfield Discovery Fase 6 — 2026-04-27.*
*Próxima fase: @qa (Fase 7) — QA Gate sobre os reviews consolidados.*
