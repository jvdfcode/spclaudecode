CREATE TABLE IF NOT EXISTS ml_search_cache (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash   text NOT NULL UNIQUE,
  query_text   text NOT NULL,
  results_json jsonb NOT NULL,
  result_count int NOT NULL DEFAULT 0,
  expires_at   timestamptz NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ml_search_cache_query_hash ON ml_search_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_ml_search_cache_expires_at ON ml_search_cache(expires_at);

-- Cache é leitura pública (anon pode ler), escrita apenas via service role / server
ALTER TABLE ml_search_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ml_search_cache: leitura pública"
  ON ml_search_cache FOR SELECT
  USING (true);

CREATE POLICY "ml_search_cache: escrita autenticada"
  ON ml_search_cache FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "ml_search_cache: update autenticado"
  ON ml_search_cache FOR UPDATE
  USING (auth.role() = 'authenticated');
