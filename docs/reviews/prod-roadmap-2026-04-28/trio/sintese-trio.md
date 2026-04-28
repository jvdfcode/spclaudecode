# Síntese do Trio — Alan + Pedro + Finch sobre PROD-001

> Consolidação adversarial: o que os 3 concordam, o que se contestam, o que vira input obrigatório para o PM+SM ajustarem o plano em v2.

**Data:** 2026-04-28
**Inputs:** `trio-01-alan.md`, `trio-02-pedro.md`, `trio-03-finch.md`
**Plano revisado:** `EPIC-PROD-001-caminho-producao.md` + `SPRINT-2026-04-28.md` (12 stories, 28 SP, 1 semana)

---

## Vereditos individuais

| Persona | Veredito | DNA aplicado |
|---------|----------|--------------|
| **Alan Nicolas** | ✅ APPROVE | Pareto ao Cubo — núcleo é OURO, ruído nas bordas |
| **Pedro Valério** | ⚠️ NEEDS WORK | Process-Absolutist — 4 vetos absolutos com evidência |
| **Thiago Finch** | ⚠️ NEEDS WORK | Funnel-First — sprint vai ao ar mas lança cego |

**Síntese:** **NEEDS WORK** — sprint não é vetado em sua essência (Alan aprova o núcleo), mas tem 4 gaps absolutistas (Pedro) e 1 omissão crítica de funil (Finch) que devem entrar em v2.

---

## Matriz de concordâncias e contestações

### ✅ Concordância tripla (3/3 alinhados)

| Tema | Alan | Pedro | Finch |
|------|------|-------|-------|
| **PROD-001-1 (Supabase)** é gate zero correto | OURO | DoD mensurável | Necessário (não move funil mas habilita) |
| **PROD-001-3 (migrations)** é essencial | OURO | DoD claro | Habilita persistência de leads |
| **PROD-001-9 (DNS)** é definitivo | OURO | Mensurável | Topo de funil ativado |
| **PROD-001-10 (LGPD + CTA)** é inegociável | OURO | Mensurável | Move fundo de funil diretamente |
| **Caminho crítico sequencial está correto** | "Impecável" | "Estrutura sólida" | (implícito) |

### ⚠️ Concordância dupla (2/3)

| Tema | Quem concorda | Quem diverge |
|------|---------------|--------------|
| **PROD-001-7 (CRON_SECRET)** é dispensável/desatualizada | Pedro: AC já satisfeito no código (`route.ts:7-8`); Finch: não move funil | Alan: classifica como PRATA (relevante mas não urgente) |
| **PROD-001-4 (parametrizar)** pode ser depriorizada | Alan: PRATA (pode ser pós-GO); Finch: higiene CI sem ROI | Pedro: classifica como passável se owner for nomeado |
| **PROD-001-12 (a11y)** está mal-classificada | Alan: deveria ser OURO, não deferrable; Finch: parcial (mobile tap) | Pedro: aceita como está se houver owner |
| **PROD-001-11 (smoke test)** mistura escopos | Alan: split necessário (Sentry ouro, middleware.test bronze); Pedro: aceitável | Finch: classifica como observabilidade (não move funil) |

### ❌ Contestação genuína (1 voz contra plano)

| Tema | Voz dissidente | Conteúdo |
|------|----------------|----------|
| **Owner pessoa-física AUSENTE em 12/12 stories** | **Pedro (sozinho)** | "Dev" ou "Pedro + Dev" não são owners auditáveis. Alan e Finch não levantaram esse ponto. |
| **Rollback INDEFINIDO em 5 stories operacionais** (3, 5, 6, 8, 9) | **Pedro (sozinho)** | Epic tem rollback genérico, mas executor lê a story individual. |
| **Instrumentação de funil AUSENTE** (4 eventos: calculo_iniciado → resultado_exibido → cta_clicado → email_submetido) | **Finch (sozinho)** | Sprint vai ao ar mas não rastreia onde o funil quebra. "10 leads em 30 dias" do MKT-001 vira métrica de vaidade. |
| **OMIE zero** (concorrência não observada) | **Finch (sozinho)** | `concorrencia-2026-Q2.md` é template vazio; lançamento cego de posicionamento. |
| **PROD-001-1 com 1 SP subestima complexidade** | **Alan (sozinho)** | Decisão D1 + criação + link + 4 chaves + migração 001-011 = 2-3h, não 1h. |
| **PROD-001-8 usa `--prod` mas se chama "preview"** | **Alan (sozinho)** | Ruído semântico que pode confundir o executor antes de DNS estar pronto. |
| **PROD-001-2 não vincula gate CI existente** | **Pedro (sozinho)** | `check:react-types-major` em `ci.yml:38-39` cobre o cenário, mas a story não referencia. |
| **PROD-001-12 (a11y) deveria ser must-have, não should-have** | **Alan + Finch parcialmente** | Touch targets de 30px num produto mobile-first quebram funil de conversão. |

---

## Ranking de prioridades para v2 (consolidado)

### 🔴 Mudanças OBRIGATÓRIAS (consenso 2+ vozes ou veto absoluto Pedro)

1. **NOMEAR owner pessoa-física em cada story** [Pedro veto absoluto]
   - Stories interativas (1, 5, 6, 9, 10): Pedro Emilio direto
   - Stories de código (2, 3, 4, 7, 8, 11, 12): "Pedro Emilio (executor: @dev Dex)" com handoff declarado

2. **REESCREVER PROD-001-7** [Pedro + Finch concordam: depriorizar/reescrever]
   - Handler `route.ts:7-8` JÁ implementa CRON_SECRET
   - Story deve focar apenas em: gerar secret, `vercel env add`, atualizar `.env.example`
   - Reduzir SP de X para 0.5 SP

