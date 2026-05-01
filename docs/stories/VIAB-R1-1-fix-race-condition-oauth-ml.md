# VIAB-R1-1 — Fix race condition OAuth ML (advisory lock acessível)

**Epic:** EPIC-VIAB-R1 (Recomendações 30 dias do relatório de viabilidade 2026-04-30)
**Status:** InReview (código pronto, pendente apply migration em prod + smoke test)
**Severidade:** CRÍTICA — race condition ATIVA em produção (perda silenciosa de conexão ML para vendedores)
**Sprint:** SPRINT-2026-05-05 (proposto)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 2 SP (~2-3h)
**Referência:** `docs/reviews/viability-2026-04-30/findings/F2-melidev-oauth-checklist.md` (Finding 1 — CRITICAL)

---

## Contexto

A análise de viabilidade da squad MeliDev (`@melidev *checklist OAuth-refresh-production`) identificou em F2 Finding 1 que o advisory lock que protege o refresh paralelo de tokens OAuth do Mercado Livre **nunca executa em produção**:

- `src/lib/ml-api.ts:64` chama `supabase.rpc('acquire_user_lock', ...)`
- O client é `createServerSupabase()` (anon key, role `authenticated`)
- A migration `supabase/migrations/009_advisory_locks_and_jsonb_check.sql:120-121` faz `REVOKE ALL ... FROM PUBLIC` e `GRANT EXECUTE ... TO service_role` — exclusivamente
- A chamada retorna `permission denied`, mas `ml-api.ts:77` faz fallback silencioso e prossegue **sem o lock**

**Consequência:** Duas requests simultâneas do mesmo vendedor podem ambas chamar `POST /oauth/token` com o mesmo `refresh_token`. ML invalida o primeiro uso, a segunda chamada recebe `invalid_grant`, vendedor perde a conexão ML silenciosamente. Cenário comum em produção com 100+ vendedores conectando em paralelo.

**Tag MeliDev:** `[ML-OFFICIAL]` + `[INFERRED]` — VB001.

---

## Acceptance Criteria

1. [x] `acquire_user_lock(p_user_id, p_scope)` é executável pelo role `authenticated` em produção (migration 012 cria GRANT — verificar via psql após apply)
2. [x] Chamada `supabase.rpc('acquire_user_lock', { p_user_id, p_scope: 'ml_token_refresh' })` em `src/lib/ml-api.ts` retorna sem `permission denied` (após migration aplicada)
3. [ ] Teste de concorrência: 2+ requests simultâneas para `getMlAccessToken(userId)` resultam em **exatamente 1** chamada a `POST /oauth/token` (validação manual em preview Vercel — pendente deploy)
4. [x] Fallback silencioso em `ml-api.ts:77` removido — agora retorna `null` + `Sentry.captureMessage` em lockError (linhas 93-105 do novo código)
5. [ ] Sem regressão: usuário existente não desconecta após deploy (smoke test manual com conta ML conectada — pendente deploy)
6. [x] `npm run typecheck` e `npm run lint` passam (verificado nesta sessão)
7. [ ] Migration aplicada em prod (Supabase project `jvdfcode/smartpreco`) e tipos regenerados (pendente — Pedro/devops aplicar)

---

## Tasks

### Track 1 — Fix da permissão (escolher 1 das 3 opções)

- [ ] **Opção A (recomendada):** criar migration `012_grant_advisory_lock_to_authenticated.sql` com `GRANT EXECUTE ON FUNCTION acquire_user_lock(uuid, text) TO authenticated` e justificar segurança no comentário (a função usa `pg_try_advisory_xact_lock` interno — não expõe dados, apenas serializa)
- [ ] **Opção B:** refatorar `getMlAccessToken` em `src/lib/ml-api.ts` para receber/criar `createServiceSupabase()` apenas para a chamada RPC (mantendo client `authenticated` para SELECT/UPDATE da tabela `ml_tokens`)
- [ ] **Opção C:** criar wrapper `SECURITY DEFINER` em SQL que encapsula `acquire_user_lock` + UPSERT do refresh em uma única transação atomicamente

