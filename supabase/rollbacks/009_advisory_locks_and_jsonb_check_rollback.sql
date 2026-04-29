-- Rollback da migration 009 — Advisory locks + JSONB CHECK + policy
-- Aplicar apenas se 009 precisar ser revertida em produção.

-- 1) Remover constraints JSONB
ALTER TABLE sku_calculations
  DROP CONSTRAINT IF EXISTS sku_calculations_cost_data_object;

ALTER TABLE sku_calculations
  DROP CONSTRAINT IF EXISTS sku_calculations_result_data_object;

-- 2) Remover policy explícita
DROP POLICY IF EXISTS "rate_limit_log: service-role only (deny authenticated)"
  ON rate_limit_log;

-- 3) Remover funções (revoga implicitamente)
DROP FUNCTION IF EXISTS rate_limit_check_and_insert(uuid, text, int);
DROP FUNCTION IF EXISTS acquire_user_lock(uuid, text);

-- 4) Restaurar comentário da tabela ao estado anterior
COMMENT ON TABLE rate_limit_log IS NULL;
