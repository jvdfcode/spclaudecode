# Story TD-001-1 — Advisory locks em refresh OAuth ML e checkRateLimit

**Epic:** EPIC-TD-001
**Status:** Draft
**Owner:** @dev (sugerido; @data-engineer para a migration)
**Severidade débito:** CRITICAL
**Esforço estimado:** 2–3 dias

---

## Contexto

O SmartPreço possui duas funções críticas sem controle de concorrência, ambas garantidamente problemáticas em ambiente serverless (Vercel Edge/Node — múltiplas instâncias simultâneas sem estado compartilhado):

**DEBT-DB-H3 — `checkRateLimit` (`src/lib/rateLimit.ts:19-38`)**
A função lê o contador de requests do usuário em `rate_limit_log`, verifica se excede o limite, e insere uma nova linha. Em serverless, 10 requisições concorrentes chegam simultaneamente, todas lêem o mesmo valor (ex: 0 de 5), todas passam na verificação, e todas inserem — resultado: 10 inserções quando o limite é 5. Rate limiting completamente ineficaz sob carga concorrente.

**DEBT-DB-C3 — refresh OAuth ML (`src/lib/ml-api.ts:42-62`)**
Quando o token ML está expirado, a função busca um novo token da API OAuth e persiste em `ml_tokens`. Se dois requests simultâneos chegam com token expirado, ambos iniciam refresh. O segundo sobrescreve o token que o primeiro acabou de persistir — enquanto o primeiro ainda está usando o token que ele obteve. Falha silenciosa e não determinística na busca de preços de mercado.

**Solução comum:** advisory locks no PostgreSQL via `pg_advisory_xact_lock(hashtext(user_id::text))`. O Supabase suporta advisory locks nativamente. A migration 009 implementa a função helper `acquire_user_lock(uuid)` em PL/pgSQL que encapsula a chamada ao lock.

**SQL pronto** disponível em `docs/reviews/db-specialist-review.md` — incluindo a função `acquire_user_lock`, policy explícita para `rate_limit_log`, e CHECK constraint em `cost_data`/`result_data` (DEBT-DB-M3 — incluído nesta migration por ser parte da mesma migration 009 conforme Seção 9 do `technical-debt-assessment.md`).

---

## Débitos cobertos

- **DEBT-DB-H3** (escalado para CRITICAL) — `checkRateLimit` sem lock — race garantida em serverless (`src/lib/rateLimit.ts:19-38`)
- **DEBT-DB-C3** (CRITICAL) — OAuth ML refresh sem lock — race condition (`src/lib/ml-api.ts:42-62`)
- **DEBT-DB-C1** (CRITICAL parcial) — `rate_limit_log` com RLS habilitado e zero policies (`008_rate_limit_log.sql:12-13`) — policy explícita vai nesta migration conforme assessment
- **DEBT-DB-M3** (HIGH) — JSONB `cost_data`/`result_data` sem CHECK constraint (`migration 004` + `src/lib/supabase/skus.ts`)

---

## Acceptance Criteria

- [ ] **AC1:** Migration `009_advisory_locks_and_jsonb_check.sql` aplicada com sucesso via `supabase db push`; arquivo de rollback `009_advisory_locks_and_jsonb_check_rollback.sql` presente em `supabase/migrations/`
- [ ] **AC2:** Função `acquire_user_lock(uuid)` existe no schema `public`; chamada direta `SELECT acquire_user_lock('00000000-0000-0000-0000-000000000001')` retorna sem erro
- [ ] **AC3:** Teste de concorrência em `checkRateLimit`: 10 chamadas paralelas com `limit=5` para o mesmo `user_id` nunca resultam em mais de 5 linhas em `rate_limit_log` para aquele usuário naquela janela de tempo
- [ ] **AC4:** Teste de concorrência em refresh OAuth: 5 chamadas paralelas a `refreshMLToken` com token expirado resultam em exatamente 1 refresh chamando a API OAuth externa; as demais aguardam e usam o token atualizado
- [ ] **AC5:** Policy explícita em `rate_limit_log` documentada via `COMMENT ON TABLE` e policy RLS criada — `DEBT-DB-C1` fechado
- [ ] **AC6:** CHECK constraint em `cost_data` e `result_data` validando estrutura JSONB mínima (`{'type': '...'}`) — `DEBT-DB-M3` fechado
- [ ] **AC7:** `pnpm typecheck`, `pnpm lint`, `pnpm test` passando após merge
- [ ] **AC8:** Sem alteração nos contratos públicos `/api/ml-search` e `/api/skus/[id]`

---

## Tasks

