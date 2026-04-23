# SmartPreço — Especificação Frontend

> Produzido por: @ux-design-expert / Uma (Brownfield Discovery — Fase 3)
> Data: 2026-04-23
> Estado: Pós-redesign UI (fusão SmartPreço + Codex design system)

---

## 1. Visão Geral do Design System

O SmartPreço possui agora um design system profissional resultante da fusão estratégica entre a base funcional SmartPreço e os elementos visuais do projeto Codex. A premissa foi: **manter o sólido, adicionar o belo**.

### 1.1 Identidade Visual

| Elemento | Valor | Aplicação |
|---------|-------|-----------|
| Fonte primária | Manrope 400-800 | Toda a tipografia |
| Cor dominante | ink-950 (#1a1d2e) | CTA, sidebar, logos, destaques |
| Cor de destaque | gold-400 (#e8c045) | Barras gradiente, ícones ativos, accents |
| Background | paper-50 (#f8f9ff) + radial gradient | Global, pages |
| Bordas | paper-200 (#e2e6f6) | Cards, divisores, tabs |
| Sucesso | profit-500 (#0e9f6e) | Viabilidade positiva |
| Atenção | warn-500 (#c06b00) | Margem apertada |
| Perigo | loss-500 (#d64545) | Inviável |

### 1.2 Gradiente Signature

```css
linear-gradient(90deg, #FFE600 0%, #2D3277 100%)
```
Aplicado em: barra superior do PageHeader, barra de aba ativa no WorkspaceNav, barra do topo do Sidebar.

---

## 2. Navegação e Layout

### 2.1 AppShell (Shell de Layout)

```
┌─────────────────────────────────────────────────┐
│  Sidebar (256px fixo, desktop)                  │
│  ┌─── gold gradient top bar (h-0.5)             │
│  │    Logo "SP" bg-ink-950 text-gold-400         │
│  │    "SmartPreço" heading                       │
│  │    ─────────────────────────────              │
│  │    NavLinks: Dashboard / Calculadora /        │
│  │              Mercado / SKUs                   │
│  │    ─────────────────────────────              │
│  │    Footer: email do usuário                   │
│  └───────────────────────────────────────        │
│                                                 │
│  Main Content (flex-1)                          │
│  ┌─── TopBar                                    │
│  │    "SmartPreço" logo (mobile) + Avatar        │
│  └──────────────────────────────────────        │
│       Page content                              │
└─────────────────────────────────────────────────┘
```

**Responsividade:**
- Sidebar: visível em `md+`, oculto em mobile (hamburger pendente de implementação)
- TopBar: sempre visível, mobile-first
- Content: `max-w` por page individual

### 2.2 WorkspaceNav (Tab Navigation)

Tab bar contextual presente nas páginas `/calculadora`, `/mercado` e `/skus`. Ausente no `/dashboard`.

**Comportamento:**
- Aba ativa: `bg-white border-paper-200 text-ink-950 shadow` + gradient bar no topo
- Aba inativa: `text-ink-700 hover:bg-paper-100`
- Border bottom compartilhado: `border-b border-paper-200`
- Ícones emoji + label (label oculto em mobile com `hidden sm:inline`)
- Detecção de rota via `usePathname()` — client component

### 2.3 NavLink (Sidebar Links)

| Estado | Estilo |
|--------|--------|
| Ativo | `bg-ink-950 text-white shadow-[0_4px_12px_rgba(45,50,119,0.22)]` |
| Ativo (ícone) | `text-gold-400` |
| Inativo | `text-ink-700 hover:bg-paper-100 hover:text-ink-950` |
| Border radius | `rounded-[12px]` |

---

## 3. Componentes Atômicos

### 3.1 StatusPill

Badge de 6 tons para comunicar estados semanticamente.

| Tone | Background | Borda | Texto | Uso |
|------|-----------|-------|-------|-----|
| neutral | paper-100 | paper-200 | ink-900 | Estados genéricos |
| info | #eef0fb | #cfd4ff | ink-950 | Informações |
| warn | warn-50 | warn-200 | warn-500 | Atenção/margem apertada |
| success | profit-50 | profit-200 | profit-500 | Viável |
| danger | loss-50 | loss-200 | loss-500 | Inviável |
| brand | #fff9cc | #fff1a6 | ink-950 | Destaque da marca |

**Props:** `label`, `tone`, `dot` (indicador circular), `icon`, `compact`, `minWidthClassName`, `children`

### 3.2 ResultCard

Card de métrica calculada com semântica de cor por resultado.

| Tone | Background | Borda | Ícone | Uso |
|------|-----------|-------|-------|-----|
| profit | profit-50 | profit-200 | profit-500 | Lucro positivo |
| warn | warn-50 | warn-200 | warn-500 | Atenção |
| loss | loss-50 | loss-200 | loss-500 | Lucro negativo |

**Estrutura visual:**
```
┌──────────────────────────────┐
│  [icon]  Label               │  (rounded-[24px], interactive-panel)
│          ──────────────────  │
│          R$ 12,50            │  (text-2xl font-extrabold)
│          ── footer text ──   │  (text-xs text-ink-700)
└──────────────────────────────┘
```

### 3.3 ProfitabilityBadge

Compõe `StatusPill` com ícones Lucide para comunicar viabilidade de produto.

| ViabilityClassification | Tone | Ícone | Label |
|------------------------|------|-------|-------|
| viable | success | CircleCheckBig | "Produto Viável" |
| attention | warn | CircleAlert | "Atenção" |
| not_viable | danger | CircleX | "Inviável" |

### 3.4 PageHeader

Header premium com identidade visual consistente entre todas as páginas.

**Estrutura:**
```
┌── gold gradient bar (h-1, absolute top) ──────────────────┐
│  [radial glow dourado, direita, 40% width]                 │
│                                                            │
│  SMARTPREÇO · CALCULADORA              (eyebrow, 11px)     │
│  ──────────────────────────────────────────────────        │
│  Análise de Custo                      (h1, 3xl bold)      │
│  MERCADO LIVRE BRASIL                  (tagline, 11px)     │
│  Descrição da página em texto corrido. (description)       │
│                                                  [aside]   │
└────────────────────────────────────────────────────────────┘
```

**Props:** `eyebrow`, `title`, `tagline`, `description`, `aside`

### 3.5 SkeletonRows

Placeholder de loading state com animação shimmer.

**Props:** `rows` (default 3), `compact` (reduz altura por linha)

**Implementação:** usa classe CSS `.skeleton-shimmer` (gradiente animado)

### 3.6 EmptyState

Estado vazio animado com suporte a ação.

**Animação:** `motion/react` `m.div` com `fadeInUp` variant
**Estilo:** `border-paper-200 bg-paper-100 rounded-[24px] py-16`

### 3.7 HoverRevealText

Texto truncado com tooltip ao hover. Adaptado para `@base-ui/react`.

**Comportamento:**
- Detecta truncamento via `ResizeObserver` + `scrollWidth > clientWidth`
- Tooltip só aparece quando o texto está efetivamente truncado
- Não usa `asChild` (incompatível com `@base-ui/react`)

---

## 4. Motion e Animações

### 4.1 Presets Padrão (`src/lib/motion/presets.ts`)

| Export | Uso |
|--------|-----|
| `revealViewport` | `{ once: true, amount: 0.14 }` — viewport trigger |
| `sectionRevealVariants` | Seção principal — fadeIn + y:14→0, 0.34s |
| `cardStaggerVariants` | Container de cards — stagger delay 0.06s |
| `itemRevealVariants` | Card individual — scale 0.985→1 + fadeIn + y:12→0 |
| `pageEnterVariants` | Entrada de página — y:8→0, 0.3s |

**Easing custom:** `[0.22, 1, 0.36, 1]` — spring-like, snappy

**Padrão de uso:**
```tsx
<m.section variants={sectionRevealVariants} initial="hidden" animate="visible" viewport={revealViewport}>
  <m.ul variants={cardStaggerVariants}>
    {items.map(item => (
      <m.li key={item.id} variants={itemRevealVariants}>
```

### 4.2 Classe `interactive-panel`

```css
.interactive-panel {
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 220ms ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(45, 50, 119, 0.15);
  }
}
```

### 4.3 Genie Button (`btn-genie`)

```css
.btn-genie {
  transition: all 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 14px rgba(45, 50, 119, 0.28);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(45, 50, 119, 0.36);
  }
  &:active { transform: scale(0.96); }
}
```

---

## 5. Páginas

### 5.1 Dashboard (`/dashboard`)

**Propósito:** Onboarding + ponto de entrada com visão geral

**Seções:**
1. Header premium com gold gradient e radial glow
2. Cards de ação rápida:
   - Nova Análise → `/calculadora` (accent `[#cfd4ff]`/`[#eef0fb]`)
   - Analisar Mercado → `/mercado`
   - Ver SKUs → `/skus`
3. Steps guide: 3 etapas numeradas com círculos `bg-ink-950 text-gold-400`

**Estado:** Funcional — CTA links ativos

### 5.2 Calculadora (`/calculadora`)

**Propósito:** Fluxo guiado de 5 etapas para calcular viabilidade

**Componentes:**
- `WorkspaceNav` (tab bar)
- `PageHeader` (eyebrow + title + tagline + description)
- Fluxo de 5 steps: Identificação → Modo → Custos → Resultado → Decisão
- `CostForm` → `ModeSelection` → `ProductIdentification` → `CostBreakdownTable`
- `ResultsPanel` → 3x `ResultCard` + `ProfitabilityBadge` + `ScenarioTable`
- `SaveSkuButton` / `DecisionPanel` / `PositionOptions`

**Estado:** Funcional — motor de cálculo completo, salvar SKU funcionando

### 5.3 Mercado (`/mercado`)

**Propósito:** Busca e comparação de preços no ML

**Componentes:**
- `WorkspaceNav` + `PageHeader`
- `MarketSearch` (busca com debounce, scraping via `/api/ml-proxy`)
- `ListingCard` × N
- `MarketSummaryPanel` (min/max/mediana/p25/p75)
- `MlScenarioCards` (posicionamento: abaixo/alinhado/acima)
- `PriceDistributionChart`

**Estado:** Funcional — scraping ML operacional

### 5.4 SKUs (`/skus`)

**Propósito:** Portfólio de produtos calculados

**Componentes:**
- `WorkspaceNav` + `PageHeader` + botão "Nova Análise"
- `SkuFilters` (filtro por status + busca por nome)
- Grid de `SkuCard` (2-4 colunas responsivas)
- `EmptySkus` (empty state com CTA)

**Estado:** Funcional — listagem + filtros funcionando

### 5.5 SKU Detalhe (`/skus/[id]`)

**Propósito:** Histórico de cálculos de um SKU específico

**Estado:** Estrutura criada, implementação detalhada pendente de análise

---

## 6. Gaps de UX Identificados

| Item | Severidade | Descrição |
|------|-----------|-----------|
| Sidebar mobile | ALTO | Não há menu hamburguer — sidebar invisível em mobile |
| `WelcomeTour` | MÉDIO | Componente existe mas sem integração no fluxo |
| `DecisionPanel` / `PositionOptions` | MÉDIO | Fase final do fluxo da calculadora sem integração clara |
| Ausência de feedback de loading | MÉDIO | Scraping ML pode demorar 3-8s sem indicação visual clara |
| Sem toast/notificação global | MÉDIO | Ações como "SKU salvo" não têm feedback visual persistente |
| SKU detalhe (`/skus/[id]`) | BAIXO | Estrutura criada, conteúdo da página detalhada ausente |
| Filtro de SKUs in-memory | BAIXO | Status filter não usa query param de forma reativa |

---

## 7. Acessibilidade (Estado Atual)

| Item | Status |
|------|--------|
| Semântica HTML (h1, nav, section) | ✅ Presente |
| `aria-label` no WorkspaceNav | ✅ Presente |
| Contraste ink-950 sobre paper-50 | ✅ WCAG AA |
| Contraste gold-400 sobre ink-950 | ✅ WCAG AA |
| Focus states customizados | ⚠️ Não verificados |
| Skip navigation link | 🔴 Ausente |
| `prefers-reduced-motion` | 🔴 Não tratado nos presets motion |
| ARIA para StatusPill / ResultCard | ⚠️ Implícito via texto |

---

*Documento produzido pelo Brownfield Discovery — Fase 3.*
*Próxima fase: @architect → technical-debt-DRAFT.md*
