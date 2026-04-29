# QA Gate Review — Fase 7 (Brownfield Discovery)

**Data:** 2026-04-27
**QA Gate:** @qa (Quinn)
**Veredito:** APPROVED

---

## 1. Resumo do veredito

O conjunto de artefatos (draft Fase 4 + review Dara Fase 5 + review Uma Fase 6) forma uma base sólida e coerente para gerar o `technical-debt-assessment.md` final. A cobertura é ampla — 41 débitos no draft, enriquecidos com 4 débitos DB adicionais (Dara) e 8 débitos FE adicionais (Uma) — totalizando 53 itens inventariados. As evidências são concretas (arquivo:linha em todos os CRITICAL/HIGH), as remediações são acionáveis (SQL, TSX e bash nas três camadas), e o mapa de dependências entre débitos está presente. Há discrepâncias de severidade entre o draft e os dois reviews que a Fase 8 deve absorver obrigatoriamente antes de publicar o documento final: escalação de DEBT-DB-H3 de HIGH para CRITICAL (Dara), adição de DEBT-FE-NEW-1 como CRITICAL (Uma), remoção de DEBT-FE-13 (Uma — resolvido), e escalação de DEBT-DB-M3 de MEDIUM para HIGH (Dara). Adicionalmente, o draft não capturou o crescimento ilimitado de `rate_limit_log` (DB-EXTRA-01, HIGH) nem a ausência de skip navigation (DEBT-FE-NEW-1, CRITICAL). Com as mudanças obrigatórias listadas na Seção 4, o material está pronto para a Fase 8 e suficientemente detalhado para a Fase 10 (epic + stories).

---

## 2. Checklist (10 itens)

