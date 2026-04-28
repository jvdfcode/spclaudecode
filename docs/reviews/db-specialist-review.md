# DB Specialist Review — Fase 5

**Data:** 2026-04-27
**Revisor:** @data-engineer (Dara)
**Draft revisado:** docs/architecture/technical-debt-DRAFT.md

---

## 1. Veredito geral

O draft captura corretamente os débitos DB mais críticos e mantém consistência com os achados do addendum de 2026-04-27. A triagem de severidade (C1/C2/C3 como CRITICAL) está acertada. No entanto, o draft trata três débitos de forma superficial: DEBT-DB-C1 é descrito apenas como "documentar com COMMENT" quando o problema real é um estado de RLS incoerente que pode causar falha silenciosa em qualquer path futuro que não use `service_role`; DEBT-DB-H3 (`checkRateLimit` sem proteção contra race) é mais grave do que HIGH porque o padrão count-then-insert em serverless garante race conditions sob carga mínima concorrente; e DEBT-DB-M3 (JSONB sem CHECK) está subvalorizado como MEDIUM porque a ausência de qualquer validação de estrutura implica corrupção silenciosa de dados históricos de cálculo.

Há também dois blind spots não cobertos pelo draft: (a) ausência de política DELETE em `ml_search_cache` — qualquer usuário autenticado com acesso direto à API Supabase pode deletar entradas de cache alheias; (b) crescimento ilimitado de `rate_limit_log` — a tabela só recebe INSERT, nunca é purgada, e não há TTL ou job de cleanup definido em nenhuma migration.

---

## 2. Concordâncias (com refinamentos)

### DEBT-DB-C1 — `rate_limit_log` com RLS habilitado e zero policies
**Veredito:** REFINE — severidade mantida CRITICAL, recomendação insuficiente no draft.

O draft sugere apenas `COMMENT ON TABLE`. Discordo como solução principal. O estado atual (`008_rate_limit_log.sql:12-13`) é `ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY` sem nenhuma policy — isso bloqueia **toda** operação de roles que não sejam `service_role` ou `postgres`. O `lib/rateLimit.ts` usa `createServiceSupabase()` (linha 1), que bypassa RLS via `service_role` — correto. O risco real é: se alguém introduzir um path que use o cliente de usuário (ex: uma Server Action que chame `checkRateLimit` com o cliente SSR), todas as queries retornarão zero rows silenciosamente, causando fail-open total no rate limiting.

**Recomendação concreta:**

Opção A (mínimo defensivo) — adicionar policy restritiva explícita que reafirma que só service_role pode operar:
```sql
-- Migration 009_rate_limit_log_policy.sql
-- Documenta explicitamente a intenção: somente service_role
COMMENT ON TABLE rate_limit_log IS
  'Acesso exclusivo via service_role (bypassa RLS). '
  'Nenhum role de usuário deve acessar esta tabela diretamente.';

-- Policy de negação explícita para roles de usuário (defense-in-depth)
CREATE POLICY "rate_limit_log: bloqueio para anon e authenticated"
  ON rate_limit_log
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
```

Opção B (preferida se equipe crescer) — desabilitar RLS e usar GRANT restritivo:
```sql
-- Só service_role e postgres têm GRANT implícito no Supabase
ALTER TABLE rate_limit_log DISABLE ROW LEVEL SECURITY;
REVOKE ALL ON rate_limit_log FROM anon, authenticated;
```

**Evidência:** `supabase/migrations/008_rate_limit_log.sql:12` — linha exata do problema.

---

### DEBT-DB-C2 — `ml_search_cache` sem DELETE policy + cron Vercel sem alarme
**Veredito:** AGREE — severidade CRITICAL mantida, com adição de gap não capturado.

O draft identifica corretamente a ausência de alarme no cron Vercel. O addendum (`DB-AUDIT-addendum-2026-04-27.md:17`) confirma que o cleanup foi implementado via Edge Function + cron `0 3 * * *` sem fallback DB-side.

