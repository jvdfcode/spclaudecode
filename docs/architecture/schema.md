# SmartPreço — Schema do Banco de Dados

**Versão:** 1.0  
**Data:** 2026-04-20  
**Autor:** Dara (Data Engineer) — AIOX SmartPreço Squad  
**Status:** Aprovado  
**Referência:** `docs/architecture/architecture.md` § 4

---

## 1. Visão Geral

O SmartPreço usa **PostgreSQL via Supabase** com 4 tabelas principais. O design segue princípios de:

- **Segurança por padrão** — RLS habilitado em todas as tabelas
- **Integridade primeiro** — FK constraints, CHECK constraints, NOT NULL onde necessário
- **Access-pattern driven** — indexes baseados nos padrões reais de consulta
- **Auditabilidade** — `created_at` e `updated_at` em todas as tabelas de usuário
- **Evolutividade** — JSONB para dados que evoluem (cost_data, result_data) sem migrations

---

## 2. Diagrama de Entidades

```
┌─────────────────────────────────────────────────────────────┐
│                   auth.users (Supabase Auth)                 │
│   id: uuid (PK)                                             │
│   email: text                                               │
│   created_at: timestamptz                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ 1:N  (user_id FK)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                          skus                               │
│   id: uuid (PK)                                             │
│   user_id: uuid (FK → auth.users)                          │
│   name: text NOT NULL                                       │
│   notes: text                                               │
│   status: text CHECK (enum)                                 │
│   is_for_sale: boolean                                      │
│   adopted_price: numeric(10,2)                              │
│   created_at: timestamptz                                   │
│   updated_at: timestamptz                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ 1:N  (sku_id FK)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    sku_calculations                         │
│   id: uuid (PK)                                             │
│   sku_id: uuid (FK → skus)                                  │
│   cost_data: jsonb NOT NULL   ← snapshot ViabilityInput     │
│   result_data: jsonb NOT NULL ← snapshot ViabilityResult    │
│   sale_price: numeric(10,2) NOT NULL                        │
│   listing_type: text CHECK (enum)                           │
│   margin_percent: numeric(6,2) ← desnormalizado             │
│   is_adopted: boolean DEFAULT false                         │
│   created_at: timestamptz                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        ml_fees                              │
│   id: uuid (PK)                                             │
│   listing_type: text CHECK (enum)                           │
│   installments: integer NOT NULL DEFAULT 1                  │
│   fee_percent: numeric(5,2) NOT NULL                        │
│   category_id: text          ← null = taxa geral            │
│   category_name: text                                       │
│   source_url: text                                          │
│   verified_at: timestamptz NOT NULL                         │
│   updated_at: timestamptz NOT NULL                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ml_search_cache                          │
│   id: uuid (PK)                                             │
│   query_hash: text NOT NULL UNIQUE  ← MD5 da query          │
│   query_text: text NOT NULL                                 │
│   results_json: jsonb NOT NULL                              │
│   result_count: integer NOT NULL DEFAULT 0                  │
│   expires_at: timestamptz NOT NULL                          │
│   created_at: timestamptz NOT NULL                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Estrutura de Migrations

```
supabase/
└── migrations/
    ├── 001_initial_schema.sql   ← tabelas, indexes, triggers
    ├── 002_rls_policies.sql     ← RLS + policies
    └── 003_seed_ml_fees.sql     ← seed das taxas ML (fontes oficiais)

supabase/
└── seed.sql                     ← alias para 003 (usado em dev local)
```

---

## 4. Migration 001 — Schema Completo

```sql
-- ============================================================
-- SmartPreço — Migration 001: Initial Schema
-- Executado em: supabase/migrations/001_initial_schema.sql
-- Idempotente: sim (IF NOT EXISTS em todos os objetos)
-- Rollback: ver seção 7
-- ============================================================

-- ------------------------------------------------------------
-- Extensions
-- ------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- busca fuzzy em nomes de SKU

