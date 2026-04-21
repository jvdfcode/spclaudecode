-- Tabela de SKUs do vendedor
CREATE TABLE IF NOT EXISTS skus (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  notes         text,
  status        text NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft','viable','attention','not_viable','for_sale')),
  is_for_sale   boolean NOT NULL DEFAULT false,
  adopted_price numeric(12,2),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Histórico de cálculos por SKU
CREATE TABLE IF NOT EXISTS sku_calculations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku_id         uuid NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
  cost_data      jsonb NOT NULL,
  result_data    jsonb NOT NULL,
  sale_price     numeric(12,2) NOT NULL,
  listing_type   text NOT NULL CHECK (listing_type IN ('free','classic','premium')),
  margin_percent numeric(8,4),
  roi_percent    numeric(8,4),
  is_viable      boolean,
  is_adopted     boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_skus_user_id ON skus(user_id);
CREATE INDEX IF NOT EXISTS idx_sku_calculations_sku_id ON sku_calculations(sku_id);

-- RLS
ALTER TABLE skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE sku_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skus: usuário acessa apenas os seus"
  ON skus FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "sku_calculations: acesso via sku do usuário"
  ON sku_calculations FOR ALL
  USING (
    sku_id IN (SELECT id FROM skus WHERE user_id = auth.uid())
  )
  WITH CHECK (
    sku_id IN (SELECT id FROM skus WHERE user_id = auth.uid())
  );

-- Trigger: updated_at automático em skus
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS skus_updated_at ON skus;
CREATE TRIGGER skus_updated_at
  BEFORE UPDATE ON skus
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