| # | Item | Status | Evidência |
|---|------|--------|-----------|
| 1 | **Cobertura** — todos os débitos relevantes capturados? (sistema, db, frontend; cross-cutting; observabilidade; testes; segurança) | PASS | Draft cobre 41 itens nas 3 camadas. Dara adiciona 4 débitos DB (DB-EXTRA-01 a 04) não capturados no draft. Uma adiciona 8 débitos FE (DEBT-FE-NEW-1 a 8). O total pós-reviews chega a 53 itens. Observabilidade (DEBT-H3, DEBT-L1), segurança (DEBT-DB-C1, DEBT-DB-C3), testes (DEBT-H6, DEBT-L2) e A11y (DEBT-FE-1, DEBT-FE-NEW-1) estão documentados. Único gap residual menor: `rate_limit_log` como vetor DDoS interno (R4 do review Dara) ainda não tem ID de débito formal, apenas nota de risco. |
| 2 | **Severidade** — classificações consistentes (CRITICAL/HIGH/MEDIUM/LOW)? Há discrepâncias entre draft e reviews? | CONCERNS | 3 discrepâncias identificadas entre o draft e os reviews: (a) DEBT-DB-H3 classificado HIGH no draft — Dara recomenda CRITICAL (`db-specialist-review.md`, Seção 2, DEBT-DB-H3); (b) DEBT-DB-M3 classificado MEDIUM no draft — Dara recomenda HIGH (`db-specialist-review.md`, Seção 2, DEBT-DB-M3); (c) DEBT-FE-NEW-1 (skip nav) inexistente no draft — Uma o classifica CRITICAL (`ux-specialist-review.md`, Seção 3, DEBT-FE-NEW-1). Discrepâncias são informadas e justificadas. Status CONCERNS não é bloqueante porque as Seções 3 e 4 deste gate determinam a resolução obrigatória. |
| 3 | **Evidência** — cada débito tem arquivo:linha ou referência concreta? | PASS | Todos os CRITICAL e HIGH têm referência arquivo:linha. DEBT-DB-C1: `008_rate_limit_log.sql:12-13`. DEBT-DB-C3: `src/lib/ml-api.ts:42-62`. DEBT-DB-H3: `src/lib/rateLimit.ts:19-38`. DEBT-FE-NEW-1: `src/app/(app)/layout.tsx` (ausência confirmada). DEBT-FE-13 (resolvido): `AppShell.tsx:13-26`, `TopBar.tsx:13-20`, `MobileDrawer.tsx:52-132`. Débitos MEDIUM/LOW com evidência genérica (ex: DEBT-FE-2 "global") são aceitáveis dado o escopo de análise. |
| 4 | **Remediação** — cada débito tem ação concreta proposta? | PASS | Draft provê quick wins e blocos A-G com esforço estimado. Review Dara provê SQL concreto para cada débito DB (functions, policies, índices, migrations numeradas 009 e 010). Review Uma provê TSX concreto para cada débito FE (aria-*, zod schemas, Server Components, focus trap). Nenhum débito CRITICAL/HIGH está apenas diagnosticado sem proposta de ação. |
| 5 | **Dependências** — interdependências entre débitos mapeadas? | PASS | Draft Seção 3 contém mapa explícito: DEBT-DB-C2 → DEBT-DB-M2 → DEBT-H3; DEBT-DB-C3 → lock DB; DEBT-FE-2 → DEBT-FE-1; DEBT-H6 → DEBT-L2. Review Dara acrescenta: DB-EXTRA-01 (cleanup `rate_limit_log`) compartilha pré-requisito com DEBT-DB-M2 (pg_cron). Review Uma acrescenta: decomposição FE-11 resolve parcialmente DEBT-FE-1 (CollapsibleSection com `aria-expanded`). |
| 6 | **Riscos cross-cutting** — observabilidade, segurança, A11y/i18n, performance documentados? | PASS | Draft Seção 4 lista 7 riscos cross-cutting com severidade. Observabilidade: DEBT-H3 + DEBT-L1. Segurança/RLS: DEBT-DB-C1 + DEBT-DB-L1. Race conditions: DEBT-DB-C3 + DEBT-DB-H3. A11y: DEBT-FE-1 + DEBT-FE-3. i18n: DEBT-FE-2. Dara adiciona R1-R4 (RLS em views, índice parcial, LGPD, DDoS via fail-open). Uma adiciona UX-1 a UX-5 (onboarding, erros ML, mobile-first, empty states, CLS). |
| 7 | **Quick wins separados de blocos longos** — priorização explícita? | PASS | Draft Seção 5 lista 10 quick wins (≤1 dia cada). Seção 6 lista 6 blocos médios (2-5 dias). Seção 7 lista 1 bloco longo (Bloco G — i18n, 2-3 sprints). Uma adiciona ordem de implementação A11y (5 itens com estimativa de horas). Dara adiciona sequência de migrations numerada (009, 010) com rollback SQL para cada bloco. |
| 8 | **Discrepâncias entre revisores absorvidas** — draft precisa incorporar: DEBT-DB-H3 → CRITICAL; DEBT-FE-NEW-1 CRITICAL adicionado; DEBT-FE-13 removido; DEBT-DB-M3 → HIGH | CONCERNS | Nenhuma das 4 discrepâncias foi absorvida pelo draft (o draft é o artefato Fase 4, anterior aos reviews). A absorção é tarefa da Fase 8. Este gate registra as discrepâncias como obrigatórias para o @architect incorporar. Ver Seções 3 e 4. |
| 9 | **Constraints documentadas** — suposições e restrições claras? | PASS | Draft Seção 8 documenta 4 itens: Stack frozen (Next 14 + React 18), Supabase exclusivo, equipe 1-3 devs, contratos de API públicos não alterar. Addendum de sistema (`system-architecture-addendum-2026-04-27.md`) documenta contexto Vercel. DB-AUDIT addendum registra migrations 007-008 como novas. Suposições são realistas e rastreáveis. |
| 10 | **Pronto para epic + stories** — clareza suficiente para @pm gerar epic na Fase 10? | PASS | Blocos A-G no draft mapeiam diretamente para epics/stories. Blocos têm: esforço estimado, débitos relacionados, sequência de implementação, rollback. Review Dara provê sequência de migrations numerada (009, 010) com SQL pronto para copy-paste em stories. Review Uma provê checklists WCAG e árvores de componentes com LOC estimados por arquivo. O @pm tem granularidade suficiente para quebrar em stories de 1-3 dias. |

**Resultado: 8 PASS, 2 CONCERNS (não bloqueantes — discrepâncias identificadas e com resolução obrigatória definida)**

---

## 3. Discrepâncias entre artefatos

### D1 — DEBT-DB-H3: HIGH (draft) vs. CRITICAL (Dara)

**Fonte da divergência:** Draft classifica `checkRateLimit` sem proteção contra race como HIGH (`technical-debt-DRAFT.md`, Seção 2.2). Dara escala para CRITICAL com justificativa técnica detalhada: o padrão count-then-insert em `src/lib/rateLimit.ts:19-38` é uma race condition garantida em serverless — 10 requests simultâneas passam todas com `limit=10`, tornando o rate limiting ineficaz exatamente sob carga de ataque (`db-specialist-review.md`, Seção 2, DEBT-DB-H3).