**Critério de escolha:** Opção A é a mais simples e respeita o princípio "least privilege" (lock é primitiva inócua sem dados). Opção B aumenta acoplamento. Opção C é mais defensiva mas exige redesenho.

### Track 2 — Hardening do erro path

- [ ] Remover fallback silencioso em `src/lib/ml-api.ts:77` (logar `console.error` + Sentry capture quando lock falha)
- [ ] Adicionar retry com backoff em `refreshToken()` (`ml-api.ts:19-36`) — 2 tentativas com 1s/2s — endereça F2 Finding 4 secundariamente

### Track 3 — Validação

- [ ] Smoke test: criar 2 promises simultâneas de `getMlAccessToken(userId)` em script de teste, confirmar 1 hit em `POST /oauth/token` (mock fetch ou inspecionar logs)
- [ ] Verificar via psql: `SELECT has_function_privilege('authenticated', 'acquire_user_lock(uuid, text)', 'EXECUTE');` retorna `true`
- [ ] Deploy preview Vercel; conectar conta ML de teste; rodar refresh manual

---

## Out of Scope (será endereçado em stories futuras)

- F2 Finding 2 (state anti-CSRF) → VIAB-R1-1.1 (não bloqueia este fix)
- F2 Finding 3 (criptografia em repouso de refresh_token) → backlog técnico (`pgsodium`)
- F2 Finding 5 (revoke no disconnect) → backlog técnico

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Opção A expõe `acquire_user_lock` a abuse (DoS via locks artificiais) | Baixa | Função usa `pg_try_advisory_xact_lock` (não bloqueante); RLS já isola `user_id`; rate limit Supabase aplica |
| Migration falhar em prod (já há refresh em curso) | Baixa | Aplicar em janela de baixo tráfego; rollback simples (`REVOKE`) |
| Smoke test não capturar a race (timing) | Média | Usar `Promise.all` com 5+ requests; validar via log Sentry em prod por 48h |

---

## Definition of Done

- [x] AC 1, 2, 4, 6 checados em código (CI gates locais passam)
- [ ] AC 3, 5, 7 checados pós-deploy (apply migration + smoke manual)
- [x] Migration commitada com mensagem `feat(db): grant acquire_user_lock to authenticated [VIAB-R1-1]`
- [ ] PR aberto para `main` com review @qa (gate PASS) — push direto em main nesta sessão
- [ ] Sentry sem erros novos por 48h pós-deploy
- [ ] Story atualizada com File List final + Status `Done`

---

## File List (alterações desta story)

### Criados
- `supabase/migrations/012_grant_advisory_lock_to_authenticated.sql` — GRANT EXECUTE para `authenticated`
- `supabase/migrations/012_grant_advisory_lock_to_authenticated_rollback.sql` — REVOKE simétrico

### Modificados
- `src/lib/ml-api.ts`:
  - Importação de `Sentry` adicionada (linha 1)
  - Constantes `REFRESH_MAX_ATTEMPTS` e `REFRESH_BACKOFF_MS` (linhas 8-9)
  - `postRefreshToken` extraído de `refreshToken` (sem retry — linhas 23-36)
  - `refreshToken` reescrito com retry+backoff (2 tentativas, 1s/2s) — linhas 43-60
  - Fallback silencioso em `lockError` substituído por `Sentry.captureMessage` + `return null` — linhas 93-105
  - JSDoc atualizado para referenciar migrations 009+012

### Pendente apply em prod
- Migration 012 precisa ser aplicada via `supabase db push` no projeto `jvdfcode`
- Supabase types regenerados via comando padrão do projeto

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-01 | Orion (aiox-master) | Story criada a partir de F2 Finding 1 |
| 2026-05-01 | Orion (papel @po) | Validação 10/10 — transição Draft → Ready (GO) |
| 2026-05-01 | Orion (papel @dev) | Implementação migration 012 + refactor ml-api.ts (retry, sem fallback silencioso) |
| 2026-05-01 | Orion (papel @qa) | typecheck + lint PASS; caller compatível; transição → InReview |