Gap adicional não capturado pelo draft: `005_ml_search_cache.sql` define policies de SELECT (público), INSERT e UPDATE (autenticados), mas **não define política DELETE**. Com RLS habilitado e ausência de DELETE policy, o comportamento do Supabase é negar DELETE para todos os roles exceto `service_role`/`postgres`. Isso significa que a Edge Function de cleanup deve usar `service_role` — se usar o cliente anon ou de usuário, o cleanup silenciosamente retorna 0 rows deletadas sem erro.

**Recomendação concreta:**

```sql
-- Migration 009 (pode ser combinada com fix do C1)
-- Cleanup policy para service_role (Edge Function usa service_role)
-- Nenhum usuário deve poder deletar cache alheio
CREATE POLICY "ml_search_cache: delete somente service_role"
  ON ml_search_cache FOR DELETE
  USING (auth.role() = 'service_role');

-- Alarme Sentry no handler do cron (src/app/api/cron/cleanup-ml-cache/route.ts)
-- Adicionar: if (deletedCount === 0 && expectedExpired > 0) Sentry.captureMessage(...)
```

Para o pg_cron como fallback (comentado em `007_performance_indexes.sql:24-26`):
```sql
-- Habilitar no dashboard Supabase: Extensions > pg_cron > Enable
-- Depois aplicar:
SELECT cron.schedule(
  'purge-ml-search-cache',
  '0 * * * *',
  $$DELETE FROM ml_search_cache WHERE expires_at < now()$$
);
```

---

### DEBT-DB-C3 — OAuth ML refresh sem lock — race condition
**Veredito:** AGREE — severidade CRITICAL mantida, detalhamento insuficiente no draft.

O draft menciona "lock no DB" sem especificar o mecanismo. A análise de `src/lib/ml-api.ts:39-64` revela o padrão exato do problema: SELECT para verificar expiração (linha 42-44), decisão de refresh baseada no resultado (linha 49-53), UPDATE sem condição de guarda (linha 57-62). Em ambiente serverless com múltiplas instâncias simultâneas, duas requests do mesmo usuário podem passar pelo check de expiração ao mesmo tempo, disparar dois refreshes paralelos para o ML e sobrescrever o refresh_token uma com a outra — o token "perdedor" fica inválido, causando logout silencioso.

**Recomendação concreta — advisory lock por usuário:**

```sql
-- Usar em transação via RPC:
-- supabase/functions/refresh-ml-token.sql (ou via rpc call no código)
CREATE OR REPLACE FUNCTION refresh_ml_token_safe(
  p_user_id uuid,
  p_new_access_token text,
  p_new_refresh_token text,
  p_new_expires_at timestamptz
) RETURNS TABLE(updated boolean) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- Advisory lock baseado no hash do user_id (evita colisão entre usuários)
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));

  -- Atualiza somente se o token ainda precisa de refresh
  UPDATE ml_tokens
  SET
    access_token  = p_new_access_token,
    refresh_token = p_new_refresh_token,
    expires_at    = p_new_expires_at,
    updated_at    = now()
  WHERE user_id = p_user_id
    AND expires_at < now() + interval '5 minutes';

  RETURN QUERY SELECT FOUND;
END;
$$;
```

Alternativa mais simples se RPC for overkill no MVP — UPDATE condicional com RETURNING:
```sql
-- No código TypeScript (src/lib/ml-api.ts), substituir supabase.from('ml_tokens').update(...)
-- por uma chamada que só atualiza se ainda expirado:
const { data: updateResult } = await supabase
  .from('ml_tokens')
  .update({
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token,
    expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  })
  .eq('user_id', currentUserId)
  .lt('expires_at', new Date(Date.now() + 5 * 60 * 1000).toISOString()) // só atualiza se ainda expirado
  .select('id')
  .single()
// Se updateResult for null, outra instância já fez o refresh — retornar token novo da segunda leitura
```

