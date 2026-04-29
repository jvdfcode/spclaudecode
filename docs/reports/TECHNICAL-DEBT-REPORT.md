# SmartPreço — Relatório Executivo de Débito Técnico

**Data:** 2026-04-27
**Autor:** @analyst (Alex) — Brownfield Discovery Fase 9
**Audiência:** Fundadores, Product Manager, Head de Engenharia
**Fonte:** `technical-debt-assessment.md` (Fase 8, APPROVED) + `qa-review.md` (Fase 7, APPROVED)

---

## Sumário Executivo

O SmartPreço possui um MVP tecnicamente sólido com stack moderna (Next.js 14 App Router, Supabase, Sentry, Vercel) e saúde geral estimada em **6/10**. Foram catalogados **54 débitos técnicos** distribuídos em três camadas — 8 críticos, 15 altos, 19 médios e 12 baixos — dos quais dois representam risco operacional imediato: a função de rate limiting permite que múltiplas requisições simultâneas burlem o limite (race condition garantida em serverless), e o token OAuth de ML pode ser renovado em paralelo por dois processos distintos ao mesmo tempo, corrompendo credenciais em produção.

**Top 3 riscos de negócio:**

1. **Rate limiting ineficaz sob ataque** — um agente malicioso com 10 requisições simultâneas passa por todas sem bloqueio; o produto fica exposto a DDoS e abuso de API de ML com custos financeiros diretos (DEBT-DB-H3, DEBT-DB-C1).
2. **Falha silenciosa de autenticação ML** — race condition no refresh OAuth pode fazer a busca de preços falhar de forma não determinística em produção, degradando a funcionalidade central do produto (DEBT-DB-C3).
3. **Barreira de acessibilidade e compliance** — ausência de skip navigation e focus trap (WCAG 2.1 Nível A) expõe o produto a risco legal e exclui usuários com deficiência; risco LGPD adicional em tokens ML sem mecanismo de exclusão explícito (DEBT-FE-NEW-1, DEBT-FE-NEW-2, DEBT-DB-M-LGPD).

**Roadmap em 3 horizontes:**

| Horizonte | Período | Foco | Sprint-equivalentes |
|-----------|---------|------|---------------------|
| H1 | Sprint atual | Race conditions críticas + 14 quick wins + A11y baseline | 1 sprint |
| H2 | Próximos 2 sprints | Cleanup/performance DB + OAuth UX + cobertura de testes | 2 sprints |
| H3 | Trimestre | Decomposição de monolíticos + ESLint 9 + planejamento i18n | 3 sprints |

**Investimento total estimado: 6–7 sprint-equivalentes** para reduzir todos os débitos CRITICAL e HIGH. Débitos MEDIUM/LOW podem ser absorvidos incrementalmente ao longo do desenvolvimento de features.

---

## 1. Estado Atual do Produto

### Stack e infraestrutura

O SmartPreço opera sobre uma stack moderna e bem escolhida para o estágio de MVP:

- **Frontend:** Next.js 14 com App Router, React 18, Tailwind CSS v4, design tokens consolidados, Server Components nativos, Sonner para toast global
- **Backend/Database:** Supabase (PostgreSQL + RLS extensivo), migrações versionadas (008 aplicadas), geração automática de tipos TypeScript via `supabase.gen.ts`
- **Observabilidade:** Sentry integrado (cliente e servidor), CI com gate de type-drift, Vercel Analytics
- **Qualidade:** TypeScript strict, `prefers-reduced-motion` global em `globals.css`, MobileDrawer com `role="dialog"`, `aria-modal` e Escape handler implementados

### Inventário de débitos pós-reviews (Fases 5–7)

| Categoria | CRITICAL | HIGH | MEDIUM | LOW | Total |
|-----------|----------|------|--------|-----|-------|
| Sistema | 1 | 6 | 5 | 3 | 15 |
| Database | 4 | 6 | 5 | 4 | 19 |
| Frontend | 3 | 3 | 9 | 5 | 20 |
| **Total** | **8** | **15** | **19** | **12** | **54** |

### Débitos resolvidos durante o ciclo brownfield

Os seguintes itens foram identificados como já resolvidos na base de código atual, sem ação necessária:

