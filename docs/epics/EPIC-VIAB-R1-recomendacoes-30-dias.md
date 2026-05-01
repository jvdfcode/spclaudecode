# EPIC-VIAB-R1 — Recomendações 30 dias do relatório de viabilidade

**Versão:** v1 (2026-05-01)
**Workflow:** viability-2026-04-30 → execução
**Owner:** Pedro Emilio Ferreira (executor: @dev Dex via handoff)
**Data:** 2026-05-01
**Sprint alvo:** SPRINT-2026-05-05 (proposto, 1 semana)
**Origem:** `docs/reviews/viability-2026-04-30/01-meli-viability.md` (R1 — Recomendações 30 dias)
**Calibração mundial:** `docs/reviews/world-benchmark-2026-05-01/02-pontuacao-mundial.md` (4.2/10 nível mundial → projetado 5.0/10 após R1)

---

## Objetivo

Endereçar as 3 críticas P0 técnicas/funil identificadas na análise de viabilidade da squad MeliDev (5.0/10 funcional + 5.0/10 mercadológico) e na pontuação mundial multi-agente (4.2/10). As 3 stories filhas removem riscos imediatos em produção (race condition OAuth ATIVA), eliminam buraco fatal de aquisição (home pública inexistente) e endereçam violação documentada de boa prática [ML-OFFICIAL] (sem backoff em 429).

---

## Justificativa de negócio

Cada dia sem fix do **F2 (race condition OAuth)** é roleta em produção: 100+ vendedores conectando em paralelo podem perder conexão silenciosamente, gerando suporte em fogo e churn invisível. Cada dia sem **landing pública (M6)** é tráfego frio descartado — todo investimento em SEO, ads ou link building no domínio raiz tem ROI zero. Cada dia sem **backoff (F3)** é dependência crítica não-mitigada com a API ML — uma mudança de rate limit ou status 429 pode parar vendas. As 3 stories juntas movem o produto de "MVP funcional com débitos críticos" para "tier Sellerboard early" (5.0-5.5/10 mundial), desbloqueando R2 (entrevistas ICP) e R3 (A/B test Trial 14d) sem retrabalho.

---

## Stories incluídas

| ID | Título | Esforço | Severidade origem | Depends-on | Bloqueador? |
|----|--------|---------|-------------------|------------|-------------|
| VIAB-R1-1 | Fix race condition OAuth ML (advisory lock acessível) | 2 SP | F2 — CRITICAL | — | SIM (P0 ATIVA em prod) |
| VIAB-R1-2 | Landing pública em `/` com headline Loss Aversion | 3 SP | M6 — CRITICAL | — | SIM (buraco fatal funil) |
| VIAB-R1-3 | Backoff exponencial em ML API + plano fallback | 2 SP | F3 — HIGH | — | NÃO (independente, paralelo) |

**Total:** 7 SP em 3 stories. Todas independentes — podem ser executadas em paralelo se houver mais de um executor `@dev`.

---

## Pré-requisitos (decisões antes do Sprint começar)

- **D1 (VIAB-R1-1):** Opção A (GRANT EXECUTE TO authenticated), B (refatorar para service_role) ou C (wrapper SECURITY DEFINER)? — recomendação Aria/Orion: A (least-privilege)
- **D2 (VIAB-R1-2):** Headline final entre Alternativas A/B/C do M6 (Pedro escolhe + número defensável)
- **D3 (VIAB-R1-3):** Confirmação de remoção do `ml-proxy/route.ts` scraping nesta story OU em VIAB-R1-3.1 (recomendação: split — backoff agora, eliminar scraping em sprint posterior)

---

## Critério de "epic done"

- [ ] VIAB-R1-1 em status `Done` (race condition fix em prod, Sentry sem novos erros 48h)
- [ ] VIAB-R1-2 em status `Done` (`/` retorna landing real, Lighthouse ≥ 90, Pedro confirma copy)
- [ ] VIAB-R1-3 em status `Done` (backoff implementado, `ml-platform-risk-fallback.md` revisado)
- [ ] Pontuação mundial reavaliada — meta: subir de 4.2/10 para ≥ 5.0/10 (relatório `02-pontuacao-mundial.md` atualizado)
- [ ] Sprint retrospective registrada em `docs/sessions/` ou vault Obsidian

---

## Riscos do epic

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| VIAB-R1-1 quebrar conexões existentes em prod | Baixa | Smoke test com conta teste antes do deploy; rollback simples (`REVOKE`) |
| VIAB-R1-2 publicar headline com R$ 847 não defensável | Média | Track 1 da story valida copy com Pedro antes do PR final |
| VIAB-R1-3 ampliar latência percebida pelo usuário | Média | UI mostra "tentando novamente" após 5s; backoff total max 62s no pior caso |
| Stories ficarem em Draft sem `@po` validar | Alta | Pedro/PO transição Draft→Ready em sessão dedicada |
| R2 (entrevistas ICP) atrasar e bloquear R3 | Média | R1 é independente de R2/R3 — não bloqueia em si |

---

## Recomendações não absorvidas neste epic

### Eliminação completa do scraping HTML (`ml-proxy/route.ts`)

**Não absorvida.** F3 identificou que `src/app/api/ml-proxy/route.ts` faz scraping com Cheerio + User-Agent falso — bomba-relógio. Eliminar completamente exige análise de quais queries dependem do scraping vs API oficial. Esta story (VIAB-R1-3) faz o **fix mínimo** (backoff) e cria documento `ml-platform-risk-fallback.md`. Eliminação completa fica para `VIAB-R1-3.1` em sprint posterior, com análise técnica como prerequisito.

### Criptografia at-rest do refresh_token (F2 Finding 3)

**Não absorvida.** F2 Finding 3 indica que `refresh_token` é texto plano em `006_ml_tokens.sql:8`. Fix é não-trivial (requer `pgsodium` + migration de dados existentes). Movido para backlog técnico — impacto é alto se houver breach do banco, mas não é race ATIVA como o Finding 1.

### Reescrita da headline `/precos` (M6 Finding 2)

**Não absorvida neste epic.** M6 Finding 2 indica que headline `/precos` é feature-first ("motor de decisão mais preciso"). Faz parte de R3 (A/B test Trial 14d + reescrever pricing) — não é P0 imediato como home pública (M6 Finding 1). Movido para `VIAB-R3` que depende de R1+R2 entregues primeiro.

---

## Próxima ação

1. **Pedro Emilio (papel @po):** invocar `@po *validate-story-draft VIAB-R1-1` (10-point checklist) → transição `Draft → Ready` se GO
2. **Executor `@dev`:** após Ready, invocar `@dev *develop-story VIAB-R1-1`
3. **`@devops`:** push do epic + commits desta sessão (`@devops *push`)
4. **Pedro:** agendar 5 entrevistas ICP em paralelo (R2, não bloqueia R1)

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-01 | Orion (@aiox-master) | Epic criado consolidando 3 stories VIAB-R1 já em Draft |
