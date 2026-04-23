# SmartPreço — Arquitetura do Sistema

> Produzido por: @architect (Brownfield Discovery — Fase 1)
> Data: 2026-04-23
> Versão: 1.0 — baseline pós-redesign UI (commit 4e54d6a)

---

## 1. Visão Geral

SmartPreço é um SaaS de inteligência de precificação para vendedores do Mercado Livre Brasil. O sistema permite calcular viabilidade de um produto, comparar preços com anúncios reais do ML, e gerenciar um portfólio de SKUs com histórico de análises.

**Estado atual:** MVP funcional rodando em Next.js 14 + Supabase, com design system profissional integrado (fusão SmartPreço + Codex).

---

## 2. Stack Tecnológico

| Camada | Tecnologia | Versão | Notas |
|--------|-----------|--------|-------|
| Framework | Next.js | ^14.2.35 | App Router, React 18, Server Components |
| Runtime | Node.js | LTS | Vercel-hosted |
| Linguagem | TypeScript | ^5.9.3 | strict mode |
| Estilização | Tailwind CSS | ^4.2.3 | v4 com `@theme inline`, sem `tailwind.config.js` convencional |
| Animações | motion (Framer Motion) | ^12.38.0 | `motion/react` import, `m.div` lazy-load |
| UI Primitivos | @base-ui/react | ^1.4.1 | Substitui Radix UI para Tooltip (sem `asChild`) |
| UI Componentes | shadcn/ui | ^4.3.1 | Badge, Button, Card, Dialog, Input, Label, Select, Separator, Table, Tabs |
| Banco de Dados | Supabase | ^2.104.0 | PostgreSQL + Auth + RLS |
| Scraping | cheerio | ^1.2.0 | Parse HTML do ML site |
| Ícones | lucide-react | ^1.8.0 | Tree-shakeable |
| Utilitários | clsx + tailwind-merge + class-variance-authority | latest | Composição de classes |
| Fonte | Manrope | Google Fonts | weights 400/500/600/700/800 |
| Testes | Vitest + jsdom | ^4.1.4 | Unit + cobertura v8 |

---

## 3. Arquitetura de Rotas (Next.js App Router)

```
src/app/
├── layout.tsx                          # Root layout — Manrope font, metadata global
├── page.tsx                            # Redirect / → /login ou /dashboard
├── globals.css                         # Design system: tokens, keyframes, utilitários
├── error.tsx                           # Error boundary global
├── not-found.tsx                       # 404
│
├── (auth)/                             # Route group: páginas sem sidebar
│   ├── layout.tsx                      # Auth layout simples
│   ├── login/page.tsx                  # Autenticação Supabase
│   └── cadastro/page.tsx               # Registro
│
├── (app)/                              # Route group: páginas autenticadas
│   ├── layout.tsx                      # AppLayout → verifica user → AppShell
│   ├── dashboard/
│   │   ├── page.tsx                    # Home: cards de ação, steps, CTAs
│   │   └── loading.tsx
│   ├── calculadora/
│   │   ├── page.tsx                    # Calculadora principal (5-steps flow)
│   │   ├── actions.ts                  # Server Actions: saveSkuAction
│   │   └── loading.tsx
│   ├── mercado/
│   │   ├── page.tsx                    # Análise de mercado ML
│   │   └── loading.tsx
│   └── skus/
│       ├── page.tsx                    # Portfólio de SKUs
│       ├── loading.tsx
│       └── [id]/
│           ├── page.tsx                # Detalhe do SKU
│           └── loading.tsx
│
└── api/
    ├── ml-proxy/route.ts               # GET: scraping lista.mercadolivre.com.br
    ├── ml-search/route.ts              # GET: busca com cache Supabase
    └── skus/[id]/route.ts              # DELETE: remover SKU
```

**Fluxo de autenticação:**
- `middleware.ts` intercepta todas as rotas (exceto estáticos)
- Rotas `/dashboard`, `/calculadora`, `/skus`, `/mercado` → redireciona para `/login` sem sessão
- Rotas `/login`, `/cadastro` → redireciona para `/dashboard` com sessão ativa
- `(app)/layout.tsx` tem segunda verificação server-side via Supabase

---

## 4. Design System

### 4.1 Paleta de Cores (Tokens)

