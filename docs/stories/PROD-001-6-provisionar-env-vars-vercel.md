# Story PROD-001-6 — Provisionar 11 env vars no Vercel production

**Epic:** EPIC-PROD-001
**Status:** Draft
**Owner:** Pedro Emilio
**Severidade origem:** B2
**Esforço estimado:** 2 SP

---

## Contexto

Gage (04-devops-gage.md, problema 2) e Aria (01-architect-aria.md, problema 1) convergem: as variáveis de ambiente de produção não existem no projeto Vercel do team `jvdfcode`. Sem elas, o build da Vercel falha silenciosamente ou o app quebra em produção — Supabase sem URL, Sentry sem DSN, ML sem credenciais. Aria documenta especificamente que `SENTRY_DSN` (server-side) e `NEXT_PUBLIC_SENTRY_DSN` (client-side) são vars distintas e ambas obrigatórias: se só uma for configurada, um dos três runtimes (client/server/edge) fica surdo para erros.

Depende de PROD-001-1 (valores do Supabase) e PROD-001-5 (projeto linkado ao Vercel).

---

## Acceptance Criteria

- [ ] `vercel env ls --scope jvdfcode` lista exatamente 11 variáveis com target `Production`
- [ ] As 11 vars listadas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ACCESS_TOKEN`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, `ML_APP_ID`, `ML_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_APP_URL` tem valor `https://smartpreco.app`
- [ ] `.env.example` atualizado com todas as 11 vars e comentários de contexto (server/client/edge/build-time)

---

## Tasks

- [ ] Confirmar valores de Supabase (de PROD-001-1): URL, ANON_KEY, SERVICE_ROLE_KEY, ACCESS_TOKEN
- [ ] Confirmar valores de Sentry: DSN (server), NEXT_PUBLIC DSN (client), ORG, PROJECT
- [ ] Confirmar valores ML: ML_APP_ID, ML_CLIENT_SECRET
- [ ] Executar sequência `vercel env add` para cada uma das 11 vars (ver Notas técnicas)
- [ ] `vercel env ls --scope jvdfcode` — confirmar 11 vars em Production
- [ ] Atualizar `.env.example` com todas as 11 entradas + comentários de contexto (não commitar valores reais)
- [ ] Commit: `docs: update .env.example with all 11 production env vars (B2)`

---

## File List

- `.env.example` (atualizado com 11 entradas + comentários)

---

## Notas técnicas

Sequência canônica de Gage (Bloco 3):
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production --scope jvdfcode
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --scope jvdfcode
vercel env add SUPABASE_SERVICE_ROLE_KEY production --scope jvdfcode
vercel env add SUPABASE_ACCESS_TOKEN production --scope jvdfcode
vercel env add NEXT_PUBLIC_SENTRY_DSN production --scope jvdfcode
vercel env add SENTRY_DSN production --scope jvdfcode
vercel env add SENTRY_ORG production --scope jvdfcode
vercel env add SENTRY_PROJECT production --scope jvdfcode
vercel env add ML_APP_ID production --scope jvdfcode
vercel env add ML_CLIENT_SECRET production --scope jvdfcode
vercel env add NEXT_PUBLIC_APP_URL production --scope jvdfcode
# valor de NEXT_PUBLIC_APP_URL: https://smartpreco.app
```

Atenção de Aria (recomendação 3): `SENTRY_DSN` (server/edge) e `NEXT_PUBLIC_SENTRY_DSN` (client) são vars distintas. Ambas precisam estar configuradas. Ver `sentry.server.config.ts:4` (usa `SENTRY_DSN`) e `sentry.client.config.ts:4` (usa `NEXT_PUBLIC_SENTRY_DSN`).

`CRON_SECRET` é adicionado em PROD-001-7, não aqui.

---

## Rollback

```bash
# Remover cada var individualmente se valor incorreto for provisionado
vercel env rm NEXT_PUBLIC_SUPABASE_URL production --scope jvdfcode
vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY production --scope jvdfcode
vercel env rm SUPABASE_SERVICE_ROLE_KEY production --scope jvdfcode
vercel env rm SUPABASE_ACCESS_TOKEN production --scope jvdfcode
vercel env rm NEXT_PUBLIC_SENTRY_DSN production --scope jvdfcode
vercel env rm SENTRY_DSN production --scope jvdfcode
vercel env rm SENTRY_ORG production --scope jvdfcode
vercel env rm SENTRY_PROJECT production --scope jvdfcode
vercel env rm ML_APP_ID production --scope jvdfcode
vercel env rm ML_CLIENT_SECRET production --scope jvdfcode
vercel env rm NEXT_PUBLIC_APP_URL production --scope jvdfcode
# Após remoção, readdicion com os valores corretos
```

Use este rollback se uma ou mais vars forem adicionadas com valores incorretos. O app de produção continuará inoperante até que as vars corretas sejam provisionadas e um novo deploy seja executado.

---

## Riscos

1. `vercel env add` é interativo — cada var requer input manual do valor via stdin; ter todos os valores em mãos antes de começar a sequência.
2. Se `SENTRY_DSN` ou `NEXT_PUBLIC_SENTRY_DSN` estiver incorreta, o Sentry ficará silencioso sem alertas — validar com PROD-001-11 (smoke test).
