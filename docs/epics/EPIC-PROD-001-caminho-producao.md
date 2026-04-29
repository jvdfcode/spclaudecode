# EPIC-PROD-001 — Caminho à produção (smartpreco.app)

**Versão:** v2 (2026-04-28) — absorve feedback do trio
**Workflow:** prod-roadmap-2026-04-28 → execução
**Owner:** @pm Morgan
**Data:** 2026-04-28
**Sprint alvo:** SPRINT-2026-04-28 (1 semana)
**Origem:** docs/reviews/prod-roadmap-2026-04-28/00-sintese-orion.md

---

## Objetivo

Colocar `smartpreco.app` em produção com o Lead Magnet funcional, observabilidade (Sentry) operacional e gates de CI auditáveis — removendo os 5 bloqueadores absolutos identificados na FASE 1 (B1-B5) e os 10 problemas HIGH (H1-H10) que causariam falhas silenciosas ou risco regulatório imediato no primeiro dia de operação.

---

## Justificativa de negócio

Cada semana sem `smartpreco.app` no ar é dado de funil perdido permanentemente: assumindo aquisição orgânica inicial conservadora de 20-50 cálculos/dia, o atraso de uma semana apaga 140-350 eventos de funil que nunca voltam. Alex (diagnóstico de negócio, 06-analyst-alex.md) estima o custo de não ir ao ar como cumulativo e irreversível — não é "atrasar o lançamento", é destruir a linha de base de dados que valida ou invalida o ICP. O risco de ir ao ar com os 5 bloqueadores não endereçados é maior ainda: deploy sem migrations = erros 500 no primeiro lead capturado; deploy sem `/privacidade` = infração LGPD imediata; deploy sem Sentry ativo = observabilidade morta-silenciosa sem alarme.

---

## Feedback do trio absorvido (v2)

As 9 mudanças obrigatórias aplicadas nesta versão (conforme `docs/reviews/prod-roadmap-2026-04-28/trio/sintese-trio.md`):

1. **Owner pessoa-física em todas as stories** — substituído `[OWNER: ?]` por `Pedro Emilio` (stories interativas: 1, 5, 6, 9, 10) e `Pedro Emilio (executor: @dev Dex via handoff)` (stories de código: 2, 3, 4, 7, 8, 11, 12). Veto absoluto de Pedro Valério.
2. **PROD-001-1 re-estimada** — de 1 SP para 2-3 SP (decisão D1 + criação + link + 4 chaves + migração 001-011). Input de Alan Nicolas.
3. **PROD-001-2 vinculada ao gate CI existente** — AC adicionado referenciando `check:react-types-major` em `ci.yml:38-39`. Input de Pedro Valério.
4. **PROD-001-3 com seção `## Rollback`** — procedimento binário de DROP CASCADE declarado in-line. Veto de Pedro Valério.
5. **PROD-001-5 com seção `## Rollback`** — `vercel unlink && rm -rf .vercel`. Veto de Pedro Valério.
6. **PROD-001-6 com seção `## Rollback`** — `vercel env rm <var> production` por var. Veto de Pedro Valério.
7. **PROD-001-7 reescrita completa** — handler `route.ts:7-8` já implementa CRON_SECRET; story refocada em provisionamento (gerar secret + env add + .env.example + verificação). SP reduzido de 1 para 0.5. Input de Pedro Valério + Thiago Finch.
8. **PROD-001-8 semântica clarificada** — AC explícito que deploy `--prod` executa apenas após PROD-001-9 (DNS) estar PASS, ou que smoke test é em `*.vercel.app`; seção `## Rollback` adicionada. Input de Alan Nicolas.
9. **PROD-001-9 com seção `## Rollback`** — reapontar A para IPs anteriores com proxy ON se DNS não propagar em 30min. Veto de Pedro Valério.
10. **PROD-001-11 M5 removido** — criação de `tests/unit/middleware.test.ts` movida para backlog pós-sprint; story mantém apenas smoke test Sentry + curl rotas. Input de Alan Nicolas.
11. **PROD-001-12 elevada para must-have paralelo** — reclassificada de "should-have/deferrable" para "must-have paralelo Dia 1-2". Input de Alan Nicolas + Thiago Finch.
12. **PROD-001-13 criada** — nova story "Instrumentar 4 eventos de funil + UTM" (2-3 SP), bloqueia PROD-001-10. Input crítico de Thiago Finch.

---

