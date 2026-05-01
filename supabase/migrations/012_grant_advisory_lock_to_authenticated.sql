-- Migration 012 — GRANT acquire_user_lock TO authenticated [VIAB-R1-1]
-- Origem: docs/reviews/viability-2026-04-30/findings/F2-melidev-oauth-checklist.md (Finding 1 — CRITICAL)
-- Cobre: F2 race condition OAuth ATIVA em produção
-- Idempotente. Rollback em 012_grant_advisory_lock_to_authenticated_rollback.sql.

-- ============================================================
-- Contexto
-- ============================================================
-- A migration 009 concedeu EXECUTE em `acquire_user_lock` apenas para
-- service_role (009_*.sql:120-121). Porém `src/lib/ml-api.ts:64` chama o
-- RPC via createServerSupabase() (anon key, role `authenticated`) — a
-- chamada retorna `permission denied` em produção e o lock NUNCA executa.
-- Resultado: race condition em refresh paralelo de tokens OAuth ML.
--
-- Solução: estender GRANT para `authenticated`. Justificativa de segurança:
--   1. A função é SECURITY DEFINER e usa `pg_advisory_xact_lock` interno
--      — primitiva inócua que apenas serializa transações concorrentes.
--   2. Não expõe dados, não modifica linhas, não burla RLS.
--   3. RLS da tabela `ml_tokens` (006_ml_tokens.sql:14-17) continua isolando
--      `auth.uid() = user_id` independentemente do lock.
--   4. Risco de DoS via locks artificiais é mitigado por (a) lock é xact-level
--      e libera no commit/rollback, (b) rate limit aplicacional já cobre.

-- ============================================================
-- GRANT
-- ============================================================

GRANT EXECUTE ON FUNCTION acquire_user_lock(uuid, text) TO authenticated;

COMMENT ON FUNCTION acquire_user_lock(uuid, text) IS
  'Bloqueia (xact-level) operações concorrentes do mesmo usuário no mesmo escopo. '
  'Liberação automática no commit/rollback. Usado em rate-limit (service_role) '
  'e refresh OAuth ML (authenticated, via createServerSupabase). '
  'GRANT estendido em 012 — VIAB-R1-1 fix da race condition OAuth.';