**Evidência:** `src/lib/ml-api.ts:42-62` — sequência SELECT + UPDATE sem lock.

---

### DEBT-DB-H1 — `ml_tokens.user_id` sem índice explícito
**Veredito:** REFINE — severidade mantida HIGH, mas risco menor do que o draft implica.

O addendum (`DB-AUDIT-addendum-2026-04-27.md:40`) levanta a dúvida corretamente. `006_ml_tokens.sql:4` declara `user_id ... UNIQUE`, e no PostgreSQL/Supabase toda constraint UNIQUE cria implicitamente um B-tree index. Portanto **o índice já existe** — mas é um índice único standalone, não um índice composto. Para queries com filtro adicional (ex: `WHERE user_id = $1 AND expires_at < now()`), um índice composto seria mais eficiente.

**Recomendação concreta:**
```sql
-- Verificar existência antes de criar:
SELECT indexname FROM pg_indexes WHERE tablename = 'ml_tokens';
-- Se existir apenas ml_tokens_user_id_key (do UNIQUE), considerar índice composto:
CREATE INDEX IF NOT EXISTS idx_ml_tokens_user_expires
  ON ml_tokens(user_id, expires_at);
```

---

### DEBT-DB-H2 — N+1 implícito em `listSkus` (`sku_calculations (*)`)
**Veredito:** REFINE — severidade mantida HIGH, mas o draft está parcialmente desatualizado.

A análise de `src/lib/supabase/skus.ts:199-225` mostra que `listSkus` **já usa** `.limit(1, { referencedTable: 'sku_calculations' })` (linha 214) e ordena por `created_at DESC` (linha 213). Portanto o N+1 clássico (trazer todos os cálculos) foi mitigado na implementação atual — mas o padrão PostgREST de `limit` em tabela relacionada não garante comportamento idêntico a LATERAL JOIN a nível de plano de execução. O Supabase gera múltiplas queries internas.

**Recomendação concreta — LATERAL JOIN via RPC ou view:**
```sql
-- View para listagem de SKUs com último cálculo (recomendada para substituir PostgREST embed)
CREATE OR REPLACE VIEW skus_with_latest_calc AS
SELECT
  s.*,
  c.id            AS calc_id,
  c.sale_price,
  c.listing_type,
  c.margin_percent,
  c.roi_percent,
  c.is_viable,
  c.is_adopted,
  c.created_at    AS calc_created_at
FROM skus s
LEFT JOIN LATERAL (
  SELECT *
  FROM sku_calculations
  WHERE sku_id = s.id
  ORDER BY created_at DESC
  LIMIT 1
) c ON true;
```

Nota: a view precisa de policy RLS ou ser acessada via `security_definer` function para manter o isolamento por `user_id`.

---

### DEBT-DB-H3 — `checkRateLimit` sem proteção contra race
**Veredito:** REFINE — draft classifica como HIGH, recomendo escalar para CRITICAL.

O padrão em `src/lib/rateLimit.ts:18-38` é: (1) SELECT COUNT onde `created_at >= windowStart`, (2) se `count < limit` então INSERT. Em serverless, múltiplas instâncias do mesmo usuário executam o SELECT simultaneamente antes de qualquer INSERT — todas retornam `count = 0`, todas passam pelo check, todas inserem. Resultado: 10 requests simultâneas com `limit=10` passam todas. O rate limiting torna-se ineficaz exatamente sob carga, que é quando mais importa.

**Recomendação concreta — contador atômico via INSERT + contagem pós-insert:**
```sql
-- Abordagem com INSERT e contagem atômica (sem race):
-- No código TypeScript, substituir o padrão count-then-insert por:

-- 1. Sempre inserir primeiro (registro da tentativa)
INSERT INTO rate_limit_log (user_id, endpoint)
VALUES ($userId, $endpoint);

-- 2. Contar quantas requests estão na janela (incluindo a que acabou de inserir)
SELECT COUNT(*) FROM rate_limit_log
WHERE user_id = $userId
  AND endpoint = $endpoint
  AND created_at >= $windowStart;

-- 3. Se count > limit: deletar o registro recém-inserido e retornar blocked
-- Isso garante que o "slot" é consumido atomicamente antes de verificar o limite
```

