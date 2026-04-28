# Technical Debt Assessment — SmartPreço (FINAL)

**Workflow:** brownfield-discovery (AIOX) — Fase 8
**Agente:** @architect (Aria/Orion)
**Data:** 2026-04-27
**QA Gate:** APPROVED (`docs/qa/qa-review.md`)
**Inputs:** draft Fase 4, review DB Dara (Fase 5), review UX Uma (Fase 6), QA Gate Quinn (Fase 7)

> Documento canônico do débito técnico do SmartPreço. Substitui o draft. Incorpora as 12 mudanças obrigatórias do QA Gate Fase 7.

---

## 1. Resumo executivo

| Categoria | CRITICAL | HIGH | MEDIUM | LOW | Total bruto | DEFERRED (⊂ total) |
|-----------|----------|------|--------|-----|-------------|---------------------|
| Sistema | 1 | 6 | 5 | 3 | 15 | 3 (DEBT-L1, L2, L3) |
| Database | 4 | 6 | 5 | 4 | 19 | 6 (DEBT-DB-M1, DB-L1, DB-L2, DB-L3, DB-EXTRA-04, DB-M-LGPD) |
| Frontend | 2 | 3 | 10 | 5 | 20 | 6 (DEBT-FE-8, FE-9, FE-10, FE-NEW-6, FE-NEW-7, FE-NEW-8) |
| **Total** | **7** | **15** | **20** | **12** | **54** | **15** |

> **Nota pós-roundtable (2026-04-27):** 15 itens marcados [DEFERRED] permanecem no inventário para rastreabilidade mas saem do sprint atual (total ativo = 39). DEBT-FE-2 rebaixado de CRITICAL → MEDIUM: CRITICAL passa de 8 → 7, MEDIUM de 19 → 20. Ver Seção 11.

**Saúde geral:** 🟡 **6/10** — MVP funcional, mas com débitos críticos de segurança implícita (RLS), race conditions (rate limit + OAuth refresh) e A11y baseline (WCAG 2.1 A).

**Prioridades de sprint:** Bloco H (rate limit + OAuth race) → Bloco E' (A11y CRITICAL: skip nav, aria-label) → quick wins. Detalhe nas Seções 5-7.

---

## 2. Inventário consolidado pós-reviews

### 2.1 CRITICAL (7 ativos; 8 originais — DEBT-FE-2 rebaixado para MEDIUM pós-roundtable)

| ID | Camada | Débito | Localização | Origem |
|----|--------|--------|-------------|--------|
| DEBT-C1 | Sistema | React 18 + `@types/react@19` mismatch | `package.json:28,38` | Draft |
| DEBT-DB-C1 | Database | `rate_limit_log` com RLS habilitado e zero policies | `008_rate_limit_log.sql:12-13` | Draft |
| DEBT-DB-C2 | Database | `ml_search_cache` sem DELETE policy + cron Vercel sem alarme | `005_ml_search_cache.sql` + `vercel.json` | Draft |
| DEBT-DB-C3 | Database | OAuth ML refresh sem lock — race condition | `src/lib/ml-api.ts:42-62` | Draft |
| **DEBT-DB-H3 (escalado)** | Database | `checkRateLimit` sem lock — race garantida em serverless | `src/lib/rateLimit.ts:19-38` | Dara (Fase 5) |
| DEBT-FE-1 | Frontend | Botões icon-only sem `aria-label` (WCAG 2.1 A) | ~15 componentes | Draft |
| ~~DEBT-FE-2~~ | ~~Frontend~~ | ~~Sem framework i18n; 100% pt-BR hardcoded~~ | ~~global~~ | ~~Draft~~ | **[RECLASSIFICADO → MEDIUM]** [gate condicional: só sobe de severidade se houver decisão documentada de expansão LATAM nas Restrições/Suposições] — ver Seção 2.3 |
| **DEBT-FE-NEW-1 (novo)** | Frontend | Skip navigation link ausente (WCAG 2.1 SC 2.4.1) | `src/app/(app)/layout.tsx`, `src/app/layout.tsx` | Uma (Fase 6) |

### 2.2 HIGH (15)

