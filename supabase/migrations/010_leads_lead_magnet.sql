-- Migration 010 — Tabela de leads do Lead Magnet (MKT-001-1)
-- Origem: roundtable Bloco I + EPIC-MKT-001
-- Idempotente. Rollback em 010_leads_lead_magnet_rollback.sql.

CREATE TABLE IF NOT EXISTS leads (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text        NOT NULL,
  source      text        NOT NULL DEFAULT 'lead-magnet',
  -- Snapshot do cálculo que motivou o lead (jsonb permite analytics flexível)
  context     jsonb,
  -- Aceite explícito do opt-in LGPD (true = aceitou; false/null = recusou)
  lgpd_optin  boolean     NOT NULL DEFAULT false,
  user_agent  text,
  created_at  timestamptz DEFAULT now() NOT NULL
);

-- Email pode repetir (mesmo lead pode submeter mais de uma vez ao longo do tempo);
-- de-duplicação fica para o pipeline de marketing.
CREATE INDEX IF NOT EXISTS idx_leads_email_created
  ON leads(email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_source_created
  ON leads(source, created_at DESC);

-- CHECK estrutural mínimo no contexto JSONB (mesmo padrão da migration 009)
ALTER TABLE leads
  DROP CONSTRAINT IF EXISTS leads_context_object_or_null;
ALTER TABLE leads
  ADD CONSTRAINT leads_context_object_or_null
  CHECK (context IS NULL OR jsonb_typeof(context) = 'object');

-- RLS — escrita anônima permitida apenas via service_role (server action).
-- Authenticated/anon não acessam diretamente; emails ficam privados.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads: service-role only (deny authenticated)"
  ON leads;

CREATE POLICY "leads: service-role only (deny authenticated)"
  ON leads
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE leads IS
  'Leads capturados pelo Lead Magnet (/calculadora-livre). '
  'Acesso somente via service_role. Source identifica o canal de origem.';