Alternativamente, usar advisory lock por `(user_id, endpoint)`:
```sql
CREATE OR REPLACE FUNCTION check_rate_limit_atomic(
  p_user_id uuid,
  p_endpoint text,
  p_limit int,
  p_window_seconds int
) RETURNS TABLE(allowed boolean, current_count bigint) LANGUAGE plpgsql AS $$
DECLARE
  v_window_start timestamptz;
  v_count bigint;
BEGIN
  v_window_start := now() - (p_window_seconds || ' seconds')::interval;

  -- Lock por hash de (user_id, endpoint) — evita race entre instâncias para o mesmo usuário+endpoint
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text || p_endpoint));

  SELECT COUNT(*) INTO v_count
  FROM rate_limit_log
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND created_at >= v_window_start;

  IF v_count < p_limit THEN
    INSERT INTO rate_limit_log (user_id, endpoint) VALUES (p_user_id, p_endpoint);
    v_count := v_count + 1;
    RETURN QUERY SELECT true, v_count;
  ELSE
    RETURN QUERY SELECT false, v_count;
  END IF;
END;
$$;
```

**Evidência:** `src/lib/rateLimit.ts:19-38` — padrão count-then-insert não atômico.

---

### DEBT-DB-M1 — `ml_fees` apenas com taxas gerais (sem categoria)
**Veredito:** AGREE — severidade MEDIUM mantida.

`002_ml_fees_table.sql` e `003_seed_ml_fees.sql` confirmam que a constraint `UNIQUE(listing_type, installments, category_id)` e as colunas `category_id`/`category_name` existem, mas os seeds só cobrem `category_id IS NULL`. Categorias com taxas diferenciadas no ML (veículos: 3%, imóveis: 3%, serviços: mínimo 3%) retornam cálculos incorretos para esses vendedores.

**Recomendação:**
```sql
-- Seed de categorias críticas ML (valores referenciais — verificar em https://www.mercadolivre.com.br/tarifas)
INSERT INTO ml_fees (listing_type, installments, fee_percent, category_id, category_name, source_url)
VALUES
  ('classic', 1, 3.00,  'MLB1743', 'Veículos',  'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338'),
  ('classic', 1, 3.00,  'MLB1459', 'Imóveis',   'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338'),
  ('premium', 1, 3.00,  'MLB1743', 'Veículos',  'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338'),
  ('premium', 1, 3.00,  'MLB1459', 'Imóveis',   'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338')
ON CONFLICT (listing_type, installments, category_id) DO UPDATE
  SET fee_percent = EXCLUDED.fee_percent,
      verified_at = now();
```

---

### DEBT-DB-M2 — `pg_cron` não habilitado
**Veredito:** AGREE — severidade MEDIUM mantida.

O SQL está comentado em `007_performance_indexes.sql:24-26`. A ativação depende de ação manual no dashboard Supabase (Extensions > pg_cron). Deve ser tratado como pré-requisito do Bloco B do draft.

---

### DEBT-DB-M3 — JSONB `cost_data`/`result_data` sem CHECK
**Veredito:** REFINE — recomendo escalar de MEDIUM para HIGH.

`004_skus_table.sql` (via SCHEMA.md) define `cost_data jsonb NOT NULL` e `result_data jsonb NOT NULL` sem nenhum CHECK. O risco não é apenas "aceitar qualquer JSONB" — é que mudanças no tipo `ViabilityInput` ou `ViabilityResult` no TypeScript podem silenciosamente tornar histórico inacessível sem qualquer erro detectável no banco.

