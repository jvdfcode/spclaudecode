-- Índices compostos para skus (filtro status + ordenação updated_at)
CREATE INDEX IF NOT EXISTS idx_skus_user_status
  ON skus(user_id, status);

CREATE INDEX IF NOT EXISTS idx_skus_user_updated
  ON skus(user_id, updated_at DESC);

-- Fix RLS sku_calculations: IN() subquery → EXISTS()
DROP POLICY IF EXISTS "sku_calculations: acesso via sku do usuário" ON sku_calculations;
CREATE POLICY "sku_calculations: acesso via sku do usuário"
  ON sku_calculations FOR ALL
  USING (EXISTS (
    SELECT 1 FROM skus WHERE id = sku_calculations.sku_id AND user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM skus WHERE id = sku_calculations.sku_id AND user_id = auth.uid()
  ));

-- Trigger updated_at em ml_tokens (audit gap B2)
DROP TRIGGER IF EXISTS ml_tokens_updated_at ON ml_tokens;
CREATE TRIGGER ml_tokens_updated_at
  BEFORE UPDATE ON ml_tokens FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Cleanup cache expirado (requer pg_cron habilitado no Supabase dashboard):
-- SELECT cron.schedule('purge-ml-search-cache','0 * * * *',
--   $$DELETE FROM ml_search_cache WHERE expires_at < now()$$);
