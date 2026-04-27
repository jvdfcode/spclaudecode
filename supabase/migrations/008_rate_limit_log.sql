-- Tabela para rate limiting persistente entre instâncias serverless
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid        NOT NULL,
  endpoint   text        NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_log_lookup
  ON rate_limit_log(user_id, endpoint, created_at);

ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;
-- Service role bypasses RLS; nenhum usuário acessa diretamente
