# Technical Debt — DRAFT (Fase 4)

**Workflow:** brownfield-discovery (AIOX) — Fase 4
**Agente:** @architect (Aria/Orion)
**Data:** 2026-04-27
**Inputs:** Fase 1 (system-architecture + addendum), Fase 2 (SCHEMA + DB-AUDIT + addendum), Fase 3 (frontend-spec + addendum)

> Draft consolidado dos débitos técnicos do SmartPreço. Este documento alimenta as Fases 5-7 (reviews especialistas + QA Gate) e gera o `technical-debt-assessment.md` final na Fase 8.

---

## 1. Resumo executivo

| Categoria | CRITICAL | HIGH | MEDIUM | LOW | Total |
|-----------|----------|------|--------|-----|-------|
| Sistema | 1 | 6 | 5 | 3 | 15 |
| Database | 3 | 3 | 4 | 3 | 13 |
| Frontend | 2 | 3 | 5 | 3 | 13 |
| **Total** | **6** | **12** | **14** | **9** | **41** |

**Score de saúde geral:** 🟡 **6.5/10** — MVP funcional com débitos significativos, sem bloqueadores absolutos.

**Tema dominante:** observabilidade incompleta + débitos de segurança/integridade no DB (RLS implícito, race conditions OAuth) + lacunas de A11y/i18n em FE.

---

## 2. Inventário consolidado

### 2.1 CRITICAL (6 itens — bloqueadores ou risco imediato)

| ID | Origem | Débito | Localização |
|----|--------|--------|-------------|
| DEBT-C1 | Sistema | React 18 + `@types/react@19` mismatch | `package.json:28,38` |
| DEBT-DB-C1 | Database | `rate_limit_log` com RLS habilitado e zero policies | `008_rate_limit_log.sql:12-13` |
| DEBT-DB-C2 | Database | `ml_search_cache` sem DELETE policy + cron Vercel sem alarme | `005_ml_search_cache.sql` + `vercel.json` |
| DEBT-DB-C3 | Database | OAuth ML refresh sem lock — race condition | `src/lib/ml-api.ts:19-36` |
| DEBT-FE-1 | Frontend | Botões icon-only sem `aria-label` (WCAG 2.1 A) | ~15 componentes |
| DEBT-FE-2 | Frontend | Sem framework i18n; 100% pt-BR hardcoded | global |

### 2.2 HIGH (12 itens)

| ID | Origem | Débito | Localização |
|----|--------|--------|-------------|
| DEBT-H1 | Sistema | `@types/node@25` sem `engines.node` declarado | `package.json` |
| DEBT-H2 | Sistema | ESLint 8 (EOL Q2/2025); config legacy | `.eslintrc.json` |
| DEBT-H3 | Sistema | Sentry edge `tracesSampleRate: 0` | `sentry.edge.config.ts:6` |
| DEBT-H4 | Sistema | `cheerio` instalado, não importado | `package.json:22` |
| DEBT-H5 | Sistema | `.env.example` incompleto | `.env.example` |
| DEBT-H6 | Sistema | Sem testes integration/e2e | `tests/` |
| DEBT-DB-H1 | Database | `ml_tokens.user_id` sem índice explícito | `006_ml_tokens.sql` |
| DEBT-DB-H2 | Database | N+1 implícito em `listSkus` (`sku_calculations (*)`) | `src/lib/supabase/skus.ts:90-104` |
| DEBT-DB-H3 | Database | `checkRateLimit` sem proteção contra race | `src/lib/rateLimit.ts:10-40` |
| DEBT-FE-3 | Frontend | Forms sem `aria-describedby` ligando erro→input | LoginForm/SignupForm |
| DEBT-FE-4 | Frontend | MarketSearch sem loading visual | `mercado/MarketSearch.tsx:50-79` |
| DEBT-FE-13 | Frontend | Sidebar mobile sem hamburger integrado (verificar `MobileDrawer`) | `components/layout/AppShell.tsx` |

### 2.3 MEDIUM (14 itens)

| ID | Origem | Débito |
|----|--------|--------|
| DEBT-M1 | Sistema | Server Actions retornam `error.message` cru (vazamento) |
| DEBT-M2 | Sistema | Lista de rotas protegidas hardcoded em `middleware.ts` |
| DEBT-M3 | Sistema | `rateLimit.ts` sem JSDoc |
| DEBT-M4 | Sistema | Project ID Supabase hardcoded em `package.json` |
| DEBT-M5 | Sistema | `beforeSend` PII duplicado entre client e server Sentry |
| DEBT-DB-M1 | Database | `ml_fees` apenas com taxas gerais (sem categoria) |
| DEBT-DB-M2 | Database | `pg_cron` não habilitado (defense-in-depth para cleanup) |
| DEBT-DB-M3 | Database | JSONB `cost_data`/`result_data` sem CHECK |
| DEBT-DB-M4 | Database | `db-types-drift` apenas em CI/PR; sem pre-commit |
| DEBT-FE-5 | Frontend | GenieButton sem `aria-busy={loading}` |
| DEBT-FE-6 | Frontend | `<Suspense>` subutilizado no `(app)` |
| DEBT-FE-7 | Frontend | Validação de email frouxa; sem `zod` |
| DEBT-FE-11 | Frontend | `CostForm.tsx` 487 LOC — monolítico |
| DEBT-FE-12 | Frontend | `MarketSearch.tsx` 418 LOC — monolítico |

### 2.4 LOW (9 itens)