## Recomendações não absorvidas

### OMIE concorrência (Thiago Finch)

**Não absorvida.** A análise de concorrência OMIE (`concorrencia-2026-Q2.md`) é escopo do epic MKT-001, não do PROD-001. Este sprint tem foco único em "ir ao ar" — lançar com posicionamento como hipótese a ser validada via entrevistas (Alex/@analyst). O risco é aceito conscientemente: lançamento cego de posicionamento, com prazo limite de 30 dias pós-GO para produzir o MKT-001-3 (análise OMIE). Registrado como risco em `## Riscos do epic`.

### PROD-001-4 mantida no sprint (Alan Nicolas + Thiago Finch sugerem depriorizar)

**Não depriorizada.** Alan classifica como PRATA (pós-GO sem risco) e Finch como higiene CI sem ROI. Mantida porque: (a) usuário já tem hábito de hardcode que cresce com o tempo — cada sprint adiciona risco acumulado; (b) custo é baixo (1 SP, ~1h); (c) decisão D1 já terá sido tomada em PROD-001-1, tornando a parametrização trivial de executar em paralelo. Débito técnico que não custa nada corrigir agora mas custa cada vez mais depois.

---

## Pré-requisitos (decisões do usuário antes do Sprint começar)

- **D1:** Supabase: usar projeto `jvdfcode` existente (`ltpdqavqhraphoyusmdi`) OU criar projeto novo? — bloqueia PROD-001-1, PROD-001-3, PROD-001-4, PROD-001-6
- **D2:** `/dashboard/kpis` está em produção ou ainda não existe como rota pública? — determina se H7/KpiTile §9.7 é bloqueador imediato (PROD-001-12) ou backlog
- **D3:** Lead Magnet CTA de email vai ao ar ativo imediatamente OU desativado até `/privacidade` publicada? — bloqueia PROD-001-10 e define sequência de publicação

---

## Stories incluídas

| ID | Título | Esforço | Severidade origem | Depends-on | Bloqueador? |
|----|--------|---------|-------------------|------------|-------------|
| PROD-001-1 | Decisão Supabase (D1) + criar projeto se novo | 2-3 SP | B3, H3, H4 | — | SIM (decisão D1) |
| PROD-001-2 | Fixar @types/react@18 + pnpm install + tsc verde | 1 SP | B1 | — | SIM |
| PROD-001-3 | Aplicar migrations 009-011 no Supabase + regen tipos | 2 SP | B3, H3 | PROD-001-1 | SIM |
| PROD-001-4 | Parametrizar SUPABASE_PROJECT_ID | 1 SP | H4 | PROD-001-1 | SIM |
| PROD-001-5 | Vercel login jvdfcode + link projeto + commit project.json | 1 SP | B4, L7 | — | SIM |
| PROD-001-6 | Provisionar 11 env vars no Vercel production | 2 SP | B2 | PROD-001-1, PROD-001-5 | SIM |
| PROD-001-7 | Provisionar CRON_SECRET no Vercel (handler já implementado) | 0.5 SP | H2 | — | NÃO (paralelo) |
| PROD-001-8 | Deploy production + smoke test do build | 1 SP | B1, B2, B4 | PROD-001-2, PROD-001-5, PROD-001-6 | SIM |
| PROD-001-9 | Custom domain smartpreco.app + DNS Cloudflare (proxy OFF apex) | 2 SP | H9 | PROD-001-8 | SIM |
| PROD-001-10 | Publicar /privacidade e ativar CTA Lead Magnet | 2 SP | B5 | PROD-001-9, PROD-001-13 | SIM |
| PROD-001-11 | Smoke test E2E em produção + Sentry alarm test | 2 SP | H10, M8 | PROD-001-10 | NÃO (gate final) |
| PROD-001-12 | A11y fixes críticos no LeadMagnetForm (must-have paralelo) | 3 SP | H5, H6, H8 | — | NÃO (paralelo Dia 1-2) |
| PROD-001-13 | Instrumentar 4 eventos de funil + UTM | 2-3 SP | — | PROD-001-3 | SIM (bloqueia PROD-001-10) |

**Esforço total estimado v2:** ~30 SP (vs 28 SP na v1)
**Variações v1 → v2:** PROD-001-1 +1 SP, PROD-001-7 -0.5 SP, PROD-001-13 +2-3 SP

---

## Critérios de aceitação do epic

