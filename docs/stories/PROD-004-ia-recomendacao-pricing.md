# PROD-004 — IA de recomendação de pricing (diferenciação vs Letzee)

**Epic:** EPIC-PROD-002 (Defensabilidade Institucional)
**Status:** Draft
**Severidade:** MÉDIA — 1 voto (Alan); diferenciação narrativa vs IA-resposta da Letzee
**Sprint:** SPRINT-2026-07-XX (proposto, depende 50+ pagantes para data fly-wheel)
**Owner:** Pedro Emilio (executor: @dev)
**SP estimado:** 5 SP (~3-5 semanas)
**Referência:**
- Comparativo Letzee: `docs/reviews/comparativo-letzee-2026-05-02/01-comparativo-8-personas.md` (Alan)
- Letzee tem IA resposta cliente — `docs/reviews/world-benchmark-2026-05-01/01-benchmark-mundial.md` seção 1.11
- Vercel AI SDK + Claude Haiku como stack

---

## Contexto

Letzee implementou **IA de resposta ao cliente** (atendimento automatizado). Alan no painel:
> *"Letzee fez IA-resposta. SmartPreço deve fazer IA-recomendação de preço ótimo (input: SKU + concorrência → output: faixa de margem alvo). Vercel AI SDK + Supabase já presentes."*

**Diferenciação proposta:**
- Letzee IA = SAC (já feature com 50+ players globais)
- SmartPreço IA = pricing recommendation (poucos players globais, zero BR)

**MVP da feature:**
- Input: SKU do seller (com histórico de simulações + categoria + tipo de anúncio)
- Sistema busca: 5-10 concorrentes diretos via API ML (após cert PROD-002) ou via cache `ml_search_cache`
- LLM gera: recomendação de preço com 3 faixas (conservador / agressivo / equilibrado) + justificativa em 2 frases

**Por que esperar 50+ pagantes:**
- Data fly-wheel: simulações pré-existentes alimentam contexto LLM
- Validação: poucos pagantes = pouca dor para justificar custo IA
- Custo: 50 pagantes × R$49 = R$ 2.450 MRR — paga R$ 100-200/mês de Claude API

---

## Acceptance Criteria

### Backend
1. [ ] Endpoint `/api/ai/price-recommendation` (POST com `{sku_id, listing_type, target_margin?}`)
2. [ ] Integração Vercel AI SDK + Claude Haiku (modelo balanceado custo/qualidade)
3. [ ] Cache resultado em tabela `ai_price_recommendations` (TTL 24h por SKU)
4. [ ] Rate limit: 5 recomendações/dia para Pro, 20 para Agency, 0 para Free

### LLM prompt engineering
5. [ ] System prompt descreve contexto: "Você é especialista em precificação Mercado Livre BR"
6. [ ] User prompt inclui: SKU + categoria + comissão atual + 5-10 concorrentes (preço, reputação, sold_quantity)
7. [ ] Output estruturado JSON via Zod schema (3 faixas + justificativa + confidence)
8. [ ] Fallback se LLM falha: retornar mediana dos concorrentes ± P25/P75 sem narrativa

### UI
9. [ ] Widget "💡 SmartPreço IA recomenda" na tela de simulação
10. [ ] Botão "Aplicar recomendação" pré-preenche preço no formulário
11. [ ] Disclaimer: "IA é proxy, não substitui análise — confirmar antes de publicar"

### Métricas
12. [ ] Eventos:
    - `ai_recommendation_requested`
    - `ai_recommendation_applied` (CTR)
    - `ai_recommendation_dismissed`
13. [ ] Dashboard interno: custo OpenAI/Anthropic por dia + ROI (recomendações aplicadas vs MRR Pro)

### Qualidade
14. [ ] Tests Vitest cobrindo: happy path, fallback sem LLM, schema Zod válido
15. [ ] `npm run typecheck` + lint + build PASS

---

## Tasks

### Track 1 — Backend e LLM
- [ ] `npm install ai @ai-sdk/anthropic` (Vercel AI SDK)
- [ ] Criar `src/lib/ai/price-recommendation.ts` com prompt + schema Zod
- [ ] Endpoint `src/app/api/ai/price-recommendation/route.ts`
- [ ] Migration `014_ai_price_recommendations.sql` (tabela cache + RLS)
- [ ] Rate limit via tabela `rate_limit_log` existente

### Track 2 — Integração com simulação
- [ ] Modificar tela de simulação (`/calculadora` autenticada) para exibir widget IA
- [ ] Botão "Pedir recomendação IA" (não automático para evitar custo)

### Track 3 — Observabilidade
- [ ] Sentry capture em erros LLM
- [ ] Dashboard custo via Vercel Analytics ou logs estruturados

---

## Out of Scope

- **AI no lead magnet `/calculadora-livre`** — custo proibitivo sem cadastro/limite
- **AI na Chrome Extension** — depende PROD-003 + custo extra
- **Auto-applying recomendação** — sempre exigir confirmação humana
- **Multi-LLM (GPT-4 + Claude + Gemini)** — começar com Claude Haiku, expandir se ROI provar

---

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|:-------------:|-----------|
| Custo Claude estourar | Média | Rate limit + cache 24h + tier-gate (só Pro+) |
| LLM gera recomendação ruim | Alta | Schema Zod rígido + fallback estatístico + disclaimer "confirmar antes" |
| Sellers não usam (gimmick) | Média | Track CTR `ai_recommendation_applied` — se < 5%, descontinuar feature |
| Compliance ML (uso de dados de concorrentes) | Baixa | Apenas dados públicos via API ML certificada (depende PROD-002) |

---

## Definition of Done

- [ ] AC 1-15 todos checados
- [ ] Custo médio por recomendação < R$ 0,05
- [ ] CTR `ai_recommendation_applied` ≥ 15% nos primeiros 30 dias
- [ ] ≥ 50 sellers usaram a feature (validação data fly-wheel)
- [ ] Story atualizada com File List + Status `Done`

---

## Change Log

| Data | Autor | Mudança |
|------|-------|---------|
| 2026-05-03 | Orion (@aiox-master) | Story criada como parte do EPIC-PROD-002 — recomendação Alan painel comparativo Letzee |