| ID | Origem | Débito |
|----|--------|--------|
| DEBT-L1 | Sistema | `error.tsx` sem `Sentry.captureException` |
| DEBT-L2 | Sistema | Playwright instalado, sem suite e2e |
| DEBT-L3 | Sistema | Tailwind v4 sem aproveitar `@layer`/`@apply` |
| DEBT-DB-L1 | Database | Tokens em plain text (Supabase encripta at-rest; documentar) |
| DEBT-DB-L2 | Database | Sem audit trail genérico (`pgaudit`) |
| DEBT-DB-L3 | Database | Validar via `EXPLAIN ANALYZE` que índices M007 são usados |
| DEBT-FE-8 | Frontend | Mistura motion library × CSS direto |
| DEBT-FE-9 | Frontend | Metadata ausente nas rotas `(auth)` |
| DEBT-FE-10 | Frontend | `localStorage` em MarketSearch sem fallback de erro |

---

## 3. Mapa de dependências entre débitos

```
DEBT-DB-C2 (cleanup cache)
  ├── depende de cron Vercel funcionar
  ├── DEBT-DB-M2 (pg_cron) é redundância sugerida
  └── precisa de Sentry alarme → DEBT-H3 (edge sample rate=0 atual bloqueia visibilidade)

DEBT-DB-C3 (OAuth race)
  └── exige lock em DB; resolve "feature gap" do doc base 2026-04-23 (A1)

DEBT-C1 (types React)
  └── isolado; fix mecânico (downgrade @types/react)

DEBT-FE-2 (i18n)
  └── refator amplo; impacta DEBT-FE-1 (extrair labels já gera oportunidade A11y)

DEBT-H6 (sem integration/e2e)
  └── DEBT-L2 (Playwright instalado) já oferece base; falta criar suite
  └── proteção contra DEBT-DB-C3 e DEBT-M1 (regressões em fluxos críticos)

DEBT-FE-11 / FE-12 (monolíticos)
  └── decomposição habilita testes unitários e cobertura de FE
```

---

## 4. Riscos arquiteturais cross-cutting

| Risco | Severidade | Débitos relacionados |
|-------|-----------|----------------------|
| Observabilidade insuficiente em produção | HIGH | DEBT-H3, DEBT-L1, DEBT-DB-C2 |
| Segurança implícita / não documentada (RLS) | HIGH | DEBT-DB-C1, DEBT-DB-L1 |
| Race conditions sob carga (OAuth, rate limit) | HIGH | DEBT-DB-C3, DEBT-DB-H3 |
| Onboarding de devs e ambiente | MEDIUM | DEBT-H5, DEBT-M3, DEBT-M4 |
| Acessibilidade / compliance | MEDIUM | DEBT-FE-1, DEBT-FE-3, DEBT-FE-5 |
| Internacionalização futura | MEDIUM | DEBT-FE-2 |
| Cobertura de testes em fluxos críticos | MEDIUM | DEBT-H6, DEBT-L2 |

---

## 5. Quick wins (≤ 1 dia cada)

1. **DEBT-C1** — alinhar `@types/react@^18.2` e `@types/react-dom@^18.2` em `package.json` + `pnpm install`.
2. **DEBT-H3** — `tracesSampleRate: 0.1` em `sentry.edge.config.ts:6`.
3. **DEBT-H4** — remover `cheerio` de `dependencies` ou documentar uso futuro explícito.
4. **DEBT-H5** — completar `.env.example` com Sentry/ML/Supabase access token + comentários.
5. **DEBT-M4** — `package.json:14-15` ler project-id de env var `SUPABASE_PROJECT_ID`.
6. **DEBT-M5** — extrair `beforeSend` para `sentry.shared.ts`.
7. **DEBT-L1** — adicionar `Sentry.captureException(error)` em `app/error.tsx`.
8. **DEBT-DB-C1** — adicionar `COMMENT ON TABLE rate_limit_log` documentando intent.
9. **DEBT-FE-9** — exportar `metadata` em `(auth)/layout.tsx`.
10. **DEBT-FE-5** — adicionar `aria-busy={loading}` em `GenieButton`.

## 6. Blocos de trabalho médio (2-5 dias cada)

- **A — Estabilizar OAuth ML** (DEBT-DB-C3 + DEBT-FE-4): lock no refresh + indicador de loading no MarketSearch.
- **B — Performance e cleanup do cache** (DEBT-DB-C2 + DEBT-DB-H2 + DEBT-DB-M2): habilitar pg_cron, alarme Sentry no cron Vercel, LATERAL JOIN em `listSkus`.
- **C — Hardening de testes** (DEBT-H6 + DEBT-L2): suite Playwright para fluxos críticos (login, calculadora, save SKU, MarketSearch).
- **D — Decomposição de monolíticos** (DEBT-FE-11 + DEBT-FE-12).
- **E — A11y baseline** (DEBT-FE-1 + DEBT-FE-3 + DEBT-FE-5): aria-label, aria-describedby, aria-busy.
- **F — ESLint 9 + flat config** (DEBT-H2): migração + regras de a11y/import-order.

## 7. Bloco de trabalho longo

- **G — Adoção de i18n** (DEBT-FE-2): instalar `next-intl`, extrair strings, configurar locale routing — estimativa 2-3 sprints.

---

## 8. Restrições e suposições

- **Suposição 1:** Stack frozen para Next 14 + React 18 (não migrar para Next 15/React 19 nesta rodada).
- **Suposição 2:** Supabase é a única integração de storage prevista (não migrar para Neon/outras).
- **Suposição 3:** Equipe pequena (1-3 devs) — priorizar quick wins + bloco A + bloco B no sprint atual.
- **Restrição:** Não alterar contratos de API públicos (`/api/ml-search`, `/api/skus/[id]`) para preservar clientes (incluindo fallback client-side documentado).

---

*Próxima fase: reviews especialistas (@data-engineer Fase 5, @ux-design-expert Fase 6).*
