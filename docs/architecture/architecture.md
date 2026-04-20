# SmartPreço — Arquitetura Técnica

**Versão:** 1.0  
**Data:** 2026-04-20  
**Autor:** Aria (Architect) — AIOX SmartPreço Squad  
**Status:** Aprovado  
**PRD de referência:** docs/prd.md

---

## 1. Visão Geral da Arquitetura

O SmartPreço é um **monolito modular** construído sobre Next.js App Router. A escolha por monolito é deliberada: o MVP precisa de velocidade de desenvolvimento, não de escalabilidade de microsserviços. A modularidade garante que, no futuro, qualquer módulo pode ser extraído se necessário.

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUÁRIO (Browser)                       │
│                    Desktop 1280px+ / Tablet 768px+              │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────────────┐
│                      VERCEL (CDN + Edge)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Next.js 14 (App Router)                    │   │
│  │                                                          │   │
│  │  ┌─────────────────┐    ┌──────────────────────────┐    │   │
│  │  │  React Server   │    │   Client Components       │    │   │
│  │  │  Components     │    │   (calculadora, tabelas)  │    │   │
│  │  │  (layouts, auth)│    │                          │    │   │
│  │  └────────┬────────┘    └──────────────────────────┘    │   │
│  │           │                                              │   │
│  │  ┌────────▼────────────────────────────────────────┐    │   │
│  │  │              API Route Handlers                  │    │   │
│  │  │   /api/ml/search   /api/skus   /api/fees        │    │   │
│  │  └────────┬───────────────────────┬───────────────┘    │   │
│  └───────────┼───────────────────────┼────────────────────┘   │
└──────────────┼───────────────────────┼────────────────────────┘
               │                       │
    ┌──────────▼──────────┐  ┌────────▼──────────────┐
    │   SUPABASE          │  │   MERCADO LIVRE API    │
    │                     │  │   (pública, server-    │
    │  PostgreSQL         │  │    side apenas)        │
    │  Auth               │  └───────────────────────┘
    │  RLS                │
    │  Storage            │
    └─────────────────────┘