- Índices `skus.status` e `skus.updated_at` — resolvidos via migration M007
- RLS `sku_calculations` com `IN` otimizado para `EXISTS` — resolvido via M007
- Trigger `updated_at` em `ml_tokens` — resolvido via M007
- Cleanup parcial de `ml_search_cache` via cron Vercel (gaps residuais capturados em DEBT-DB-C2)
- `prefers-reduced-motion` global — resolvido em `globals.css`
- Tipos DB manuais substituídos por `supabase.gen.ts` gerado + CI drift gate
- Toast global implementado via Sonner
- MobileDrawer com acessibilidade base completa — `AppShell.tsx:13-26`, `TopBar.tsx:13-20`, `MobileDrawer.tsx:52-132` (gap residual de focus trap capturado em DEBT-FE-NEW-2)

---

## 2. Riscos de Negócio

A tabela abaixo traduz os débitos técnicos em linguagem de impacto para o negócio, ordenada por severidade.

| Risco | Impacto no negócio | Probabilidade | Débitos relacionados |
|-------|-------------------|---------------|---------------------|
| **Rate limiting burlar sob carga concorrente** — o sistema de controle de uso pode ser contornado por múltiplas requisições simultâneas, expondo a plataforma a DDoS e custos de API ML não controlados | CRÍTICO: custos financeiros diretos e indisponibilidade do produto | Alta (ambiente serverless é inerentemente concorrente) | DEBT-DB-H3, DEBT-DB-C1, DEBT-DB-H4 |
| **Race condition OAuth ML em produção** — dois processos simultâneos podem acionar renovação de token ao mesmo tempo, corrompendo credenciais e quebrando a busca de preços de mercado de forma intermitente | CRÍTICO: funcionalidade central do produto falha de forma não determinística | Média (ocorre sob uso simultâneo moderado) | DEBT-DB-C3 |
| **Acessibilidade WCAG 2.1 Nível A — risco legal e de inclusão** — ausência de skip navigation e focus trap viola o nível mínimo obrigatório; pode gerar reclamações LGPD e exclui usuários com deficiência visual ou motora | ALTO: risco legal, dano reputacional, exclusão de segmento de usuários | Alta (qualquer auditoria identifica imediatamente) | DEBT-FE-NEW-1, DEBT-FE-NEW-2, DEBT-FE-1, DEBT-FE-3 |
| **Crescimento descontrolado do banco de dados** — tabela `rate_limit_log` cresce sem limite; com volume moderado acumula ~864.000 linhas por mês, degradando a própria consulta de rate limiting | ALTO: degradação progressiva de performance + custos de storage Supabase crescentes | Alta (crescimento linear e garantido desde o primeiro uso) | DEBT-DB-H4, DB-EXTRA-03 |
| **Observabilidade insuficiente em produção** — Sentry Edge com `tracesSampleRate: 0` e `error.tsx` sem captura explícita de exceções impedem diagnóstico de falhas no ambiente real | ALTO: tempo de resposta a incidentes aumentado; falhas passam completamente despercebidas | Alta (configuração atual é zero observabilidade no Edge) | DEBT-H3, DEBT-L1, DEBT-DB-C2 |
| **LGPD — direito ao esquecimento não implementado** — tokens ML associados a `auth.uid()` não têm mecanismo explícito de exclusão em caso de cancelamento de conta; risco de não-conformidade regulatória | MÉDIO: risco de multa LGPD; MVP com `ON DELETE CASCADE` minimiza, mas não elimina | Média (risco cresce com base de usuários) | DEBT-DB-M-LGPD |
| **Expansão internacional bloqueada** — 100% das strings hardcoded em pt-BR sem framework de i18n; qualquer expansão de mercado exige refatoração ampla de toda a base de código | MÉDIO (curto prazo) / ALTO (longo prazo): custo de expansão cresce exponencialmente a cada feature adicionada sem i18n | Baixa (curto prazo); Alta (se produto escalar) | DEBT-FE-2 |
| **Onboarding de desenvolvedores lento** — `.env.example` incompleto, Project ID Supabase hardcoded, sem JSDoc em funções críticas; novo desenvolvedor leva horas para configurar o ambiente corretamente | MÉDIO: produtividade da equipe reduzida; risco de configuração incorreta em produção | Alta (afeta cada novo colaborador ou deploy em ambiente novo) | DEBT-H5, DEBT-M3, DEBT-M4 |

---

## 3. Pontos Fortes da Base de Código

Estes ativos representam decisões técnicas acertadas que devem ser preservadas e ampliadas no desenvolvimento futuro.

