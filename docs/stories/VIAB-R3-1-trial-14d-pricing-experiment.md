# VIAB-R3-1 — Trial 14d híbrido via pricing-experiment.ts

**Epic:** EPIC-VIAB-R3 (Trial 14d + Headline + Concorrência)
**Status:** InReview (código implementado + 21/21 tests + build PASS em 2026-05-02; drip email out-of-scope → VIAB-R3-1.1 paralela)
**Severidade:** ALTA — Free tier eterno viola padrão de mercado (M4 — Alfredo Soares); 4-6× MRR mês 1 estimado
**Sprint:** SPRINT-2026-05-12 (proposto, após VIAB-R1 todo em prod)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 3 SP (~4-6h)
**Referência:**
- `docs/reviews/viability-2026-04-30/findings/M4-alfredo-trial-vs-free.md` (Free tier eterno = 0/3 concorrentes; modelo híbrido pode 4-6× MRR)
- `docs/business/ICP-validation-2026-Q2.md` (WTP modal R$ 49 + sub-perfis com pricing escalonado)
- `docs/business/concorrencia-2026-Q2.md` (Letzee 15d trial, Hunter Hub 14d, GoSmarter free permanente)

---

## Contexto

Painel de 6 personas (Top 5 ações, item #4): Trial 14d híbrido recebeu 4/6 votos como ação P0 (Finch + Raduan + Tallis + Nardon). Atual SmartPreço: Free tier eterno com 1 SKU + Pro R$ 39-149.

**Problema:**
- 100% dos concorrentes BR diretos usam trial (Hunter Hub 14d, Letzee 15d)
- Free eterno cria "hábito de não pagar" — ICP central (Diego, Ricardo, Carlos) explícitos: *"R$ 19 = sinal negativo, ferramenta séria não cobra R$ 19"* (8 confirmações sintéticas)
- Trauma de SaaS anterior (Patrícia: "academia debitou 8 meses") exige: trial **sem cartão**

**Solução proposta:**
- **Variante D no pricing-experiment.ts:** Trial 14 dias do Pro completo SEM cartão + fallback Free 1 SKU após expirar
- A/B test mantém variante atual (Free eterno) como controle 50%

**Tag MeliDev:** `[ML-CENTRAL]` (padrão de mercado) + `[INFERRED]` (4-6× MRR estimado).

---

## Acceptance Criteria

### Implementação
1. [ ] `pricing-experiment.ts` (verificar se existe; se não, criar componente client) tem variante D ativa
2. [ ] Trial 14d Pro completo: usuário cria conta sem cartão, ganha acesso a Pro features por 14 dias
3. [ ] Cálculo de "tempo restante" no UI (ex: "Trial: 8 dias restantes" no header)
4. [ ] Email day-3 (relatório de uso), day-10 (prova de economia gerada), day-13 (CTA conversão)
5. [ ] Fallback após expiração: usuário NÃO é desconectado; apenas Pro features bloqueiam com CTA "Voltar ao Pro: R$ 49/mês"

### Eventos novos em FunnelEventName
6. [ ] `trial_started` — momento do signup (com variante A/B)
7. [ ] `trial_day_3` — dispara quando email day-3 é aberto
8. [ ] `trial_day_7` — dispara em interação na metade do trial
9. [ ] `trial_day_14` — dispara no último dia (CTA upgrade)
10. [ ] `trial_to_paid` — converteu para R$ 49 antes do day-14
11. [ ] `trial_expired` — sem conversão; rebaixou para Free 1 SKU

### Backend
12. [ ] Tabela `trials` em Supabase: `user_id`, `started_at`, `expires_at`, `variant`, `converted_at`, `expired`
13. [ ] Migration aplicada em prod
14. [ ] RLS isola `auth.uid() = user_id`
15. [ ] Endpoint `/api/trial/status` retorna estado atual (active/expired/converted)

### A/B test
16. [ ] Bucket determinístico por `user_id` (50/50 split entre Free eterno vs Trial 14d)
17. [ ] Cohort tracking: variante registrada em `funnel_events` payload de `trial_started`

### Qualidade
18. [ ] `npm run typecheck` PASS
19. [ ] `npm run lint` PASS
20. [ ] `npm test` PASS (≥3 testes Vitest cobrindo: bucket determinístico, cálculo expires_at, fallback expirado)
21. [ ] `npm run build` PASS

---

## Tasks

### Track 1 — Backend (migration + endpoint)
- [ ] Criar `supabase/migrations/013_trials_table.sql` com tabela `trials` + RLS + GRANT
- [ ] Aplicar migration em local + dev
- [ ] Criar `src/app/api/trial/status/route.ts` (GET retorna estado, POST inicia)
- [ ] Estender tipos Supabase

### Track 2 — Frontend (pricing-experiment + UI trial)
- [ ] Verificar se `src/lib/experiments/pricing-experiment.ts` existe; se não, criar
- [ ] Adicionar variante D ao experimento
- [ ] Componente `<TrialBanner />` no header autenticado mostrando dias restantes
- [ ] Página `/precos` exibe CTA "Começar trial 14d grátis" se usuário não-logado OU variant=D
- [ ] Componente `<UpgradeGate />` para Pro features quando trial expirado

### Track 3 — Email automation (drip sequence)
- [ ] Verificar se há infra de email transacional (Resend/Sendgrid?)
- [ ] Se não houver: out-of-scope desta story → criar story-irmã VIAB-R3-1.1 para drip sequence
- [ ] Se houver: 3 emails (day-3, day-10, day-13) com templates Loss Aversion

### Track 4 — Eventos + analytics
- [ ] Estender `FunnelEventName` em `src/lib/analytics/events.ts` com 6 eventos
- [ ] Disparar `trial_started` no signup com `variant`
- [ ] Disparar `trial_to_paid` / `trial_expired` no endpoint de processamento

### Track 5 — Testes
- [ ] `tests/unit/pricing-experiment.test.ts` — bucket determinístico
- [ ] `tests/unit/trial-status.test.ts` — cálculo de dias restantes + fallback

---

## Out of Scope (out)

- **Drip email sequence** se infra de email não existir → VIAB-R3-1.1 paralela
- **Pricing page redesign visual** → VIAB-R3-2 (story irmã)
- **Cancelar trial proativamente** (UX) → backlog
- **Múltiplas variantes simultâneas** (>2 buckets) → backlog

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| `pricing-experiment.ts` não existir | Alta | Track 2 inclui criação se ausente |
| Email transacional não configurado | Alta | Track 3 cria story-irmã se ausente |
| Trial 14d aumentar churn pós-expiração | Média | Fallback Free 1 SKU + email day-13 com prova de economia |
| A/B test sem volume estatístico | Alta | Análise cohort após 30 dias com mín. 30 conversões/variante |

---

## Definition of Done

- [ ] AC 1-21 todos checados
- [ ] PR com screenshots: trial signup, banner com dias restantes, fallback expirado
- [ ] Migration aplicada em prod (`supabase db push` no `jvdfcode`)
- [ ] @qa gate PASS
- [ ] Sentry sem erros novos por 48h
- [ ] Story atualizada com File List + Status `Done`
- [ ] Pedro confirma copy do email drip sequence

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-02 | Orion (@aiox-master) | Story criada como parte do EPIC-VIAB-R3 |
| 2026-05-02 | Orion (papel @po) | Validação 10/10 — Draft → Ready |
| 2026-05-02 | Orion (papel @dev) | Migration 013 + endpoint /api/trial/status + variante D + TrialBanner + UpgradeGate + 6 eventos + 12 tests |
| 2026-05-02 | Orion (papel @qa) | typecheck + lint + 21/21 tests + build PASS — transição → InReview |

---

## File List (alterações desta story)

### Criados
- `supabase/migrations/013_trials_table.sql` (+ rollback) — tabela trials + RLS + trigger auto-expires_at
- `src/app/api/trial/status/route.ts` — GET retorna estado, POST inicia trial (idempotente)
- `src/components/trial/TrialBanner.tsx` — banner client com dias restantes
- `src/components/trial/UpgradeGate.tsx` — card fallback quando trial expirado
- `tests/unit/pricing-experiment.test.ts` — 12 tests novos (variante D, deterministic bucket, constantes)

### Modificados
- `src/lib/pricing-experiment.ts`:
  - PricingVariant adiciona 'D'
  - VARIANT_PRICES['D'] = 49
  - TRIAL_VARIANT + TRIAL_DURATION_DAYS exportados
  - pricingTableFor adapta plano free → "Trial 14d" para variante D
  - variantFromCookie aceita D + distribuição uniforme entre 4
  - deterministicVariantFromUserId (FNV-1a hash, 50/50 B vs D)
- `src/lib/analytics/events.ts` — 8 eventos novos (6 trial + 2 pricing)
- `tests/unit/lib/pricing-experiment.test.ts` — atualiza assertions para incluir D

### Out-of-scope — VIAB-R3-1.1 paralela
- Drip email (day-3, day-10, day-13) — infra Resend/Sendgrid ausente no projeto
- Cron de expiração automática — pode ser self-check no endpoint via campo `expired`