**Recomendação concreta (mínimo imediato):**
```sql
-- Migration: validação estrutural mínima
ALTER TABLE sku_calculations
  ADD CONSTRAINT sku_calc_cost_data_is_object
    CHECK (jsonb_typeof(cost_data) = 'object'),
  ADD CONSTRAINT sku_calc_result_data_is_object
    CHECK (jsonb_typeof(result_data) = 'object');

-- Médio prazo: adicionar campo schema_version para versionamento explícito
ALTER TABLE sku_calculations
  ADD COLUMN IF NOT EXISTS schema_version smallint NOT NULL DEFAULT 1;
-- Futuramente: migrate histórico via UPDATE SET schema_version = 1 WHERE schema_version IS NULL
```

---

### DEBT-DB-M4 — `db-types-drift` apenas em CI/PR; sem pre-commit
**Veredito:** AGREE — severidade MEDIUM mantida.

O risco é real mas gerenciável. O pré-commit hook é a camada correta para capturar drift antes do PR. Adicionar ao `package.json`:
```json
// .husky/pre-commit (ou lint-staged)
"supabase gen types typescript --local > src/types/database.ts && git diff --exit-code src/types/database.ts"
```

---

### DEBT-DB-L1 — Tokens em plain text
**Veredito:** AGREE — severidade LOW mantida.

Supabase encripta dados at-rest (AES-256) e em trânsito (TLS 1.2+). O risco real é acesso não autorizado via SQL direto (dashboard, psql, service_role vazado). Documentar no SCHEMA.md e considerar `pgcrypto.encrypt` apenas se compliance exigir (LGPD não requer por si só, dado o at-rest encryption).

---

### DEBT-DB-L2 — Sem audit trail genérico (`pgaudit`)
**Veredito:** AGREE — severidade LOW mantida.

`pgaudit` no Supabase Cloud é habilitado via dashboard. Para MVP, uma solução mais pragmática é trigger de auditoria em `ml_tokens` (tabela mais sensível):
```sql
-- Trigger simples de audit log para ml_tokens
CREATE TABLE IF NOT EXISTS audit_log (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text        NOT NULL,
  operation  text        NOT NULL,  -- INSERT/UPDATE/DELETE
  user_id    uuid,
  changed_at timestamptz DEFAULT now(),
  old_data   jsonb,
  new_data   jsonb
);

CREATE OR REPLACE FUNCTION audit_ml_tokens() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO audit_log(table_name, operation, user_id, old_data, new_data)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.user_id, OLD.user_id),
    CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) - 'access_token' - 'refresh_token' END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) - 'access_token' - 'refresh_token' END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER ml_tokens_audit
  AFTER INSERT OR UPDATE OR DELETE ON ml_tokens
  FOR EACH ROW EXECUTE FUNCTION audit_ml_tokens();
```

---

### DEBT-DB-L3 — Validar via `EXPLAIN ANALYZE` que índices M007 são usados
**Veredito:** AGREE — severidade LOW mantida.

`007_performance_indexes.sql:2-6` criou `idx_skus_user_status` e `idx_skus_user_updated`. Verificar uso em produção:
```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM skus
WHERE user_id = '<test-uuid>'
  AND status = 'viable'
ORDER BY updated_at DESC;
-- Esperado: "Index Scan using idx_skus_user_status" ou "idx_skus_user_updated"
-- Se aparecer "Seq Scan": estatísticas desatualizadas — rodar ANALYZE skus;
```

---

## 3. Débitos adicionais (não capturados no draft)

### DB-EXTRA-01 — `rate_limit_log` cresce indefinidamente (sem TTL ou cleanup)
**Severity:** HIGH (proposta de adição ao inventário do draft)
**Evidência:** `008_rate_limit_log.sql` — nenhuma política de retenção, nenhum índice parcial com filtragem temporal, nenhum job de cleanup. A tabela acumula uma row por request de API dentro da janela de rate limit. Com 10 usuários fazendo 10 requests/min nos endpoints `ml-search` e `ml-proxy`, a tabela cresce ~28.800 rows/dia. Em 30 dias: ~864.000 rows. O índice `idx_rate_limit_log_lookup` em `(user_id, endpoint, created_at)` mitiga a performance de leitura, mas não o crescimento de armazenamento.