```

---

## 2. Stack Técnica — Decisões e Justificativas

### Frontend

| Tecnologia | Versão | Justificativa |
|-----------|--------|---------------|
| Next.js | 14+ (App Router) | SSR nativo, API Routes integradas, deploy Vercel sem config |
| TypeScript | 5+ | Segurança de tipos em todo o codebase, obrigatório |
| Tailwind CSS | 3+ | Estilização utilitária, consistência visual, sem CSS files |
| shadcn/ui | latest | Componentes acessíveis (WCAG AA), baseados em Radix UI |
| React | 18+ | Incluído no Next.js |

**Por que App Router e não Pages Router?**  
Server Components reduzem o JS enviado ao cliente. Layouts aninhados são nativos. A tendência do ecossistema é App Router. Pages Router seria escolha conservadora sem benefício real aqui.

### Backend

| Tecnologia | Justificativa |
|-----------|---------------|
| Next.js API Routes | Evita serviço separado, deploy unificado no Vercel |
| Supabase | PostgreSQL gerenciado + Auth + RLS + Storage em um único serviço |
| Node.js (via Next.js) | TypeScript nativo, sem overhead de transpilação adicional |

**Por que não Railway separado no MVP?**  
Railway entra se precisarmos de workers, cron jobs ou serviços que não cabem em API Routes. No MVP, tudo cabe em Route Handlers do Next.js. Simples é melhor.

### Banco de Dados

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Banco | PostgreSQL (Supabase) | Relacional, confiável, RLS nativo |
| Auth | Supabase Auth | Integrado com o banco, RLS automático por `auth.uid()` |
| Storage | Supabase Storage | Fotos de SKU, mesmo provider |
| Cache de busca ML | Tabela no próprio Supabase | Evita Redis no MVP, simples e suficiente |

### Testes

| Tipo | Ferramenta | Quando roda |
|------|-----------|-------------|
| Unitário | Vitest | Local + CI em cada PR |
| Integração | Vitest + mock Supabase | CI em cada PR |
| E2E | Playwright | CI em PRs que tocam fluxos críticos |

**Por que Vitest e não Jest?**  
Vitest é mais rápido, tem API compatível com Jest (migração zero), e integra melhor com a toolchain moderna (Vite-based). A cobertura ≥70% exigida pelo NFR08 é mais fácil de medir com Vitest.

---

## 3. Estrutura de Pastas

```
smartpreco/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Route group: páginas sem navbar
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── cadastro/
│   │   │       └── page.tsx
│   │   ├── (app)/                    # Route group: páginas com navbar
│   │   │   ├── layout.tsx            # Layout principal (navbar + sidebar)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── calculadora/
│   │   │   │   └── page.tsx          # Fluxo principal (tabs)
│   │   │   ├── skus/
│   │   │   │   ├── page.tsx          # Central de SKUs (grid)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Detalhe do SKU
│   │   │   └── mercado/
│   │   │       └── page.tsx          # Bloco Mercado
│   │   ├── api/                      # API Route Handlers
│   │   │   ├── ml/
│   │   │   │   └── search/
│   │   │   │       └── route.ts      # GET → ML API (server-side)
│   │   │   ├── skus/
│   │   │   │   ├── route.ts          # GET (list) + POST (create)
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET + PUT + DELETE
│   │   │   └── fees/
│   │   │       └── route.ts          # GET taxas ML do banco
│   │   ├── layout.tsx                # Root layout (providers, fonts)
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui (gerados, não editar)
│   │   ├── layout/
│   │   │   ├── AppShell.tsx          # Shell com sidebar/navbar
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── calculadora/
│   │   │   ├── CostForm.tsx          # Formulário de custos
│   │   │   ├── FeesSelector.tsx      # Tipo de anúncio + parcelas
│   │   │   ├── ResultPanel.tsx       # Painel de resultados em RT
│   │   │   └── FlowTabs.tsx          # Tabs Entrada/Simulador/Mercado/Decisão
│   │   ├── simulador/
│   │   │   ├── ScenarioTable.tsx     # Tabela de cenários
│   │   │   └── ZoneLegend.tsx        # Legenda das zonas
│   │   ├── skus/
│   │   │   ├── SkuGrid.tsx           # Grid de cards
│   │   │   ├── SkuCard.tsx           # Card individual
│   │   │   ├── SkuSaveModal.tsx      # Modal salvar SKU
│   │   │   └── SkuDetail.tsx         # Página de detalhe
│   │   ├── mercado/
│   │   │   ├── SearchPanel.tsx       # Busca ML
│   │   │   ├── ListingCard.tsx       # Card de anúncio
│   │   │   └── PositionBadge.tsx     # Badge abaixo/alinhado/acima
│   │   └── decisao/
│   │       ├── DecisionPanel.tsx     # Painel de decisão
│   │       └── PositionOptions.tsx   # 3 opções (Econômico/Comp/Premium)
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Supabase browser client
│   │   │   ├── server.ts             # Supabase server client (API Routes)
│   │   │   └── middleware.ts         # Auth middleware helper
│   │   ├── calculations/             # Motor financeiro (puro TypeScript)
│   │   │   ├── engine.ts             # Orquestrador principal
│   │   │   ├── costs.ts              # Cálculo de custos
│   │   │   ├── profitability.ts      # Margem, ROI, break-even
│   │   │   ├── simulator.ts          # Geração de cenários
│   │   │   └── index.ts              # Exports públicos
│   │   ├── ml-api/
│   │   │   ├── search.ts             # Busca de anúncios ML
│   │   │   ├── filters.ts            # Limpeza de base (kits, dedup)
│   │   │   └── positioning.ts        # Cálculo de posicionamento
│   │   └── utils/
│   │       ├── currency.ts           # Formatação BRL
│   │       ├── percent.ts            # Formatação %
│   │       └── cn.ts                 # Class names helper
│   │
│   ├── hooks/
│   │   ├── usePricingCalculator.ts   # Estado + cálculos em tempo real
│   │   ├── useScenarioSimulator.ts   # Estado do simulador
│   │   ├── useSkuRegistry.ts         # CRUD de SKUs
│   │   └── useMercadoSearch.ts       # Busca ML com cache
│   │
│   ├── types/
│   │   ├── pricing.ts                # ViabilityInput, ViabilityResult
│   │   ├── sku.ts                    # Sku, SkuCalculation
│   │   ├── mercado.ts                # MlListing, SearchResult
│   │   └── database.ts               # Tipos gerados pelo Supabase CLI
│   │
│   └── middleware.ts                 # Proteção de rotas (auth check)
│
├── supabase/
│   ├── migrations/                   # SQL migrations (versionadas)
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_ml_fees.sql
│   │   └── 003_rls_policies.sql
│   └── seed.sql                      # Dados iniciais (taxas ML)
│
├── tests/
│   ├── unit/
│   │   └── calculations/             # Testes das funções financeiras
│   ├── integration/
│   │   └── api/                      # Testes de API Routes
│   └── e2e/
│       └── flows/                    # Fluxos Playwright
│
├── .github/
│   └── workflows/
│       └── ci.yml                    # Lint + typecheck + test + build
│
├── .env.example                      # Template de variáveis
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. Schema do Banco de Dados

