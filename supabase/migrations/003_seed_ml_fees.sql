-- ============================================================
-- SmartPreço — Migration 003: Seed Taxas Mercado Livre
-- Fonte: https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338
-- Fonte: https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077
-- Verificado em: 2026-04-20
-- Idempotente: INSERT ... ON CONFLICT DO UPDATE
-- ============================================================

-- Taxas base (1x sem parcelamento) por tipo de anúncio
INSERT INTO ml_fees (listing_type, installments, fee_percent, source_url, notes, verified_at)
VALUES
  ('free',    1,  0.00, 'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338', 'Anúncio Gratuito: sem comissão.', '2026-04-20'),
  ('classic', 1, 11.00, 'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338', 'Anúncio Clássico: taxa geral de 11%.', '2026-04-20'),
  ('premium', 1, 17.00, 'https://www.mercadolivre.com.br/ajuda/custo-de-vender_1338', 'Anúncio Premium: taxa geral de 17%.', '2026-04-20')
ON CONFLICT (listing_type, installments, category_id)
DO UPDATE SET
  fee_percent  = EXCLUDED.fee_percent,
  source_url   = EXCLUDED.source_url,
  notes        = EXCLUDED.notes,
  verified_at  = EXCLUDED.verified_at,
  updated_at   = now();

-- Custos de parcelamento ADICIONAIS (Clássico)
INSERT INTO ml_fees (listing_type, installments, fee_percent, source_url, notes, verified_at)
VALUES
  ('classic',  2,  3.89, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 2x. ADICIONAL à comissão de 11%.', '2026-04-20'),
  ('classic',  3,  5.05, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 3x.', '2026-04-20'),
  ('classic',  4,  5.83, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 4x.', '2026-04-20'),
  ('classic',  5,  6.36, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 5x.', '2026-04-20'),
  ('classic',  6,  6.43, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 6x.', '2026-04-20'),
  ('classic',  7,  8.03, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 7x.', '2026-04-20'),
  ('classic',  8,  8.51, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 8x.', '2026-04-20'),
  ('classic',  9,  8.95, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 9x.', '2026-04-20'),
  ('classic', 10,  9.21, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 10x.', '2026-04-20'),
  ('classic', 11,  9.63, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 11x.', '2026-04-20'),
  ('classic', 12,  9.99, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Clássico 12x.', '2026-04-20')
ON CONFLICT (listing_type, installments, category_id)
DO UPDATE SET
  fee_percent  = EXCLUDED.fee_percent,
  source_url   = EXCLUDED.source_url,
  notes        = EXCLUDED.notes,
  verified_at  = EXCLUDED.verified_at,
  updated_at   = now();

-- Custos de parcelamento ADICIONAIS (Premium)
INSERT INTO ml_fees (listing_type, installments, fee_percent, source_url, notes, verified_at)
VALUES
  ('premium',  2,  3.89, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 2x. ADICIONAL à comissão de 17%.', '2026-04-20'),
  ('premium',  3,  5.05, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 3x.', '2026-04-20'),
  ('premium',  4,  5.83, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 4x.', '2026-04-20'),
  ('premium',  5,  6.36, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 5x.', '2026-04-20'),
  ('premium',  6,  6.43, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 6x.', '2026-04-20'),
  ('premium',  7,  8.03, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 7x.', '2026-04-20'),
  ('premium',  8,  8.51, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 8x.', '2026-04-20'),
  ('premium',  9,  8.95, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 9x.', '2026-04-20'),
  ('premium', 10,  9.21, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 10x.', '2026-04-20'),
  ('premium', 11,  9.63, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 11x.', '2026-04-20'),
  ('premium', 12,  9.99, 'https://www.mercadolivre.com.br/ajuda/custo-parcelamento_3077', 'Parcelamento Premium 12x.', '2026-04-20')
ON CONFLICT (listing_type, installments, category_id)
DO UPDATE SET
  fee_percent  = EXCLUDED.fee_percent,
  source_url   = EXCLUDED.source_url,
  notes        = EXCLUDED.notes,
  verified_at  = EXCLUDED.verified_at,
  updated_at   = now();