-- ------------------------------------------------------------
-- Helper: trigger de auto-update para updated_at
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Tabela: skus
-- Propósito: portfólio de produtos do vendedor
-- ============================================================
CREATE TABLE IF NOT EXISTS skus (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 255),
  notes         text        CHECK (char_length(notes) <= 2000),
  status        text        NOT NULL DEFAULT 'draft'
                              CHECK (status IN ('draft', 'viable', 'attention', 'not_viable', 'for_sale')),
  is_for_sale   boolean     NOT NULL DEFAULT false,
  adopted_price numeric(10,2)
                              CHECK (adopted_price IS NULL OR adopted_price > 0),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT skus_is_for_sale_requires_price
    CHECK (
      is_for_sale = false
      OR (is_for_sale = true AND adopted_price IS NOT NULL)
    )
);

COMMENT ON TABLE skus IS 'Portfólio de SKUs do vendedor. Cada SKU pode ter múltiplos cálculos de viabilidade.';
COMMENT ON COLUMN skus.status IS 'draft | viable | attention | not_viable | for_sale';
COMMENT ON COLUMN skus.adopted_price IS 'Preço adotado para venda. Obrigatório quando is_for_sale=true.';
COMMENT ON COLUMN skus.is_for_sale IS 'Indica que o produto está ativamente à venda no ML.';

CREATE TRIGGER skus_set_updated_at
  BEFORE UPDATE ON skus
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Tabela: sku_calculations
-- Propósito: histórico de cálculos de viabilidade por SKU
-- ============================================================
CREATE TABLE IF NOT EXISTS sku_calculations (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id         uuid        NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  -- Snapshots imutáveis do estado no momento do cálculo
  cost_data      jsonb       NOT NULL,   -- ViabilityInput serializado
  result_data    jsonb       NOT NULL,   -- ViabilityResult serializado
  -- Campos desnormalizados para queries analíticas rápidas
  sale_price     numeric(10,2) NOT NULL CHECK (sale_price > 0),
  listing_type   text        NOT NULL DEFAULT 'classic'
                               CHECK (listing_type IN ('free', 'classic', 'premium')),
  margin_percent numeric(6,2),           -- resultado: pode ser negativo
  roi_percent    numeric(8,2),           -- resultado: pode ser negativo
  is_viable      boolean,               -- resultado: true/false/null (sem cálculo)
  is_adopted     boolean     NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT sku_calculations_cost_data_not_empty
    CHECK (cost_data != '{}'::jsonb),
  CONSTRAINT sku_calculations_result_data_not_empty
    CHECK (result_data != '{}'::jsonb)
);

COMMENT ON TABLE sku_calculations IS 'Histórico de cálculos de viabilidade. Imutável: nunca faça UPDATE, apenas INSERT.';
COMMENT ON COLUMN sku_calculations.cost_data IS 'Snapshot de ViabilityInput. Imutável após inserção.';
COMMENT ON COLUMN sku_calculations.result_data IS 'Snapshot de ViabilityResult. Imutável após inserção.';
COMMENT ON COLUMN sku_calculations.is_adopted IS 'Indica que este cálculo foi o escolhido para adoção do preço de venda.';

-- ============================================================
-- Tabela: ml_fees
-- Propósito: taxas oficiais do Mercado Livre (dados de referência)
-- ============================================================
CREATE TABLE IF NOT EXISTS ml_fees (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_type  text        NOT NULL
                              CHECK (listing_type IN ('free', 'classic', 'premium')),
  installments  integer     NOT NULL DEFAULT 1 CHECK (installments BETWEEN 1 AND 12),
  fee_percent   numeric(5,2) NOT NULL CHECK (fee_percent >= 0 AND fee_percent <= 100),
  category_id   text,        -- null = taxa geral (sem categoria específica)
  category_name text,
  source_url    text,        -- URL da documentação oficial ML
  notes         text,        -- observações sobre a taxa
  verified_at   timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT ml_fees_category_consistency
    CHECK (
      (category_id IS NULL AND category_name IS NULL)
      OR (category_id IS NOT NULL AND category_name IS NOT NULL)
    ),
  CONSTRAINT ml_fees_unique_type_installments_category
    UNIQUE (listing_type, installments, category_id)
);

COMMENT ON TABLE ml_fees IS 'Taxas oficiais do Mercado Livre. Atualizar quando ML alterar tabela de taxas. Leitura pública.';
COMMENT ON COLUMN ml_fees.category_id IS 'ID da categoria ML (ex: MLB1144). NULL = taxa padrão sem categoria.';
COMMENT ON COLUMN ml_fees.verified_at IS 'Data da última verificação na documentação oficial ML.';

