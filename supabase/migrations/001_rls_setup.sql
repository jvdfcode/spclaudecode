-- Habilitar RLS nas tabelas de usuário
-- (tabelas serão criadas em story 4.1, mas RLS é preparado aqui)
ALTER TABLE IF EXISTS skus ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sku_calculations ENABLE ROW LEVEL SECURITY;