**Recomendação concreta:**
```sql
-- Opção A: pg_cron (quando habilitado para DEBT-DB-M2)
SELECT cron.schedule(
  'purge-rate-limit-log',
  '0 4 * * *',  -- diariamente às 4h
  $$DELETE FROM rate_limit_log WHERE created_at < now() - interval '1 day'$$
);

-- Opção B: índice parcial para acelerar deletes seletivos
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_old_records
  ON rate_limit_log(created_at)
  WHERE created_at < now() - interval '1 hour';
  -- Nota: índice parcial com expressão dinâmica tem limitações no Postgres;
  -- usar índice simples em created_at como alternativa:
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_created_at
  ON rate_limit_log(created_at);
```

---

### DB-EXTRA-02 — `ml_search_cache` sem política DELETE explícita
**Severity:** MEDIUM (gap de completude de RLS)
**Evidência:** `005_ml_search_cache.sql:17-27` define SELECT (público), INSERT e UPDATE (autenticados), mas omite DELETE policy. Com RLS habilitado, ausência de DELETE policy implica que `service_role` pode deletar (correto para o cron de cleanup), mas não há proteção explícita contra DELETE de usuário autenticado via Supabase client direto.

**Recomendação:** já detalhada em DEBT-DB-C2 acima — adicionar policy `USING (auth.role() = 'service_role')` para DELETE.

---

### DB-EXTRA-03 — `sku_calculations.cost_data` cresce sem bound por usuário
**Severity:** MEDIUM (growth pattern não endereçado)
**Evidência:** SCHEMA.md — `sku_calculations` acumula um row por cálculo de viabilidade. Não há `MAX_CALCULATIONS_PER_SKU` ou política de arquivamento. Um usuário que calcule 50 preços para o mesmo SKU acumula 50 snapshots JSONB completos. Com `cost_data` estimado em ~500 bytes e `result_data` em ~800 bytes por row, 1000 cálculos = ~1.3MB de JSONB por usuário — aceitável hoje, mas sem nenhum mecanismo de controle futuro.

**Recomendação (médio prazo):**
```sql
-- Trigger para limitar histórico por SKU (ex: manter últimos 50 cálculos)
CREATE OR REPLACE FUNCTION limit_sku_calculations() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM sku_calculations
  WHERE sku_id = NEW.sku_id
    AND id NOT IN (
      SELECT id FROM sku_calculations
      WHERE sku_id = NEW.sku_id
      ORDER BY created_at DESC
      LIMIT 50
    );
  RETURN NEW;
END;
$$;

CREATE TRIGGER sku_calculations_limit
  AFTER INSERT ON sku_calculations
  FOR EACH ROW EXECUTE FUNCTION limit_sku_calculations();
```

---

### DB-EXTRA-04 — `ml_fees` sem trigger `updated_at`
**Severity:** LOW
**Evidência:** `002_ml_fees_table.sql` define `updated_at timestamptz NOT NULL DEFAULT now()` mas não cria trigger para auto-atualização em UPDATE. Diferente de `skus` que tem `skus_updated_at` trigger. Se alguém fizer UPDATE manual em `ml_fees` (ex: corrigir percentual de taxa), `updated_at` fica com o valor da inserção original.