```css
/* globals.css — :root */
--ink-950: #1a1d2e   /* Texto primário, backgrounds de UI premium */
--ink-900: #2d3277   /* Azul-índigo profundo */
--ink-700: #4b5185
--ink-500: #8b91b8

--paper-50:  #f8f9ff  /* Background global (gradiente radial) */
--paper-100: #f1f3fb
--paper-200: #e2e6f6  /* Bordas, divisores */

--gold-300: #f5d580
--gold-400: #e8c045   /* Destaque: logos, ícones ativos */
--gold-500: #c9a400

--profit-500: #0e9f6e /* Verde viabilidade */
--profit-200: #a7f3d0
--profit-50:  #ecfdf5

--warn-500: #c06b00   /* Amarelo-âmbar atenção */
--warn-200:  #fde68a
--warn-50:   #fffbeb

--loss-500: #d64545   /* Vermelho inviável */
--loss-200: #fecaca
--loss-50:  #fff1f1
```

### 4.2 Tailwind Config (v4)

Adicionado ao `tailwind.config.ts`:
- `ink` (950/900/700/500)
- `paper` (50/100/200)
- `gold` (300/400/500)
- `profit` (500/200/50)
- `warn` (500/200/50)
- `loss` (500/200/50)
- `primary: #2d3277`, `viable: #0e9f6e`, `attention: #c06b00`, `danger: #d64545`

### 4.3 Classes Utilitárias Custom

```css
.interactive-panel    /* card com hover translateY(-2px) + shadow ink-950 */
.skeleton-shimmer     /* gradiente animado para loading states */
.fade-in-up           /* animação de entrada (0.3s ease) */
.panel-reveal         /* variante alternativa */
.table-row-hover      /* hover em linhas de tabela */
```

### 4.4 Motion Presets (`src/lib/motion/presets.ts`)

```typescript
revealViewport          // { once: true, amount: 0.14 }
sectionRevealVariants   // fadeIn + y:14→0, ease custom
cardStaggerVariants     // stagger container (delayChildren: 0.04, staggerChildren: 0.06)
itemRevealVariants      // scale: 0.985→1 + fadeIn + y:12→0
pageEnterVariants       // page transition (y:8→0, 0.3s)
```

---

## 5. Componentes — Hierarquia Atômica

### Atoms (`src/components/ui/`)

| Componente | Função | Tokens usados |
|-----------|--------|---------------|
| `StatusPill` | Badge de 6 tons (neutral/info/warn/success/danger/brand) | paper, profit, warn, loss |
| `ResultCard` | Card de métrica com tom e ícone | profit-50/200/500, warn-*, loss-* |
| `SkeletonRows` | Placeholder de loading | skeleton-shimmer |
| `EmptyState` | Estado vazio animado | paper-100/200, ink-700 |
| `HoverRevealText` | Texto truncado com tooltip | @base-ui/react Tooltip |
| `genie-button` | Botão premium com spring animation | ink-950, gold-400 |
| Shadcn UI: `button`, `card`, `badge`, `dialog`, `input`, `label`, `select`, `separator`, `table`, `tabs`, `tooltip` | — | — |

### Molecules (`src/components/ui/`)

| Componente | Função | Composto de |
|-----------|--------|-------------|
| `ProfitabilityBadge` | Badge de viabilidade com ícone | StatusPill + lucide icons |

### Organisms (`src/components/`)

#### Layout
| Componente | Função |
|-----------|--------|
| `AppShell` | Container principal — sidebar + topbar + content |
| `Sidebar` | Navegação lateral com gold gradient e logo |
| `NavLink` | Link de navegação com estado ativo ink-950 |
| `TopBar` | Barra superior com avatar e email |
| `PageHeader` | Header de página com eyebrow, title, tagline e gold gradient |
| `WorkspaceNav` | Tab bar entre Calculadora/Mercado/SKUs (usePathname) |

#### Calculadora
| Componente | Função |
|-----------|--------|
| `CostForm` | Formulário de entrada de dados do produto (5 steps) |
| `ModeSelection` | Seleção de tipo de anúncio |
| `ProductIdentification` | Identificação do produto |
| `CostBreakdownTable` | Detalhamento de custos |
| `ResultsPanel` | Painel de resultados com ResultCards e badge |
| `ScenarioTable` | Tabela de cenários de preço |
| `SaveSkuButton` | Botão salvar SKU |

#### Mercado
| Componente | Função |
|-----------|--------|
| `MarketSearch` | Busca de produtos no ML com debounce |
| `ListingCard` | Card de anúncio ML |
| `MarketSummaryPanel` | Painel de estatísticas de mercado |
| `MlScenarioCards` | Cards de posicionamento de preço |
| `PriceDistributionChart` | Visualização da distribuição de preços |

#### SKUs
| Componente | Função |
|-----------|--------|
| `SkuCard` | Card de SKU no portfólio |
| `SkuFilters` | Filtros de status e busca |
| `RecalcularButton` | Recalcular viabilidade do SKU |