| ID | Camada | Débito | Localização |
|----|--------|--------|-------------|
| DEBT-H1 | Sistema | `@types/node@25` sem `engines.node` declarado | `package.json` |
| DEBT-H2 | Sistema | ESLint 8 (EOL Q2/2025); config legacy | `.eslintrc.json` |
| DEBT-H3 | Sistema | Sentry edge `tracesSampleRate: 0` | `sentry.edge.config.ts:6` |
| DEBT-H4 | Sistema | `cheerio` instalado, não importado | `package.json:22` |
| DEBT-H5 | Sistema | `.env.example` incompleto | `.env.example` |
| DEBT-H6 | Sistema | Sem testes integration/e2e | `tests/` |
| DEBT-DB-H1 | Database | `ml_tokens.user_id` sem índice explícito (verificar `pg_indexes`) | `006_ml_tokens.sql` |
| DEBT-DB-H2 | Database | N+1 implícito em `listSkus` (`sku_calculations (*)`) | `src/lib/supabase/skus.ts:90-104` |
| **DEBT-DB-H4 (novo, ex DB-EXTRA-01)** | Database | `rate_limit_log` cresce ilimitado (sem TTL/cleanup) | `008_rate_limit_log.sql` |
| **DEBT-DB-M3 (escalado)** | Database | JSONB `cost_data`/`result_data` sem CHECK — corrupção silenciosa | `src/lib/supabase/skus.ts` + migration 004 |
| DEBT-FE-3 | Frontend | Forms sem `aria-describedby` ligando erro→input | LoginForm/SignupForm |
| DEBT-FE-4 | Frontend | MarketSearch sem loading visual | `mercado/MarketSearch.tsx:50-79` |
| **DEBT-FE-NEW-2 (novo)** | Frontend | Focus trap ausente em MobileDrawer (WCAG 2.1 SC 2.1.2) | `MobileDrawer.tsx:52-132` |

> **Nota:** DEBT-FE-13 (sidebar mobile sem hamburger) **REMOVIDO** — verificação direta em `AppShell.tsx:13-26`, `TopBar.tsx:13-20`, `MobileDrawer.tsx:52-132` confirma implementação completa com `role="dialog"`, `aria-modal`, Escape handler. O gap real (focus trap) está coberto por DEBT-FE-NEW-2.

### 2.3 MEDIUM (20; inclui DEBT-FE-2 rebaixado de CRITICAL + 2 itens DEFERRED no inventário)

| ID | Camada | Débito |
|----|--------|--------|
| DEBT-M1 | Sistema | Server Actions retornam `error.message` cru |
| DEBT-M2 | Sistema | Lista de rotas protegidas hardcoded em `middleware.ts:40-47` |
| DEBT-M3 | Sistema | `rateLimit.ts` sem JSDoc |
| DEBT-M4 | Sistema | Project ID Supabase hardcoded em `package.json:14-15` |
| DEBT-M5 | Sistema | `beforeSend` PII duplicado entre client e server Sentry |
| DEBT-DB-M1 | Database | `ml_fees` apenas com taxas gerais (sem categorias) | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-DB-M2 | Database | `pg_cron` não habilitado (defense-in-depth) |
| DEBT-DB-M4 | Database | `db-types-drift` apenas em CI/PR; sem pre-commit |
| **DB-EXTRA-02 (novo)** | Database | `ml_search_cache` sem política DELETE explícita |
| **DB-EXTRA-03 (novo)** | Database | `sku_calculations` cresce sem bound por usuário |
| DEBT-FE-5 | Frontend | GenieButton sem `aria-busy={loading}` |
| DEBT-FE-6 | Frontend | `<Suspense>` subutilizado no `(app)` |
| DEBT-FE-7 | Frontend | Validação de email frouxa; sem `zod` |
| DEBT-FE-11 | Frontend | `CostForm.tsx` 487 LOC — monolítico |
| DEBT-FE-12 | Frontend | `MarketSearch.tsx` 418 LOC — monolítico |
| **DEBT-FE-NEW-3 (novo)** | Frontend | `EmptyState` sem `role` semântico | `EmptyState.tsx:14-25` |
| **DEBT-FE-NEW-4 (novo)** | Frontend | Inputs numéricos sem `inputMode="decimal"` | `CostForm.tsx:148-154` |
| **DEBT-FE-NEW-5 (novo)** | Frontend | WelcomeTour não integrado ao estado real | `dashboard/page.tsx:84` |
| **DEBT-DB-M-LGPD (nota, R6 do QA)** | Database | `ml_tokens` sem mecanismo explícito de direito ao esquecimento | compliance | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual; convertido em risco documentado na Seção 11.2] |
| **DEBT-FE-2 (rebaixado de CRITICAL)** | Frontend | Sem framework i18n; 100% pt-BR hardcoded | global | [gate condicional: só sobe de severidade se houver decisão documentada de expansão LATAM nas Restrições/Suposições] |