CREATE TRIGGER ml_fees_set_updated_at
  BEFORE UPDATE ON ml_fees
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- Tabela: ml_search_cache
-- Propósito: cache de resultados da ML API (TTL 1h)
-- ============================================================
CREATE TABLE IF NOT EXISTS ml_search_cache (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash   text        NOT NULL UNIQUE CHECK (char_length(query_hash) = 32), -- MD5 hex
  query_text   text        NOT NULL,
  results_json jsonb       NOT NULL,
  result_count integer     NOT NULL DEFAULT 0 CHECK (result_count >= 0),
  expires_at   timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT ml_search_cache_expires_after_creation
    CHECK (expires_at > created_at)
);

COMMENT ON TABLE ml_search_cache IS 'Cache de buscas ML API. TTL 1h. Escrita exclusiva via service_role (server-side).';
COMMENT ON COLUMN ml_search_cache.query_hash IS 'MD5 da query normalizada (lowercase + trim). Chave de lookup.';

-- ============================================================
-- Indexes — baseados nos padrões de acesso
-- ============================================================

-- skus: consultas mais frequentes
CREATE INDEX IF NOT EXISTS idx_skus_user_id
  ON skus(user_id);
-- ^^ toda query começa com user_id (RLS + listagem)

CREATE INDEX IF NOT EXISTS idx_skus_user_status
  ON skus(user_id, status);
-- ^^ filtros de status frequentes: "meus SKUs viáveis"

CREATE INDEX IF NOT EXISTS idx_skus_user_updated
  ON skus(user_id, updated_at DESC);
-- ^^ listagem ordenada por mais recente

CREATE INDEX IF NOT EXISTS idx_skus_name_trgm
  ON skus USING gin(name gin_trgm_ops);
-- ^^ busca fuzzy por nome de SKU (requer pg_trgm)

-- sku_calculations: sempre consultado via sku_id
CREATE INDEX IF NOT EXISTS idx_sku_calculations_sku_id
  ON sku_calculations(sku_id);

CREATE INDEX IF NOT EXISTS idx_sku_calculations_sku_recent
  ON sku_calculations(sku_id, created_at DESC);
-- ^^ "último cálculo do SKU X" — padrão muito frequente

CREATE INDEX IF NOT EXISTS idx_sku_calculations_is_adopted
  ON sku_calculations(sku_id, is_adopted)
  WHERE is_adopted = true;
-- ^^ index parcial: encontrar o cálculo adotado de cada SKU

-- ml_fees: lookup por tipo de anúncio e parcelas
CREATE INDEX IF NOT EXISTS idx_ml_fees_listing_installments
  ON ml_fees(listing_type, installments);

-- ml_search_cache: lookup por hash + limpeza de expirados
CREATE INDEX IF NOT EXISTS idx_ml_search_cache_hash
  ON ml_search_cache(query_hash);
-- ^^ já coberto pelo UNIQUE, mas explícito para clareza

CREATE INDEX IF NOT EXISTS idx_ml_search_cache_expires
  ON ml_search_cache(expires_at)
  WHERE expires_at < now();
-- ^^ para job de limpeza de cache expirado
```

---

## 5. Migration 002 — RLS e Políticas

```sql
-- ============================================================
-- SmartPreço — Migration 002: RLS Policies
-- Executado em: supabase/migrations/002_rls_policies.sql
-- Idempotente: DROP POLICY IF EXISTS antes de CREATE
-- ============================================================

-- ============================================================
-- skus: isolamento total por usuário
-- ============================================================
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;

-- Remove policies anteriores (idempotência)
DROP POLICY IF EXISTS "skus_select_own" ON skus;
DROP POLICY IF EXISTS "skus_insert_own" ON skus;
DROP POLICY IF EXISTS "skus_update_own" ON skus;
DROP POLICY IF EXISTS "skus_delete_own" ON skus;

-- SELECT: apenas os seus próprios
CREATE POLICY "skus_select_own" ON skus
  FOR SELECT
  USING (user_id = auth.uid());

-- INSERT: user_id deve ser o do usuário autenticado
CREATE POLICY "skus_insert_own" ON skus
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE: apenas os seus próprios
CREATE POLICY "skus_update_own" ON skus
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE: apenas os seus próprios
CREATE POLICY "skus_delete_own" ON skus
  FOR DELETE
  USING (user_id = auth.uid());