**Resolução para Fase 8:** Escalar DEBT-DB-H3 para CRITICAL. Mover da tabela 2.2 HIGH para 2.1 CRITICAL no documento final. Atualizar resumo executivo (tabela de contagem por categoria). Criar Bloco A' específico ou integrar ao Bloco A como sub-tarefa prioritária.

---

### D2 — DEBT-FE-NEW-1: ausente no draft, CRITICAL em Uma

**Fonte da divergência:** Draft não capturou skip navigation link como débito (`technical-debt-DRAFT.md`, inteiro). Uma identificou durante auditoria de `src/app/layout.tsx` e `src/app/(app)/layout.tsx` — ausência de `<a href="#main-content" class="sr-only focus:not-sr-only">` viola WCAG 2.1 SC 2.4.1 Nível A (`ux-specialist-review.md`, Seção 3, DEBT-FE-NEW-1). O frontend-spec-addendum já havia reportado o gap.

**Resolução para Fase 8:** Adicionar DEBT-FE-NEW-1 ao inventário como CRITICAL, Seção 2.1. Atualizar tabela de resumo executivo (+1 CRITICAL Frontend). Incluir na lista de quick wins (estimativa: 1h).

---

### D3 — DEBT-FE-13: HIGH (draft) vs. RESOLVIDO (Uma)

**Fonte da divergência:** Draft classifica "Sidebar mobile sem hamburger integrado" como HIGH (`technical-debt-DRAFT.md`, Seção 2.2). Uma verificou o código real: `AppShell.tsx:13-26`, `TopBar.tsx:13-20`, `MobileDrawer.tsx:52-132` — implementação completa com `role="dialog"`, `aria-modal`, Escape handler, backdrop com `aria-hidden` (`ux-specialist-review.md`, Seção 2, DEBT-FE-13). O draft foi baseado na especificação 2026-04-23 que reportou o item como pendente; o addendum 2026-04-27 sinalizou "verificar MobileDrawer" sem confirmar.

**Resolução para Fase 8:** Remover DEBT-FE-13 do inventário de débitos pendentes. Mover para seção de "Débitos resolvidos no ciclo brownfield" ou nota de rodapé. Atualizar tabela de resumo (-1 HIGH Frontend). Gap residual real do MobileDrawer — focus trap ausente — já capturado como DEBT-FE-NEW-2 HIGH por Uma.

---

### D4 — DEBT-DB-M3: MEDIUM (draft) vs. HIGH (Dara)

**Fonte da divergência:** Draft classifica `sku_calculations` JSONB sem CHECK como MEDIUM (`technical-debt-DRAFT.md`, Seção 2.3). Dara escala para HIGH: a ausência de validação estrutural implica corrupção silenciosa de histórico de cálculos ao mudar `ViabilityInput`/`ViabilityResult` no TypeScript — dado histórico torna-se inacessível sem erro detectável no banco (`db-specialist-review.md`, Seção 2, DEBT-DB-M3).

**Resolução para Fase 8:** Escalar DEBT-DB-M3 para HIGH. Mover da Seção 2.3 MEDIUM para 2.2 HIGH no documento final. Atualizar contagens no resumo executivo.

---

### D5 — DB-EXTRA-01 ausente no draft

**Fonte da divergência:** `rate_limit_log` cresce indefinidamente sem TTL ou cleanup não foi capturado pelo draft (`technical-debt-DRAFT.md`, inteiro). Dara documenta como HIGH: com 10 usuários fazendo 10 requests/min, tabela acumula ~864.000 rows/30 dias; degrada a própria feature de rate limiting que depende de contagens rápidas (`db-specialist-review.md`, Seção 3, DB-EXTRA-01).

**Resolução para Fase 8:** Adicionar DB-EXTRA-01 ao inventário como HIGH, Seção 2.2. Incluir no Bloco B (Performance e cleanup do cache) como sub-tarefa do job pg_cron. Atualizar resumo executivo (+1 HIGH Database).

---

## 4. Mudanças obrigatórias para Fase 8

As seguintes ações DEVEM ser incorporadas pelo @architect no `technical-debt-assessment.md` final. Nenhuma é opcional — todas decorrem de evidências concretas dos reviews Fase 5 e 6.

1. **Escalar DEBT-DB-H3 de HIGH para CRITICAL** — mover para Seção 2.1, atualizar resumo executivo (Database CRITICAL: 3→4). Justificativa: `src/lib/rateLimit.ts:19-38` — race condition garantida em serverless, rate limiting ineficaz sob carga concorrente (`db-specialist-review.md`, Seção 6, item 1).