### 2.4 LOW (12)

| ID | Camada | Débito |
|----|--------|--------|
| DEBT-L1 | Sistema | `error.tsx` sem `Sentry.captureException` | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-L2 | Sistema | Playwright instalado, sem suite e2e | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-L3 | Sistema | Tailwind v4 sem aproveitar `@layer`/`@apply` | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-DB-L1 | Database | Tokens em plain text — Supabase encripta at-rest; documentar | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-DB-L2 | Database | Sem audit trail genérico (`pgaudit`) | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-DB-L3 | Database | Validar via `EXPLAIN ANALYZE` que índices M007 são usados | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| **DB-EXTRA-04 (novo)** | Database | `ml_fees` sem trigger `updated_at` | `002_ml_fees_table.sql` | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-FE-8 | Frontend | Mistura motion library × CSS direto | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-FE-9 | Frontend | Metadata ausente nas rotas `(auth)` | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| DEBT-FE-10 | Frontend | `localStorage` em MarketSearch sem fallback de erro | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| **DEBT-FE-NEW-6 (novo)** | Frontend | Empty states inconsistentes entre páginas | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| **DEBT-FE-NEW-7 (novo)** | Frontend | Toast com duração curta (3s) para mensagens importantes | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |
| **DEBT-FE-NEW-8 (novo)** | Frontend | Emojis sem `aria-hidden` em contextos críticos | [DEFERRED — vetado por Alan + Pedro como volume sem Playbook real / sai do sprint atual] |

### 2.5 Débitos resolvidos no ciclo brownfield (notas)

- `M2 base / M4 base` (índice `skus.status`, `skus.updated_at`) — resolvido via M007.
- RLS `sku_calculations` `IN`→`EXISTS` — resolvido via M007.
- Trigger `updated_at` em `ml_tokens` — resolvido via M007.
- Cleanup de `ml_search_cache` — parcialmente resolvido (cron Vercel; ver DEBT-DB-C2 para gaps).
- `prefers-reduced-motion` global — resolvido em `globals.css`.
- Tipos DB manuais — resolvido (`supabase.gen.ts` gerado + CI drift gate).
- Sonner toast global — implementado.
- **DEBT-FE-13 (sidebar mobile)** — `MobileDrawer.tsx:52-132` resolve; gap residual coberto por DEBT-FE-NEW-2.

---

## 3. Mapa de dependências (atualizado)

```
DEBT-DB-C2 (cleanup cache)
  ├── depende de cron Vercel funcionar
  ├── DEBT-DB-M2 (pg_cron) é redundância sugerida
  └── precisa Sentry alarme → DEBT-H3 (edge sample rate=0 atual bloqueia visibilidade)

DEBT-DB-C3 (OAuth refresh race)
  └── exige lock em DB; resolve A1 do doc base 2026-04-23

DEBT-DB-H3 (rate limit race) [CRITICAL]
  └── compartilha lock pattern com DEBT-DB-C3
  └── DEBT-DB-H4 (cleanup rate_limit_log) é pré-requisito de performance

DEBT-DB-H4 (cleanup rate_limit_log)
  └── compartilha pré-requisito pg_cron com DEBT-DB-M2 e DEBT-DB-C2

DEBT-C1 (types React)
  └── isolado; fix mecânico

DEBT-FE-NEW-1 (skip nav) [CRITICAL]
  └── pré-requisito para qualquer auditoria WCAG futura

DEBT-FE-NEW-2 (focus trap MobileDrawer)
  └── MobileDrawer base já está implementado; estende com hook `useFocusTrap`

DEBT-FE-2 (i18n)
  └── refator amplo; impacta DEBT-FE-1 (extrair labels gera oportunidade A11y)

DEBT-H6 (sem integration/e2e)
  └── DEBT-L2 (Playwright instalado) já oferece base
  └── proteção contra DEBT-DB-C3, DEBT-DB-H3 e DEBT-M1 (regressões)

DEBT-FE-11 / FE-12 (monolíticos)
  └── decomposição habilita testes unitários e cobertura FE
  └── decomposição com CollapsibleSection resolve parcialmente DEBT-FE-1
```

