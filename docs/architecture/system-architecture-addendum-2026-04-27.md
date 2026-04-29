# System Architecture — Addendum 2026-04-27

**Workflow:** brownfield-discovery (AIOX) — Fase 1 (re-run)
**Agente:** @architect (Aria/Orion)
**Base:** `docs/architecture/system-architecture.md` (versão 2026-04-23)

> Este adendo NÃO substitui o doc principal. Acrescenta achados novos detectados na re-execução do workflow em 2026-04-27 e atualiza versões reais observadas em `pnpm-lock.yaml`.

---

## 1. Atualizações de stack vs versão de 2026-04-23

| Item | 2026-04-23 | 2026-04-27 | Δ |
|------|-----------|-----------|----|
| `@types/react` | (não declarado) | `^19.2.14` | **NOVO mismatch com React 18** |
| `@types/react-dom` | — | `^19.2.3` | idem |
| `@types/node` | — | `^25.6.0` | sem `engines.node` |
| `@sentry/nextjs` | — | `^10.50.0` instalado | Sentry foi adicionado (3 configs + `instrumentation.ts`) |
| `playwright` | — | `^1.59.1` | instalado, sem suite e2e |
| `vercel.json` | — | cron `0 3 * * *` `/api/cron/cleanup-ml-cache` | **novo** |
| `.github/workflows/ci.yml` | — | lint→typecheck→test:coverage→build + db-types-drift | **novo** |
| Migrations | 6 (001-006) | 8 (incluindo 007 perf indexes + 008 rate_limit_log) | **+2** |
| `src/lib/rateLimit.ts` | — | implementado | **novo** |
| `src/types/supabase.gen.ts` | — | gerado via Supabase CLI | **novo** |

## 2. Pontos de integração no contexto Vercel

| Camada | Implementação | Marketplace Vercel |
|--------|---------------|--------------------|
| Banco relacional + Auth | Supabase (PostgreSQL + Auth + RLS) | Supabase é integração de Marketplace; mantém. |
| Cache de busca ML | tabela `ml_search_cache` no Supabase | Funciona; cleanup via cron Vercel `0 3 * * *` (ver DEBT-DB-C2). |
| Tokens OAuth ML | tabela `ml_tokens` no Supabase | Funcional; risco de race em refresh (DEBT-DB-C3). |
| Observabilidade | Sentry (`@sentry/nextjs@10`) | Edge tracesSampleRate=0 (DEBT-H3). |
| Cron jobs | `vercel.json` (1 cron diário) | OK; sem alarme se cron parar. |

Nenhuma migração de storage recomendada — Supabase é a integração ativa e adequada.

## 3. Débitos novos / refinados (re-run)

Numeração contínua à do doc base (que listava M1-M8 sem severidade clara):

### CRITICAL

- **DEBT-C1** — `react@18` vs `@types/react@19` (e idem react-dom). Risco de tipos inválidos.

### HIGH

- **DEBT-H1** — `@types/node@25` sem `engines.node` declarado; CI usa Node 20.
- **DEBT-H2** — ESLint 8 (EOL Q2/2025); `.eslintrc.json` sem regras custom além de `next/core-web-vitals`.
- **DEBT-H3** — `sentry.edge.config.ts:6` com `tracesSampleRate: 0` → middleware/edge sem traces.
- **DEBT-H4** — `cheerio@^1.2.0` em dependencies, **sem imports** em `src/`. Bloat ~40KB.
- **DEBT-H5** — `.env.example` incompleto: faltam Sentry (`*_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`), ML (`ML_APP_ID`, `ML_CLIENT_SECRET`) e `SUPABASE_ACCESS_TOKEN` (CI).
- **DEBT-H6** — Sem testes integration/e2e. 14 unit tests cobrem `lib/`; route handlers, server actions, OAuth e middleware sem cobertura.

### MEDIUM

- **DEBT-M1** — Server Actions retornam `error.message` cru ao cliente (`/calculadora/actions.ts:6-18`). Risco de vazar internals.
- **DEBT-M2** — Lista de rotas protegidas hardcoded no `middleware.ts:40-47`. Mover para constante.
- **DEBT-M3** — `rateLimit.ts` sem JSDoc (algoritmo, janela, TTL não documentados).
- **DEBT-M4** — Project ID Supabase hardcoded em `package.json:14-15` (`ltpdqavqhraphoyusmdi`). Usar env var.
- **DEBT-M5** — `beforeSend` PII duplicado entre `sentry.client.config.ts` e `sentry.server.config.ts`. Extrair util compartilhado.

### LOW

- **DEBT-L1** — `error.tsx:13` apenas `console.error`; sem `Sentry.captureException(error)`.
- **DEBT-L2** — Playwright instalado, sem suite e2e.
- **DEBT-L3** — Tailwind v4 sem aproveitar `@layer`/`@apply`.

## 4. Riscos arquiteturais novos

| Risco | Severidade | Mitigação atual |
|-------|-----------|-----------------|
| Race em refresh OAuth ML | HIGH | nenhuma — `getMlAccessToken` sem lock |
| Cron Vercel falhar silenciosamente | HIGH | sem alarme; cache cresce ilimitado (combinar com DEBT-DB-C2) |
| Drift de tipos Supabase fora do CI | MEDIUM | job `db-types-drift` PR-only; sem hook local |
| PII em logs estruturados (`ml-search/route.ts`) | MEDIUM | `beforeSend` Sentry strip; `console.log` JSON-line não passa pelo Sentry filter |
| Onboarding dev (env vars faltando) | MEDIUM | README parcial; `.env.example` incompleto |

## 5. Prioridades consolidadas (este sprint)

1. DEBT-C1 (types React)
2. DEBT-H3 (Sentry edge sample rate)
3. DEBT-H5 (.env.example completar)
4. DEBT-DB-C1 / DEBT-DB-C2 / DEBT-DB-C3 (DB críticos — ver DB-AUDIT addendum)

---
*Re-run brownfield-discovery — Fase 1 — 2026-04-27*
