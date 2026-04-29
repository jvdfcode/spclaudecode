# EPIC-TD-001 — Technical Debt Paydown H1 (Sprint atual)

**Workflow:** brownfield-discovery → execução
**Owner:** @pm Morgan
**Data:** 2026-04-27
**Sprint alvo:** atual (1–2 semanas)
**Fonte:** `docs/architecture/technical-debt-assessment.md` (Fase 8, APPROVED) + `docs/reports/TECHNICAL-DEBT-REPORT.md` (Fase 9)

---

## Atualização pós-roundtable (2026-04-27)

**Origem:** roundtable-personas-2026-04-27.md

**Mudanças incorporadas:**
- DEBT-H3 (Sentry Edge `tracesSampleRate: 0.1`) adicionado como primeiro item do sprint, antes dos 14 quick wins comuns — consenso unânime do roundtable (Tallis + Nardon + todos).
- Veto Conditions adicionados (Pedro Valério) — seção abaixo; 4 vetos se tornam gates obrigatórios antes de iniciar stories.
- Story TD-001-5 adicionada: Veto Conditions executáveis no CI (Lighthouse-CI, job concorrência, lint rule React/types, PR template rollback).
- Owner placeholders `[OWNER: ?]` aplicados a todos os 14 quick wins de TD-001-4 — nomeação obrigatória na sprint planning.
- Pre-commit hook `db-types-drift` adicionado como task explícita em TD-001-4 (Pedro: "gate em PR é tarde demais").
- EPIC-MKT-001 (Bloco I — Validação de Mercado) adicionado nas dependências externas — H2 condicionado ao output de `docs/business/ICP-validation-2026-Q2.md`.

---

## Veto Conditions (Pedro Valério — OBRIGATÓRIOS antes de iniciar stories)

Quatro condições que vedam o início das stories se não atendidas. Cada veto é um gate de processo, não uma sugestão. TD-001-5 converte estes vetos em gates de CI automatizados.

1. **Veto 1:** iniciar TD-001-1 sem rollback file `009_advisory_locks_and_jsonb_check_rollback.sql` commitado no MESMO PR da migration 009. O EPIC menciona rollback como "obrigatório" na seção de rollback — mas sem este veto, ele pode ser mergeado sem o rollback. Processo sem rollback commitado junto é processo que permite erro irreversível em produção.

2. **Veto 2:** marcar TD-001-4 como Done sem owner pessoa-física (não @dev) por quick win individual. 14 itens com um único "@dev" como owner não é processo — é lista de desejos. Cada item recebe um nome antes de começar o sprint. (Ver `[OWNER: ?]` em todos os 14 quick wins.)

3. **Veto 3:** enviar EPIC-TD-001 sem checklist de DOD por story (TD-001-1..5). Story sem DOD é story sem gate de saída — ela nunca está "feita", está "pareço que feita".

4. **Veto 4:** executar Bloco H (migration 009) sem job de teste de concorrência automatizado no CI. O CI atual (`pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test`) não inclui esse job. Merge sem validação automatizada de race condition é exatamente o tipo de processo que permite o erro que estamos corrigindo.

---

## Primeiro item do sprint — DEBT-H3 (Sentry Edge `tracesSampleRate: 0.1`)

**Antes de qualquer outra task de H1:** configurar Sentry Edge com `tracesSampleRate: 0.1` em produção.

**Justificativa (consenso unânime do roundtable + recomendação Tallis/Nardon):** sem observabilidade em edge, todos os outros débitos são debugados no escuro. O Bloco H (race conditions) resolve o risco mais crítico — mas se a solução tiver efeito colateral inesperado em produção, só saberemos se o Sentry estiver coletando. DEBT-H3 com `tracesSampleRate: 0` é o que torna todo o resto cego.

Este item está incluído como quick win em TD-001-4 mas deve ser executado primeiro, antes de qualquer merge de TD-001-1, TD-001-2 ou TD-001-3.

---

## Objetivo

Eliminar os dois riscos operacionais imediatos do SmartPreço (race conditions críticas em rate limiting e OAuth ML), estabelecer baseline de acessibilidade WCAG 2.1 Nível A e executar os 14 quick wins de configuração e observabilidade — todos no sprint atual.

