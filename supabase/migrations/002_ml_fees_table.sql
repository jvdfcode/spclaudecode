-- ============================================================
-- SmartPreço — Migration 002: Tabela ml_fees
-- Idempotente: sim (IF NOT EXISTS)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS ml_fees (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_type  text         NOT NULL
                               CHECK (listing_type IN ('free', 'classic', 'premium')),
  installments  integer      NOT NULL DEFAULT 1
                               CHECK (installments BETWEEN 1 AND 12),
  fee_percent   numeric(5,2) NOT NULL
                               CHECK (fee_percent >= 0 AND fee_percent <= 100),
  category_id   text,
  category_name text,
  source_url    text,
  notes         text,
  verified_at   timestamptz  NOT NULL DEFAULT now(),
  updated_at    timestamptz  NOT NULL DEFAULT now(),

  CONSTRAINT ml_fees_category_consistency
    CHECK (
      (category_id IS NULL AND category_name IS NULL)
      OR (category_id IS NOT NULL AND category_name IS NOT NULL)
    ),
  CONSTRAINT ml_fees_unique_type_installments_category
    UNIQUE (listing_type, installments, category_id)
);

-- RLS: leitura pública (taxas são dados de referência, não confidenciais)
ALTER TABLE ml_fees ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ml_fees' AND policyname = 'ml_fees_read_all'
  ) THEN
    CREATE POLICY ml_fees_read_all ON ml_fees FOR SELECT USING (true);
  END IF;
END $$;

COMMENT ON TABLE ml_fees IS 'Taxas oficiais do Mercado Livre. Leitura pública, escrita restrita a admins.';
COMMENT ON COLUMN ml_fees.installments IS 'Número de parcelas. 1 = sem parcelamento (taxa base do tipo de anúncio).';
COMMENT ON COLUMN ml_fees.fee_percent IS 'Percentual da taxa sobre o valor de venda. Para installments>1: custo ADICIONAL à taxa base.';
COMMENT ON COLUMN ml_fees.category_id IS 'ID da categoria ML. NULL = taxa geral (aplica a todas as categorias).';