---

## 4. Riscos arquiteturais cross-cutting

| Risco | Severidade | Débitos relacionados |
|-------|-----------|----------------------|
| Observabilidade insuficiente em produção | HIGH | DEBT-H3, DEBT-L1, DEBT-DB-C2 |
| Segurança implícita / não documentada (RLS) | HIGH | DEBT-DB-C1, DEBT-DB-L1 |
| Race conditions sob carga (OAuth, rate limit) | **CRITICAL** | DEBT-DB-C3, DEBT-DB-H3 |
| Rate limiting fail-open sob indisponibilidade do DB | HIGH | DEBT-DB-H3, DEBT-DB-H4 |
| Onboarding de devs e ambiente | MEDIUM | DEBT-H5, DEBT-M3, DEBT-M4 |
| Acessibilidade / compliance WCAG 2.1 A/AA | **HIGH** | DEBT-FE-1, DEBT-FE-3, DEBT-FE-5, DEBT-FE-NEW-1, DEBT-FE-NEW-2 |
| Internacionalização futura | MEDIUM | DEBT-FE-2 |
| Cobertura de testes em fluxos críticos | MEDIUM | DEBT-H6, DEBT-L2 |
| Mensagens de erro ML não diferenciadas (UX) | MEDIUM | DEBT-FE-4 |
| Performance perceptual (CLS/LCP no dashboard) | MEDIUM | DEBT-FE-6, DEBT-DB-H2 |
| LGPD: direito ao esquecimento | MEDIUM | DEBT-DB-M-LGPD |

---

## 5. Quick wins (≤ 1 dia cada)

1. **DEBT-C1** — alinhar `@types/react@^18.2` e `@types/react-dom@^18.2` em `package.json` + `pnpm install`.
2. **DEBT-FE-NEW-1** — adicionar skip nav link no root layout (estimativa 1h).
3. **DEBT-H3** — `tracesSampleRate: 0.1` em `sentry.edge.config.ts:6`.
4. **DEBT-H4** — remover `cheerio` ou documentar uso futuro.
5. **DEBT-H5** — completar `.env.example` com Sentry/ML/Supabase access token.
6. **DEBT-M4** — `package.json:14-15` ler `SUPABASE_PROJECT_ID` de env.
7. **DEBT-M5** — extrair `beforeSend` para `sentry.shared.ts`.
8. **DEBT-L1** — adicionar `Sentry.captureException(error)` em `app/error.tsx`.
9. **DEBT-DB-C1** — `COMMENT ON TABLE rate_limit_log` documentando intent + policy explícita.
10. **DEBT-FE-9** — exportar `metadata` em `(auth)/layout.tsx`.
11. **DEBT-FE-5** — adicionar `aria-busy={loading}` em `GenieButton`.
12. **DEBT-FE-NEW-3** — `role="status"` em `EmptyState.tsx`.
13. **DEBT-FE-NEW-4** — `inputMode="decimal"` em CostForm inputs numéricos.
14. **DB-EXTRA-04** — trigger `set_updated_at` em `ml_fees` (incluir na migration 010).

## 6. Blocos de trabalho médio (2-5 dias cada)

- **Bloco H — Race conditions críticas** (DEBT-DB-C3 + DEBT-DB-H3): advisory locks em refresh OAuth e em `checkRateLimit`. Migration 009 com função PL/pgSQL `acquire_user_lock(uuid)`. **PRIORIDADE MÁXIMA — ambos são CRITICAL.**
- **Bloco A — Estabilizar OAuth ML** (DEBT-DB-C3 já em Bloco H; combinar com DEBT-FE-4): indicador de loading no MarketSearch.
- **Bloco B — Performance e cleanup** (DEBT-DB-C2 + DEBT-DB-H2 + DEBT-DB-H4 + DEBT-DB-M2 + DB-EXTRA-02 + DB-EXTRA-03): habilitar `pg_cron`, alarme Sentry no cron Vercel, LATERAL JOIN em `listSkus`, TTL/cleanup em `rate_limit_log`.
- **Bloco C — Hardening de testes** (DEBT-H6 + DEBT-L2): suite Playwright para fluxos críticos (login, calculadora, save SKU, MarketSearch, OAuth).
- **Bloco D — Decomposição de monolíticos** (DEBT-FE-11 + DEBT-FE-12).
- **Bloco E' — A11y CRITICAL/HIGH** (DEBT-FE-1 + DEBT-FE-NEW-1 + DEBT-FE-NEW-2 + DEBT-FE-3 + DEBT-FE-5): skip nav, focus trap, aria-label, aria-describedby, aria-busy. Bloco baseline WCAG 2.1 AA.
- **Bloco F — ESLint 9 + flat config** (DEBT-H2): migração + regras de a11y/import-order.