2. **Adicionar DEBT-FE-NEW-1 como CRITICAL** — skip navigation link ausente em `src/app/(app)/layout.tsx`. WCAG 2.1 SC 2.4.1 Nível A. Estimativa: 1h. Incluir nos quick wins. Atualizar resumo executivo (Frontend CRITICAL: 2→3). Remediação concreta disponível em `ux-specialist-review.md`, Seção 3.

3. **Remover DEBT-FE-13 do inventário de débitos** — MobileDrawer está completamente implementado e funcional (`AppShell.tsx:13-26`, `TopBar.tsx:13-20`, `MobileDrawer.tsx:52-132`). Mover para nota de "débitos resolvidos no ciclo brownfield". Atualizar resumo executivo (Frontend HIGH: 3→2). Ver `ux-specialist-review.md`, Seção 2, DEBT-FE-13.

4. **Escalar DEBT-DB-M3 de MEDIUM para HIGH** — mover para Seção 2.2, atualizar resumo executivo (Database MEDIUM: 4→3, Database HIGH: 3→4). Remediação SQL disponível em `db-specialist-review.md`, Seção 2, DEBT-DB-M3 (CHECK constraints + schema_version column).

5. **Adicionar DB-EXTRA-01 como HIGH** — `rate_limit_log` sem cleanup/TTL. Evidência: `008_rate_limit_log.sql` (ausência de política de retenção). Incluir no Bloco B. Atualizar resumo executivo (Database HIGH: +1). SQL de remediação (pg_cron job diário às 4h) disponível em `db-specialist-review.md`, Seção 3, DB-EXTRA-01.

6. **Adicionar DEBT-FE-NEW-2 como HIGH** — Focus trap ausente em `MobileDrawer.tsx`. WCAG 2.1 SC 2.1.2. Implementação completa em `ux-specialist-review.md`, Seção 3, DEBT-FE-NEW-2 (custom hook com `querySelectorAll` + `inert` attribute em AppShell).

7. **Incorporar débitos adicionais DB como MEDIUM** — Adicionar ao inventário: DB-EXTRA-02 (`ml_search_cache` sem política DELETE explícita) e DB-EXTRA-03 (`sku_calculations` cresce sem bound por usuário). Evidência e SQL em `db-specialist-review.md`, Seção 3.

8. **Incorporar débitos adicionais FE como MEDIUM** — Adicionar: DEBT-FE-NEW-3 (EmptyState sem `role` semântico, `EmptyState.tsx:14-25`), DEBT-FE-NEW-4 (inputs numéricos sem `inputMode="decimal"`, `CostForm.tsx:148-154`), DEBT-FE-NEW-5 (WelcomeTour não integrado ao estado real, `dashboard/page.tsx:84`). Evidência e TSX em `ux-specialist-review.md`, Seção 3.

9. **Incorporar débitos adicionais DB como LOW** — Adicionar: DB-EXTRA-04 (`ml_fees` sem trigger `updated_at`, `002_ml_fees_table.sql`). Trigger SQL em `db-specialist-review.md`, Seção 3, DB-EXTRA-04.

10. **Incorporar débitos adicionais FE como LOW** — Adicionar: DEBT-FE-NEW-6 (empty states inconsistentes), DEBT-FE-NEW-7 (toast duração curta), DEBT-FE-NEW-8 (emojis sem `aria-hidden` em contextos críticos). Evidência em `ux-specialist-review.md`, Seção 3.

11. **Atualizar mapa de dependências (Seção 3 do draft)** — Adicionar: DEBT-FE-NEW-1 → pré-requisito para qualquer auditoria WCAG; DEBT-FE-NEW-2 → depende da resolução de DEBT-FE-13 (MobileDrawer base está pronto); DB-EXTRA-01 → compartilha pré-requisito pg_cron com DEBT-DB-M2 (Bloco B).

12. **Atualizar tabela de resumo executivo** com contagens corrigidas pós-reviews. Contagem projetada após absorção obrigatória:

| Categoria | CRITICAL | HIGH | MEDIUM | LOW | Total |
|-----------|----------|------|--------|-----|-------|
| Sistema | 1 | 6 | 5 | 3 | 15 |
| Database | 4 | 6 | 5 | 4 | 19 |
| Frontend | 3 | 3 | 9 | 5 | 20 |
| **Total** | **8** | **15** | **19** | **12** | **54** |