**Recomendação:**
```sql
CREATE TRIGGER ml_fees_updated_at
  BEFORE UPDATE ON ml_fees
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

---

## 4. Recomendações de implementação

### Bloco A — Estabilizar OAuth ML (DEBT-DB-C3)

**Sequência de migrations sugerida:**

1. Criar função `refresh_ml_token_safe` (SQL acima na seção DEBT-DB-C3)
2. Modificar `src/lib/ml-api.ts:57-62` para usar a RPC ao invés de update direto
3. Adicionar retry com leitura pós-update para obter token atualizado por outra instância

**Rollback:** a função SQL é `CREATE OR REPLACE`, reverter para o `supabase.update()` direto não requer migration adicional.

**Pré-requisito:** testar com `EXPLAIN (ANALYZE)` que `pg_advisory_xact_lock` não causa lock contention em load test (cenário: 10 requests simultâneas do mesmo usuário).

---

### Bloco B — Performance e cleanup do cache (DEBT-DB-C2, DEBT-DB-H2, DEBT-DB-M2)

**Sequência:**

1. Habilitar `pg_cron` no dashboard Supabase (Extensions > pg_cron)
2. Aplicar migration que agenda os dois jobs de cleanup:

```sql
-- Migration 010_cron_jobs.sql
-- Cleanup ml_search_cache expirado (hourly)
SELECT cron.schedule(
  'purge-ml-search-cache',
  '0 * * * *',
  $$DELETE FROM ml_search_cache WHERE expires_at < now()$$
);

-- Cleanup rate_limit_log antigo (daily, 4h)
SELECT cron.schedule(
  'purge-rate-limit-log',
  '0 4 * * *',
  $$DELETE FROM rate_limit_log WHERE created_at < now() - interval '1 day'$$
);
```

3. Adicionar DELETE policy em `ml_search_cache` (migration 009)
4. Adicionar alarme Sentry no handler do cron Vercel
5. Migrar `listSkus` para usar a view `skus_with_latest_calc` (SQL acima em DEBT-DB-H2)

**Rollback para cron:**
```sql
SELECT cron.unschedule('purge-ml-search-cache');
SELECT cron.unschedule('purge-rate-limit-log');
```

---

### Bloco C — Hardening de integridade (DEBT-DB-C1, DEBT-DB-M3)

**Sequência:**

```sql
-- Migration 009_hardening.sql (pode ser única migration)

-- 1. rate_limit_log: policy negativa explícita
CREATE POLICY "rate_limit_log: bloqueio para anon e authenticated"
  ON rate_limit_log FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);

COMMENT ON TABLE rate_limit_log IS
  'Acesso exclusivo via service_role. Políticas bloqueiam anon/authenticated explicitamente.';

-- 2. ml_search_cache: DELETE policy
CREATE POLICY "ml_search_cache: delete somente service_role"
  ON ml_search_cache FOR DELETE
  USING (auth.role() = 'service_role');

-- 3. sku_calculations: CHECK de estrutura JSONB
ALTER TABLE sku_calculations
  ADD CONSTRAINT sku_calc_cost_data_is_object
    CHECK (jsonb_typeof(cost_data) = 'object'),
  ADD CONSTRAINT sku_calc_result_data_is_object
    CHECK (jsonb_typeof(result_data) = 'object');

-- 4. schema_version para versionamento futuro
ALTER TABLE sku_calculations
  ADD COLUMN IF NOT EXISTS schema_version smallint NOT NULL DEFAULT 1;

-- 5. ml_fees: trigger updated_at
CREATE TRIGGER ml_fees_updated_at
  BEFORE UPDATE ON ml_fees
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. índice em rate_limit_log.created_at para cleanup eficiente
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_created_at
  ON rate_limit_log(created_at);
```

**Rollback:**
```sql
DROP POLICY IF EXISTS "rate_limit_log: bloqueio para anon e authenticated" ON rate_limit_log;
DROP POLICY IF EXISTS "ml_search_cache: delete somente service_role" ON ml_search_cache;
ALTER TABLE sku_calculations
  DROP CONSTRAINT IF EXISTS sku_calc_cost_data_is_object,
  DROP CONSTRAINT IF EXISTS sku_calc_result_data_is_object,
  DROP COLUMN IF EXISTS schema_version;
