-- Rollback da migration 011 — Tabela de eventos de funil
DROP POLICY IF EXISTS "funnel_events: service-role only (deny authenticated)" ON funnel_events;
DROP INDEX IF EXISTS idx_funnel_events_name_created;
DROP TABLE IF EXISTS funnel_events;