| Ponto forte | Valor técnico | Impacto no negócio |
|-------------|--------------|-------------------|
| **Next.js 14 App Router + Server Components** | Renderização server-side nativa, menor bundle client, patterns modernos | Performance e SEO melhores sem esforço adicional |
| **RLS extensivo no Supabase** | Isolamento de dados por usuário na camada de banco; segurança por design | Conformidade e proteção de dados multi-tenant sem código de aplicação |
| **Design tokens consolidados (Tailwind v4)** | Consistência visual garantida programaticamente | Velocidade de desenvolvimento de UI e manutenção de identidade visual |
| **CI/CD com gate de type-drift** | Impede que alterações de schema DB quebrem types TypeScript sem detecção | Qualidade contínua; previne classe inteira de bugs em produção |
| **Motor de cálculo de viabilidade testado** | Lógica de negócio central validada e coberta por testes | Confiabilidade da proposta de valor principal do produto |
| **Sonner toast global** | Sistema de feedback unificado para o usuário | UX consistente com mínimo de esforço por feature nova |
| **`prefers-reduced-motion` global** | Respeita preferências de acessibilidade do sistema operacional automaticamente | Acessibilidade base sem custo por componente |
| **MobileDrawer com acessibilidade base** | `role="dialog"`, `aria-modal`, Escape handler, backdrop com `aria-hidden` | Base sólida implementada; gap residual (focus trap) é incremental |
| **Tipos TypeScript gerados do DB** | `supabase.gen.ts` mantém types sincronizados com schema real via CI | Previne bugs de incompatibilidade entre aplicação e banco de dados |

---

## 4. Roadmap Recomendado

### H1 — Sprint Atual (prioridade máxima)

**Objetivo:** Eliminar os dois riscos operacionais imediatos e estabelecer baseline de acessibilidade.

| Bloco | Ações | Débitos cobertos |
|-------|-------|-----------------|
| **Bloco H — Race conditions** | Migration 009: função `acquire_user_lock(uuid)`, policy explícita `rate_limit_log`, CHECK JSONB em `cost_data`/`result_data` | DEBT-DB-H3, DEBT-DB-C3, DEBT-DB-C1, DEBT-DB-M3 |
| **Quick Wins (14 itens)** | Fixes mecânicos de 1h a 1 dia cada, executáveis em paralelo | DEBT-C1, DEBT-H3, DEBT-H4, DEBT-H5, DEBT-M4, DEBT-M5, DEBT-L1, DEBT-DB-C1, DEBT-FE-9, DEBT-FE-5, DEBT-FE-NEW-1, DEBT-FE-NEW-3, DEBT-FE-NEW-4, DB-EXTRA-04 |
| **Bloco E' — A11y baseline** | Skip nav no root layout, focus trap em MobileDrawer, `aria-label` nos 15 botões icon-only, `aria-describedby` em formulários de login/signup | DEBT-FE-NEW-1, DEBT-FE-NEW-2, DEBT-FE-1, DEBT-FE-3 |

### H2 — Próximos 2 Sprints

**Objetivo:** Estabilizar performance do banco de dados, melhorar cobertura de testes e completar UX crítico.

| Bloco | Ações | Débitos cobertos |
|-------|-------|-----------------|
| **Bloco B — Performance e cleanup DB** | Migration 010: `pg_cron` para limpeza de `rate_limit_log` e `ml_search_cache`, LATERAL JOIN em `listSkus`, alarme Sentry no cron Vercel | DEBT-DB-C2, DEBT-DB-H2, DEBT-DB-H4, DEBT-DB-M2, DB-EXTRA-02, DB-EXTRA-03 |
| **Bloco A — OAuth ML UX** | Indicador de loading visual em MarketSearch (complementar ao lock do Bloco H) | DEBT-FE-4 |
| **Bloco C — Cobertura de testes** | Suite Playwright para fluxos críticos: login, calculadora, save SKU, MarketSearch, OAuth refresh | DEBT-H6, DEBT-L2 |

### H3 — Trimestre

**Objetivo:** Qualidade de código de longo prazo e preparação para escala.

| Bloco | Ações | Débitos cobertos |
|-------|-------|-----------------|
| **Bloco D — Decomposição de monolíticos** | Quebrar `CostForm.tsx` (487 LOC) e `MarketSearch.tsx` (418 LOC) em componentes menores; habilita testes unitários FE | DEBT-FE-11, DEBT-FE-12 |
| **Bloco F — ESLint 9** | Migração para flat config (EOL Q2/2025) + regras de a11y e import-order | DEBT-H2 |
| **Bloco G — i18n (planejamento)** | Validar com business se expansão internacional está no roadmap; instalar `next-intl`, extrair strings, configurar locale routing | DEBT-FE-2 |