## 7. Bloco de trabalho longo

- **Bloco G — Adoção de i18n** (DEBT-FE-2): instalar `next-intl`, extrair strings, configurar locale routing — estimativa 2-3 sprints.

---

## 8. Restrições e suposições

- **Suposição 1:** Stack frozen para Next 14 + React 18.
- **Suposição 2:** Supabase é a única integração de storage (sem migrar para Neon/outras).
- **Suposição 3:** Equipe pequena (1-3 devs) — priorizar Bloco H + quick wins no sprint atual.
- **Suposição 4:** Cobertura LGPD inicial via `ON DELETE CASCADE` é considerada suficiente para MVP; mecanismo explícito de "direito ao esquecimento" (DEBT-DB-M-LGPD) fica para v2.
- **Restrição:** Não alterar contratos de API públicos (`/api/ml-search`, `/api/skus/[id]`).
- **Restrição:** Migrações DB devem ser idempotentes e ter rollback documentado.

---

## 9. Sequência de migrations propostas

| Migration | Conteúdo | Bloco |
|-----------|----------|-------|
| `009_advisory_locks_and_jsonb_check.sql` | Função `acquire_user_lock(uuid)`, CHECK em `cost_data`/`result_data`, policy explícita `rate_limit_log`, comentários documentais | Bloco H + DEBT-DB-M3 + DEBT-DB-C1 |
| `010_pg_cron_and_extras.sql` | Habilitar `pg_cron` (se elegível), jobs de cleanup `ml_search_cache` e `rate_limit_log`, trigger `set_updated_at` em `ml_fees`, índice `idx_ml_tokens_user_id` (se ausente) | Bloco B + DEBT-DB-H4 + DB-EXTRA-04 + DEBT-DB-H1 |

SQL pronto para colar nas duas migrations está em `docs/reviews/db-specialist-review.md`.

---

## 11. Atualização pós-roundtable (2026-04-27)

**Origem:** `docs/reviews/roundtable-personas-2026-04-27.md`
**Personas que motivaram esta atualização:** Alan Nicolas (curadoria), Pedro Valério (processo), Raduan Melo (estratégia comercial), Bruno Nardon (growth), Thiago Finch (funnel), Tallis Gomes (execução pragmática).

### 11.1 Cortes ao inventário

Itens marcados [DEFERRED] — permanecem no inventário para rastreabilidade, excluídos do sprint ativo até haver novo contexto de impacto.

| ID | Justificativa |
|----|---------------|
| DEBT-DB-M1 | Achado de escopo sem Playbook executável; sem impacto mensurável para MVP de 1-3 devs. |
| DEBT-DB-M-LGPD | Sem arquivo:linha, sem SQL proposto. É observação de conformidade, não débito acionável. Promovido a risco na Seção 11.2. |
| DEBT-DB-L1 | Documentação de comportamento de plataforma; não requer ação técnica imediata. |
| DEBT-DB-L2 | `pgaudit` — compliance sem urgência; ausente do escopo MVP. |
| DEBT-DB-L3 | Validação de índices via `EXPLAIN ANALYZE` — diagnóstico, não débito executável. |
| DB-EXTRA-04 | Trigger `updated_at` em `ml_fees` — sem impacto em fluxo crítico atual. |
| DEBT-L1 | `error.tsx` sem captureException — importante, mas subordinado ao Bloco H + observabilidade. |
| DEBT-L2 | Playwright sem suite e2e — infra de teste; entra após Bloco C, não no sprint H1. |
| DEBT-L3 | Tailwind `@layer`/`@apply` — estilo sem impacto funcional. |
| DEBT-FE-8 | Mistura motion × CSS — sem arquivo:linha específico; opinião de ferramenta. |
| DEBT-FE-9 | Metadata em rotas `(auth)` — SEO de auth sem urgência de produto. |
| DEBT-FE-10 | `localStorage` sem fallback — edge case de MarketSearch sem Playbook concreto. |
| DEBT-FE-NEW-6 | Empty states inconsistentes — UX polish sem impacto em retenção mensurável hoje. |
| DEBT-FE-NEW-7 | Toast 3s — opinião de heurística sem evidência de problema real em produção. |
| DEBT-FE-NEW-8 | Emojis sem `aria-hidden` — achado de scanner; sem auditoria WCAG real motivando. |

