# SmartPreço — Documentação do Schema de Banco de Dados

> Produzido por: @data-engineer (Brownfield Discovery — Fase 2)
> Data: 2026-04-23
> Fonte: migrações SQL em `supabase/migrations/`

---

## Visão Geral do Modelo

```
auth.users (Supabase gerenciado)
    │
    ├──< skus (portfólio do vendedor)
    │       └──< sku_calculations (histórico de análises)
    │
    └──< ml_tokens (tokens OAuth ML por usuário)

ml_fees (referência pública — taxas ML)
ml_search_cache (cache de buscas ML)
```

---

## Tabelas

### `auth.users`
Gerenciada internamente pelo Supabase Auth. Campos relevantes:
- `id: uuid` — referenciado por todas as tabelas de usuário
- `email: text`
- Sessão via `@supabase/ssr` com cookies

---

### `skus`
Portfólio de SKUs do vendedor.

| Coluna | Tipo | Nullable | Default | Notas |
|--------|------|----------|---------|-------|
| `id` | uuid | NOT NULL | gen_random_uuid() | PK |
| `user_id` | uuid | NOT NULL | — | FK → auth.users(id) ON DELETE CASCADE |
| `name` | text | NOT NULL | — | Nome do produto |
| `notes` | text | NULL | NULL | Observações opcionais |
| `status` | text | NOT NULL | 'draft' | CHECK: draft/viable/attention/not_viable/for_sale |
| `is_for_sale` | boolean | NOT NULL | false | Produto publicado à venda |
| `adopted_price` | numeric(12,2) | NULL | NULL | Preço definitivo adotado pelo vendedor |
| `created_at` | timestamptz | NOT NULL | now() | — |
| `updated_at` | timestamptz | NOT NULL | now() | Auto-atualizado por trigger |

**Índices:**
- PK: `id`
- `idx_skus_user_id` em `user_id`

**Trigger:** `skus_updated_at` — `BEFORE UPDATE` → `set_updated_at()` function

**RLS:** `user_id = auth.uid()` para ALL (SELECT + INSERT + UPDATE + DELETE)

---

### `sku_calculations`
Histórico de todos os cálculos de viabilidade feitos para um SKU.

| Coluna | Tipo | Nullable | Default | Notas |
|--------|------|----------|---------|-------|
| `id` | uuid | NOT NULL | gen_random_uuid() | PK |
| `sku_id` | uuid | NOT NULL | — | FK → skus(id) ON DELETE CASCADE |
| `cost_data` | jsonb | NOT NULL | — | Snapshot de `ViabilityInput` |
| `result_data` | jsonb | NOT NULL | — | Snapshot de `ViabilityResult` |
| `sale_price` | numeric(12,2) | NOT NULL | — | Preço testado |
| `listing_type` | text | NOT NULL | — | CHECK: free/classic/premium |
| `margin_percent` | numeric(8,4) | NULL | NULL | Margem resultante |
| `roi_percent` | numeric(8,4) | NULL | NULL | ROI resultante |
| `is_viable` | boolean | NULL | NULL | Classificação de viabilidade |
| `is_adopted` | boolean | NOT NULL | false | Cálculo adotado como definitivo |
| `created_at` | timestamptz | NOT NULL | now() | — |

**Índices:**
- PK: `id`
- `idx_sku_calculations_sku_id` em `sku_id`

**RLS:** Via sku_id: `sku_id IN (SELECT id FROM skus WHERE user_id = auth.uid())`

**Observação:** `cost_data` e `result_data` armazenam snapshots JSONB completos. Isso permite visualizar análises históricas mesmo que o motor de cálculo mude no futuro.

---

### `ml_fees`
Tabela de referência com as taxas oficiais do Mercado Livre.

| Coluna | Tipo | Nullable | Default | Notas |
|--------|------|----------|---------|-------|
| `id` | uuid | NOT NULL | gen_random_uuid() | PK |
| `listing_type` | text | NOT NULL | — | CHECK: free/classic/premium |
| `installments` | integer | NOT NULL | 1 | CHECK: 1-12 |
| `fee_percent` | numeric(5,2) | NOT NULL | — | CHECK: 0-100 |
| `category_id` | text | NULL | NULL | ID de categoria ML (NULL = geral) |
| `category_name` | text | NULL | NULL | Nome legível da categoria |
| `source_url` | text | NULL | NULL | URL oficial de referência |
| `notes` | text | NULL | NULL | Observações |
| `verified_at` | timestamptz | NOT NULL | now() | Data de verificação |
| `updated_at` | timestamptz | NOT NULL | now() | Última atualização |

