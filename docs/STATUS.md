# Status do Projeto SmartPreço

**Última atualização:** 2026-05-02 (VIAB-R1-2 + VIAB-R1-2.1 implementados após debate de 3 specialists)
**Snapshot mantido por:** Orion (@aiox-master) ao final de cada sessão significativa

> Este arquivo é o **ponto de entrada de continuidade**: leia primeiro para saber onde paramos sem precisar reler 6+ docs.

---

## Estado atual

**Produção:** ativa em https://smartpreco.app (SSL emitido em 2026-04-30 via PROD-001-14)
**Branch principal:** `main` (4 commits ahead de `origin/main` em 2026-05-01 — pendente push via `@devops`)
**Última pontuação mundial:** **4.2/10** (painel multi-agente — `docs/reviews/world-benchmark-2026-05-01/02-pontuacao-mundial.md`)
**Última pontuação interna:** 5.0/10 funcional + 5.0/10 mercadológico (squad MeliDev — `docs/reviews/viability-2026-04-30/01-meli-viability.md`)

---

## Epics ativos

| Epic | Status | Owner | Stories | Próximo passo |
|------|:------:|-------|---------|---------------|
| **EPIC-PROD-001** — Caminho à produção | ✅ Done | Pedro Emilio + @pm | 13/13 | — |
| **EPIC-MKT-001** — Validação de mercado | 🟡 InProgress | Pedro Emilio | 5 (entrevistas ICP MKT-001-2 pendentes) | R2 do roadmap (5 entrevistas, 7.5h em 14 dias) |
| **EPIC-VIAB-R1** — Recomendações 30 dias | 🟢 InReview (3/4) | Pedro Emilio (executor: @dev) | R1-1, R1-2, R1-2.1 InReview · R1-3 Draft | Apply migration 012 prod + review preview Vercel da landing |
| **EPIC-TD-001** — Debt paydown H1 | 📋 Backlog | — | — | — |

---

## Sessão 2026-05-01 — Resumo

### Deliverables produzidos (4 commits, NÃO pushed)

```
c3f9277 docs(viability): plano v3 + relatório consolidado + 11 findings (squad MeliDev)
66894fc docs(viability): marcar plano v2 como SUPERSEDED por v3
581b4dd docs(stories): EPIC-VIAB-R1 — 3 stories críticas
e57c46d docs(benchmark): pontuação mundial SmartPreço 4.2/10 vs 10 concorrentes
```

### Documentos criados

- `docs/reviews/viability-2026-04-30/00-plano-v3.md` — plano de execução com squad MeliDev
- `docs/reviews/viability-2026-04-30/01-meli-viability.md` — relatório consolidado (5.0/10 + 5.0/10)
- `docs/reviews/viability-2026-04-30/findings/F1-F3 + M1-M8b` — 11 findings detalhados
- `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` — 10 concorrentes mundiais (Helium 10, Sellerboard, Nubimetrics, etc.)
- `docs/reviews/world-benchmark-2026-05-01/02-pontuacao-mundial.md` — painel 4 agentes (Aria/Uma/Alfredo/Finch) → **4.2/10**
- `docs/stories/VIAB-R1-1-fix-race-condition-oauth-ml.md` — 2 SP, P0 ATIVA em prod
- `docs/stories/VIAB-R1-2-landing-publica-home.md` — 3 SP, buraco fatal funil
- `docs/stories/VIAB-R1-3-backoff-ml-api.md` — 2 SP, hardening ML API
- `docs/epics/EPIC-VIAB-R1-recomendacoes-30-dias.md` — header agregando 3 stories

---

## 4 Críticas P0 ativas

| # | Achado | Story relacionada | Status |
|---|--------|-------------------|:------:|
| F2 | Race condition OAuth ATIVA (`acquire_user_lock` inacessível) | VIAB-R1-1 | 🟢 InReview (apply migration pendente) |
| M6 | Home `/` redireciona pra `/dashboard` — sem landing pública | VIAB-R1-2 + R1-2.1 | 🟢 InReview (preview Vercel pendente) |
| M1 | ICP é demografia genérica, zero entrevistas | R2 (não delegável) | 📋 Backlog |
| F3 | Scraping HTML + ML lançou calculadora oficial 2026 | VIAB-R1-3 | 🟡 Draft |

---

## Próximos passos imediatos (priorizados)

### Apply em prod (Pedro/devops)
1. **Aplicar migration 012** no Supabase prod (`jvdfcode`) — `supabase db push` ou via dashboard
2. **Regenerar tipos** Supabase (não é estritamente necessário — migration 012 não altera schema, apenas permissions)
3. **Smoke test manual** — conectar conta ML de teste, verificar refresh OK e Sentry sem `lock_error`
4. **Monitorar Sentry 48h** — DoD final de VIAB-R1-1

### Sprint imediato (próxima sessão)
5. **VIAB-R1-3** (backoff ML API) — mesmo workflow @po → @dev → @qa
6. **R3** (após R1+R2) — Trial 14d via pricing-experiment.ts + reescrever headline /precos

### Trabalho humano (Pedro, não delegável)
5. **Agendar 5 entrevistas ICP** (R2, ~7.5h em 14 dias) — destrava todas as decisões mercadológicas

### Pós R1+R2
6. **VIAB-R3** (backlog) — A/B test Trial 14d vs Free + reescrever headline `/precos`

---

## Cenários projetados (90 dias)

| Cenário | Nota mundial projetada | Tier |
|---------|:----------------------:|------|
| Inação | 3.5/10 (decai) | Pré-MVP |
| R1 técnico (VIAB-R1-1/2/3) | **5.0/10** | Produto funcional |
| + R2 ICP validado | 5.8/10 | Produto-mercado early |
| + R3 Trial 14d | 6.5/10 | Tier Sellerboard early |
| + comunidade externa (6m) | 7.2/10 | Tier Sellerboard maduro |

---

## Pontos de atenção / dívidas conhecidas

- **`ml-proxy/route.ts` scraping HTML** — bomba-relógio; eliminação completa em VIAB-R1-3.1 (sprint posterior)
- **`refresh_token` em texto plano** (006_ml_tokens.sql:8) — F2 Finding 3, backlog técnico (`pgsodium`)
- **Headline `/precos`** feature-first — endereçada em VIAB-R3, não R1
- **`squads/melidev/data/ml-sources-registry.yaml`** — verificar `last_verified` ≤ 90 dias antes de cada uso
- **Threats de mercado:** Pacvue/Helium 10 ($1B valuation) pode entrar LATAM em 12-24m; calculadora oficial ML em evolução

---

## Como atualizar este arquivo

Ao final de cada sessão significativa:
1. Atualizar "Última atualização" no topo
2. Atualizar "Estado atual" se houve deploy/merge
3. Adicionar seção "Sessão YYYY-MM-DD — Resumo" com commits + deliverables
4. Atualizar tabela "Epics ativos" se status mudou
5. Atualizar "Próximos passos imediatos" reordenando prioridades

Padrão: append-only para histórico, edição apenas em "Estado atual" e "Próximos passos".