**Decisão editorial (Alan + Pedro):** DEBT-FE-NEW-3 (EmptyState `role`), DEBT-FE-NEW-4 (`inputMode="decimal"`), DEBT-FE-NEW-5 (WelcomeTour) mantidos ativos — têm impacto em fluxo de usuário e Playbook de 1h cada. Não entram no Pareto 80%.

### 11.2 Reclassificações

- **DEBT-FE-2:** CRITICAL → MEDIUM. Veto de Alan: sem arquivo:linha, sem Playbook para estágio atual, sem decisão de expansão LATAM. Gate condicional: reclassifica para HIGH/CRITICAL apenas se `docs/architecture/` ou `Restrições/Suposições` registrar decisão formal de expansão geográfica.
- **DEBT-DB-M-LGPD:** mantido no inventário com flag DEFERRED para rastreabilidade regulatória. Risco de conformidade LGPD (direito ao esquecimento em `ml_tokens`) registrado aqui como nota ativa: sem Playbook hoje, monitorar para v2. Suposição 4 da Seção 8 permanece válida.

### 11.3 Mapa de dependências — custo de violação (Alan Recomendação 3)

| Se X for feito antes de Y | Custo concreto |
|---------------------------|----------------|
| Bloco B (pg_cron + cleanup) antes do Bloco H (advisory locks) | Job de cleanup de `rate_limit_log` e `ml_search_cache` compete com consultas de `checkRateLimit` durante janela de alta concorrência — pode mascarar race condition ou elevar latência exatamente quando o lock seria necessário. |
| Bloco G (i18n) antes do Bloco I (validação de mercado) | 2-3 sprints extraindo strings e configurando locale routing sem confirmar ICP ou decisão de expansão LATAM — alto custo de oportunidade; trabalho possivelmente descartado se pivot de escopo ocorrer. |
| Quick wins sem DOD atômico antes do Bloco H | Equipe dispersa em 14 itens paralelos (DEBT-H4, DEBT-H5, DEBT-M4…) enquanto race condition CRITICAL (DEBT-DB-H3) permanece ativa — qualquer produção sob carga expõe o sistema ao risco que o paydown pretendia resolver. |

### 11.4 Resumo das mudanças

**Contagem ANTES vs DEPOIS:**

| Severidade | Antes | Depois | Delta | Observação |
|------------|-------|--------|-------|------------|
| CRITICAL | 8 | 7 | −1 | DEBT-FE-2 rebaixado para MEDIUM |
| HIGH | 15 | 15 | 0 | sem mudança |
| MEDIUM | 19 | 20 | +1 | DEBT-FE-2 entra (+1); DEBT-DB-M1 e DEBT-DB-M-LGPD permanecem com flag DEFERRED |
| LOW | 12 | 12 | 0 | todos 12 (+ DB-EXTRA-04) permanecem no inventário; flagged DEFERRED |
| DEFERRED | 0 | 15 | +15 | 13 LOW/DB-EXTRA-04 + DEBT-DB-M1 + DEBT-DB-M-LGPD |
| **Total bruto** | **54** | **54** | 0 | inventário preservado para rastreabilidade |
| **Total ativo** | **54** | **39** | −15 | itens elegíveis para sprint (54 − 15 DEFERRED) |

**Próximos passos:**
- Ver EPIC-MKT-001 (Bloco I — Validação de mercado) para o novo épico criado a partir desta síntese.
- Atualização do `TECHNICAL-DEBT-REPORT.md` (Fase 9) incorpora estas mudanças de contagem e DEFERRED flags.
- Pré-requisito H2: output de `docs/business/ICP-validation-2026-Q2.md` deve existir antes de iniciar Blocos B/A/C.

---

*Documento final da Fase 8. Próxima fase: @analyst (Fase 9) — relatório executivo.*