**Constraints:**
- UNIQUE: `(listing_type, installments, category_id)`
- CHECK: category_id e category_name devem ser ambos NULL ou ambos NOT NULL

**RLS:** Leitura pública (`SELECT USING (true)`)

**Semântica das taxas:**
- `installments = 1` → taxa base do tipo de anúncio (sem parcelamento adicional)
- `installments > 1` → custo ADICIONAL sobre a taxa base (não substitui)
- Taxas gerais: `category_id IS NULL`
- Taxas por categoria: `category_id NOT NULL` (ainda não seeded)

**Dados seed (migration 003):**
- Free 1x: 0%
- Classic 1x: 11%, Classic 2x-12x: 3.89%-9.99% (adicional)
- Premium 1x: 17%, Premium 2x-12x: (mesmos % do Classic como adicional)

---

### `ml_search_cache`
Cache de resultados de busca do ML para reduzir requisições ao scraping.

| Coluna | Tipo | Nullable | Default | Notas |
|--------|------|----------|---------|-------|
| `id` | uuid | NOT NULL | gen_random_uuid() | PK |
| `query_hash` | text | NOT NULL | — | UNIQUE — hash da query normalizada |
| `query_text` | text | NOT NULL | — | Texto original da busca |
| `results_json` | jsonb | NOT NULL | — | Resultado completo (array de MlListing) |
| `result_count` | int | NOT NULL | 0 | Quantidade de resultados |
| `expires_at` | timestamptz | NOT NULL | — | TTL do cache |
| `created_at` | timestamptz | NOT NULL | now() | — |

**Índices:**
- `idx_ml_search_cache_query_hash` em `query_hash`
- `idx_ml_search_cache_expires_at` em `expires_at`

**RLS:**
- SELECT: público (`true`)
- INSERT: `auth.role() = 'authenticated'`
- UPDATE: `auth.role() = 'authenticated'`

---

### `ml_tokens`
Tokens OAuth 2.0 do Mercado Livre por usuário (para futuras integrações com a API oficial ML).

| Coluna | Tipo | Nullable | Default | Notas |
|--------|------|----------|---------|-------|
| `id` | uuid | NOT NULL | gen_random_uuid() | PK |
| `user_id` | uuid | NOT NULL | — | FK → auth.users(id) ON DELETE CASCADE, UNIQUE |
| `access_token` | text | NOT NULL | — | Token de acesso |
| `refresh_token` | text | NOT NULL | — | Token de renovação |
| `expires_at` | timestamptz | NOT NULL | — | Expiração do access_token |
| `created_at` | timestamptz | NULL | now() | — |
| `updated_at` | timestamptz | NULL | now() | — |

**Constraint:** UNIQUE em `user_id` (um token ativo por usuário)

**RLS:** `auth.uid() = user_id` para ALL

**Estado:** Tabela criada, flow de OAuth ainda não implementado na aplicação.

---

## Mapa de Funções SQL

```sql
set_updated_at()  -- LANGUAGE plpgsql
                  -- Retorna NEW com updated_at = now()
                  -- Usada em: skus_updated_at trigger
```

---

## Padrões RLS

| Padrão | Tabelas |
|--------|---------|
| `user_id = auth.uid()` | skus, ml_tokens |
| Via relação (JOIN) | sku_calculations → via sku_id → skus |
| Leitura pública | ml_fees, ml_search_cache (SELECT) |
| Escrita autenticada | ml_search_cache (INSERT/UPDATE) |

---

## Considerações de Performance

| Item | Observação |
|------|-----------|
| `listSkus` query | Faz SELECT `*` + `sku_calculations (*)` — retorna TODOS os cálculos históricos por SKU para apenas exibir o mais recente. Ineficiente em larga escala. |
| Sem índice em `skus.status` | Filtro por status na página de SKUs é feito in-memory no servidor. |
| Sem índice em `skus.updated_at` | ORDER BY `updated_at` DESC sem índice dedicado (impacto baixo com poucos registros). |
| `ml_search_cache` sem cleanup | Não há job de limpeza para registros expirados (`expires_at < now()`). |
| `cost_data` / `result_data` JSONB | Snapshots completos — sem compressão. Crescimento linear com o número de cálculos. |