---

## Justificativa de negócio

O TECHNICAL-DEBT-REPORT.md identifica três riscos de negócio de alta probabilidade que justificam execução imediata:

**1. Rate limiting ineficaz (DEBT-DB-H3, DEBT-DB-C1)**
A função `checkRateLimit` em `src/lib/rateLimit.ts:19-38` não usa advisory lock. Em ambiente serverless, múltiplas requisições concorrentes lêem o mesmo contador antes de qualquer incremento, permitindo que um agente malicioso com 10 requisições simultâneas passe por todas sem bloqueio. Resultado direto: DDoS aplicação e custos de API de ML sem controle.

**2. Race condition OAuth ML (DEBT-DB-C3)**
`src/lib/ml-api.ts:42-62` não adquire lock antes de renovar token. Dois processos concorrentes podem iniciar refresh simultaneamente, o segundo sobrescreve o token do primeiro enquanto ele ainda está sendo usado, quebrando a busca de preços de mercado — funcionalidade central do produto — de forma não determinística.

**3. Acessibilidade WCAG 2.1 Nível A (DEBT-FE-NEW-1, DEBT-FE-NEW-2, DEBT-FE-1, DEBT-FE-3, DEBT-FE-5)**
Ausência de skip navigation link e focus trap em MobileDrawer viola o nível mínimo de acessibilidade obrigatório. Risco legal crescente; custo de retrofit aumenta a cada feature adicionada sem correção.

---

## Stories incluídas

| ID | Título | Esforço estimado | Severidade dominante | Bloqueia outra story? |
|----|--------|-----------------|---------------------|-----------------------|
| TD-001-1 | Advisory locks em refresh OAuth ML e checkRateLimit | 2–3 dias | CRITICAL | Não |
| TD-001-2 | Skip nav + aria-label baseline + focus trap MobileDrawer | 2–3 dias | CRITICAL/HIGH | Não |
| TD-001-3 | Forms a11y (aria-describedby + aria-busy + zod email) | 1–2 dias | HIGH/MEDIUM | Não |
| TD-001-4 | Quick wins de configuração e observabilidade | 2–3 dias (paralelos) | CRITICAL a LOW | Não |
| TD-001-5 | Veto Conditions executáveis no CI (Pedro Valério) | 4–6 horas | HIGH | TD-001-1 (job concorrência deve existir antes do Bloco H) |

---

### Story TD-001-5 — Veto Conditions executáveis no CI (Pedro Valério)

**Arquivo:** `docs/stories/TD-001-5-veto-conditions-ci.md`

**Tasks principais:**
- Configurar `lighthouse-ci` no GitHub Actions com threshold A11y >= 90 e Performance >= 70 (bloqueia merge se falhar)
- Criar job de concorrência: script Node que chama `checkRateLimit` 10 vezes em paralelo e valida que `limit=5` é respeitado (bloqueia merge se inserir > 5 rows)
- Criar lint rule custom (`eslint-plugin-local`) que valida `@types/react` major == `react` major em `package.json` (bloqueia commit se diverge)
- Adicionar PR template: migration sem rollback file no mesmo PR = merge bloqueado (checklist obrigatório)

**AC:** cada um dos 4 vetos do EPIC-TD-001 vira gate executável no CI. Nenhum dos vetos depende de revisão humana subjetiva. Merge é impossível se o gate falha.

---

### Nota sobre TD-001-4 — Task adicional obrigatória (Pedro Valério)

**Task adicionada explicitamente a TD-001-4:**
- [ ] Configurar pre-commit hook para `db-types-drift` (DEBT-DB-M4) — `husky` + script `pnpm check:types-drift` rodando antes de cada commit. **Veto Pedro: gate em PR é tarde demais.** O hook é automação de 10 minutos que protege as migrations 009 e 010 executadas neste sprint. Sem o hook, drift de tipos pode ser commitado por horas antes de alguém ver no PR.

**Owners por quick win — todos substituídos por `[OWNER: ?]`:**
Os 14 quick wins de TD-001-4 tinham `@dev` como owner único. Todos foram substituídos por `[OWNER: ?]`. Nomeação obrigatória na sprint planning — Veto 2 de Pedro Valério.

