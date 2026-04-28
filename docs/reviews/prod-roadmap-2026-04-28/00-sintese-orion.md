# Síntese Orion — FASE 1 do Roadmap a Produção

**Data:** 2026-04-28
**Curador:** Orion (AIOX Master / Design Chief)
**Inputs:** 6 diagnósticos individuais em `docs/reviews/prod-roadmap-2026-04-28/01..06-*.md`
**Próxima fase:** PM (Morgan) + SM (River) consomem este documento para gerar EPIC-PROD-001 e SPRINT-2026-04-28.

---

## Sumário executivo (3 frases)

O caminho até `smartpreco.app` em produção tem **30 problemas-raiz mapeados** distribuídos em 6 dimensões — destes, **5 são BLOQUEADORES absolutos** (3 técnicos: types React, env vars Sentry, migrations não aplicadas; 1 operacional: projeto não linkado ao team `jvdfcode`; 1 regulatório: LGPD sem política publicada). Há **3 pré-condições estritamente sequenciais** (decisão Supabase → migrations + env vars → deploy + DNS), o resto pode ser paralelizado em duas tracks (técnico/devops + UX/QA/negócio). O sprint de produção **só fecha** com 12 stories priorizadas que entregam o app no ar com Lead Magnet ativo, observabilidade ligada e gates de CI auditáveis — sem pular nenhuma.

---

## Veredito de cada agente (1 linha cada)

| Agente | Veredito |
|--------|----------|
| **Aria** | "Caminho viável bloqueado por 5 falhas concretas: env vars Sentry, middleware no Edge sem `cookies()`, cron sem auth, types React mismatch, flag instrumentationHook obsoleta." |
| **Dara** | "3 migrations não aplicadas (009-011), drift confirmado em `supabase.gen.ts`, project-id hardcoded no CI bloqueia decisão de Supabase novo vs antigo." |
| **Uma** | "Halo v1.1 estruturalmente correto, mas 4 gaps bloqueiam: focus ring divergente, aria-busy ausente no CTA principal, KPI tile §9.7 não formalizado, empty states de Supabase indefinidos." |
| **Gage** | "Pipeline funcional bloqueado por 3 gaps operacionais sequenciais: projeto não linkado a `jvdfcode`, env vars de produção inexistentes, DNS Cloudflare ainda em AWS antiga." |
| **Quinn** | "CI bloqueia bem build/concurrency, mas deixa passar regressão visual silenciosa, falha auth real, drift de schema em push direto e ausência total de Sentry alarm." |
| **Alex** | "Pode ir ao ar com Lead Magnet hoje, mas LGPD sem `/privacidade` é risco regulatório imediato, A/B pricing sem dado é inútil, ICP é template vazio." |

---

## Matriz cruzada — 30 problemas-raiz

### BLOQUEADORES absolutos (5) — sem isso o app não vai pra produção

| # | Origem | Problema-raiz | Evidência | Resolve com |
|---|--------|---------------|-----------|-------------|
| **B1** | Aria | `@types/react@19` × React 18 quebra `tsc --noEmit` | `package.json:28`, DEBT-C1 | Fixar `@types/react@^18.3.12` exato + `pnpm install` |
| **B2** | Aria + Gage | Env vars Sentry/Supabase/ML não provisionadas no Vercel `jvdfcode` | `next.config.js:11-13`, `.env.example` incompleto | `vercel env add` × 11 vars (sequência canônica de Gage Bloco 3) |
| **B3** | Dara + Gage | Migrations 009-011 não aplicadas em Supabase real | `supabase/migrations/009-011`, `supabase.gen.ts` espelha 001-008 | Decidir Supabase (antigo/novo) → `supabase db push` → `pnpm generate:types` |
| **B4** | Gage | Projeto Vercel não linkado ao team `jvdfcode` | ausência de `.vercel/project.json` | `vercel teams switch jvdfcode` → `vercel link --scope jvdfcode` |
| **B5** | Alex | LGPD sem política de privacidade publicada antes do 1º email capturado | `/privacidade` inexistente; lead magnet captura PII | Publicar `/privacidade` ou desativar CTA de captura até publicar |

### HIGH (10) — precisa resolver antes do GO ou imediatamente após

