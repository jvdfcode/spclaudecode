# Changelog Sprint Plan v1 → v2

**Data:** 2026-04-28
**Origem do feedback:** Trio Alan Nicolas + Pedro Valério + Thiago Finch
**Síntese:** docs/reviews/prod-roadmap-2026-04-28/trio/sintese-trio.md

## Mudanças aplicadas (9 obrigatórias absorvidas)

### Mudanças globais

1. **Owner pessoa-física em 13/13 stories** — formato canônico: `Pedro Emilio` para stories interativas (1, 5, 6, 9, 10), `Pedro Emilio (executor: @dev Dex via handoff)` para stories de código (2, 3, 4, 7, 8, 11, 12, 13). Resolve veto absoluto sem perder ergonomia humano-no-loop do AIOX. Origem: VETO Pedro Valério.

2. **Rollback in-line em stories 3, 5, 6, 8, 9** — antes apenas no epic, agora cada story declara procedimento binário in-line no campo de riscos e no critério GO/NO-GO do sprint. Sprint v2 incorpora os rollbacks dos riscos R3 (DNS) e R6 (migrations) na seção de riscos com procedimentos explícitos. Origem: VETO Pedro Valério.

### Mudanças por story

3. **PROD-001-1** — re-estimada de 1 SP para 2-3 SP (média 2.5 SP no burndown). Razão: decisão D1 + criação de projeto se novo + link + 4 chaves + migração 001-011 = 2-3h, não 1h conforme documentado por Alan. Origem: Alan Nicolas (subestimação).

4. **PROD-001-2** — AC vinculado a `ci.yml:38-39`. O gate `check:react-types-major` no CI já cobre o cenário pós-fix; a story em v2 deve referenciar essa linha para confirmar cobertura auditável. Origem: Pedro Valério (gate não-referenciado).

5. **PROD-001-7** — REESCRITA completa, SP 1 → 0.5. O handler `route.ts:7-8` JÁ implementa a validação de `CRON_SECRET`. A story v2 foca exclusivamente em: gerar o secret, executar `vercel env add CRON_SECRET production`, atualizar `.env.example`. Sem modificação de código. Titulo atualizado: "Provisionar CRON_SECRET no Vercel env". Origem: Pedro Valério (story desatualizada — código já existe).

6. **PROD-001-8** — semântica clarificada. O deploy com `--prod` é production deploy real, condicional ao DNS (PROD-001-9) estar configurado. Título atualizado: "Deploy production (condicional DNS) + smoke test do build". Story v2 declara explicitamente que o flag `--prod` só é usado após PROD-001-9 Done. Origem: Alan Nicolas (ruído semântico).

7. **PROD-001-11** — M5 (middleware.test) movido para backlog. Gate final do sprint mantém apenas smoke test Sentry + curl de rotas críticas. A story `middleware.test.ts` é criada como item de backlog pós-sprint (M5 na seção Deferred do sprint). Origem: Alan Nicolas (escopo misturado).

8. **PROD-001-12** — elevada de "should-have/deferrable" para **must-have paralelo**. Touch targets de 30px num produto mobile-first (vendedores do Mercado Livre usando celular) quebram o funil de conversão — é bloqueador real de GO, não opcional. Executar Dia 1-2 em paralelo, sem condicional. Origem: Alan Nicolas + Thiago Finch (mobile tap target afeta funil).

### Story nova

9. **PROD-001-13 CRIADA** — Instrumentação 4 eventos de funil + UTM persistence. Eventos: `calculo_iniciado → resultado_exibido → cta_clicado → email_submetido`. Inclui campos UTM em `funnel_events` (`utm_source`, `utm_medium`, `utm_campaign`). SP: 2-3 (média 2.5 no burndown). Bloqueia PROD-001-10 — CTA de captura de lead deve estar instrumentado antes de ser ativado. Prioridade: Dia 1-2 paralelo. Critério de DoD adicionado ao sprint: `SELECT count(*) FROM funnel_events WHERE event_name IN ('calculo_iniciado', 'resultado_exibido', 'cta_clicado', 'email_submetido') > 0`. Origem: Thiago Finch (sprint cego sem instrumentação — "loja sem caixa registradora").

---

## Mudanças NÃO absorvidas (decisão consciente)

### N1 — OMIE concorrência (Finch)

- **Sugestão:** Observar posicionamento de concorrentes (OMIE) antes de lançar; `concorrencia-2026-Q2.md` é template vazio.
- **Decisão:** NÃO ABSORVIDA no sprint PROD-001.
- **Justificativa:** OMIE de concorrência é escopo do EPIC-MKT-001 (validação de mercado), não do PROD-001 (caminho de produção). O sprint PROD-001 tem objetivo único: `smartpreco.app` no ar com funil funcional. Lançar com posicionamento como hipótese é decisão consciente — entrevistas ICP conduzidas por @analyst Alex nas primeiras 2 semanas pós-GO calibram a mensagem sem bloquear o lançamento.
- **Risco aceito documentado:** R8 no SPRINT v2. Prazo: 30 dias pós-GO para revisitar posicionamento.

### N2 — PROD-001-4 depriorizar (Alan + Finch)

- **Sugestão:** Mover parametrizar `SUPABASE_PROJECT_ID` para backlog pós-GO (Alan: PRATA; Finch: higiene CI sem ROI imediato).
- **Decisão:** MANTIDA no sprint com 2 SP.
- **Justificativa:** Débito de hardcode cresce com o tempo — cada nova referência ao project ID é um ponto de falha adicional. Custo é baixo (1 SP, ~1h de trabalho). Resolver agora evita que vire incidente em sprint futuro quando o projeto crescer. Pedro Valério aceitou a story se houver owner nomeado — owner adicionado em v2.

---

## Impacto na capacity

| Métrica | v1 | v2 |
|---------|----|----|
| Total de stories | 12 | 13 |
| Total SP | 28 | ~30 |
| Capacity (1 dev / 1 semana) | 30h | 30h |
| Folga estimada | 2h | 0h |

**Atenção:** v2 está no limite da capacity. Amortecedores:
- PROD-001-7 reduzida de 1 SP para 0.5 SP libera ~30min.
- Priorizar PROD-001-13 no Dia 1-2 evita que bloqueie PROD-001-10 no Dia 4.
- Se emergirem bloqueios externos (DNS, Supabase), PROD-001-4 (2 SP) é candidata a carryover sem risco de produção.

---

## Vereditos pós-ajuste (esperados)

- **Pedro Valério:** VETOS resolvidos — owners pessoa-física em 13/13, rollbacks in-line, PROD-001-7 reescrita (handler já existe, story foca em provisionamento), PROD-001-2 referencia `ci.yml:38-39`.
- **Alan Nicolas:** APPROVE confirmado — núcleo intacto, PROD-001-12 elevada para must-have, PROD-001-11 com M5 removido, PROD-001-8 com semântica clarificada, PROD-001-1 re-estimada.
- **Thiago Finch:** APPROVE esperado — PROD-001-13 adicionada (instrumentação funil), critério de DoD de eventos adicionado ao sprint, risco R8 (OMIE) documentado como aceito com data de revisão.

---

*Changelog gerado por @sm River — 2026-04-28*
*Inputs: sintese-trio.md + SPRINT-2026-04-28 v1*
