# Story MKT-001-5 — KPIs Baseline: CAC, LTV, Ativação, NPS Piloto

**Epic:** EPIC-MKT-001
**Status:** Draft
**Owner sugerido:** [OWNER: ?] (preencher na sprint planning)
**Persona-origem do roundtable:** Nardon + Finch
**Esforço estimado:** 2–3 dias

---

## Contexto

O SmartPreço não tem nenhuma métrica de negócio instrumentada. Os KPIs de NFR07 (1.000 usuários simultâneos) são KPIs de infraestrutura, não de funil. Não há dado de CAC, LTV, taxa de ativação ou NPS.

Bruno Nardon (roundtable): "Produto sem distribuição morre. Definir 1 canal prioritário e medir em 30 dias."

Thiago Finch (roundtable, OMIE — Excelência): "NFR07 (1.000 usuários simultâneos) é KPI de infra. Cadê CAC, LTV, churn, taxa de ativação (% que salva primeiro SKU), NPS de vendedores ML? Inexistentes no discovery."

Tallis (roundtable): "Fix DEBT-H3 (Sentry Edge `tracesSampleRate`) e DEBT-OBS-01 são os primeiros itens — sem observabilidade, os primeiros 100 usuários vão ensinar o produto a falhar em silêncio."

Esta story instrumenta o dashboard interno de KPIs com as 4 métricas essenciais de validação de mercado: CAC hipótese, LTV hipótese, taxa de ativação e NPS piloto. Depende de DEBT-H3 estar ativo (Sentry Edge) para correlacionar erros com comportamento de usuário.

---

## Acceptance Criteria

- [ ] **AC1:** Dashboard interno com 4 KPIs vivos e atualizados em tempo próximo ao real:
  - **CAC hipótese:** custo por lead capturado via Lead Magnet (MKT-001-1) dividido pelo esforço de aquisição (ex: horas em grupos de WhatsApp × valor/hora)
  - **LTV hipótese:** WTP modal das entrevistas (MKT-001-2) × retenção esperada (hipótese inicial: 6 meses de assinatura)
  - **Taxa de ativação:** % de usuários cadastrados que salvaram pelo menos 1 SKU
  - **NPS piloto:** score de pesquisa em 1 pergunta enviada por email para os leads/usuários
- [ ] **AC2:** Baseline registrada na data de publicação do dashboard — valores iniciais documentados em `docs/business/ICP-validation-2026-Q2.md` seção KPIs
- [ ] **AC3:** Vercel Analytics (ou equivalente) configurado e coletando dados de pageview em `/calculadora-livre` e `/precos`
- [ ] **AC4:** Taxa de ativação calculável a partir de dados do Supabase (query em `sku_calculations` por `user_id` com `created_at >= cadastro + 24h`)
- [ ] **AC5:** `pnpm typecheck` e `pnpm build` passando

---

## Tasks

- [ ] **T1:** Configurar Vercel Analytics no projeto (se não ativo): habilitar em `vercel.json` ou via dashboard; confirmar coleta de eventos em `/calculadora-livre` e `/precos`
- [ ] **T2:** Criar query SQL de taxa de ativação em Supabase: `% de user_id em auth.users que têm pelo menos 1 row em sku_calculations com created_at <= signup_at + 48h`; salvar em `docs/business/queries/ativacao.sql`
- [ ] **T3:** Definir fórmula de CAC hipótese e LTV hipótese em `docs/business/ICP-validation-2026-Q2.md` seção KPIs (fórmulas simples, não modelos financeiros complexos)
- [ ] **T4:** Criar pesquisa de NPS piloto (1 pergunta: "De 0 a 10, você recomendaria o SmartPreço a outro vendedor de ML?") — pode ser via Typeform, Google Forms ou email direto; automatizar envio para leads capturados (MKT-001-1) após 7 dias
- [ ] **T5:** Criar documento interno `docs/business/kpis-baseline.md` com: definição de cada KPI, fórmula, fonte de dados, baseline na data de publicação, meta para 30 dias
- [ ] **T6:** Adicionar link para dashboard de analytics (Vercel Analytics URL) e para queries SQL em `docs/business/ICP-validation-2026-Q2.md`
- [ ] **T7:** Verificar que DEBT-H3 (Sentry Edge `tracesSampleRate: 0.1`) está ativo — se não, abrir blocker para que TD-001-4 o inclua; KPIs de erro de produção dependem disso

---

## Output esperado

- `docs/business/kpis-baseline.md` — definição e baseline dos 4 KPIs
- `docs/business/queries/ativacao.sql` — query de taxa de ativação
- Vercel Analytics ativo com dados de pageview nas rotas públicas
- Seção KPIs em `docs/business/ICP-validation-2026-Q2.md` preenchida

---

## Notas técnicas / referências

- **Recomendação Nardon + Finch:** "KPIs comerciais baseline: CAC hipótese, LTV hipótese, taxa de ativação (% que salva primeiro SKU), NPS de teste piloto." (roundtable-personas-2026-04-27.md, Adições H1.5)
- **DEBT-H3:** Sentry Edge `tracesSampleRate: 0` → sem observabilidade de erros em produção. Tallis e Nardon identificaram como pré-requisito de qualquer dado de produção confiável. Confirmar que está ativo antes de considerar dados de KPI como válidos.
- **Nardon:** "Dados > intuição — e agora a intuição está guiando o roadmap inteiro." Os KPIs são o mecanismo de substituição da intuição por dados reais.
- **Taxa de ativação** é o KPI mais direto de valor do produto: se o usuário não salva o primeiro SKU, o produto falhou na proposta de valor central, independentemente da qualidade técnica.
- Dashboard pode ser simples (planilha compartilhada + queries manuais) em v0 — não construir ferramenta de analytics própria nesta sprint.

---

## Riscos

- Poucos usuários na base tornam os KPIs estatisticamente insignificantes em v0 (mitigação: documentar N explicitamente; usar como sinal direcional, não estatística definitiva)
- NPS piloto por email pode ter taxa de resposta < 20% (mitigação: enviar com personalização; oferecer incentivo de extensão de trial)
- DEBT-H3 não ativo faz dados de Sentry correlacionados com KPIs serem inválidos (mitigação: verificar antes de T7; se não ativo, marcar AC5 como condicional)

---

*Story gerada por @pm (Morgan) — EPIC-MKT-001 — Roundtable 2026-04-27*
