# VIAB-R1-3 — Backoff exponencial em ML API + plano fallback documentado

**Epic:** EPIC-VIAB-R1 (Recomendações 30 dias do relatório de viabilidade 2026-04-30)
**Status:** Draft
**Severidade:** ALTA — viola VB006 [ML-OFFICIAL]; risco de plataforma documentado mas não mitigado
**Sprint:** SPRINT-2026-05-05 (proposto)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 2 SP (~3-4h)
**Referência:** `docs/reviews/viability-2026-04-30/findings/F3-risco-plataforma-ml.md` (Cenário B + 4 gaps críticos)

---

## Contexto

A análise de viabilidade da squad MeliDev (`@melidev *explain rate-limit-and-policy-volatility` + `@meli-ops *explain-policy mudancas-de-API`) identificou em F3 que SmartPreço tem dependência **crítica e parcialmente mitigada** da API do Mercado Livre:

**Gaps críticos identificados:**
1. `searchMlApi` faz `throw new Error` em qualquer não-200 sem retry nem backoff — **viola VB006 [ML-OFFICIAL]**
2. Sem monitoramento de 429 (rate limit) via Sentry
3. Scraping HTML em `src/app/api/ml-proxy/route.ts:15-27` com Cheerio + User-Agent falso — bomba-relógio
4. ML lançou calculadora oficial em 2026 — sem plano fallback documentado para Cenário A (ameaça existencial)

**Fix mínimo proposto (R1):** backoff exponencial em 429 + monitoramento + documentação fallback para ≥1 cenário. A eliminação completa do scraping HTML fica para sprint posterior.

**Tags MeliDev:** `[ML-OFFICIAL]` (rate limit) + `[ML-POLICY-CHANGES]` + `[INFERRED]`.

---

## Acceptance Criteria

1. [ ] `searchMlApi` (em `src/lib/ml-api.ts` ou módulo equivalente) implementa retry com backoff exponencial em status 429 — máximo 5 tentativas com delays `2^n × 1000ms` (2s, 4s, 8s, 16s, 32s) + jitter ≤500ms
2. [ ] Após 5 tentativas falhas, retorna erro estruturado (não 502 cru) — frontend pode fazer fallback graceful
3. [ ] Status 5xx do ML também respeita backoff (mesma lógica, max 3 tentativas)
4. [ ] Sentry captura evento customizado `ml_api_rate_limited` com `user_id`, `endpoint`, `attempt_count` quando 429 ocorre
5. [ ] Sentry captura `ml_api_exhausted` quando 5 tentativas falham
6. [ ] Documento `docs/architecture/ml-platform-risk-fallback.md` criado cobrindo:
   - Cenário A (ML lança calculadora oficial) — narrativa de diferenciação documentada
   - Cenário B (ML muda rate limit) — backoff implementado nesta story + cache TTL atual
   - Cenário C (ML bane IP Vercel) — fallback client-side em `MarketSearch.tsx:103` documentado como estratégia
7. [ ] Smoke test: simular 429 via mock fetch → confirmar 5 tentativas com delays corretos (testar timing com Jest fake timers)
8. [ ] `npm run typecheck` e `npm run lint` passam
9. [ ] Health check endpoint `GET /api/health/ml` (opcional para esta story — pode ir para backlog)

---

## Tasks

### Track 1 — Backoff exponencial

- [ ] Criar utility `src/lib/utils/exponential-backoff.ts` com função `withBackoff(fn, opts)`:
  - `opts.maxRetries: number` (default 5)
  - `opts.baseDelayMs: number` (default 1000)
  - `opts.retryOn: (response | error) => boolean` (default: 429 + 5xx)
  - `opts.jitterMs: number` (default 500)
  - Logging via callback `opts.onRetry(attempt, delay, reason)`
- [ ] Refatorar `searchMlApi` (em `src/lib/ml-api.ts`) para usar `withBackoff`
- [ ] Refatorar `refreshToken` (mesma lib) — endereça F2 Finding 4 secundariamente
- [ ] Cobertura de testes unitários ≥80% em `exponential-backoff.ts` (cases: success first try, retry on 429, retry on 5xx, exhaustion, jitter)

### Track 2 — Observabilidade

- [ ] Integrar Sentry capture em `withBackoff` (eventos `ml_api_rate_limited` e `ml_api_exhausted`)
- [ ] Adicionar contexto Sentry: `endpoint`, `user_id` (via Sentry user scope já configurado), `attempt_count`, `delay_ms`
- [ ] Adicionar dashboard query no Sentry (issue type: ml_api_rate_limited) — documentar URL no PR

### Track 3 — Documentação fallback

- [ ] Criar `docs/architecture/ml-platform-risk-fallback.md` com seções:
  - Resumo executivo (3 cenários A/B/C de F3)
  - Cenário A — Estratégia de diferenciação ("inteligência comparativa de mercado como core value")
  - Cenário B — Implementação atual (backoff + cache + degradação client-side)
  - Cenário C — Plano de recuperação (registro app oficial ML; eliminação scraping)
  - Sinais de alerta (% de 429, queda em conversão calculadora-livre)
  - Checklist trimestral de revisão
- [ ] Linkar documento em `docs/architecture/README.md` (se existir) ou em `docs/INDEX.md`

### Track 4 — Validação

- [ ] Teste unitário com `jest.useFakeTimers()` simulando 4×429 + 1×200 → retry sequence correta
- [ ] Teste unitário simulando 5×429 → exhaustion + Sentry capture
- [ ] Validar manualmente em preview Vercel: stub de fetch retornando 429 (via feature flag dev) → ver Sentry event chegando

---

## Out of Scope (será endereçado em stories futuras)

- Eliminação completa do scraping HTML em `ml-proxy/route.ts` → VIAB-R1-3.1 (dependência: análise técnica sobre quais queries dependem do scraping vs API oficial)
- Health check endpoint `/api/health/ml` → backlog técnico (AC 9 é opcional)
- Validação runtime de taxas hardcoded em `mercadolivre.config.ts` → backlog (gap #3 de F3)
- Reescrita da narrativa landing diferenciando do "ML oficial" → VIAB-R1-2 (story irmã trata da landing)

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Backoff ampliar latência percebida pelo usuário | Média | Limite total: 2+4+8+16+32 = 62s no pior caso. UI deve mostrar "tentando novamente" após 5s. Documentar no PR. |
| Jitter mal implementado causa thundering herd | Baixa | Jitter aleatório 0-500ms por retry; testes unitários cobrem distribuição |
| Sentry capture inflar custo de plano | Baixa | Usar `Sentry.captureMessage` (não `captureException`) com nível `warning`; sample rate configurável |
| ML mudar rate limit antes de 30 dias | Alta | Backoff é robusto a mudanças de threshold; documentação `[ML-POLICY-CHANGES]` revalidada trimestralmente |

---

## Definition of Done

- [ ] AC 1-8 todos checados (AC 9 opcional documentado)
- [ ] PR aberto para `main` com gate @qa PASS
- [ ] Documento `ml-platform-risk-fallback.md` revisado por Pedro Emilio
- [ ] Sentry confirma eventos novos chegando após deploy preview
- [ ] Story atualizada com File List final + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-01 | Orion (aiox-master) | Story criada a partir de F3 Cenário B + 4 gaps críticos |