DROP TRIGGER IF EXISTS ml_fees_updated_at ON ml_fees;
DROP INDEX IF EXISTS idx_rate_limit_log_created_at;
```

---

## 5. Riscos não endereçados

### R1 — Escalabilidade da policy RLS de `sku_calculations` sob join com `skus`

`007_performance_indexes.sql:10-17` migrou a policy de `IN` para `EXISTS` — correto. Porém, quando a query envolve um JOIN externo (ex: a view `skus_with_latest_calc` proposta), o PostgreSQL pode não conseguir aplicar a policy de `sku_calculations` com push-down eficiente, resultando em evaluation por row sem aproveitar `idx_skus_user_status`. Isso precisa ser validado com `EXPLAIN (ANALYZE, BUFFERS)` em produção assim que a view for criada.

### R2 — Ausência de índice parcial em `ml_search_cache` para registros expirados

O índice `idx_ml_search_cache_expires_at` em `005_ml_search_cache.sql:12` cobre o campo inteiro. Para queries de cleanup (`WHERE expires_at < now()`), um índice parcial seria mais eficiente com o tempo:
```sql
-- Considerar no futuro, após volume justificar:
CREATE INDEX idx_ml_search_cache_expired
  ON ml_search_cache(expires_at)
  WHERE expires_at < now();
-- Nota: índice parcial com now() não é estático — Postgres revalida predicate
-- A efetividade é limitada; avaliar vs. índice simples conforme volume.
```

### R3 — Conformidade LGPD: `ml_tokens` contém dados pessoais vinculados a `auth.uid()`

Os tokens OAuth são vinculados a uma identidade de usuário real. A LGPD (Lei 13.709/2018, Art. 5º, II) classifica isso como dado pessoal quando associado a titular identificável. O mecanismo de `ON DELETE CASCADE` em `ml_tokens` (linha 4 de `006_ml_tokens.sql`) garante remoção ao deletar o usuário — correto. Porém, não há mecanismo de "direito ao esquecimento" explícito para o caso de remoção de conta sem deleção do `auth.users` (ex: conta suspensa). Considerar `SECURITY INVOKER` function de purge chamada no fluxo de cancelamento de conta.

### R4 — `rate_limit_log` como vetor de DDoS interno

O padrão "fail open" em `src/lib/rateLimit.ts:26-29` retorna `{ ok: true }` se o DB estiver indisponível. Isso é correto para disponibilidade, mas implica que uma indisponibilidade do Supabase remove completamente o rate limiting. Em combinação com o crescimento ilimitado da tabela (DB-EXTRA-01), um atacante que force degradação do DB elimina o rate limiting como efeito colateral. Considerar Redis/Upstash como fallback para o contador de rate limit.

---

## 6. Conclusão

**Top-3 ações prioritárias para incorporação na Fase 8 (technical-debt-assessment.md final):**

1. **Escalar DEBT-DB-H3 de HIGH para CRITICAL** — o padrão count-then-insert em `checkRateLimit` (`src/lib/rateLimit.ts:19-38`) é uma race condition garantida em ambiente serverless. O rate limiting atual é ineficaz sob carga concorrente, que é exatamente o cenário de ataque. Combinar com a função SQL atômica proposta (`check_rate_limit_atomic`) e absorver no Bloco A ou criar Bloco A' específico.

2. **Adicionar DB-EXTRA-01 como HIGH ao inventário** — `rate_limit_log` sem cleanup é um débito de crescimento de dados que não aparece em nenhum DEBT-DB-* do draft. Em produção com usuários reais, a tabela crescerá sem bound e degradará a própria feature de rate limiting que depende de contagens rápidas nela.

3. **Consolidar migration 009_hardening.sql antes de qualquer deploy em produção** — os fixes de DEBT-DB-C1 (policy negativa em `rate_limit_log`), DEBT-DB-C2 (DELETE policy em `ml_search_cache`), e DEBT-DB-M3 (CHECK em JSONB) são uma única migration de ~20 linhas que fecha três gaps de segurança e integridade simultaneamente. Custo: 30 minutos. Risco de não fazer: dados corrompidos silenciosamente + cleanup do cache falhando silenciosamente + superfície de RLS implícita.