---

## 5. Investimento Estimado

| Bloco | Descrição | Esforço (dias) | Severidade dominante | Risco se adiar | ROI estimado |
|-------|-----------|---------------|---------------------|----------------|-------------|
| **Bloco H** | Race conditions: lock rate limit + OAuth | 2–3 | CRITICAL | Rate limiting ineficaz = DDoS + custos ML não controlados | Muito alto — protege diretamente receita e custos operacionais |
| **Quick Wins** | 14 fixes mecânicos independentes | 5–7 (paralelos) | CRITICAL a LOW | Acúmulo progressivo de risco; cada dia aumenta probabilidade de incidente | Alto — máximo impacto por esforço mínimo |
| **Bloco E'** | A11y baseline WCAG 2.1 Nível A | 3–4 | CRITICAL/HIGH | Risco legal crescente; custo de retrofit aumenta com cada feature nova | Alto — custo cresce exponencialmente se adiado |
| **Bloco B** | Performance e cleanup de tabelas DB | 4–5 | HIGH | Degradação progressiva de queries + custos Supabase crescentes | Alto — custo de storage e latência aumentam com uso |
| **Bloco A** | OAuth ML UX + loading state MarketSearch | 1–2 | HIGH | UX degradada na funcionalidade central do produto | Médio — complementa e visibiliza o Bloco H |
| **Bloco C** | Suite Playwright: 5 fluxos críticos | 4–5 | HIGH | Regressões críticas detectadas apenas em produção | Alto — proteção contínua sem custo recorrente após setup |
| **Bloco D** | Decomposição de componentes monolíticos | 3–4 | MEDIUM | Velocidade de desenvolvimento decresce; testes unitários FE inviáveis | Médio — ROI acumulativo; habilita cobertura de testes FE |
| **Bloco F** | Migração ESLint 8 → 9 (flat config) | 2–3 | HIGH | EOL Q2/2025 — sem suporte de segurança ou novos plugins de a11y | Médio — custo de migração cresce a cada mês de atraso |
| **Bloco G** | i18n fase 1: planejamento + extração de strings | 10–15 | MEDIUM | Expansão internacional requer refatoração total se não planejada agora | Estratégico — depende de validação de mercado primeiro |
| **Total (H1+H2+H3, excl. Bloco G)** | — | **24–33 dias (~5–7 sprints)** | — | — | — |

---

## 6. KPIs Pós-Paydown

Indicadores mensuráveis para verificar que o investimento em paydown de débito gerou valor real.

| KPI | Baseline estimado | Meta pós-H1 | Meta pós-H2 | Ferramenta |
|-----|------------------|-------------|-------------|-----------|
| **Lighthouse A11y score** | ~60–70 (sem skip nav, sem aria-labels em 15 botões) | ≥ 85 após Bloco E' | ≥ 90 após Bloco F com regras a11y | Lighthouse CI / Vercel Analytics |
| **Cobertura e2e (fluxos críticos)** | 0% — sem suite Playwright ativa | 0% (H1 não inclui testes) | ≥ 80% dos 5 fluxos críticos | Playwright / CI report |
| **p95 latência `/api/ml-search`** | Não medido (edge `tracesSampleRate: 0`) | Baseline estabelecido após fix DEBT-H3 | Redução ≥ 20% após LATERAL JOIN (Bloco B) | Sentry APM / Vercel Analytics |
| **Taxa de erros Sentry (7d rolling)** | Parcialmente visível — edge = 0 amostras | Visibilidade completa estabelecida | Redução ≥ 30% vs. baseline | Sentry Dashboard |
| **Linhas em `ml_search_cache`** | Crescimento irrestrito | Sem alteração em H1 | Estabilizado com TTL e cron (Bloco B) | Supabase Studio |
| **Linhas em `rate_limit_log`** | ~864.000 linhas/mês em crescimento | Policy explícita + lock aplicados (Bloco H) | TTL ativo via pg_cron (Bloco B) | Supabase Studio |
| **Tempo de setup de ambiente (novo dev)** | Estimado 2–4h com gaps no `.env.example` | ≤ 30 min após quick wins DEBT-H5 + DEBT-M4 | ≤ 30 min mantido | Medição manual no onboarding |

---

## 7. Proximos Passos

### Fase 10 — Epic + Stories (@pm)