- [ ] `curl -sI https://smartpreco.app` retorna `HTTP/2 200`
- [ ] Login funciona com user real: cadastra → login → redireciona para `/dashboard`
- [ ] `/calculadora-livre` acessível sem auth, LeadMagnetForm renderiza e submete sem erro 500
- [ ] Lead capturado persiste em tabela `leads` do Supabase (verificar via Supabase dashboard ou `SELECT count(*) FROM leads`)
- [ ] `/api/track` recebe pageview e persiste em `funnel_events` (`POST /api/track` com payload `{ event: "pageview", page: "/calculadora-livre" }` retorna 200)
- [ ] Sentry recebe pelo menos 1 evento de teste (executar `Sentry.captureMessage("smoke-test")` e verificar no dashboard)
- [ ] Lighthouse A11y >= 90 em `/calculadora-livre`, `/precos`, `/login` (executar `pnpm lhci autorun` contra URL de produção)
- [ ] Cron Vercel registrado e protegido por `CRON_SECRET` (`curl -sI https://smartpreco.app/api/cron/cleanup-ml-cache` sem header retorna 401)
- [ ] CI passa em push direto a main (`gh run list --branch main --limit 3` mostra todos `completed/success`)
- [ ] `SELECT count(*) FROM funnel_events WHERE event_name IN ('calculo_iniciado', 'resultado_exibido', 'cta_clicado', 'email_submetido') > 0` após smoke test manual

---

## Dependências externas

| Dependência | Tipo | Requerida por |
|-------------|------|---------------|
| Vercel team `jvdfcode` com plano Pro ativo | Operacional | PROD-001-5, PROD-001-7 (cron confiável requer Pro — M4) |
| Cloudflare: acesso ao painel DNS de `smartpreco.app` | Operacional | PROD-001-9 |
| Supabase: decisão D1 + chaves do projeto correto | Decisão | PROD-001-1, 3, 4, 6 |
| Sentry: org e projeto criados com DSN disponível | Operacional | PROD-001-6, PROD-001-11 |
| GitHub Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_PROJECT_ID` | CI/CD | PROD-001-4, PROD-001-5 |

---

## Riscos do epic

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Decisão D1 atrasada bloqueia 4 stories em paralelo | CRÍTICA | Obter decisão D1 antes de iniciar o Sprint — é pré-requisito explícito |
| Propagação DNS Cloudflare > 30min causa downtime aparente | MÉDIA | Executar PROD-001-9 no início de um dia de trabalho; manter preview URL como fallback |
| Migrations 009-011 têm dependências não testadas em staging | ALTA | Executar `supabase migration list` antes do push; rodar contra branch de staging primeiro se disponível |
| Plano Hobby no Vercel suprime cron silenciosamente (M4) | MÉDIA | Confirmar plano Pro no team `jvdfcode` antes de PROD-001-5 |
| LGPD: capturar lead antes de `/privacidade` publicada | ALTA | PROD-001-10 bloqueia ativação do CTA — nunca ativar captura antes da rota estar no ar |
| **OMIE concorrência (risco aceito)** | MÉDIA | Lançamento cego de posicionamento; prazo 30 dias pós-GO para produzir MKT-001-3 (análise OMIE). Escopo de MKT-001, não deste epic. |

---

## Plano de rollback

- **Vercel:** reverter para deploy anterior via `vercel rollback <deployment-url>` ou via dashboard Vercel → Production → Previous deployment
- **DNS:** reapontar registros A no Cloudflare para IPs AWS anteriores (`15.197.148.33`, `3.33.130.190`) com proxy ON; o preview URL Vercel (`smartpreco-*.vercel.app`) continua acessível independente do DNS
- **Supabase:** migrations 009-011 não têm `rollback` automático — pré-aplicar e testar em staging ou branch Supabase antes de aplicar em produção; em caso de problema, reversão manual via `DROP TABLE leads CASCADE; DROP TABLE funnel_events CASCADE;` (dados serão perdidos)
- **types fix (B1):** reversão trivial via `git revert` se `pnpm install` introduzir regressão inesperada

---

*EPIC-PROD-001 v2 — gerado por @pm Morgan — 2026-04-28*
*v1: 2026-04-28 — gerado originalmente*
*v2: 2026-04-28 — absorve feedback do trio (Alan Nicolas + Pedro Valério + Thiago Finch)*
*Inputs: docs/reviews/prod-roadmap-2026-04-28/trio/sintese-trio.md*