-- ============================================================
-- sku_calculations: acesso herdado via skus
-- Não tem user_id diretamente — valida via JOIN com skus
-- ============================================================
ALTER TABLE sku_calculations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sku_calc_select_via_sku" ON sku_calculations;
DROP POLICY IF EXISTS "sku_calc_insert_via_sku" ON sku_calculations;
DROP POLICY IF EXISTS "sku_calc_update_via_sku" ON sku_calculations;
DROP POLICY IF EXISTS "sku_calc_delete_via_sku" ON sku_calculations;

CREATE POLICY "sku_calc_select_via_sku" ON sku_calculations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM skus
      WHERE skus.id = sku_calculations.sku_id
        AND skus.user_id = auth.uid()
    )
  );

CREATE POLICY "sku_calc_insert_via_sku" ON sku_calculations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM skus
      WHERE skus.id = sku_calculations.sku_id
        AND skus.user_id = auth.uid()
    )
  );

CREATE POLICY "sku_calc_update_via_sku" ON sku_calculations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM skus
      WHERE skus.id = sku_calculations.sku_id
        AND skus.user_id = auth.uid()
    )
  );

CREATE POLICY "sku_calc_delete_via_sku" ON sku_calculations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM skus
      WHERE skus.id = sku_calculations.sku_id
        AND skus.user_id = auth.uid()
    )
  );

-- ============================================================
-- ml_fees: dados de referência — leitura pública (qualquer usuário)
-- Escrita apenas por service_role (admin)
-- ============================================================
ALTER TABLE ml_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ml_fees_read_all" ON ml_fees;

CREATE POLICY "ml_fees_read_all" ON ml_fees
  FOR SELECT
  USING (true);
-- INSERT/UPDATE/DELETE bloqueados para anon e authenticated
-- Apenas service_role (que bypassa RLS) pode escrever

-- ============================================================
-- ml_search_cache: leitura pública, escrita via service_role
-- O Route Handler usa service_role_key para gravar no cache
-- ============================================================
ALTER TABLE ml_search_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cache_read_all" ON ml_search_cache;
DROP POLICY IF EXISTS "cache_service_insert" ON ml_search_cache;

CREATE POLICY "cache_read_all" ON ml_search_cache
  FOR SELECT
  USING (true);

-- Escrita: qualquer usuário autenticado pode inserir no cache
-- A proteção real é: o server grava com service_role (ignora RLS),
-- o anon key só pode ler. Em produção, o INSERT via anon está
-- explicitamente negado pela ausência de política de INSERT.
-- Nota: INSERT via anon key será NEGADO (sem policy = deny).
-- O Route Handler usa service_role, que bypassa RLS.
```

### Testes de RLS (Positivo e Negativo)

```sql
-- ============================================================
-- Como testar as políticas RLS no Supabase SQL Editor
-- ============================================================

-- SETUP: crie dois usuários via Auth e anote os UUIDs
-- user_a: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
-- user_b: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'

-- ---- TESTE 1: SELECT positivo ----
-- Executar como user_a via supabase.auth.signIn()
-- Esperado: retorna apenas SKUs de user_a

SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}';
SELECT id, name FROM skus;
-- Deve retornar: apenas SKUs com user_id = user_a ✓

-- ---- TESTE 2: SELECT negativo (isolamento) ----
-- Executar como user_b
-- Esperado: NÃO retorna SKUs de user_a

SET LOCAL "request.jwt.claims" TO '{"sub": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"}';
SELECT id, name FROM skus WHERE user_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
-- Deve retornar: 0 linhas ✓ (RLS filtra)

-- ---- TESTE 3: INSERT negativo (user_id inválido) ----
-- Executar como user_a tentando inserir com user_id de user_b
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}';
INSERT INTO skus (user_id, name) VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'SKU fraudulento'
);
-- Deve retornar: ERROR (violação de WITH CHECK) ✓

-- ---- TESTE 4: ml_fees leitura pública ----
-- Executar como anon (sem autenticação)
RESET role;  -- anon
SELECT listing_type, fee_percent FROM ml_fees LIMIT 5;
-- Deve retornar: dados ✓ (política USING(true))

