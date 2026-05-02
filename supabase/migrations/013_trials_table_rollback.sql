-- Rollback migration 013 — drop trials table + trigger + função
-- Reverte VIAB-R3-1. Trials existentes serão APAGADOS (CASCADE).
-- Use apenas se Trial 14d for descontinuado.

DROP TRIGGER IF EXISTS trials_set_expires_at_trigger ON trials;
DROP FUNCTION IF EXISTS trials_set_expires_at();
DROP INDEX IF EXISTS trials_expires_at_idx;
DROP POLICY IF EXISTS "trials: own row only" ON trials;
DROP TABLE IF EXISTS trials;