#### Decisão
| Componente | Função |
|-----------|--------|
| `DecisionPanel` | Painel de recomendação de decisão |
| `PositionOptions` | Opções de posicionamento (abaixo/alinhado/acima) |

---

## 6. Camada de Negócio (Business Logic)

### 6.1 Motor de Cálculo (`src/lib/calculations/`)

```
engine.ts          # Orquestra: calculateViability(input, fees) → ViabilityResult
costs.ts           # calculateCostBreakdown: comissão + parcelamento + frete + embalagem + impostos
profitability.ts   # calculateProfitabilityMetrics: lucro, margem, ROI, minimumViablePrice, recommendedPrice
classifier.ts      # classifyViability: margem → 'viable' | 'attention' | 'not_viable'
simulator.ts       # Simula cenários de preço para ScenarioTable
index.ts           # Re-exports
```

**Fluxo de cálculo:**
1. `ViabilityInput` → `calculateCostBreakdown` (lookup ML fees no Supabase via `useMlFees`)
2. `CostBreakdown` → `calculateProfitabilityMetrics` → `ProfitabilityMetrics`
3. `marginPercent` → `classifyViability` → `ViabilityClassification`

### 6.2 Mercado Livre Integration

```
src/lib/mercadolivre.config.ts   # Configurações: URLs, thresholds
src/lib/mercadolivre/
  analyzer.ts                    # analyzeListings → MarketSummary (percentis p25/p50/p75)
  cleaner.ts                     # Limpeza e normalização de listings
src/lib/hooks/useMlFees.ts       # Hook: carrega ml_fees do Supabase (com fallback hardcoded)
src/app/api/ml-proxy/route.ts    # Scraping de lista.mercadolivre.com.br via cheerio
src/app/api/ml-search/route.ts   # Busca com cache Supabase (ml_search_cache)
```

**Estratégia de scraping:** Server-side fetch de `lista.mercadolivre.com.br` com headers de browser fake. Cheerio para parse do HTML. Matching de relevância por palavras-chave (ratio ≥ 0.5). Cache em `ml_search_cache` com TTL.

---

## 7. Banco de Dados (Supabase / PostgreSQL)

### 7.1 Tabelas

| Tabela | RLS | Propósito |
|--------|-----|-----------|
| `auth.users` | Supabase Auth | Usuários (gerenciado pelo Supabase) |
| `skus` | user_id = auth.uid() | Portfólio de SKUs do vendedor |
| `sku_calculations` | via sku_id → user | Histórico de cálculos por SKU |
| `ml_fees` | Leitura pública | Taxas oficiais do ML (referência) |
| `ml_search_cache` | Leitura pública, escrita autenticada | Cache de buscas ML |
| `ml_tokens` | user_id = auth.uid() | Tokens OAuth ML por usuário |

### 7.2 Migrações

| Arquivo | Conteúdo |
|---------|----------|
| `001_rls_setup.sql` | Habilita RLS nas tabelas (idempotente) |
| `002_ml_fees_table.sql` | Cria `ml_fees` com constraints de consistência |
| `003_seed_ml_fees.sql` | Popula taxas padrão do ML |
| `004_skus_table.sql` | Cria `skus` + `sku_calculations` + triggers `updated_at` |
| `005_ml_search_cache.sql` | Cache de busca com índices e políticas |
| `006_ml_tokens.sql` | Tokens OAuth ML por usuário |

### 7.3 Tipos de Database

Definidos manualmente em `src/types/database.ts` (pendente: `supabase gen types` automático).

---

## 8. Autenticação

- **Provider:** Supabase Auth (email/password)
- **Middleware:** `src/middleware.ts` — intercepta todas as rotas, cookie-based session
- **Client-side:** `@supabase/ssr` com `createBrowserClient`
- **Server-side:** `createServerClient` em Server Components e Route Handlers
- **Proteção dupla:** middleware + `(app)/layout.tsx` — redundância intencional

---

## 9. Padrões de Código

### Convenções
- Importações absolutas com `@/` alias (tsconfig paths)
- Server Components por padrão; `'use client'` explícito apenas onde necessário
- Server Actions em `actions.ts` co-localizados com a página
- Tipos em `src/types/` separados por domínio
- Hooks customizados em `src/lib/hooks/` e `src/hooks/`

### Qualidade
- TypeScript strict mode ativo
- ESLint config Next.js
- Prettier + prettier-plugin-tailwindcss
- Vitest para unit tests (`tests/` directory)

---