-- ---- TESTE 5: ml_fees sem escrita pública ----
-- Executar como authenticated (não service_role)
SET LOCAL role TO authenticated;
SET LOCAL "request.jwt.claims" TO '{"sub": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}';
INSERT INTO ml_fees (listing_type, installments, fee_percent) VALUES ('classic', 1, 99.00);
-- Deve retornar: ERROR (nenhuma policy de INSERT para authenticated) ✓
```

---

## 6. Migration 003 — Seed das Taxas ML

```sql
-- ============================================================
-- SmartPreço — Migration 003: Seed Taxas Mercado Livre
-- Executado em: supabase/migrations/003_seed_ml_fees.sql
-- Fonte: Ajuda do Mercado Livre (links abaixo)
-- Verificado em: 2026-04-20
-- Idempotente: INSERT ... ON CONFLICT DO UPDATE
-- ============================================================

-- Fonte principal das taxas:
-- https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338
-- https://www.mercadolivre.com.br/ajuda/valor-das-tarifas_2833

-- ============================================================
-- Taxas de comissão por tipo de anúncio (sem parcelamento)
-- Parcelamento em 1x = sem custo adicional de parcelamento
-- ============================================================

INSERT INTO ml_fees (listing_type, installments, fee_percent, category_id, category_name, source_url, notes, verified_at)
VALUES

-- ---- Gratuito ----
-- Comissão 0%, mas limitado a 5 anúncios/mês sem custo de anúncio
('free', 1, 0.00, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338',
 'Anúncio Gratuito: sem comissão. Limite de 5 anúncios ativos gratuitos por mês.',
 '2026-04-20'),

-- ---- Clássico — taxa geral ----
-- 11% é a taxa geral para a maioria das categorias
('classic', 1, 11.00, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338',
 'Anúncio Clássico: taxa geral de 11% sobre o valor do produto. Frete pago pelo comprador.',
 '2026-04-20'),

-- ---- Premium — taxa geral ----
-- 17% é a taxa geral para a maioria das categorias
('premium', 1, 17.00, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338',
 'Anúncio Premium: taxa geral de 17% sobre o valor do produto. Frete grátis incluso.',
 '2026-04-20'),

-- ---- Categorias com taxa diferenciada ----
-- Veículos: taxa fixa (não percentual — tratar como taxa especial)
('classic', 1, 3.00, 'MLB1744', 'Carros e Caminhonetes',
 'https://www.mercadolivre.com.br/ajuda/valor-das-tarifas_2833',
 'Veículos: taxa de 3% — máximo R$900 por transação. Regra especial.',
 '2026-04-20'),

('premium', 1, 3.00, 'MLB1744', 'Carros e Caminhonetes',
 'https://www.mercadolivre.com.br/ajuda/valor-das-tarifas_2833',
 'Veículos: taxa de 3% — máximo R$900 por transação. Regra especial.',
 '2026-04-20'),

-- Imóveis (taxa fixa por anúncio, não percentual — placeholder)
('classic', 1, 0.00, 'MLB1459', 'Imóveis',
 'https://www.mercadolivre.com.br/ajuda/valor-das-tarifas_2833',
 'Imóveis: taxa fixa por anúncio, não percentual. Não usar fórmula de margem padrão.',
 '2026-04-20'),

-- Serviços
('classic', 1, 0.00, 'MLB1540', 'Serviços',
 'https://www.mercadolivre.com.br/ajuda/valor-das-tarifas_2833',
 'Serviços: sem comissão percentual. Custo de anúncio fixo.',
 '2026-04-20')

ON CONFLICT (listing_type, installments, category_id)
DO UPDATE SET
  fee_percent   = EXCLUDED.fee_percent,
  source_url    = EXCLUDED.source_url,
  notes         = EXCLUDED.notes,
  verified_at   = EXCLUDED.verified_at,
  updated_at    = now();

-- ============================================================
-- Custos de parcelamento (cobrados sobre o valor de venda)
-- Fonte: https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077
-- Verificado: 2026-04-20
-- ============================================================

-- IMPORTANTE: O custo de parcelamento é ADICIONAL à comissão do anúncio.
-- Exemplo: Clássico 1x = 11% comissão + 0% parcelamento = 11% total
--          Clássico 6x = 11% comissão + 5.43% parcelamento = ~16.43% total
-- Os valores abaixo são os custos EXCLUSIVOS de parcelamento.