### Diagrama de Entidades

```
auth.users (Supabase Auth)
    │
    │ 1:N
    ▼
skus
    │ id, user_id, name, notes, status, is_for_sale, created_at, updated_at
    │
    │ 1:N
    ▼
sku_calculations
    │ id, sku_id, cost_data (jsonb), result_data (jsonb), created_at
    │
    └── (referência ao preço adotado)

ml_search_cache
    id, query_hash, query_text, results_json (jsonb), expires_at, created_at

ml_fees
    id, listing_type, category_name, category_id, fee_percent, updated_at
```

### Tabelas Detalhadas

#### `skus`
```sql
CREATE TABLE skus (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  notes       text,
  status      text NOT NULL DEFAULT 'draft',
    -- 'viable' | 'attention' | 'not_viable' | 'for_sale' | 'draft'
  is_for_sale boolean NOT NULL DEFAULT false,
  adopted_price numeric(10,2),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

#### `sku_calculations`
```sql
CREATE TABLE sku_calculations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id      uuid NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  cost_data   jsonb NOT NULL,  -- snapshot do ViabilityInput
  result_data jsonb NOT NULL,  -- snapshot do ViabilityResult
  margin_percent numeric(6,2), -- desnormalizado para queries rápidas
  created_at  timestamptz NOT NULL DEFAULT now()
);
```

#### `ml_fees`
```sql
CREATE TABLE ml_fees (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_type  text NOT NULL,  -- 'free' | 'classic' | 'premium'
  category_name text,
  category_id   text,
  fee_percent   numeric(5,2) NOT NULL,
  updated_at    timestamptz NOT NULL DEFAULT now()
);
```

#### `ml_search_cache`
```sql
CREATE TABLE ml_search_cache (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash   text NOT NULL UNIQUE,
  query_text   text NOT NULL,
  results_json jsonb NOT NULL,
  expires_at   timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);
```

### Políticas RLS

```sql
-- skus: usuário acessa apenas os seus
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skus_owner_only" ON skus
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- sku_calculations: acesso via sku (herda o user_id)
ALTER TABLE sku_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sku_calculations_via_sku" ON sku_calculations
  USING (
    EXISTS (
      SELECT 1 FROM skus
      WHERE skus.id = sku_calculations.sku_id
        AND skus.user_id = auth.uid()
    )
  );

-- ml_fees: leitura pública (dados de referência)
ALTER TABLE ml_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ml_fees_read_all" ON ml_fees FOR SELECT USING (true);

-- ml_search_cache: leitura pública, escrita apenas server-side
ALTER TABLE ml_search_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cache_read_all" ON ml_search_cache FOR SELECT USING (true);
CREATE POLICY "cache_service_write" ON ml_search_cache
  FOR INSERT WITH CHECK (true); -- restrito via service_role_key no server
```

---

## 5. Fluxo de Autenticação

```
1. Usuário acessa /calculadora (rota protegida)
         │
         ▼
