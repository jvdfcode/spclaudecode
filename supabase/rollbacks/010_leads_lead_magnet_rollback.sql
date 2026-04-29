-- Rollback da migration 010 — Tabela de leads
-- Aplicar apenas se 010 precisar ser revertida em produção.

DROP POLICY IF EXISTS "leads: service-role only (deny authenticated)" ON leads;
DROP INDEX IF EXISTS idx_leads_source_created;
DROP INDEX IF EXISTS idx_leads_email_created;
DROP TABLE IF EXISTS leads;