3. **ADICIONAR seção `## Rollback` em PROD-001-3, 5, 6, 8, 9** [Pedro veto]
   - Cada story operacional precisa do procedimento binário declarado in-line

4. **ADICIONAR story nova: instrumentação dos 4 eventos de funil** [Finch — bloqueia sentido do sprint]
   - `calculo_iniciado → resultado_exibido → cta_clicado → email_submetido`
   - Inclui UTM persistence (utm_source, utm_medium, utm_campaign em funnel_events)
   - Esforço: 2-3h (story nova: PROD-001-13?)

5. **ELEVAR PROD-001-12 (a11y)** [Alan + Finch parcialmente]
   - De "should-have/deferrable" para "must-have paralelo"
   - Executar Dia 1-2 em paralelo, sem condicional

### 🟡 Mudanças RECOMENDADAS (1 voz forte com evidência)

6. **CORTAR teste de middleware (M5) de PROD-001-11** [Alan]
   - Manter apenas smoke test Sentry + curl rotas como gate final
   - Criar story separada pós-sprint para `middleware.test.ts`

7. **AJUSTAR estimativa PROD-001-1** [Alan]
   - De 1 SP para 2-3 SP (decisão + criação + link + 4 chaves + migração)

8. **ESCLARECER semântica PROD-001-8** [Alan]
   - Decidir: deploy `--prod` é production deploy real ou preview?
   - Renomear story se necessário; condicional explícita à PROD-001-9

9. **VINCULAR PROD-001-2 ao gate CI existente** [Pedro]
   - AC deve referenciar `ci.yml:38-39` e confirmar cobertura do cenário pos-fix

### 🟢 Recomendações DOCUMENTADAS (não absorvidas, decisão consciente)

10. **OMIE concorrência** [Finch] — Não absorvida no sprint PROD-001 porque:
    - Sprint é "ir ao ar"; OMIE é trabalho do epic MKT-001
    - Documentar como risco aceito no epic, com data limite de 30 dias pós-GO
    - Decisão consciente: lançar com posicionamento como hipótese, validar via entrevistas (Alex)

11. **PROD-001-4 (parametrizar SUPABASE_PROJECT_ID)** [Alan + Finch sugerem depriorizar]
    - Alan: PRATA (pós-GO sem risco); Finch: higiene CI sem ROI
    - **Manter no sprint** porque: usuário já tem hábito de hardcode → débito que cresce; custo é baixo (1 SP)
    - Justificativa será documentada no changelog v2

---

## Tensões reais (3 contestações genuínas, conforme exigido)

### Tensão #1 — Owner pessoa-física vs ergonomia AIOX
- **Pedro:** "Dev" não é pessoa-física, é veto absoluto.
- **Plano atual (Morgan/River):** usa "Pedro + Dev" para refletir ergonomia humano-no-loop com agentes AIOX.
- **Resolução proposta:** Adotar formato Pedro Valério-compatible: `Pedro Emilio (executor: @dev Dex via handoff em .aiox/handoffs/{story}.yaml)`. Resolve veto sem perder ergonomia.

### Tensão #2 — Sprint de produção vs instrumentação de funil
- **Finch:** sem 4 eventos de funil, sprint é "loja sem caixa registradora".
- **Morgan/River:** sprint focado em "ir ao ar"; instrumentação cabe ao MKT-001-5.
- **Resolução proposta:** Adicionar PROD-001-13 (2-3h) mínima — apenas os 4 eventos básicos + UTM. Dashboard rico fica em MKT-001-5. Sem isso, MKT-001 começa cego.

### Tensão #3 — Curadoria (Alan) vs Process (Pedro)
- **Alan:** PROD-001-12 (a11y) deveria ser OURO must-have.
- **Pedro:** aceita como está se houver owner.
- **Finch (terceira voz):** parcialmente concorda com Alan (mobile tap afeta funil).
- **Resolução proposta:** Elevar para must-have paralelo (2/3 vozes ao menos parcialmente concordam); manter SP atual.

---

## Recomendações para PM+SM (Fase 4)

**Mudanças obrigatórias para SPRINT v2:**
1. Cada story tem owner pessoa-física no formato canônico.
2. Stories operacionais (3, 5, 6, 8, 9) têm seção `## Rollback` com procedimento binário.
3. PROD-001-7 reescrita (handler já existe; foco vira provisionamento).
4. PROD-001-13 NOVA: instrumentação 4 eventos + UTM (2-3h, prioridade alta).
5. PROD-001-12 elevada para must-have paralelo.
6. PROD-001-1 re-estimada para 2-3 SP.
7. PROD-001-8 com semântica clarificada (production deploy condicional à PROD-001-9).
8. PROD-001-11 com M5 (middleware.test) movido para backlog.
9. PROD-001-2 com AC vinculado a `ci.yml:38-39`.

**Mudanças não absorvidas (com justificativa registrada no changelog v2):**
- OMIE concorrência — risco aceito, escopo do MKT-001.
- PROD-001-4 mantida no sprint — débito de hardcode que cresce com o tempo.

**Total de impacto na capacidade:**
- Original: 28 SP / 12 stories
- v2: ~30 SP / 13 stories (PROD-001-1: +1 SP, PROD-001-7: -1 SP, PROD-001-13: +2 SP)
- Cabe na capacity de 30h se PROD-001-7 reduzir como Pedro sugere.

---

*Síntese consolidada por Orion — 2026-04-28*
*Princípio aplicado: vetos absolutos de Pedro têm precedência (process > opinião); omissão de funil (Finch) é input obrigatório porque sprint sem dado é sprint perdido; aprovação de Alan no núcleo confirma que estrutura macro está correta — ajustes são cirúrgicos, não refundação.*