2. middleware.ts intercepta
   └── Verifica Supabase session cookie
         │
         ├── Sessão válida → passa para a página
         │
         └── Sem sessão → redirect para /login
                  │
                  ▼
3. Usuário preenche email + senha em /login
         │
         ▼
4. LoginForm chama supabase.auth.signInWithPassword()
         │
         ▼
5. Supabase retorna session JWT
   └── Cookie httpOnly é setado automaticamente
         │
         ▼
6. Redirect para /dashboard
```

### Clientes Supabase (dois obrigatórios)

```typescript
// src/lib/supabase/client.ts — usa no browser (Client Components)
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// src/lib/supabase/server.ts — usa em Server Components e API Routes
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export const createServerSupabase = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  )
```

---

## 6. Integração ML API

### Por que server-side obrigatório

A ML API bloqueia requests de browser (CORS + IP). Além disso, expor qualquer credencial no cliente viola o NFR05. **Toda chamada à ML API passa pelo Route Handler `/api/ml/search`.**

### Fluxo de Busca com Cache

```
Cliente → POST /api/ml/search { query, filters }
                │
                ▼
         Gera query_hash (MD5 da query normalizada)
                │
                ▼
         Supabase: SELECT da ml_search_cache WHERE query_hash = ?
                │
                ├── Cache HIT + não expirado → retorna dados em cache
                │
                └── Cache MISS ou expirado
                         │
                         ▼
                   GET https://api.mercadolibre.com/sites/MLB/search
                   ?q={query}&limit=50&condition=new
                         │
                         ▼
                   Aplica filtros de limpeza:
                   - Remove kits/combos (regex no title)
                   - Deduplica por hash(price + title_normalizado)
                   - Calcula confidence_index
                         │
                         ▼
                   Salva no ml_search_cache (expires_at = now() + 1h)
                         │
                         ▼
                   Retorna resultado limpo ao cliente
```

### Tratamento de Rate Limit

```typescript
// src/lib/ml-api/search.ts
const ML_API_BASE = 'https://api.mercadolibre.com'
const ML_RATE_LIMIT_MS = 1100 // 1 req/s com margem

let lastRequestAt = 0

async function fetchWithRateLimit(url: string) {
  const now = Date.now()
  const wait = ML_RATE_LIMIT_MS - (now - lastRequestAt)
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  lastRequestAt = Date.now()
  return fetch(url, { next: { revalidate: 0 } })
}
```

---

## 7. Motor de Cálculo Financeiro

Os cálculos são **funções puras em TypeScript**, sem dependências de UI ou banco. Vivem em `src/lib/calculations/` e são testados unitariamente com Vitest.

### Fluxo de Cálculo

```
ViabilityInput (do formulário)
        │
        ▼
calculateCostBreakdown(input)
  → acquisitionCost, commissionCost, shippingCost,
    packagingCost, taxCost, overheadCostPerUnit...
        │
        ▼
calculateRevenueBreakdown(input, costs)
  → grossRevenue, netRevenue, discounts
        │
        ▼
calculateProfitabilityMetrics(input, revenue, costs)
  → marginPercent, roiPercent, breakEvenPrice,
    minimumViablePrice, recommendedPrice
        │
        ▼
classifyProfitability(metrics, thresholds)
  → 'viable' | 'attention' | 'not_viable'
        │
        ▼
ViabilityResult (para o painel de resultados)
```

### Fórmulas Principais

```
Custo Total = CMV + taxa_ML + parcelamento + frete + embalagem + impostos + overhead

Margem % = (Preço - Custo Total) / Preço × 100

ROI % = (Preço - Custo Total) / Custo Total × 100

Preço Mínimo Viável = busca binária onde Margem = 0%

Preço Recomendado = busca binária onde Margem = margem_alvo (default 20%)
```

---

## 8. Variáveis de Ambiente

```bash
# .env.local (nunca commitar — adicionar ao .gitignore)

# Supabase — público (exposto no browser, seguro)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Supabase — privado (somente server-side, NUNCA no cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Regra:** variáveis com `NEXT_PUBLIC_` são expostas ao browser. Somente `URL` e `ANON_KEY` (que têm RLS como proteção) recebem o prefixo público. `SERVICE_ROLE_KEY` nunca.

