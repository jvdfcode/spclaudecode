# Status do Projeto SmartPreço

**Última atualização:** 2026-05-02 (quádruplo end-to-end: VIAB-R3-1 + R3-2 implementados + SWOT/Canvas/BP via @strategist + comparativo SmartPreço vs Letzee 8 personas)
**Snapshot mantido por:** Orion (@aiox-master) ao final de cada sessão significativa

> Este arquivo é o **ponto de entrada de continuidade**: leia primeiro para saber onde paramos sem precisar reler 6+ docs.

---

## Estado atual

**Produção:** ativa em https://smartpreco.app (SSL emitido em 2026-04-30 via PROD-001-14)
**Branch principal:** `main` (4 commits ahead de `origin/main` em 2026-05-01 — pendente push via `@devops`)
**Última pontuação mundial:** **3.85/10** (painel 6 personas 2026-05-02 — `docs/reviews/painel-6-personas-2026-05-02/01-pontuacao-painel.md`); painel anterior 4.2/10 (4 agentes)
**Última pontuação interna:** 5.0/10 funcional + 5.0/10 mercadológico (squad MeliDev — `docs/reviews/viability-2026-04-30/01-meli-viability.md`)

---

## Epics ativos

| Epic | Status | Owner | Stories | Próximo passo |
|------|:------:|-------|---------|---------------|
| **EPIC-PROD-001** — Caminho à produção | ✅ Done | Pedro Emilio + @pm | 13/13 | — |
| **EPIC-MKT-001** — Validação de mercado | 🟢 InReview parcial | Pedro Emilio | MKT-001-2 v1 SINTÉTICA executada (10 entrevistas sintéticas + Método B + C) | Validar ≥3 findings com vendedor real (mês 2-3) |
| **EPIC-VIAB-R1** — Recomendações 30 dias | 🟢 InReview (4/4) ✅ | Pedro Emilio (executor: @dev) | R1-1, R1-2, R1-2.1, R1-3 InReview | Apply migration 012 prod + review preview Vercel + smoke 48h |
| **EPIC-VIAB-R3** — Trial 14d + Headline + Concorrência | 🟢 InReview (2/3) | Pedro Emilio (executor: @dev) | R3-1 + R3-2 InReview · R3-3 Draft | Apply migration 013 + promote /precos prod + R3-3 (bloco concorrência) |
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
| M1 | ICP é demografia genérica, zero entrevistas | MKT-001-2 v1 sintética + R2 real | 🟢 InReview parcial (sintético OK, real pendente) |
| F3 | Scraping HTML + ML lançou calculadora oficial 2026 | VIAB-R1-3 | 🟢 InReview (backoff implementado; eliminação scraping → R1-3.1 backlog) |

---

## Próximos passos imediatos (priorizados)

### Apply em prod (Pedro/devops) — URGENTE pelo painel 6 personas
1. **Aplicar migration 012** no Supabase prod (`jvdfcode`) — race condition F2 ATIVA
2. **Promote VIAB-R1-2** para prod após review do preview Vercel
3. **Smoke test manual** — conectar conta ML, verificar refresh OK + Sentry sem `lock_error`
4. **Monitorar Sentry 48h** — DoD final de VIAB-R1-1

### Trabalho humano P0 (Pedro)
5. **Validar ICP v1 sintética com ≥3 vendedores reais** (mês 2-3) — 7 findings priorizados em `docs/business/ICP-validation-2026-Q2.md` seção 8
6. **Plantar 1 post útil em 1 grupo FB ML** ("Vendedores ML BR" 60k — canal #1 confirmado pela tripla)
7. **Decisão de pricing definitivo R$39 vs R$49** aguarda 3+ entrevistas reais (não bloqueia VIAB-R1-3)

### P0 do painel comparativo Letzee (8/8 personas votam unânime)
5. **Aplicar Certificação App ML** (developers.mercadolivre.com.br) — 4-8 semanas, P0 não-negociável
6. **Decisão founder full-time vs vender tese** — 90 dias gate Nardon
7. **Plantar 1 post útil no FB "Vendedores ML BR" 60k** — esta semana, custo zero
8. **Migrar scraping HTML → API oficial ML** após cert (VIAB-R1-3.1 backlog)

### Sprint próxima sessão (após Pedro decisões)
9. **VIAB-R3-3** (bloco concorrência /precos) — última story do EPIC-VIAB-R3
10. **PROD-002** (cert ML) — criar story dedicada
11. **PROD-003** (Chrome Extension MVP) — paridade Letzee point-of-decision

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