A Fase 10 do Brownfield Discovery transforma este relatório em epic e stories acionáveis no backlog. Os blocos H1/H2/H3 do roadmap mapeiam diretamente para epics; cada bloco tem granularidade suficiente para stories de 1–3 dias.

**Owners recomendados por bloco:**

| Bloco | Owner principal | Suporte |
|-------|----------------|---------|
| Bloco H (race conditions) | @data-engineer | @dev |
| Quick Wins | @dev | — |
| Bloco E' (A11y baseline) | @dev | @ux-design-expert |
| Bloco B (DB cleanup e performance) | @data-engineer | @devops |
| Bloco A (OAuth UX) | @dev | — |
| Bloco C (testes e2e) | @qa | @dev |
| Bloco D (decomposição monolíticos) | @dev | @ux-design-expert |
| Bloco F (ESLint 9) | @dev | — |
| Bloco G (i18n) | @pm (decisao de negocio primeiro) | @architect |

### Cadencia de revisao

- **Semanal:** Review de KPIs de observabilidade (Sentry + Vercel Analytics) com Head de Eng
- **Por sprint:** Atualizacao do inventario de debitos em `technical-debt-assessment.md` conforme items sao resolvidos
- **Trimestral:** Reavaliacao do Bloco G (i18n) conforme validacao de mercado avanca

### Pre-requisitos para Fase 10

1. Decisao dos fundadores sobre priorizacao H1/H2/H3 — validar alinhamento com roadmap de produto
2. Decisao sobre Bloco G (i18n): confirmar se expansao internacional esta no roadmap de 6 meses antes de dimensionar o epic
3. `technical-debt-assessment.md` (Fase 8) confirmado como documento base para o @pm — severidades atualizadas pos-reviews Dara + Uma

---

## Rastreabilidade

Todos os riscos e recomendacoes neste relatorio sao rastreaveis aos IDs de debito catalogados em `technical-debt-assessment.md` (Fase 8):

**CRITICAL (8):** DEBT-C1, DEBT-DB-C1, DEBT-DB-C2, DEBT-DB-C3, DEBT-DB-H3, DEBT-FE-1, DEBT-FE-2, DEBT-FE-NEW-1

**HIGH (15):** DEBT-H1, DEBT-H2, DEBT-H3, DEBT-H4, DEBT-H5, DEBT-H6, DEBT-DB-H1, DEBT-DB-H2, DEBT-DB-H4, DEBT-DB-M3, DEBT-FE-3, DEBT-FE-4, DEBT-FE-NEW-2

**MEDIUM (19):** DEBT-M1, DEBT-M2, DEBT-M3, DEBT-M4, DEBT-M5, DEBT-DB-M1, DEBT-DB-M2, DEBT-DB-M4, DB-EXTRA-02, DB-EXTRA-03, DEBT-FE-5, DEBT-FE-6, DEBT-FE-7, DEBT-FE-11, DEBT-FE-12, DEBT-FE-NEW-3, DEBT-FE-NEW-4, DEBT-FE-NEW-5, DEBT-DB-M-LGPD

**LOW (12):** DEBT-L1, DEBT-L2, DEBT-L3, DEBT-DB-L1, DEBT-DB-L2, DEBT-DB-L3, DB-EXTRA-04, DEBT-FE-8, DEBT-FE-9, DEBT-FE-10, DEBT-FE-NEW-6, DEBT-FE-NEW-7, DEBT-FE-NEW-8

---

## 8. Atualização pós-roundtable (2026-04-27)

**Origem:** `docs/reviews/roundtable-personas-2026-04-27.md`
**Personas envolvidas:** Pedro Valério (Process Absolutist), Alan Nicolas (Knowledge Architect), Raduan Melo (Estrategista Comercial PWR), Bruno Nardon (Growth G4), Thiago Finch (Funnel-First), Tallis Gomes [SINTETIZADO] (Serial Founder).

### 8.1 Sumário do roundtable

As 6 personas convergiram em um diagnóstico inesperado: o brownfield-discovery é tecnicamente impecável mas é comercialmente cego. Quatro das seis vetaram o roadmap H2/H3 porque nenhum dos 54 débitos endereça canal de aquisição, ICP validado por willingness to pay, ou modelo de monetização. Há consenso unânime em executar Bloco H (race conditions críticas) imediatamente — risco convexo puro. As recomendações consensuadas e os blocos novos foram aterrissados em artefatos editáveis nas Etapas 1-3 do plano de aterrissagem do roundtable.

### 8.2 Roadmap revisado

