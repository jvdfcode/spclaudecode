# VIAB-R1-1 — Fix race condition OAuth ML (advisory lock acessível)

**Epic:** EPIC-VIAB-R1 (Recomendações 30 dias do relatório de viabilidade 2026-04-30)
**Status:** Draft
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

1. [ ] `acquire_user_lock(p_user_id, p_scope)` é executável pelo role `authenticated` em produção (verificar via psql ou supabase migration list)
2. [ ] Chamada `supabase.rpc('acquire_user_lock', { p_user_id, p_scope: 'ml_token_refresh' })` em `src/lib/ml-api.ts` retorna `true` (lock obtido) sem `permission denied`
3. [ ] Teste de concorrência: 2+ requests simultâneas para `getMlAccessToken(userId)` resultam em **exatamente 1** chamada a `POST /oauth/token` (verificar via mock + log de Sentry)
4. [ ] Fallback silencioso em `ml-api.ts:77` removido OU substituído por log explícito de erro (não engolir falha de lock)
5. [ ] Sem regressão: usuário existente não desconecta após deploy (smoke test manual com conta ML conectada)
6. [ ] `npm run typecheck` e `npm run lint` passam
7. [ ] Migration aplicada em prod (Supabase project `jvdfcode/smartpreco`) e tipos regenerados

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

- [ ] AC 1-7 todos checados
- [ ] Migration commitada com mensagem `feat(db): grant acquire_user_lock to authenticated [VIAB-R1-1]`
- [ ] PR aberto para `main` com review @qa (gate PASS)
- [ ] Sentry sem erros novos por 48h pós-deploy
- [ ] Story atualizada com File List final + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-01 | Orion (aiox-master) | Story criada a partir de F2 Finding 1 |