## 10. Pontos de Integração Externos

| Integração | Tipo | Implementação | Estado |
|-----------|------|---------------|--------|
| Mercado Livre (listagens) | Web scraping | `api/ml-proxy` + cheerio | Funcional |
| Mercado Livre (OAuth) | OAuth 2.0 | `ml_tokens` table + `api/ml-search` | Tabela criada, flow pendente |
| Supabase Auth | SaaS | `@supabase/ssr` | Funcional |
| Supabase Database | SaaS | `@supabase/supabase-js` | Funcional |
| Google Fonts (Manrope) | CDN | `next/font/google` | Funcional |

---

## 11. Estrutura de Pastas (Visão Completa)

```
smartpreco/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/
│   │   ├── auth/         # LoginForm, SignupForm, LogoutButton
│   │   ├── calculadora/  # Fluxo de cálculo (6 componentes)
│   │   ├── decisao/      # Painel de decisão (2 componentes)
│   │   ├── layout/       # AppShell, Sidebar, NavLink, TopBar, PageHeader, WorkspaceNav
│   │   ├── mercado/      # Análise de mercado ML (5 componentes)
│   │   ├── onboarding/   # WelcomeTour
│   │   ├── skus/         # Portfólio (3 componentes)
│   │   └── ui/           # Atomic: StatusPill, ResultCard, SkeletonRows, EmptyState,
│   │                     #         HoverRevealText, ProfitabilityBadge + 9x shadcn/ui
│   ├── hooks/            # useDecisionEngine
│   ├── lib/
│   │   ├── calculations/ # Motor de cálculo (6 módulos)
│   │   ├── hooks/        # useMlFees
│   │   ├── mercadolivre/ # analyzer, cleaner
│   │   ├── motion/       # presets.ts (animações padronizadas)
│   │   ├── supabase/     # client, server, skus
│   │   └── utils/        # format.ts, utils.ts
│   ├── middleware.ts     # Proteção de rotas
│   └── types/            # database, index, mercado, pricing, sku
├── supabase/
│   ├── docs/             # (gerado pelo Brownfield Discovery)
│   └── migrations/       # 6 migrações SQL
├── tests/                # Vitest unit tests
├── docs/                 # Documentação do projeto
├── packages/             # (espaço para futuras libs internas)
└── [config files]        # package.json, tsconfig.json, tailwind.config.ts, etc.
```

---

## 12. Decisões Arquiteturais Relevantes

| Decisão | Racional | Trade-off |
|---------|----------|-----------|
| Next.js Server Components first | SSR nativo, auth server-side segura | Componentes interativos precisam de `'use client'` explícito |
| Scraping ML via servidor | API ML bloqueia IPs de servidor apenas de forma seletiva; scraping HTML funciona | Frágil a mudanças de HTML do ML |
| Cache de busca no Supabase | Reduz latência e carga no ML | Precisa de invalidação por TTL |
| @base-ui/react (não Radix) | Componentes acessíveis sem opinionado styling | API diferente de Radix — sem `asChild` no Tooltip |
| Tailwind v4 com @theme inline | CSS nativo, tokens como variáveis CSS | Configuração não convencional, menos plugins compatíveis |
| Manrope como fonte primária | Personalidade premium, variantes numerosas | Dependência de CDN Google Fonts |
| motion (Framer Motion v11+) | Animações fluidas e acessíveis | Bundle adicional (~50KB gzip) |
| Tipos DB manuais | Sem dependência de CLI local | Precisa de atualização manual ao alterar schema |

---

## 13. Débitos Técnicos Identificados (Preliminar)

| Item | Severidade | Categoria |
|------|-----------|-----------|
| Tipos DB manuais (não gerados via `supabase gen types`) | MÉDIO | Developer Experience |
| OAuth ML não completamente implementado (tabela existe, flow pendente) | ALTO | Feature Gap |
| Scraping ML sem retry/backoff | MÉDIO | Resiliência |
| Sem testes de integração para Server Actions | MÉDIO | Qualidade |
| `WelcomeTour` sem implementação visível nos flows | BAIXO | UX |
| Sem monitoramento/logging de erros em produção | ALTO | Observabilidade |
| Sem rate limiting nas APIs `/ml-proxy` e `/ml-search` | ALTO | Segurança |
| `DecisionPanel` + `PositionOptions` — integração com fluxo principal incompleta | MÉDIO | Feature Gap |

---

*Documento produzido automaticamente pelo Brownfield Discovery Workflow — Fase 1.*
*Próxima fase: @data-engineer → SCHEMA.md + DB-AUDIT.md*