| Horizonte | Antes | Depois (pós-roundtable) |
|-----------|-------|-------------------------|
| **H1 (sprint atual)** | Bloco H + 14 quick wins + Bloco E' | DEBT-H3 (Sentry edge) primeiro item + Bloco H + Bloco E' + 14 quick wins (com [OWNER: ?] obrigatório) + Story TD-001-5 (veto conditions executáveis no CI) |
| **H1.5 (NOVO — Bloco I)** | — | EPIC-MKT-001 (Validação de Mercado): Lead Magnet + 10 entrevistas ICP + OMIE concorrência + Pricing-page-v0 + KPIs baseline. Output: `docs/business/ICP-validation-2026-Q2.md` |
| **H2** | Blocos B + A + C | Mesmos blocos, **condicionado** ao output documental do Bloco I |
| **H3** | Blocos D + F + G (i18n) | Blocos D + F. **Bloco G (DEBT-FE-2 / i18n) reclassificado como DEFERRED sem prazo** — só é reativado mediante decisão documentada de expansão LATAM (gate condicional) |

### 8.3 Cortes ao inventário (Etapa 1 / Aria)

15 itens marcados [DEFERRED] no `technical-debt-assessment.md` Seção 11.1 — permanecem no inventário para rastreabilidade mas saem do sprint atual. Total ativo passa de 54 para 39 itens. DEBT-FE-2 (i18n) rebaixado de CRITICAL para MEDIUM com gate condicional.

### 8.4 Veto Conditions executáveis (Etapa 2 / Morgan)

4 vetos do Pedro Valério convertidos em gates de CI bloqueantes via Story TD-001-5:
1. Rollback file da migration 009 commitado no MESMO PR.
2. Owner pessoa-física por quick win (não @dev genérico).
3. DOD por story (TD-001-1..5).
4. Job de teste de concorrência automatizado validando race conditions de DEBT-DB-H3 e DEBT-DB-C3.

### 8.5 Bloco I — Validação de Mercado (Etapa 2 / Morgan)

EPIC-MKT-001 com 5 stories cobrindo Lead Magnet, entrevistas ICP, OMIE concorrência, pricing/posicionamento e KPIs baseline. AC do epic: produzir `docs/business/ICP-validation-2026-Q2.md` que vira pré-requisito documental de H2. Sem esse output, H2 não é desbloqueado.

### 8.6 Riscos do roadmap revisado

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Bloco I não confirmar ICP/WTP | ALTA | Plano de pivô: revisar tese do produto antes de continuar paydown |
| H2 ficar congelado por 4-6 semanas aguardando Bloco I | MÉDIA | Bloco H (race conditions) é executado em paralelo ao Bloco I — não bloqueia |
| Time perder momentum técnico | BAIXA | Vetos do Pedro garantem gates de CI executáveis; rigor não cai durante Bloco I |
| Concorrente avançar enquanto rodamos validação | MÉDIA | OMIE (Story MKT-001-3) mapeia concorrência ativa; Lead Magnet (MKT-001-1) gera presença de mercado em paralelo |

### 8.7 Próximos passos

1. Sprint planning para nomear `[OWNER: ?]` em cada um dos 14 quick wins de TD-001-4.
2. Iniciar TD-001-5 (veto conditions no CI) em paralelo aos quick wins — não bloqueia o sprint.
3. Bloco H (Story TD-001-1) executado primeiro — race conditions são prioridade absoluta consensuada (6/6 personas).
4. Após H1 entregue: kickoff do Bloco I (EPIC-MKT-001) — 1 sprint de 2 semanas.
5. Documento `docs/business/ICP-validation-2026-Q2.md` gerado ao final do Bloco I → libera H2.

### 8.8 Documentos de referência (atualizados)

- `docs/architecture/technical-debt-assessment.md` (Seção 11 nova)
- `docs/epics/EPIC-TD-001-debt-paydown-h1.md` (vetos + DEBT-H3 primeiro item + TD-001-5)
- `docs/epics/EPIC-MKT-001-validacao-mercado.md` (novo)
- `docs/stories/MKT-001-1..5-*.md` (5 novas stories)
- `docs/stories/TD-001-5-veto-conditions-ci.md` (nova)
- `docs/reviews/roundtable-personas-2026-04-27.md` (síntese mestre)

---

*Produzido por @analyst (Alex) — Brownfield Discovery Fase 9 — 2026-04-27*
*Proximo passo: @pm (Fase 10) — Epic + stories para paydown de debito tecnico*