| # | Origem | Problema-raiz | Evidência | Severidade |
|---|--------|---------------|-----------|------------|
| **H1** | Aria | `createServerSupabase` usa `cookies()` Node — incompatível Edge | `src/lib/supabase/server.ts:12-14` | Quebra silencioso se rota for Edge |
| **H2** | Aria | Cron `/api/cron/cleanup-ml-cache` sem `CRON_SECRET` | `vercel.json:3-7` | Endpoint público, abuso trivial |
| **H3** | Dara | Drift `supabase.gen.ts` vs schema remoto pós-migrations | `src/types/supabase.gen.ts` | Tipagem ausente para `leads`/`funnel_events` |
| **H4** | Dara | Project-id hardcoded em CI e package.json | `ci.yml:116`, `package.json:14` | Falso positivo/negativo se Supabase mudar |
| **H5** | Uma | Focus ring divergente em LeadMagnetForm | `LeadMagnetForm.tsx:169,187,229,333` | WCAG 2.4.7, funil de conversão único |
| **H6** | Uma | `aria-busy` ausente no CTA "Calcular viabilidade" | `LeadMagnetForm.tsx:239-244` | WCAG 4.1.3, screen reader na rota orgânica |
| **H7** | Uma | Empty/error state de Supabase indefinido | `AppShell.tsx`, sem Suspense fallback | Tela branca em cold start |
| **H8** | Uma | Touch targets < 44×44px no formulário | `LeadMagnetForm.tsx:201-215` | WCAG 2.5.5, mobile-first |
| **H9** | Gage | Cloudflare proxy ON apex incompatível SSL Vercel ACME | DNS atual com proxy ON em smartpreco.app | SSL falha intermitente |
| **H10** | Quinn | Sentry sem validação de conectividade — pode estar morto silencioso | `sentry.*.config.ts` sem teste de smoke | Observabilidade morta sem alarme |

### MEDIUM (8) — deveriam estar resolvidos antes ou logo após GO

| # | Origem | Problema-raiz | Evidência |
|---|--------|---------------|-----------|
| **M1** | Aria | `experimental.instrumentationHook: true` será removido em Next 15 | `next.config.js:7` |
| **M2** | Dara | `ml_search_cache` RLS semanticamente errada (insert/update authenticated impossível) | `005_ml_search_cache.sql:22-27` |
| **M3** | Dara | Sem cleanup automático `funnel_events` — crescimento ilimitado | `007_performance_indexes.sql:24-27` (cron comentado) |
| **M4** | Gage | Cron Vercel só confiável no plano Pro | `vercel.json:3-7` + plano Hobby |
| **M5** | Quinn | Middleware sem cobertura de teste após fix recente | `src/middleware.ts` (commit 683e538) |
| **M6** | Quinn | Coverage exclui `src/components/**` — Onda 4 sem snapshot | `vitest.config.ts:16` |
| **M7** | Quinn | `db-types-drift` só em PR — push direto a main escapa | `ci.yml` job `db-types-drift` |
| **M8** | Quinn | Ausência total de E2E (Playwright instalado, sem suite) | `package.json:46`, sem `tests/e2e/` |

### LOW (7) — backlog pós-produção

| # | Origem | Problema-raiz |
|---|--------|---------------|
| **L1** | Uma | KPI tile §9.7 não formalizado — só vira problema se `/dashboard/kpis` for usado em produção |
| **L2** | Alex | A/B pricing sem WTP de entrevistas (8+ semanas pra dado significativo) |
| **L3** | Alex | Eventos de funil não instrumentados no Vercel Analytics (4 steps do Lead Magnet) |
| **L4** | Alex | Concorrência mapeada como template vazio — diferencial não auditado |
| **L5** | Alex | ICP é declaração, não evidência (10 entrevistas pendentes) |
| **L6** | Quinn | Lighthouse roda contra `localhost` sem env vars reais (passa sem auditar) |
| **L7** | Gage | `.vercel/project.json` deveria ser commitado para o CI funcionar |

---

## Mapa de dependências entre agentes

