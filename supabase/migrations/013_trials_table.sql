-- Migration 013 — trials table + RLS [VIAB-R3-1]
-- Origem: docs/stories/VIAB-R3-1-trial-14d-pricing-experiment.md
-- Cobre: Trial 14d híbrido vs Free tier eterno (M4 finding — Free viola padrão de mercado)
-- Idempotente. Rollback em 013_trials_table_rollback.sql.

-- ============================================================
-- 1) Tabela `trials`
-- ============================================================
-- 1 row por usuário. `expires_at` calculado no insert (started_at + 14d).
-- `variant` registra qual A/B foi atribuído ao usuário (pricing-experiment + trial flag).
-- `converted_at` setado quando usuário assina Pro pago durante trial.
-- `expired` = true após cron de expiração rodar (ou self-check no endpoint).

CREATE TABLE IF NOT EXISTS trials (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  variant text NOT NULL CHECK (variant IN ('A','B','C','D')),
  converted_at timestamptz NULL,
  expired boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE trials IS
  'Estado de trial 14d por usuário (VIAB-R3-1). 1 row/usuário. expires_at = started_at + 14 dias. '
  'variant indica qual A/B do pricing-experiment foi atribuído. '
  'converted_at marca conversão Pro pago durante trial. expired marca após expiração.';

-- ============================================================
-- 2) Index para queries de expiração
-- ============================================================
CREATE INDEX IF NOT EXISTS trials_expires_at_idx
  ON trials (expires_at)
  WHERE expired = false AND converted_at IS NULL;

-- ============================================================
-- 3) RLS — usuário só vê próprio trial
-- ============================================================
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "trials: own row only" ON trials;
CREATE POLICY "trials: own row only"
  ON trials
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- service_role já tem bypass automático — sem GRANT explícito necessário

-- ============================================================
-- 4) Trigger: auto-set expires_at no insert se não fornecido
-- ============================================================
CREATE OR REPLACE FUNCTION trials_set_expires_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF NEW.expires_at IS NULL THEN
    NEW.expires_at := COALESCE(NEW.started_at, now()) + interval '14 days';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trials_set_expires_at_trigger ON trials;
CREATE TRIGGER trials_set_expires_at_trigger
  BEFORE INSERT ON trials
  FOR EACH ROW
  EXECUTE FUNCTION trials_set_expires_at();

-- ============================================================
-- 5) Permissões básicas
-- ============================================================
GRANT SELECT, INSERT, UPDATE ON trials TO authenticated;