---

## 5. Recomendações (não-bloqueantes)

**R1 — Adicionar ID formal a DB-EXTRA-01 para rastreabilidade.** O débito de crescimento ilimitado de `rate_limit_log` foi documentado por Dara como "débito adicional" sem ID canônico. Sugestão: renomear para DEBT-DB-H4 na sequência do inventário final.

**R2 — Incluir Risco R4 de Dara no mapa cross-cutting.** O risco de DDoS interno via fail-open do rate limiting (Dara, Seção 5, R4) é arquiteturalmente relevante mas não aparece na Seção 4 do draft. Sugestão: adicionar linha na tabela de riscos cross-cutting: "Rate limiting fail-open sob indisponibilidade do DB | HIGH | DEBT-DB-H3, DB-EXTRA-01".

**R3 — Risco UX-2 de Uma merece menção em riscos cross-cutting.** Feedback de erros ML não distingue tipo de falha (`MarketSearch.tsx:156-162`) impacta diretamente a percepção de qualidade do produto. Sugestão: adicionar ao mapa de riscos como "Mensagens de erro ML não diferenciadas | MEDIUM | DEBT-FE-4".

**R4 — Risco UX-5 (CLS no dashboard) como risco de observabilidade/performance.** `dashboard/page.tsx:75` faz `await listSkus()` bloqueando o render completo. Já coberto por DEBT-FE-6 (Suspense subutilizado), mas o impacto no LCP (Core Web Vitals / Vercel Analytics) pode ser explicitado na seção de riscos de performance.

**R5 — DB-EXTRA-03 e DB-EXTRA-04 podem ser combinados em uma única migration com DB-EXTRA-01.** Dara sugere migration 010 para os cron jobs. Os triggers `ml_fees_updated_at` e o CHECK JSONB já estão na migration 009 proposta. Consolidar para reduzir o número de migrations em produção.

**R6 — Documentar explicitamente o LGPD risk (R3 de Dara).** `ml_tokens` contém dados pessoais vinculados a `auth.uid()` sem mecanismo de "direito ao esquecimento" explícito para conta suspensa. Recomendado registrar como `DEBT-DB-M-LGPD` ou nota de compliance na Seção 8 (Restrições) do documento final.

---

## 6. Pronto para Fase 8?

**Sim.**

O material dos três artefatos (draft + review Dara + review Uma) é suficientemente completo, concreto e coerente para produzir o `technical-debt-assessment.md` final. As discrepâncias de severidade são identificadas com evidência clara. As mudanças obrigatórias na Seção 4 são específicas e acionáveis. O @architect pode executar a Fase 8 incorporando os 12 itens obrigatórios sem necessidade de nova rodada de investigação.

---

## 7. Pronto para Fase 10 (epic + stories)?

**Sim, com condicionantes.**

O material permite gerar epic + stories, com as seguintes condicionantes:

**Condicionante 1 (obrigatória antes da Fase 10):** O `technical-debt-assessment.md` final (Fase 8) deve ser o documento base para o @pm, não o draft. O draft tem severidades desatualizadas que afetariam a priorização incorreta de stories.

**Condicionante 2 (obrigatória):** O relatório executivo da Fase 9 (@analyst) deve consolidar os totais corrigidos da tabela de contagem (Seção 4, item 12) antes da Fase 10, para que o @pm tenha visão executiva das prioridades.

**Condicionante 3 (recomendada):** A Fase 10 deve mapear os blocos do draft (A-G) como epics ou grupos de stories, aproveitando as sequências de implementação e rollback já documentadas por Dara e Uma. Blocos A (OAuth ML) e B (cache + cleanup) têm pré-requisitos de infra (pg_cron) que devem ser explicitados como tasks de DevOps antes das stories de desenvolvimento.

**Granularidade disponível para stories:**
- Blocos A-F: granularidade de 2-5 dias cada — quebráveis em stories de 1-2 dias
- Bloco G (i18n): estimativa de 2-3 sprints — candidato a epic próprio com stories por namespace
- Quick wins (10 itens): cada um é uma story de ≤1 dia, candidatos a sprint 0 de debt paydown
- Migrations DB 009 e 010: candidatas a tasks de @data-engineer dentro das stories correspondentes

---

*Documento produzido por @qa (Quinn) — Brownfield Discovery Fase 7 (QA Gate) — 2026-04-27.*
*Próxima fase: @architect (Fase 8) — `technical-debt-assessment.md` final.*
