-- Rollback migration 012 — REVOKE acquire_user_lock FROM authenticated
-- Reverte VIAB-R1-1 — race condition OAuth voltará a ocorrer em produção.
-- Use apenas se o GRANT causar regressão imprevista.

REVOKE EXECUTE ON FUNCTION acquire_user_lock(uuid, text) FROM authenticated;

COMMENT ON FUNCTION acquire_user_lock(uuid, text) IS
  'Bloqueia (xact-level) operações concorrentes do mesmo usuário no mesmo escopo. '
  'Liberação automática no commit/rollback. Usado em rate-limit e refresh OAuth ML.';