---

## Critérios de aceitação do epic

- [ ] **Bloco H entregue:** migration 009 aplicada com `acquire_user_lock(uuid)` funcional; testes de concorrência provam que 10 chamadas simultâneas a `checkRateLimit` com limit=5 nunca ultrapassam 5 inserções; refresh ML concorrente nunca sobrescreve token válido
- [ ] **A11y baseline entregue:** skip nav presente em `app/layout.tsx` + `(app)/layout.tsx`; todos os ~15 botões icon-only têm `aria-label`; `useFocusTrap` ativo em MobileDrawer; `aria-describedby` em LoginForm/SignupForm/RecoverForm; `aria-busy` em GenieButton
- [ ] **14 quick wins concluídos:** todos os itens da Story TD-001-4 verificados com PR verde em CI
- [ ] **Lighthouse A11y >= 90** em `/` e em `/(app)/dashboard` (medido via Lighthouse CI ou run manual)
- [ ] **Sem regressões em CI:** `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` passando após merge de todas as stories

---

## Dependências externas

| Dependência | Status | Impacto se indisponível |
|-------------|--------|------------------------|
| `pg_cron` habilitado no Supabase tier | A verificar antes de Sprint | Quick win DB-EXTRA-04 (trigger `ml_fees`) é independente; cleanup via `pg_cron` move para H2 (Story TD-002-1) |
| Sentry alarmes configurados (DevOps) | A verificar | DEBT-H3 e DEBT-L1 são fixes de código independentes; alarmes são configuração de projeto Sentry |
| Acesso `supabase db push` no ambiente de dev | Necessário para migrations 009 | Bloqueante para TD-001-1 |
| **EPIC-MKT-001 (Bloco I — Validação de Mercado)** | Após H1 e antes de H2 | H2 (Blocos B/A/C) condicionado ao output `docs/business/ICP-validation-2026-Q2.md`. Sem ICP validado por dados, iniciar H2 é pagar débito técnico de produto sem mercado confirmado. Ver `docs/epics/EPIC-MKT-001-validacao-mercado.md`. |

---

## Riscos do epic

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Migration 009 com advisory lock quebra comportamento existente de `checkRateLimit` | Baixa | Alto | Testes de concorrência obrigatórios antes de merge; rollback documentado na story |
| `pg_cron` não disponível no tier Free do Supabase | Média | Baixo (scope H1 não depende) | DB-EXTRA-04 usa trigger nativo, não `pg_cron`; cron de cleanup vai para H2 |
| Varredura dos ~15 botões icon-only encontrar mais ocorrências que o estimado | Média | Baixo (esforço adicional) | TD-001-2 autoriza busca abrangente; diferença de escopo documentada na story |
| Downgrade `@types/react` 19→18 quebre tipos de algum componente | Baixa | Médio | DEBT-C1 resolve um mismatch intencional; testar `pnpm typecheck` logo após fix |

---

## Plano de rollback por categoria

**Migrations DB (009):**
- Rollback file obrigatório: `009_advisory_locks_and_jsonb_check_rollback.sql`
- Conteúdo mínimo: `DROP FUNCTION IF EXISTS acquire_user_lock(uuid);` + reversão de policy/COMMENT
- Aplicar via `supabase db push` em caso de incidente

**Código aplicação (`ml-api.ts`, `rateLimit.ts`):**
- Revert git do commit específico da story TD-001-1
- Não há alteração de schema de API pública (`/api/ml-search`, `/api/skus/[id]`) — revert é seguro

**Componentes A11y (TD-001-2, TD-001-3):**
- Alterações são aditivas (novos atributos HTML, novo hook `useFocusTrap`)
- Revert git sem efeito colateral — nenhum dado ou contrato de API alterado

**Quick wins (TD-001-4):**
- Cada item é commit atômico independente; reverter seletivamente se necessário
- Exceção: downgrade `@types/react` — verificar `pnpm typecheck` imediatamente após aplicar

---

*Epic gerado por @pm (Morgan) — Brownfield Discovery Fase 10 — 2026-04-27*