---

## 9. CI/CD Pipeline

```
Push para feature branch
        │
        ▼
GitHub Actions: ci.yml
  ├── pnpm install
  ├── pnpm lint          → ESLint (bloqueia se falhar)
  ├── pnpm typecheck     → tsc --noEmit (bloqueia se falhar)
  ├── pnpm test          → Vitest (bloqueia se falhar)
  └── pnpm build         → Next.js build (bloqueia se falhar)
        │
        ▼
PR criado → Vercel Preview Deploy automático
(URL única por PR para testar antes do merge)
        │
        ▼
Merge na main
        │
        ▼
Vercel Production Deploy automático
```

### GitHub Actions — ci.yml

```yaml
name: CI
on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test --coverage
      - run: pnpm build
```

---

## 10. Decisões Arquiteturais — ADRs

### ADR-01: Monolito modular em vez de microsserviços
**Contexto:** MVP com 1 dev, prazo apertado, 1.000 usuários no horizonte.  
**Decisão:** Monolito Next.js com pastas por módulo.  
**Consequência:** Deploy simples, desenvolvimento rápido. Se escalar para 100k usuários, extrair o motor de busca ML como serviço separado.

### ADR-02: Cálculos no cliente (React state), não no servidor
**Contexto:** NFR01 exige <500ms para cálculo. Server round-trip seria 200-400ms de latência.  
**Decisão:** Funções puras executadas no browser via React hooks.  
**Consequência:** Zero latência para cálculos. Trade-off: não pode auditar os cálculos server-side (aceitável no MVP).

### ADR-03: Cache de busca ML no PostgreSQL, não no Redis
**Contexto:** Rate limit de 1 req/s da ML API. Redis seria mais performático mas adiciona serviço.  
**Decisão:** Tabela `ml_search_cache` no Supabase com `expires_at`.  
**Consequência:** Cache funcional para MVP. Se cache hit rate > 80%, a latência extra do PostgreSQL é imperceptível.

### ADR-04: pnpm em vez de npm/yarn
**Contexto:** Node 24 disponível. pnpm é mais rápido e economiza disco com hard links.  
**Decisão:** pnpm como package manager padrão.  
**Consequência:** Todos os comandos usam `pnpm`. CI usa `pnpm/action-setup`.

### ADR-05: Vitest em vez de Jest
**Contexto:** Stack moderna com TypeScript. Vitest tem API compatível com Jest, mais rápido, sem configuração de transformers.  
**Decisão:** Vitest para unit e integration tests.  
**Consequência:** `import.meta.env` disponível nos testes, sem necessidade de `jest.config.js` complexo.

---

## 11. Checklist de Segurança

- [x] `SERVICE_ROLE_KEY` nunca exposto no frontend
- [x] RLS habilitado em todas as tabelas de usuário
- [x] Toda chamada à ML API via Route Handler server-side
- [x] Middleware protege todas as rotas `/app/*`
- [x] Cookies de sessão httpOnly (gerenciado pelo Supabase SSR)
- [x] Inputs validados antes de persistir no banco
- [x] CORS não é problema (Next.js API Routes são same-origin)
- [ ] Rate limiting nas API Routes (pós-MVP: middleware Vercel)
- [ ] Monitoramento de erros (pós-MVP: Sentry)

---

## 12. Próximos Passos

Com esta arquitetura aprovada, o squad pode avançar em paralelo:

| Agente | Próxima ação | Output |
|--------|-------------|--------|
| `@data-engineer` | Detalhar schema SQL completo com indexes e constraints | `docs/architecture/schema.md` |
| `@ux-design-expert` | Especificar UX dos 5 módulos (fluxos, estados, responsividade) | `docs/architecture/ux-spec.md` |
| `@sm` | Criar stories do EPIC-01 (setup Next.js + Supabase) | `docs/stories/1.1.story.md` |

---

*Documento gerado por Aria (Architect) — AIOX SmartPreço Squad*  
*Referências: docs/prd.md, docs/brief.md*
