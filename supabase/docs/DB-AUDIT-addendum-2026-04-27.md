# DB Audit — Addendum 2026-04-27

**Workflow:** brownfield-discovery (AIOX) — Fase 2 (re-run)
**Agente:** @data-engineer (Dara)
**Base:** `supabase/docs/DB-AUDIT.md` (2026-04-23)

> Este adendo refina o documento base com as 2 migrations novas (`007_performance_indexes.sql`, `008_rate_limit_log.sql`) e complementa achados.

## 1. O que mudou desde 2026-04-23

| Mudança | Status | Documento base referenciava |
|---------|--------|------------------------------|
| Migration `007_performance_indexes.sql` aplicada | ✅ Implementada | M2 (índice `(user_id, status)`) e M4 (índice `(user_id, updated_at DESC)`) — agora **resolvidos** |
| RLS de `sku_calculations` mudou de `IN` para `EXISTS` | ✅ Implementada | nota em "Avaliação de RLS" — agora **resolvido** |
| Migration `008_rate_limit_log.sql` aplicada | ✅ Implementada | A3 (rate limiting) — parcial; ver DB-C1 |
| Trigger `set_updated_at` adicionado em `ml_tokens` | ✅ | B2 — **resolvido** |
| Edge Function `/api/cron/cleanup-ml-cache` + cron Vercel `0 3 * * *` | ✅ Parcial | A2 (cleanup `ml_search_cache`) — implementado mas com gaps (ver DB-C2) |

## 2. Débitos remanescentes / novos

### CRITICAL (novos / refinados)

**DEBT-DB-C1** — `rate_limit_log` com RLS habilitado e zero policies
- `008_rate_limit_log.sql:12-13` — `ALTER TABLE … ENABLE ROW LEVEL SECURITY` sem policies.
- Funciona porque `lib/rateLimit.ts` usa `createServiceSupabase()`, mas é frágil/implícito.
- Fix: documentar com `COMMENT ON TABLE rate_limit_log IS 'Acesso somente via service_role'` ou adicionar policy explícita restritiva.

**DEBT-DB-C2** — `ml_search_cache` sem DELETE policy + cron sem alarme
- Cleanup só funciona se cron Vercel rodar; sem fallback DB-side.
- Fix: (a) Sentry alert no handler do cron; (b) habilitar `pg_cron` como redundância (M007 deixa SQL pronto comentado).

**DEBT-DB-C3** — OAuth ML: refresh token sem lock (race)
- `src/lib/ml-api.ts:19-36` — `refreshToken()` sem `SELECT … FOR UPDATE` ou advisory lock.
- Concurrent refresh pode sobrescrever tokens ou ambos falharem.
- Fix: `pg_advisory_xact_lock(hashtext(user_id::text))` em transação; ou serializar via `UPDATE … WHERE expires_at < now() RETURNING …`.

### HIGH (refinados)

**DEBT-DB-H1** — `ml_tokens.user_id` indexação implícita
- `UNIQUE` cria índice único — verificar `pg_indexes` em produção. Se ausente, criar `idx_ml_tokens_user_id`.

**DEBT-DB-H2** — `listSkus` traz `sku_calculations (*)` (N+1)
- `src/lib/supabase/skus.ts:90-104`. M1 do doc base permanece.
- Fix: LATERAL JOIN com `LIMIT 1`.

**DEBT-DB-H3** — `checkRateLimit` sem proteção contra race
- `src/lib/rateLimit.ts:10-40` — count antes de INSERT.
- Fix: advisory lock ou contador atomic.

### MEDIUM (refinados)

- **DEBT-DB-M1** — `ml_fees` ainda só com taxas gerais (B1 base permanece).
- **DEBT-DB-M2** — `pg_cron` não habilitado (defense-in-depth).
- **DEBT-DB-M3** — JSONB `cost_data`/`result_data` sem CHECK (B3 base permanece).
- **DEBT-DB-M4** — `db-types-drift` apenas em CI/PR; sem pre-commit hook.

### LOW

- **DEBT-DB-L1** — Tokens em plain text (Supabase encripta at-rest; SSL no transit). Documentar.
- **DEBT-DB-L2** — Sem audit trail genérico (`pgaudit` ou triggers manuais).
- **DEBT-DB-L3** — Validar via `EXPLAIN ANALYZE` que índices de M007 estão sendo usados.

## 3. Resolvidos desde 2026-04-23

| Item base | Status |
|-----------|--------|
| M2 — Índice `skus.status` | ✅ Resolvido (M007) |
| M4 — Índice `skus.updated_at` | ✅ Resolvido (M007) |
| RLS `sku_calculations` IN→EXISTS | ✅ Resolvido (M007) |
| B2 — Trigger `updated_at` em `ml_tokens` | ✅ Resolvido (M007) |
| A2 — Cleanup `ml_search_cache` | 🟡 Parcial (cron Vercel — sem alarme; DEBT-DB-C2) |
| A3 — Rate limiting | 🟡 Parcial (`rate_limit_log` + `lib/rateLimit.ts`; DEBT-DB-C1, H3) |

## 4. Ações priorizadas (sprint atual)

1. DEBT-DB-C1 (documentar/policy `rate_limit_log`)
2. DEBT-DB-C2 (alarme cron; `pg_cron` opcional)
3. DEBT-DB-C3 (lock refresh OAuth)
4. DEBT-DB-H2 (LATERAL `listSkus`)

---
*Re-run brownfield-discovery — Fase 2 — 2026-04-27*