```
                 ┌─────────────────────────────────────┐
                 │ DECISÃO DO USUÁRIO                  │
                 │ Supabase antigo (jvdfcode) ou novo? │
                 └──────────────┬──────────────────────┘
                                ▼
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
    ┌───────────────┐                    ┌─────────────────────┐
    │ Dara          │                    │ Gage                │
    │ - migrations  │                    │ - vercel link       │
    │ - drift fix   │                    │ - env vars × 11     │
    │ - project-id  │                    │ - cloudflare DNS    │
    └────┬──────────┘                    └────┬────────────────┘
         │                                    │
         └──────────────┬─────────────────────┘
                        ▼
                ┌───────────────┐
                │ Aria          │
                │ - types fix   │
                │ - cron secret │
                │ - cookies()   │
                └───────┬───────┘
                        ▼
        ┌───────────────┴────────────────┐
        ▼                                ▼
┌───────────────┐              ┌─────────────────┐
│ Uma           │              │ Quinn           │
│ - focus ring  │              │ - middleware    │
│ - aria-busy   │              │   test          │
│ - touch tgt   │              │ - E2E auth      │
│ - skeleton    │              │ - sentry smoke  │
└───────┬───────┘              └────┬────────────┘
        │                           │
        └─────────┬─────────────────┘
                  ▼
          ┌───────────────┐
          │ Alex          │
          │ - /privacidade│
          │ - eventos func│
          │ - calibrar A/B│
          └───────────────┘
                  ▼
          [GO PRODUÇÃO]
```

**Caminho crítico (sequência rígida):**
1. Decisão Supabase
2. Migrations + env vars + types fix (paralelizáveis após decisão)
3. Vercel link + deploy preview
4. DNS Cloudflare (com proxy OFF no apex)
5. `/privacidade` publicada
6. CTA Lead Magnet ativado
7. GO

---

## Sinalizações cruzadas (onde dois ou mais agentes convergem)

| Convergência | Agentes | Observação |
|--------------|---------|------------|
| **Sentry observabilidade morta-silenciosa** | Aria + Quinn + Alex | Aria detecta env vars, Quinn detecta falta de smoke test, Alex detecta impacto comercial |
| **Migrations + types** | Dara + Aria + Quinn | Dara detecta drift, Aria nota que tsc quebra, Quinn nota que push direto escapa do gate |
| **Funil de conversão silencioso** | Uma + Alex | Uma vê WCAG falhar, Alex vê cada lead como dado perdido |
| **Decisão Supabase como blocker** | Dara + Gage + Aria | Sem ela: migrations não rodam, env vars não tem valor, deploy não compila |

---

## Top 3 pontos de divergência (decisões pendentes do usuário)

| # | Pergunta | Quem precisa de resposta | Impacto |
|---|----------|--------------------------|---------|
| **D1** | Supabase: jvdfcode existente ou criar novo? | Dara + Gage + Aria | Bloqueia migrations, env vars e deploy |
| **D2** | `/dashboard/kpis` está em produção ou só local? | Uma | Define se KPI tile §9.7 é blocker ou backlog |
| **D3** | Lead Magnet vai ao ar com CTA de email ativo ou desativado até `/privacidade`? | Alex + Pedro (jurídico) | Bloqueia coleta de PII; afeta MKT-001-1 AC |

---

## Sinal verde para FASE 2 (PM + SM)

Tudo o que PM/SM precisam para gerar o EPIC-PROD-001 + Sprint Plan:
- ✅ 30 problemas-raiz mapeados com severidade e evidência
- ✅ 5 BLOQUEADORES claros (não ambíguos)
- ✅ Mapa de dependências entre agentes (caminho crítico desenhado)
- ✅ 3 decisões pendentes do usuário documentadas (não inventar)
- ✅ Sequência canônica de 17 passos do Gage para deploy operacional
- ✅ Severidades calibradas para priorização de stories

**Limites para PM/SM (não pisar fora):**
- Não inventar AC além das evidências dos diagnósticos
- Cada story deve referenciar pelo menos 1 problema-raiz desta matriz (B/H/M/L)
- Ordem de stories deve respeitar caminho crítico
- Decisões D1/D2/D3 ficam como pré-requisitos do Sprint, não como tasks executáveis

---

*Síntese Orion — FASE 1 → FASE 2 — 2026-04-28*
*Gravado em: docs/reviews/prod-roadmap-2026-04-28/00-sintese-orion.md*