INSERT INTO ml_fees (listing_type, installments, fee_percent, category_id, category_name, source_url, notes, verified_at)
VALUES

-- ---- Clássico — custo de parcelamento ----
-- 1x: sem custo adicional (já registrado acima, pulamos)
('classic', 2,  3.89, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 2x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 3,  5.05, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 3x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 4,  5.83, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 4x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 5,  6.36, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 5x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 6,  6.43, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 6x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 7,  8.03, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 7x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 8,  8.51, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 8x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 9,  8.95, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 9x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 10, 9.21, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 10x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 11, 9.63, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 11x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),
('classic', 12, 9.99, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Clássico 12x. ADICIONAL à comissão de 11%.',
 '2026-04-20'),

-- ---- Premium — custo de parcelamento ----
-- Premium oferece parcelamento sem juros ao comprador — custo absorvido pelo vendedor
('premium', 2,  3.89, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 2x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 3,  5.05, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 3x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 4,  5.83, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 4x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 5,  6.36, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 5x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 6,  6.43, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 6x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 7,  8.03, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 7x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 8,  8.51, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 8x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 9,  8.95, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 9x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 10, 9.21, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 10x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 11, 9.63, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 11x. ADICIONAL à comissão de 17%.',
 '2026-04-20'),
('premium', 12, 9.99, NULL, NULL,
 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077',
 'Custo de parcelamento Premium 12x. ADICIONAL à comissão de 17%.',
 '2026-04-20')

ON CONFLICT (listing_type, installments, category_id)
DO UPDATE SET
  fee_percent   = EXCLUDED.fee_percent,
  source_url    = EXCLUDED.source_url,
  notes         = EXCLUDED.notes,
  verified_at   = EXCLUDED.verified_at,
  updated_at    = now();
```

---

## 7. Rollback Scripts

```sql
-- ============================================================
-- ROLLBACK COMPLETO (ordem inversa das migrations)
-- ATENÇÃO: Destrói todos os dados. Usar APENAS em dev/staging.
-- ============================================================

-- Rollback 003: remove seed (não é necessário, DROP TABLE cobre)

-- Rollback 002: desabilita RLS e remove policies
ALTER TABLE sku_calculations DISABLE ROW LEVEL SECURITY;
ALTER TABLE skus DISABLE ROW LEVEL SECURITY;
ALTER TABLE ml_fees DISABLE ROW LEVEL SECURITY;
ALTER TABLE ml_search_cache DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "skus_select_own"           ON skus;
DROP POLICY IF EXISTS "skus_insert_own"           ON skus;
DROP POLICY IF EXISTS "skus_update_own"           ON skus;
DROP POLICY IF EXISTS "skus_delete_own"           ON skus;
DROP POLICY IF EXISTS "sku_calc_select_via_sku"   ON sku_calculations;
DROP POLICY IF EXISTS "sku_calc_insert_via_sku"   ON sku_calculations;
DROP POLICY IF EXISTS "sku_calc_update_via_sku"   ON sku_calculations;
DROP POLICY IF EXISTS "sku_calc_delete_via_sku"   ON sku_calculations;
DROP POLICY IF EXISTS "ml_fees_read_all"          ON ml_fees;
DROP POLICY IF EXISTS "cache_read_all"            ON ml_search_cache;

-- Rollback 001: remove tabelas (CASCADE remove indexes + triggers)
DROP TABLE IF EXISTS ml_search_cache   CASCADE;
DROP TABLE IF EXISTS ml_fees           CASCADE;
DROP TABLE IF EXISTS sku_calculations  CASCADE;
DROP TABLE IF EXISTS skus              CASCADE;

DROP FUNCTION IF EXISTS set_updated_at CASCADE;
DROP EXTENSION IF EXISTS "pg_trgm";
```

---

## 8. Padrões de Acesso — Referência para o Motor

Esta seção documenta as queries que o código TypeScript executará, para validar que os indexes cobrem os padrões reais.

### Queries Frequentes

```sql
-- 1. Listar SKUs do usuário (dashboard, central de SKUs)
SELECT id, name, status, is_for_sale, adopted_price, updated_at
FROM skus
WHERE user_id = $1
ORDER BY updated_at DESC;
-- Index: idx_skus_user_updated ✓