- [ ] **T1:** Ler `docs/reviews/db-specialist-review.md` — extrair SQL completo para migration 009 (função `acquire_user_lock`, policy `rate_limit_log`, CHECK constraints JSONB)
- [ ] **T2:** Criar `supabase/migrations/009_advisory_locks_and_jsonb_check.sql` com:
  - `CREATE OR REPLACE FUNCTION acquire_user_lock(p_user_id uuid) RETURNS void` usando `pg_advisory_xact_lock(hashtext(p_user_id::text))`
  - Policy explícita em `rate_limit_log` (INSERT permitido para `auth.uid()` correspondente)
  - `COMMENT ON TABLE rate_limit_log IS '...'`
  - CHECK constraint em `sku_calculations.cost_data` e `sku_calculations.result_data`
- [ ] **T3:** Criar `supabase/migrations/009_advisory_locks_and_jsonb_check_rollback.sql` com reversão completa
- [ ] **T4:** Refatorar `src/lib/rateLimit.ts:19-38` — chamar `acquire_user_lock(userId)` via `supabase.rpc('acquire_user_lock', { p_user_id: userId })` antes da leitura do contador; envolver em transaction se possível
- [ ] **T5:** Refatorar `src/lib/ml-api.ts:42-62` — adquirir lock via `acquire_user_lock(userId)` antes de checar expiração e iniciar refresh; garantir que múltiplos callers com token expirado esperem o primeiro terminar
- [ ] **T6:** Escrever teste de concorrência para `checkRateLimit` em `tests/unit/rateLimit.test.ts` — usar `Promise.all` com 10 chamadas paralelas, mockar Supabase para simular comportamento de lock, verificar AC3
- [ ] **T7:** Escrever teste de concorrência para `refreshMLToken` em `tests/unit/mlApi.test.ts` — 5 chamadas paralelas, mock da API OAuth externa, verificar AC4
- [ ] **T8:** Aplicar migration via `supabase db push` em ambiente de dev; verificar com `supabase migration list`
- [ ] **T9:** Executar `pnpm typecheck && pnpm lint && pnpm test`; corrigir eventuais falhas

---

## File List

_(preenchido durante implementação)_

- `supabase/migrations/009_advisory_locks_and_jsonb_check.sql` — criado
- `supabase/migrations/009_advisory_locks_and_jsonb_check_rollback.sql` — criado
- `src/lib/rateLimit.ts` — modificado (T4)
- `src/lib/ml-api.ts` — modificado (T5)
- `tests/unit/rateLimit.test.ts` — criado ou modificado (T6)
- `tests/unit/mlApi.test.ts` — criado ou modificado (T7)

---

## Notas técnicas

**Advisory lock pattern (PL/pgSQL):**
```sql
CREATE OR REPLACE FUNCTION acquire_user_lock(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));
END;
$$;
```
O lock é automaticamente liberado no fim da transaction — sem necessidade de `pg_advisory_xact_unlock`.

**Importante:** `pg_advisory_xact_lock` requer que a chamada Supabase esteja dentro de uma transaction explícita. Verificar se `supabase.rpc()` do cliente JS suporta transaction wrapping, ou usar `supabase.from('...').select()` dentro de um RPC que já encapsula a operação com o lock.

**Alternativa se advisory locks não estiverem disponíveis no tier:** usar `SELECT ... FOR UPDATE` em uma linha de controle dedicada na `rate_limit_log` (ver `docs/reviews/db-specialist-review.md` para ambas as opções).

**Referências:**
- `docs/reviews/db-specialist-review.md` — SQL completo da migration 009 (Dara, Fase 5)
- `technical-debt-assessment.md` Seção 9 — sequência de migrations proposta
- `src/lib/rateLimit.ts:19-38` — código atual sem lock
- `src/lib/ml-api.ts:42-62` — código atual de refresh sem lock

---

## Riscos / Plano de rollback

**Risco principal:** Lock muito agressivo pode serializar requests legítimos concorrentes do mesmo usuário, degradando latência percebida.

**Mitigação:** Advisory lock libera imediatamente após a transaction (não serializa toda a sessão do usuário); window de contenção é milissegundos — aceitável vs. o risco atual de race condition.

**Rollback:**
1. Reverter commits de `rateLimit.ts` e `ml-api.ts` via `git revert`
2. Aplicar `009_advisory_locks_and_jsonb_check_rollback.sql` via `supabase db push`
3. Verificar comportamento em staging antes de reaplicar

---

*Story gerada por @pm (Morgan) — EPIC-TD-001 — Brownfield Discovery Fase 10 — 2026-04-27*
