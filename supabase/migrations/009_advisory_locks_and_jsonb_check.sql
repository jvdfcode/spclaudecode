-- Migration 009 — Advisory locks + JSONB CHECK + policies explícitas
-- Origem: roundtable-personas-2026-04-27 + EPIC-TD-001 + Story TD-001-1
-- Cobre: DEBT-DB-H3 (rate limit race), DEBT-DB-C3 (OAuth refresh race),
--         DEBT-DB-M3 (JSONB sem CHECK), DEBT-DB-C1 (rate_limit_log policy)
-- Idempotente. Rollback em 009_advisory_locks_and_jsonb_check_rollback.sql.

-- ============================================================
-- 1) Função PL/pgSQL: advisory lock por usuário (Bloco H)
-- ============================================================
-- Acquire um xact-level advisory lock no contexto de uma transação.
-- O lock é liberado automaticamente ao final da transação (commit ou rollback).
-- Hashtext garante distribuição entre slots de lock; user_id||scope evita
-- colisão entre rate-limit e refresh OAuth do mesmo usuário.

CREATE OR REPLACE FUNCTION acquire_user_lock(p_user_id uuid, p_scope text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text || ':' || p_scope));
END;
$$;

COMMENT ON FUNCTION acquire_user_lock(uuid, text) IS
  'Bloqueia (xact-level) operações concorrentes do mesmo usuário no mesmo escopo. '
  'Liberação automática no commit/rollback. Usado em rate-limit e refresh OAuth ML.';

-- ============================================================
-- 2) Função check-then-insert atômica para rate limit
-- ============================================================
-- Encapsula a leitura de count + insert em uma única transação com lock,
-- eliminando a race condition do lib/rateLimit.ts (DEBT-DB-H3).
-- Retorna a contagem ANTES do insert; chamador decide se ok=true.

CREATE OR REPLACE FUNCTION rate_limit_check_and_insert(
  p_user_id uuid,
  p_endpoint text,
  p_window_seconds int
)
RETURNS TABLE(current_count bigint, inserted boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_count bigint;
  v_window_start timestamptz;
BEGIN
  PERFORM acquire_user_lock(p_user_id, 'rate_limit:' || p_endpoint);

  v_window_start := now() - make_interval(secs => p_window_seconds);

  SELECT count(*)
  INTO v_count
  FROM rate_limit_log
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND created_at >= v_window_start;

  -- Sempre insere; chamador valida limite. Insert dentro do lock garante
  -- que duas chamadas concorrentes não decidem com base na mesma contagem.
  INSERT INTO rate_limit_log (user_id, endpoint) VALUES (p_user_id, p_endpoint);

  RETURN QUERY SELECT v_count AS current_count, true AS inserted;
END;
$$;

COMMENT ON FUNCTION rate_limit_check_and_insert(uuid, text, int) IS
  'Atômico: lock por user+endpoint, conta janela, insere row. '
  'Resolve DEBT-DB-H3 (race condition do checkRateLimit).';

-- ============================================================
-- 3) Policy explícita em rate_limit_log (DEBT-DB-C1)
-- ============================================================
-- A tabela tinha RLS habilitado sem nenhuma policy → bloqueava tudo
-- para roles authenticated. Esta policy documenta o intent: apenas
-- service_role acessa diretamente.

DROP POLICY IF EXISTS "rate_limit_log: service-role only (deny authenticated)"
  ON rate_limit_log;

CREATE POLICY "rate_limit_log: service-role only (deny authenticated)"
  ON rate_limit_log
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE rate_limit_log IS
  'Audit de rate limiting. Acesso somente via service_role (createServiceSupabase). '
  'Policy explícita nega authenticated/anon para deixar o intent legível.';

-- ============================================================
-- 4) JSONB CHECK em sku_calculations (DEBT-DB-M3)
-- ============================================================
-- Validação mínima de schema: cost_data e result_data devem ser objetos.
-- Previne corrupção silenciosa de histórico ao mudar ViabilityInput/Result.

ALTER TABLE sku_calculations
  DROP CONSTRAINT IF EXISTS sku_calculations_cost_data_object;

ALTER TABLE sku_calculations
  ADD CONSTRAINT sku_calculations_cost_data_object
  CHECK (jsonb_typeof(cost_data) = 'object');

ALTER TABLE sku_calculations
  DROP CONSTRAINT IF EXISTS sku_calculations_result_data_object;

ALTER TABLE sku_calculations
  ADD CONSTRAINT sku_calculations_result_data_object
  CHECK (jsonb_typeof(result_data) = 'object');

-- ============================================================
-- 5) Permissões para roles que chamam via Supabase
-- ============================================================
-- service_role precisa executar as funções; authenticated não.

REVOKE ALL ON FUNCTION acquire_user_lock(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION acquire_user_lock(uuid, text) TO service_role;

REVOKE ALL ON FUNCTION rate_limit_check_and_insert(uuid, text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION rate_limit_check_and_insert(uuid, text, int) TO service_role;
