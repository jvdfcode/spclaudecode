-- Migration 011 — Tabela de eventos de funil (MKT-001-5)
-- Origem: roundtable Bloco I + EPIC-MKT-001 + Story MKT-001-5
-- Idempotente. Rollback em 011_funnel_events_rollback.sql.

CREATE TABLE IF NOT EXISTS funnel_events (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  payload     jsonb       NOT NULL DEFAULT '{}'::jsonb,
  ts_client   timestamptz NOT NULL,
  user_agent  text,
  referer     text,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- Para queries do dashboard de KPIs por evento × dia
CREATE INDEX IF NOT EXISTS idx_funnel_events_name_created
  ON funnel_events(name, created_at DESC);

-- CHECK estrutural mínimo no payload (mesmo padrão das migrations 009/010)
ALTER TABLE funnel_events
  DROP CONSTRAINT IF EXISTS funnel_events_payload_object;
ALTER TABLE funnel_events
  ADD CONSTRAINT funnel_events_payload_object
  CHECK (jsonb_typeof(payload) = 'object');

-- RLS — eventos são escritos via service_role pelo /api/track.
-- Nenhum acesso direto de authenticated/anon (nem leitura nem escrita).
ALTER TABLE funnel_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "funnel_events: service-role only (deny authenticated)"
  ON funnel_events;

CREATE POLICY "funnel_events: service-role only (deny authenticated)"
  ON funnel_events
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE funnel_events IS
  'Eventos do funil capturados via /api/track (lead_magnet_calculated, '
  'lead_captured, pricing_viewed, pricing_plan_clicked). '
  'Acesso somente via service_role.';