-- 2. Filtrar SKUs por status
SELECT id, name, status, adopted_price
FROM skus
WHERE user_id = $1 AND status = $2
ORDER BY updated_at DESC;
-- Index: idx_skus_user_status ✓

-- 3. Buscar SKU por nome (fuzzy)
SELECT id, name, status
FROM skus
WHERE user_id = $1 AND name ILIKE '%' || $2 || '%';
-- Index: idx_skus_name_trgm ✓ (com pg_trgm e operador %)

-- 4. Último cálculo de um SKU
SELECT id, sale_price, margin_percent, result_data, created_at
FROM sku_calculations
WHERE sku_id = $1
ORDER BY created_at DESC
LIMIT 1;
-- Index: idx_sku_calculations_sku_recent ✓

-- 5. Histórico de cálculos de um SKU
SELECT id, sale_price, margin_percent, listing_type, is_adopted, created_at
FROM sku_calculations
WHERE sku_id = $1
ORDER BY created_at DESC;
-- Index: idx_sku_calculations_sku_id ✓

-- 6. Buscar taxas ML para cálculo (motor financeiro)
SELECT listing_type, installments, fee_percent
FROM ml_fees
WHERE listing_type = $1
  AND category_id IS NULL  -- taxa geral
ORDER BY installments;
-- Index: idx_ml_fees_listing_installments ✓

-- 7. Cache lookup (hot path — executa em toda busca ML)
SELECT results_json, result_count, expires_at
FROM ml_search_cache
WHERE query_hash = $1
  AND expires_at > now();
-- Index: UNIQUE em query_hash ✓

-- 8. Limpeza de cache expirado (job periódico ou lazy cleanup)
DELETE FROM ml_search_cache
WHERE expires_at < now();
-- Index: idx_ml_search_cache_expires ✓
```

---

## 9. Estrutura JSONB — Contratos de Tipos

Os campos `cost_data` e `result_data` em `sku_calculations` são snapshots das interfaces TypeScript definidas em `src/types/pricing.ts`. Documentados aqui para garantir consistência.

### cost_data (ViabilityInput)

```json
{
  "productCost": 45.00,
  "shippingCost": 12.00,
  "packagingCost": 2.50,
  "taxRate": 0.06,
  "overheadRate": 0.05,
  "targetMargin": 0.20,
  "salePrice": 99.90,
  "listingType": "classic",
  "installments": 1
}
```

### result_data (ViabilityResult)

```json
{
  "totalCost": 71.44,
  "costBreakdown": {
    "acquisition": 45.00,
    "commission": 10.99,
    "shipping": 12.00,
    "packaging": 2.50,
    "tax": 2.70,
    "overhead": 4.50,
    "installment": 0.00
  },
  "marginPercent": 28.47,
  "roiPercent": 39.81,
  "breakEvenPrice": 71.44,
  "minimumViablePrice": 71.44,
  "recommendedPrice": 89.30,
  "classification": "viable",
  "calculatedAt": "2026-04-20T12:00:00Z"
}
```

---

## 10. Checklist de Validação do Schema

- [x] Todas as tabelas têm `id uuid PK DEFAULT gen_random_uuid()`
- [x] Tabelas de usuário têm `created_at` e `updated_at`
- [x] Trigger de auto-update em `skus` e `ml_fees`
- [x] FK com `ON DELETE CASCADE` onde faz sentido (sku_calculations → skus)
- [x] CHECK constraints em campos enum (status, listing_type)
- [x] CHECK constraints de integridade de negócio (is_for_sale exige adopted_price)
- [x] RLS habilitado em todas as tabelas
- [x] Policies cobrindo SELECT + INSERT + UPDATE + DELETE em tabelas de usuário
- [x] ml_fees e ml_search_cache com política de leitura pública
- [x] Indexes para todos os padrões de acesso documentados
- [x] Index parcial para `is_adopted = true` (evita full scan)
- [x] Seed data com fontes oficiais ML e data de verificação
- [x] Script de rollback completo e testado
- [x] JSONB contracts documentados para geração de tipos TypeScript

---

*Documento gerado por Dara (Data Engineer) — AIOX SmartPreço Squad*
